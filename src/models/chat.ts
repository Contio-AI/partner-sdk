/**
 * Chat Session domain models for the Contio Partner Chat Session API.
 *
 * Partners can create asynchronous, turn-based chat sessions with the
 * Contio AI agent on behalf of their users. Sessions are scoped to meetings
 * and processed sequentially by turn.
 *
 * Required OAuth scopes:
 *  - `chat:read`  — GET /sessions, GET /sessions/:id
 *  - `chat:write` — POST /sessions, PUT /sessions/:id
 */

// ── Enums ────────────────────────────────────────────────────────────────────

/** Status of a chat session */
export type ChatSessionStatus = 'active' | 'closed' | 'expired';

/** Role of a turn author */
export type ChatTurnRole = 'user' | 'agent';

/** Processing status of a turn */
export type ChatTurnStatus = 'queued' | 'processing' | 'completed' | 'failed';

// ── Sub-objects ───────────────────────────────────────────────────────────────

/** A single tool invocation recorded in an agent turn */
export interface ChatToolCall {
  /** Tool name (e.g., `search_meeting_notes`, `list_action_items`) */
  name: string;
  /** Outcome of the tool call */
  status: 'success' | 'failed';
}

/** Token usage statistics for an agent turn */
export interface ChatTokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
}

/** Structured metadata attached to agent turns */
export interface ChatAgentMetadata {
  /** Tools the agent invoked during this turn */
  tool_calls: ChatToolCall[];
  /** Context document IDs referenced by the agent */
  referenced_documents: string[];
  /** Model identifier used for this turn (e.g., `gpt-4o`) */
  model: string;
  /** Token consumption for this turn */
  token_usage: ChatTokenUsage;
}

/** Error detail for a failed turn */
export interface ChatTurnError {
  /** Machine-readable error code */
  code: 'agent_error' | 'timeout' | 'context_too_large' | 'rate_limited';
  /** Human-readable description */
  message: string;
}

// ── Core models ───────────────────────────────────────────────────────────────

/**
 * A single turn in a chat session — either a user message or an agent response.
 */
export interface ChatTurn {
  id: string;
  session_id: string;
  /** 1-based position in the session; user messages are odd, agent responses are even */
  sequence_number: number;
  role: ChatTurnRole;
  /** Message text (user) or agent response text */
  content: string;
  status: ChatTurnStatus;
  /** Present when `status === 'failed'` */
  error?: ChatTurnError | null;
  /** Present for `role === 'agent'` turns */
  agent_metadata?: ChatAgentMetadata | null;
  created_at: string;
  completed_at: string | null;
}

/**
 * A paginated list of turns within a session.
 */
export interface ChatTurnListResponse {
  items: ChatTurn[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * A chat session between a partner and the Contio AI agent.
 * `meeting_id` is optional — sessions can be created without a meeting context.
 */
export interface ChatSession {
  id: string;
  meeting_id?: string | null;
  status: ChatSessionStatus;
  /** AI-generated or partner-supplied session title */
  title?: string | null;
  /** Total number of turns (user + agent) in this session */
  turn_count: number;
  /** Partner-supplied arbitrary key-value metadata */
  metadata?: Record<string, string>;
  created_at: string;
  updated_at: string;
  /** The first user turn; only present on the POST /sessions response */
  current_turn?: ChatTurn;
  /** Turn history; only present on GET /sessions/:id responses */
  turns?: ChatTurnListResponse;
}

// ── Request / Response types ──────────────────────────────────────────────────

/** Query parameters for listing sessions (`GET /sessions`) */
export interface ChatSessionListParams {
  meeting_id?: string;
  status?: ChatSessionStatus;
  limit?: number;
  offset?: number;
}

/** Paginated response for list sessions */
export interface ChatSessionListResponse {
  items: ChatSession[];
  total: number;
  limit: number;
  offset: number;
}

/** Request body for creating a new session (`POST /sessions`) */
export interface CreateChatSessionRequest {
  /** Optional — omit to create a session without a meeting context. */
  meeting_id?: string;
  message: string;
  context_document_ids?: string[];
  metadata?: Record<string, string>;
}

/** Query parameters for fetching a session (`GET /sessions/:id`) */
export interface GetChatSessionParams {
  /** `undelivered` (default) returns only new turns; `all_turns` returns full history */
  include?: 'undelivered' | 'all_turns';
  turn_limit?: number;
  turn_offset?: number;
}

/** Request body for sending a message (`PUT /sessions/:id`) */
export interface SendChatMessageRequest {
  message: string;
}

/** Response body for send message (`202 Accepted`) */
export interface SendChatMessageResponse {
  turn: ChatTurn;
  /** Position in the processing queue (1 = currently processing) */
  position: number;
  /** Total number of turns waiting to be processed */
  queued_turns: number;
}

/** Response body for get turn (`GET /sessions/:id/turns/:turn_id`) */
export interface GetTurnResponse {
  turn: ChatTurn;
}

