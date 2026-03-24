/**
 * Chat Session domain delegate — asynchronous turn-based chat with the Contio AI agent.
 *
 * All functions accept an {@link HttpTransport} as first argument so they
 * can be invoked by the {@link PartnerUserClient} facade without exposing
 * BaseClient internals.
 *
 * Required OAuth scopes:
 *  - `chat:read`  — getSessions, getSession, getTurn
 *  - `chat:write` — createSession, sendMessage
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  ChatSession,
  ChatSessionListParams,
  ChatSessionListResponse,
  ChatTurn,
  CreateChatSessionRequest,
  GetChatSessionParams,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '../../models';

// ── Raw API response shapes (internal — not part of public model) ─────────────

/** Shape of a turn as returned by the Partner API */
interface RawTurn {
  id: string;
  session_id: string;
  sequence_number?: number | null;
  role: string;
  content: string;
  status: string;
  error?: { code: string; message: string } | null;
  agent_metadata?: {
    tool_calls?: Array<{ name: string; status: string }>;
    referenced_documents?: string[];
    model?: string;
    token_usage?: { prompt_tokens: number; completion_tokens: number };
  } | null;
  created_at: string;
  completed_at?: string | null;
}

/** Response from POST /sessions */
interface RawCreateSessionResponse {
  id: string;
  meeting_id?: string | null;
  status: string;
  metadata?: Record<string, string>;
  created_at: string;
  initial_turn?: RawTurn | null;
}

/** Response from GET /sessions/:id */
interface RawGetSessionResponse {
  session: {
    id: string;
    meeting_id?: string | null;
    status: string;
    title?: string | null;
    turn_count: number;
    metadata?: Record<string, string>;
    created_at: string;
    updated_at: string;
  };
  turns: RawTurn[];
  turn_pagination?: {
    total: number;
    offset: number;
    limit: number;
    has_more: boolean;
  } | null;
}

/** Response from GET /sessions/:id/turns/:turn_id */
interface RawGetTurnResponse {
  turn: RawTurn;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapRawTurn(raw: RawTurn): ChatTurn {
  // Map error with proper type casting for the code
  const error = raw.error
    ? { code: raw.error.code as ChatTurn['error'] extends { code: infer C } ? C : never, message: raw.error.message }
    : null;

  // Map agent_metadata with defaults for required fields
  const agent_metadata = raw.agent_metadata
    ? {
        tool_calls: (raw.agent_metadata.tool_calls ?? []).map((tc) => ({
          name: tc.name,
          status: tc.status as 'success' | 'failed',
        })),
        referenced_documents: raw.agent_metadata.referenced_documents ?? [],
        model: raw.agent_metadata.model ?? '',
        token_usage: raw.agent_metadata.token_usage ?? { prompt_tokens: 0, completion_tokens: 0 },
      }
    : null;

  return {
    id: raw.id,
    session_id: raw.session_id,
    sequence_number: raw.sequence_number ?? 0,
    role: raw.role as ChatTurn['role'],
    content: raw.content,
    status: raw.status as ChatTurn['status'],
    error,
    agent_metadata,
    created_at: raw.created_at,
    completed_at: raw.completed_at ?? null,
  };
}

function mapCreateSessionResponse(raw: RawCreateSessionResponse): ChatSession {
  const initialTurn = raw.initial_turn ? mapRawTurn(raw.initial_turn) : undefined;
  return {
    id: raw.id,
    meeting_id: raw.meeting_id ?? null,
    status: raw.status as ChatSession['status'],
    title: null,
    turn_count: initialTurn ? 1 : 0,
    metadata: raw.metadata,
    created_at: raw.created_at,
    updated_at: raw.created_at,
    current_turn: initialTurn,
    turns: initialTurn
      ? { items: [initialTurn], total: 1, limit: 25, offset: 0 }
      : { items: [], total: 0, limit: 25, offset: 0 },
  };
}

function mapGetSessionResponse(raw: RawGetSessionResponse): ChatSession {
  const turns = (raw.turns ?? []).map(mapRawTurn);
  return {
    id: raw.session.id,
    meeting_id: raw.session.meeting_id ?? null,
    status: raw.session.status as ChatSession['status'],
    title: raw.session.title ?? null,
    turn_count: raw.session.turn_count,
    metadata: raw.session.metadata,
    created_at: raw.session.created_at,
    updated_at: raw.session.updated_at,
    turns: {
      items: turns,
      total: raw.turn_pagination?.total ?? turns.length,
      limit: raw.turn_pagination?.limit ?? turns.length,
      offset: raw.turn_pagination?.offset ?? 0,
    },
  };
}

// ── Sessions ─────────────────────────────────────────────────────────────────

/**
 * Create a new chat session and submit the first user message.
 *
 * The agent begins processing turn 1 immediately. Returns `201 Created` with
 * the session and the initial user turn embedded as `current_turn`.
 */
export async function createSession(
  http: HttpTransport,
  data: CreateChatSessionRequest,
  options?: RequestOptions,
): Promise<ChatSession> {
  const raw = await http.post<RawCreateSessionResponse>('/sessions', data, options);
  return mapCreateSessionResponse(raw);
}

/**
 * List sessions created by the authenticated user's partner app.
 */
export async function getSessions(
  http: HttpTransport,
  params?: ChatSessionListParams,
  options?: RequestOptions,
): Promise<ChatSessionListResponse> {
  return http.get<ChatSessionListResponse>('/sessions', params, options);
}

/**
 * Retrieve session details and its turns.
 *
 * By default returns only turns not yet seen by the caller (`include=undelivered`).
 * Pass `include: 'all_turns'` to retrieve the full conversation history.
 */
export async function getSession(
  http: HttpTransport,
  sessionId: string,
  params?: GetChatSessionParams,
  options?: RequestOptions,
): Promise<ChatSession> {
  const raw = await http.get<RawGetSessionResponse>(`/sessions/${sessionId}`, params, options);
  return mapGetSessionResponse(raw);
}

// ── Turns ─────────────────────────────────────────────────────────────────────

/**
 * Enqueue a new user message as the next turn in an existing session.
 *
 * Returns `202 Accepted` with the newly queued turn and its position in the
 * processing queue. The agent response will be delivered via a
 * `session.turn.completed` webhook when processing is complete.
 */
export async function sendMessage(
  http: HttpTransport,
  sessionId: string,
  data: SendChatMessageRequest,
  options?: RequestOptions,
): Promise<SendChatMessageResponse> {
  return http.put<SendChatMessageResponse>(`/sessions/${sessionId}`, data, options);
}

/**
 * Retrieve a specific turn by ID within a session.
 *
 * This is useful when a `turn_id` is received via webhook and the partner
 * wants to fetch only that turn instead of the full session history.
 *
 * @param sessionId - The session ID that contains the turn
 * @param turnId - The turn ID to retrieve
 */
export async function getTurn(
  http: HttpTransport,
  sessionId: string,
  turnId: string,
  options?: RequestOptions,
): Promise<ChatTurn> {
  const raw = await http.get<RawGetTurnResponse>(`/sessions/${sessionId}/turns/${turnId}`, options);
  return mapRawTurn(raw.turn);
}
