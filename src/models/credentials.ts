/**
 * Credential management type definitions for the Contio Partner API
 */

/**
 * Credential types supported by the Partner API
 */
export type CredentialType = 'api_key' | 'webhook_secret' | 'client_secret';

/**
 * Credential status values
 */
export type CredentialStatus = 'active' | 'transitioning' | 'disabled';

/**
 * Recommended actions for credential health
 */
export type CredentialRecommendedAction = 'ok' | 'rotate_soon' | 'rotate_recommended';

/**
 * Credential audit action types
 */
export type CredentialAuditAction =
  | 'rotated'
  | 'accessed'
  | 'tested'
  | 'disabled'
  | 'enabled'
  | 'rollback';

/**
 * Who initiated the credential action
 */
export type CredentialInitiatedBy = 'partner' | 'internal' | 'system';

/**
 * Individual credential status information
 */
export interface CredentialStatusInfo {
  credential_type: CredentialType;
  status: CredentialStatus;
  created_at: string;
  last_rotated_at?: string;
  last_used_at?: string;
  age_days: number;
  recommended_action: CredentialRecommendedAction;
  grace_period_ends_at?: string;
}

/**
 * Response from GET /credentials endpoint
 * Contains status for all three credential types
 */
export interface CredentialStatusResponse {
  api_key: CredentialStatusInfo;
  webhook_secret: CredentialStatusInfo;
  client_secret: CredentialStatusInfo;
}

/**
 * Request to rotate a credential
 */
export interface CredentialRotationRequest {
  /**
   * Confirmation token to prevent accidental rotations
   * Can be any string, e.g., "confirm_rotation_12345"
   */
  confirmation_token: string;

  /**
   * Optional reason for the rotation (for audit purposes)
   */
  reason?: string;

  /**
   * Grace period in hours (default: 24, max: 168)
   * During this period, both old and new credentials are valid
   */
  grace_period_hours?: number;
}

/**
 * Response from credential rotation
 */
export interface CredentialRotationResponse {
  credential_type: CredentialType;

  /**
   * The new credential value
   * IMPORTANT: Save this securely - it's only shown once!
   */
  new_credential: string;

  /**
   * When the grace period ends
   * After this time, only the new credential will work
   *
   * NOTE: Webhook secrets do not have grace periods (this will be null/undefined)
   */
  grace_period_ends_at?: string;

  /**
   * Emergency rollback token (valid for 1 hour)
   * Single-use token to revert the rotation if needed
   *
   * NOTE: Webhook secrets do not support rollback (this will be null/undefined)
   */
  rollback_token?: string;

  /**
   * When the rollback token expires
   *
   * NOTE: Webhook secrets do not support rollback (this will be null/undefined)
   */
  rollback_expires_at?: string;
}

/**
 * Request to rollback a credential rotation
 */
export interface CredentialRollbackRequest {
  /**
   * Rollback token from the rotation response
   * Valid for 1 hour, single-use only
   */
  rollback_token: string;
}

/**
 * Credential audit event
 */
export interface CredentialAuditEvent {
  id: string;
  partner_app_id: string;
  credential_type: CredentialType;
  action: CredentialAuditAction;
  initiated_by: CredentialInitiatedBy;
  user_agent?: string;
  ip_address?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * Parameters for querying credential audit history
 */
export interface CredentialAuditHistoryParams {
  /**
   * Number of events to return (default: 20, max: 100)
   */
  limit?: number;

  /**
   * Number of events to skip (for pagination)
   */
  offset?: number;

  /**
   * Filter by credential type
   */
  credential_type?: CredentialType;

  /**
   * Filter by action type
   */
  action?: CredentialAuditAction;
}

/**
 * Response from credential audit history endpoint
 */
export interface CredentialAuditHistoryResponse {
  events: CredentialAuditEvent[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
  };
}
