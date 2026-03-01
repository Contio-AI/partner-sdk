/**
 * Authentication-related type definitions for the Contio Partner API
 */

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  scope?: string[];
}

export interface ApiKeyConfig {
  apiKey: string;
  apiKeyHeader?: string; // Default: 'X-API-Key'
}

/**
 * Workspace role assigned to a user.
 *
 * - `WORKSPACE_OWNER` — Full control over the workspace
 * - `WORKSPACE_ADMIN` — Administrative access (can manage members)
 * - `WORKSPACE_MEMBER` — Standard member access
 */
export type WorkspaceRole = 'WORKSPACE_OWNER' | 'WORKSPACE_ADMIN' | 'WORKSPACE_MEMBER';

export interface UserProfile {
  id: string;
  display_name: string;
  email?: string;
  created_at: string;
  /** The user's current workspace ID */
  workspace_id: string;
  /** The user's current workspace name */
  workspace_name: string;
  /** The user's role in the workspace */
  workspace_role: WorkspaceRole;
}

/**
 * Options for initiating partner authentication with shared workspace support.
 */
export interface InitiatePartnerAuthOptions {
  /**
   * Target workspace for the new user. If omitted, a personal workspace
   * is created for the user (preserving current default behavior).
   */
  workspace_id?: string;
  /**
   * When `true`, assigns `WORKSPACE_ADMIN` role instead of `WORKSPACE_MEMBER`
   * when joining a shared workspace. Ignored when `workspace_id` is not provided.
   * @default false
   */
  is_admin?: boolean;
}

/**
 * Error codes specific to shared workspace operations.
 *
 * | Code | HTTP Status | When |
 * | --- | --- | --- |
 * | `workspace_not_found` | 400 | `workspace_id` does not exist |
 * | `workspace_not_authorized` | 403 | Workspace not owned by a user from the same partner |
 * | `workspace_conflict` | 409 | Existing user is in a different workspace than specified |
 */
export type WorkspaceErrorCode =
  | 'workspace_not_found'
  | 'workspace_not_authorized'
  | 'workspace_conflict';

export interface ErrorResponse {
  code: string;
  error?: string;
  /**
   * @deprecated Use `error` instead. Will be removed in the next major version.
   */
  message?: string;
  /** Unique identifier for the API request, useful for debugging and support */
  request_id?: string;
  /**
   * Present on `workspace_conflict` errors. Contains the user's current workspace ID
   * so the caller can retry with the correct workspace.
   */
  workspace_id?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: Date;
  scope?: string[];
}
