/**
 * Chat Session domain delegate — asynchronous turn-based chat with the Contio AI agent.
 *
 * All functions accept an {@link HttpTransport} as first argument so they
 * can be invoked by the {@link PartnerUserClient} facade without exposing
 * BaseClient internals.
 *
 * Required OAuth scopes:
 *  - `chat:read`  — getSessions, getSession
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
  CreateChatSessionRequest,
  GetChatSessionParams,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '../../models';

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
  return http.post<ChatSession>('/sessions', data, options);
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
  return http.get<ChatSession>(`/sessions/${sessionId}`, params, options);
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

