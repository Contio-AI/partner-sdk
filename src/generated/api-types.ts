/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Bad request error for creating an action item */
export interface ActionItemCreateActionItemError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_request"
   */
  code?: "invalid_request" | "invalid_due_date";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request body"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface ActionItemCreateActionItemRequest {
  /**
   * @minLength 1
   * @maxLength 1000
   * @example "Call or schedule meeting to discuss"
   */
  description?: string;
  /**
   * YYYY-MM-DD format
   * @example "2023-01-08"
   */
  due_date?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  meeting_id: string;
  partner_context?: Record<string, unknown>;
  /** @example "needs_review" */
  status?:
    | "needs_review"
    | "accepted"
    | "in_progress"
    | "blocked"
    | "completed"
    | "cancelled";
  /**
   * @minLength 1
   * @maxLength 1000
   * @example "Follow up with client"
   */
  title: string;
}

/** Bad request error for listing action items */
export interface ActionItemGetActionItemsError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_start_date"
   */
  code?: "invalid_start_date" | "invalid_end_date";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid start_date format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface ActionItemPartnerActionItemResponse {
  /**
   * ID of the user assigned to this action item
   * @example "123e4567-e89b-12d3-a456-426614174003"
   */
  assigned_to_user_id?: string;
  /**
   * Timestamp when the action item was completed
   * @example "2023-01-08T18:00:00-07:00"
   */
  completed_at?: string;
  /**
   * Timestamp when the action item was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Detailed description of the action item
   * @example "Follow up with client about proposal"
   */
  description?: string;
  /**
   * Due date in YYYY-MM-DD format
   * @example "2023-01-08"
   */
  due_date?: string;
  /**
   * Whether this action item was assigned via partner workflow
   * @example true
   */
  has_partner_assignment?: boolean;
  /**
   * Unique identifier for the action item
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  id?: string;
  /**
   * Whether the action item has been completed
   * @example false
   */
  is_completed?: boolean;
  /**
   * ID of the meeting this action item belongs to
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  meeting_id?: string;
  /** Partner-specific context data stored with the action item */
  partner_context?: Record<string, unknown>;
  /**
   * Current status (needs_review, accepted, in_progress, blocked, completed, cancelled)
   * @example "accepted"
   */
  status?: string;
  /**
   * Title of the action item
   * @example "Client follow-up call"
   */
  title?: string;
  /**
   * Timestamp when the action item was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
}

/** Bad request error for updating an action item */
export interface ActionItemUpdateActionItemError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_action_item_id"
   */
  code?: "invalid_action_item_id" | "invalid_request" | "invalid_due_date";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid action item ID format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface ActionItemUpdateActionItemRequest {
  /**
   * @minLength 1
   * @maxLength 1000
   * @example "Updated description"
   */
  description?: string;
  /**
   * YYYY-MM-DD format
   * @example "2023-01-08"
   */
  due_date?: string;
  /** @example true */
  is_completed?: boolean;
  partner_context?: Record<string, unknown>;
  /** @example "needs_review" */
  status?:
    | "needs_review"
    | "accepted"
    | "in_progress"
    | "blocked"
    | "completed"
    | "cancelled";
  /**
   * @minLength 1
   * @maxLength 1000
   * @example "Follow up with client"
   */
  title?: string;
}

/** Bad request error for creating IdP configuration */
export interface AdminCreateIdPConfigError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_request_body"
   */
  code?:
    | "invalid_request_body"
    | "invalid_idp_credentials"
    | "invalid_idp"
    | "domain_is_generic"
    | "domain_already_claimed"
    | "strict_mode_requires_domains"
    | "discovery_fetch_failed"
    | "idp_config_exists";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request body"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface AdminCreateIdPConfigRequest {
  /**
   * Email domains allowed for SSO (required for strict mode). Users with other domains will be rejected.
   * @example ["company.com","subsidiary.com"]
   */
  allowed_email_domains?: string[];
  /** Maps Contio user fields to IdP claim names. Defaults to {"email": "email", "name": "name"}. Only change if your IdP uses non-standard claim names. */
  claim_mappings?: Record<string, string>;
  /**
   * OIDC discovery endpoint URL from your Identity Provider (must end with /.well-known/openid-configuration)
   * @example "https://company.okta.com/.well-known/openid-configuration"
   */
  discovery_url: string;
  /**
   * OAuth Client ID from your Identity Provider's OIDC application. This is NOT your Contio Partner client_id.
   * @minLength 1
   * @example "0oa1234567890abcdef"
   */
  idp_client_id: string;
  /**
   * OAuth Client Secret from your Identity Provider's OIDC application. This is NOT your Contio Partner client_secret. Stored encrypted at rest.
   * @minLength 1
   * @example "IdP-secret-from-okta-or-azure"
   */
  idp_client_secret: string;
  /**
   * Domain validation mode: "strict" requires allowed_email_domains, "partner_managed" trusts your IdP's user base
   * @example "strict"
   */
  mode: "strict" | "partner_managed";
  /**
   * Display name for this IdP configuration
   * @minLength 1
   * @maxLength 255
   * @example "Okta SSO"
   */
  name: string;
  /**
   * OIDC scopes to request during authentication. Defaults to ["openid", "email", "profile"]
   * @example ["openid","email","profile"]
   */
  scopes?: string[];
}

/** Bad request error for creating a workflow */
export interface AdminCreateWorkflowError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_request_body"
   */
  code?: "invalid_request_body" | "validation_error";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request body"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface AdminCreateWorkflowRequest {
  /** @minItems 1 */
  actions: PartnerWorkflowAction[];
  /**
   * @maxLength 1000
   * @example "Sync action items to CRM"
   */
  description?: string;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "CRM Integration"
   */
  name: string;
  trigger_type:
    | "action_item_created"
    | "action_item_updated"
    | "action_item_completed"
    | "meeting_ended"
    | "meeting_summary_ready";
}

export interface AdminCredentialRotationRequest {
  /** @example "confirm-rotation-12345" */
  confirmation_token: string;
  /** @example 48 */
  grace_period_hours?: number;
  /** @example "Scheduled rotation" */
  reason?: string;
}

export interface AdminCredentialRotationResponse {
  /**
   * Type of credential that was rotated (api_key or client_secret)
   * @example "api_key"
   */
  credential_type?: string;
  /**
   * When the grace period ends and old credential stops working
   * @example "2024-01-15T10:30:00Z"
   */
  grace_period_ends_at?: string;
  /**
   * The newly generated credential value (only shown once)
   * @example "pk_live_abc123..."
   */
  new_credential?: string;
  /**
   * When the rollback token expires
   * @example "2024-01-14T10:30:00Z"
   */
  rollback_expires_at?: string;
  /**
   * Token to use if you need to rollback to the previous credential
   * @example "rollback_token_xyz..."
   */
  rollback_token?: string;
}

export interface AdminCredentialStatusResponse {
  /**
   * Age of the credential in days
   * @example 5
   */
  age_days?: number;
  /**
   * When the credential was created
   * @example "2024-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Type of credential (api_key or client_secret)
   * @example "api_key"
   */
  credential_type?: string;
  /**
   * When the grace period ends (if in pending_rotation status)
   * @example "2024-01-12T10:30:00Z"
   */
  grace_period_ends_at?: string;
  /**
   * When the credential was last rotated
   * @example "2024-01-10T10:30:00Z"
   */
  last_rotated_at?: string;
  /**
   * When the credential was last used for authentication
   * @example "2024-01-20T10:30:00Z"
   */
  last_used_at?: string;
  /**
   * Recommended action (ok, rotate_soon, rotate_now)
   * @example "ok"
   */
  recommended_action?: string;
  /**
   * Current status (active, pending_rotation, expired)
   * @example "active"
   */
  status?: string;
}

export interface AdminIdPConfigResponse {
  /**
   * Email domains allowed for SSO
   * @example ["company.com","subsidiary.com"]
   */
  allowed_email_domains?: string[];
  /**
   * Discovered OIDC authorization endpoint
   * @example "https://company.okta.com/authorize"
   */
  authorization_endpoint?: string;
  /** Maps Contio user fields to IdP claim names */
  claim_mappings?: Record<string, string>;
  /** @example "2024-01-01T00:00:00Z" */
  created_at?: string;
  /**
   * When the OIDC discovery document was last fetched
   * @example "2024-01-01T00:00:00Z"
   */
  discovery_last_fetched_at?: string;
  /**
   * OIDC discovery endpoint URL
   * @example "https://company.okta.com/.well-known/openid-configuration"
   */
  discovery_url?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  id?: string;
  /**
   * OAuth Client ID from your Identity Provider (secret is never returned)
   * @example "0oa1234567890abcdef"
   */
  idp_client_id?: string;
  /**
   * Whether this IdP configuration is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Discovered OIDC issuer
   * @example "https://company.okta.com"
   */
  issuer?: string;
  /**
   * Discovered OIDC JWKS URI
   * @example "https://company.okta.com/jwks"
   */
  jwks_uri?: string;
  /**
   * Domain validation mode
   * @example "strict"
   */
  mode?: string;
  /**
   * Display name for this IdP configuration
   * @example "Okta SSO"
   */
  name?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174001" */
  partner_app_id?: string;
  /**
   * OIDC scopes requested during authentication
   * @example ["openid","email","profile"]
   */
  scopes?: string[];
  /**
   * Discovered OIDC token endpoint
   * @example "https://company.okta.com/token"
   */
  token_endpoint?: string;
  /**
   * IdP type (always "oidc")
   * @example "oidc"
   */
  type?: string;
  /** @example "2024-01-01T00:00:00Z" */
  updated_at?: string;
  /**
   * Discovered OIDC userinfo endpoint
   * @example "https://company.okta.com/userinfo"
   */
  userinfo_endpoint?: string;
}

export interface AdminListResponseAdminUserConnectionResponse {
  /** Array of items for the current page */
  items?: AdminUserConnectionResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of items across all pages
   * @example 100
   */
  total?: number;
}

export interface AdminListResponseAdminWorkflowResponse {
  /** Array of items for the current page */
  items?: AdminWorkflowResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of items across all pages
   * @example 100
   */
  total?: number;
}

export interface AdminPartnerAppResponse {
  /**
   * OAuth client ID for this partner app
   * @example "partner_1234567890_abcdef123456"
   */
  client_id?: string;
  /**
   * Name of the company that owns this partner app
   * @example "Acme Corp"
   */
  company_name?: string;
  /**
   * Timestamp when the partner app was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Optional description of the partner app
   * @example "Integrates with our CRM system"
   */
  description?: string;
  /**
   * Unique identifier for the partner app
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Display name of the partner app
   * @example "CRM Integration"
   */
  name?: string;
  /**
   * Primary contact email for this partner app
   * @example "contact@example.com"
   */
  primary_contact_email?: string;
  /**
   * URL-friendly slug for the partner app
   * @example "acme-crm"
   */
  slug?: string;
  /**
   * Current status (active, inactive, suspended)
   * @example "active"
   */
  status?: string;
  /**
   * Timestamp when the partner app was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
  /**
   * Whether webhook delivery is enabled for this partner app
   * @example true
   */
  webhook_enabled?: boolean;
  /** Optional webhook event filter configuration for this partner app */
  webhook_filter?: AdminWebhookFilterResponse;
  /**
   * Webhook URL for receiving event notifications
   * @example "https://api.example.com/webhook"
   */
  webhook_url?: string;
}

/** Bad request error for rotating API key */
export interface AdminRotateAPIKeyError400 {
  /**
   * Unique identifier for the error type
   * @example "bad_request"
   */
  code?: "bad_request" | "rate_limit_exceeded";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

/** Bad request error for rotating client secret */
export interface AdminRotateClientSecretError400 {
  /**
   * Unique identifier for the error type
   * @example "bad_request"
   */
  code?: "bad_request" | "rate_limit_exceeded";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

/** Bad request error for rotating webhook secret */
export interface AdminRotateWebhookSecretError400 {
  /**
   * Unique identifier for the error type
   * @example "bad_request"
   */
  code?: "bad_request";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface AdminSetWebhookFilterRequest {
  /** @minItems 1 */
  events: string[];
  /** @example "include" */
  type: "include" | "exclude";
}

/** Bad request error for updating partner app */
export interface AdminUpdateAppError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_request_body"
   */
  code?: "invalid_request" | "invalid_request_body" | "validation_error";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request body"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface AdminUpdateAppRequest {
  /**
   * @maxLength 1000
   * @example "Updated integration description"
   */
  description?: string;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Updated CRM Integration"
   */
  name?: string;
  /**
   * @minLength 3
   * @maxLength 63
   * @example "acme-crm"
   */
  slug?: string;
  /** @example "https://api.example.com/webhook" */
  webhook_url?: string;
}

/** Bad request error for updating partner app status */
export interface AdminUpdateAppStatusError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_status"
   */
  code?: "invalid_request_body" | "invalid_status";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid status value"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface AdminUpdateAppStatusRequest {
  /** @example "suspended" */
  status: "active" | "suspended" | "inactive";
}

/** Bad request error for updating IdP configuration */
export interface AdminUpdateIdPConfigError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_request_body"
   */
  code?:
    | "invalid_request_body"
    | "invalid_idp_credentials"
    | "invalid_idp"
    | "domain_is_generic"
    | "domain_already_claimed"
    | "strict_mode_requires_domains"
    | "discovery_fetch_failed";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request body"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface AdminUpdateIdPConfigRequest {
  /** Email domains allowed for SSO (required for strict mode) */
  allowed_email_domains?: string[];
  /** Maps Contio user fields to IdP claim names */
  claim_mappings?: Record<string, string>;
  /**
   * OIDC discovery endpoint URL from your Identity Provider
   * @example "https://company.okta.com/.well-known/openid-configuration"
   */
  discovery_url?: string;
  /**
   * OAuth Client ID from your Identity Provider's OIDC application. This is NOT your Contio Partner client_id.
   * @minLength 1
   * @example "0oa1234567890abcdef"
   */
  idp_client_id?: string;
  /**
   * OAuth Client Secret from your Identity Provider's OIDC application. This is NOT your Contio Partner client_secret. Stored encrypted at rest.
   * @minLength 1
   * @example "new-IdP-secret"
   */
  idp_client_secret?: string;
  /**
   * Enable or disable this IdP configuration
   * @example true
   */
  is_active?: boolean;
  /**
   * Domain validation mode: "strict" or "partner_managed"
   * @example "partner_managed"
   */
  mode?: "strict" | "partner_managed";
  /**
   * Display name for this IdP configuration
   * @minLength 1
   * @maxLength 255
   * @example "Updated Okta SSO"
   */
  name?: string;
  /** OIDC scopes to request during authentication */
  scopes?: string[];
}

/** Bad request error for updating partner app webhook filters */
export interface AdminUpdateWebhookFilterError400 {
  /**
   * Unique identifier for the error type
   * @example "validation_error"
   */
  code?: "invalid_request_body" | "validation_error";
  /**
   * User-friendly description of what went wrong
   * @example "invalid event types: invalid.event"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
  /**
   * Valid event types that can be used in the webhook filter request
   * @example ["meeting.created","action_item.updated"]
   */
  valid_event_types?: string[];
}

export interface AdminUpdateWebhookStatusRequest {
  /** @example true */
  enabled: boolean;
  /** @example "abandon" */
  pending_disposition?: "deliver" | "abandon";
}

/** Bad request error for updating a workflow */
export interface AdminUpdateWorkflowError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_workflow_id"
   */
  code?: "invalid_workflow_id" | "invalid_request_body" | "validation_error";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid workflow ID format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface AdminUpdateWorkflowRequest {
  /** @minItems 1 */
  actions?: PartnerWorkflowAction[];
  /**
   * @maxLength 1000
   * @example "Updated description"
   */
  description?: string;
  is_active?: boolean;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Updated CRM Integration"
   */
  name?: string;
  /** @example "active" */
  status?: "active" | "inactive";
  trigger_type?:
    | "action_item_created"
    | "action_item_updated"
    | "action_item_completed"
    | "meeting_ended"
    | "meeting_summary_ready";
}

export interface AdminUserConnectionResponse {
  /**
   * Timestamp when the connection was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * When the partner feature was activated for this user
   * @example "2023-01-01T00:00:00Z"
   */
  feature_activated_at?: string;
  /**
   * Unique identifier for the user connection
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  id?: string;
  /**
   * When the user last used the partner integration
   * @example "2023-01-15T10:30:00Z"
   */
  last_used_at?: string;
  /**
   * Expiration time of the OAuth token
   * @example "2023-12-31T23:59:59Z"
   */
  oauth_expires_at?: string;
  /**
   * OAuth scopes granted by the user
   * @example ["['openid'"," 'profile'"," 'meetings:read']"]
   */
  oauth_scopes?: string[];
  /**
   * Current status of the connection (active, inactive, revoked)
   * @example "active"
   */
  status?: string;
  /**
   * Timestamp when the connection was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
  /**
   * Email address of the connected user
   * @example "john.doe@example.com"
   */
  user_email?: string;
  /**
   * ID of the connected user
   * @example "123e4567-e89b-12d3-a456-426614174003"
   */
  user_id?: string;
  /**
   * Display name of the connected user
   * @example "John Doe"
   */
  user_name?: string;
}

export interface AdminWebhookDeliveriesResponse {
  /** Array of webhook delivery records */
  deliveries?: AdminWebhookDeliveryResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of deliveries matching the filter
   * @example 25
   */
  total?: number;
}

export interface AdminWebhookDeliveryResponse {
  /**
   * Timestamp when the delivery was created
   * @example "2024-01-14T10:00:00Z"
   */
  created_at?: string;
  /**
   * When the webhook was successfully delivered
   * @example "2024-01-14T10:30:00Z"
   */
  delivered_at?: string;
  /**
   * Current delivery status (pending, delivered, failed, abandoned)
   * @example "delivered"
   */
  delivery_status?: string;
  /**
   * Error message if delivery failed
   * @example ""
   */
  error_message?: string;
  /**
   * ID of the event that triggered this delivery
   * @example "123e4567-e89b-12d3-a456-426614174006"
   */
  event_id?: string;
  /**
   * Type of event that triggered this webhook
   * @example "action_item_created"
   */
  event_type?: string;
  /**
   * HTTP status code returned by the webhook endpoint
   * @example 200
   */
  http_status_code?: number;
  /**
   * Unique identifier for the webhook delivery
   * @example "123e4567-e89b-12d3-a456-426614174005"
   */
  id?: string;
  /**
   * When the next retry attempt will be made (if applicable)
   * @example "2024-01-15T10:30:00Z"
   */
  next_retry_at?: string;
  /**
   * ID of the partner app this delivery belongs to
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  partner_app_id?: string;
  /**
   * Number of retry attempts made
   * @example 0
   */
  retry_count?: number;
}

export interface AdminWebhookFilterResponse {
  /**
   * Event types included in the filter configuration
   * @example ["meeting.created","action_item.updated"]
   */
  events?: string[];
  /**
   * Filter mode controlling how events are matched
   * @example "include"
   */
  type?: string;
}

export interface AdminWorkflowResponse {
  /** Actions to execute when the workflow is triggered */
  actions?: PartnerWorkflowAction[];
  /**
   * Timestamp when the workflow was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Optional description of what the workflow does
   * @example "Sync action items to CRM"
   */
  description?: string;
  /**
   * Unique identifier for the workflow
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  id?: string;
  /**
   * Name of the workflow
   * @example "CRM Integration"
   */
  name?: string;
  /**
   * ID of the partner app that owns this workflow
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  partner_app_id?: string;
  /**
   * Current status (active or inactive)
   * @example "active"
   */
  status?: string;
  /**
   * Event type that triggers this workflow
   * @example "action_item_created"
   */
  trigger_type?: string;
  /**
   * Timestamp when the workflow was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
}

export type AuthorizeCreateData = OauthOAuthConsentResponse;

export type AuthorizeCreateError = Record<string, unknown>;

export type AuthorizeListError = ErrorsErrorResponse;

export interface AuthorizeListParams {
  /** OAuth client ID */
  client_id: string;
  /** PKCE code challenge */
  code_challenge?: string;
  /** PKCE code challenge method */
  code_challenge_method?: string;
  /** OAuth redirect URI */
  redirect_uri: string;
  /** OAuth response type (code) */
  response_type: string;
  /** OAuth scopes */
  scope?: string;
  /** OAuth state parameter */
  state?: string;
}

/** Bad request error for creating a meeting from a calendar event */
export interface CalendarCreateMeetingFromCalendarEventError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_calendar_event_id"
   */
  code?: "invalid_calendar_event_id" | "invalid_request";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid calendar event ID format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

/** Bad request error for listing calendar events */
export interface CalendarGetCalendarEventsError400 {
  /**
   * Error code identifying the specific type of error
   * @example "invalid_start_date"
   */
  code?:
    | "invalid_query_parameters"
    | "missing_start_date"
    | "missing_end_date"
    | "invalid_start_date"
    | "invalid_end_date";
  /**
   * Human-readable error message
   * @example "Invalid start_date format"
   */
  error?: string;
  /**
   * Request identifier for tracing
   * @example "abc123xyz"
   */
  request_id?: string;
}

/** Bad request error for linking a calendar event to a meeting */
export interface CalendarLinkCalendarEventError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_meeting_id"
   */
  code?:
    | "invalid_meeting_id"
    | "invalid_request_body"
    | "calendar_event_already_linked"
    | "meeting_already_linked";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid meeting ID format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface CalendarLinkCalendarEventResponse {
  /**
   * Human-readable message describing the result
   * @example "Meeting linked to calendar event successfully"
   */
  message?: string;
  /**
   * Whether the operation was successful
   * @example true
   */
  success?: boolean;
}

export interface CalendarPartnerCalendarEventAttendee {
  /**
   * Email address of the attendee
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * Display name of the attendee
   * @example "John Doe"
   */
  name?: string;
  /**
   * RSVP status (accepted, declined, tentative, needs_action)
   * @example "accepted"
   */
  status?: string;
  /**
   * Attendee type (required, optional, resource)
   * @example "required"
   */
  type?: string;
}

export interface CalendarPartnerCalendarEventResponse {
  /** List of attendees for the calendar event */
  attendees?: CalendarPartnerCalendarEventAttendee[];
  /**
   * Description or body of the calendar event
   * @example "Discuss project updates"
   */
  description?: string;
  /**
   * End time of the event in RFC3339 format
   * @example "2023-01-01T11:00:00-07:00"
   */
  end_time?: string;
  /**
   * Unique identifier for the calendar event
   * @example "123e4567-e89b-12d3-a456-426614174006"
   */
  id?: string;
  /**
   * Location of the event (physical or virtual)
   * @example "Conference Room A"
   */
  location?: string;
  /**
   * ID of the linked Contio meeting, if any
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  meeting_id?: string;
  /** Organizer of the calendar event */
  organizer?: CalendarPartnerCalendarEventAttendee;
  /**
   * Start time of the event in RFC3339 format
   * @example "2023-01-01T10:00:00-07:00"
   */
  start_time?: string;
  /**
   * Title of the calendar event
   * @example "Weekly Team Sync"
   */
  title?: string;
}

export interface CalendarPartnerCreateMeetingFromCalendarEventResponse {
  /**
   * Whether a new meeting was created (false if existing meeting was returned)
   * @example true
   */
  created?: boolean;
  /** The created or existing meeting */
  meeting?: SharedPartnerMeetingResponse;
  /**
   * Human-readable message describing the result
   * @example "Meeting created successfully from calendar event"
   */
  message?: string;
}

export interface CalendarPartnerLinkCalendarEventRequest {
  /**
   * @maxLength 255
   * @example "123e4567-e89b-12d3-a456-426614174006"
   */
  calendar_event_id: string;
}

export type CheckConsentCreateData = OauthOAuthConsentCheckResponse;

export type CheckConsentCreateError = ErrorsErrorResponse;

export interface ContextMeetingContextListResponse {
  items?: ContextMeetingContextResponse[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface ContextMeetingContextResponse {
  context_type?: string;
  created_at?: string;
  created_by_user_id?: string;
  deleted_at?: string;
  document_id?: string;
  id?: string;
  meeting_id?: string;
  partner_app_id?: string;
  platform_name?: string;
  source_format?: string;
  title?: string;
  updated_at?: string;
  workspace_id?: string;
}

/** Standard error response format used across all API endpoints. All error responses follow this consistent structure for predictable error handling. */
export interface ErrorsErrorResponse {
  /**
   * Unique identifier for the error type, useful for programmatic error handling
   * @example "not_found"
   */
  code?:
    | "not_found"
    | "note_not_found"
    | "bad_request"
    | "validation_error"
    | "unauthorized"
    | "forbidden"
    | "conflict"
    | "resource_already_exists"
    | "too_many_requests"
    | "internal_server_error";
  /**
   * User-friendly description of what went wrong
   * @example "The requested resource could not be found"
   */
  message?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

/** Error response for workspace conflict (409). Includes the user's current workspace_id. */
export interface ErrorsPartnerConflictErrorResponse {
  /**
   * Unique identifier for the error type, useful for programmatic error handling
   * @example "workspace_conflict"
   */
  code?: string;
  /**
   * User-friendly description of what went wrong
   * @example "User already belongs to a different workspace"
   */
  error?: string;
  /**
   * Deprecated: Use 'error' field instead. Will be removed in v2.0
   * @example "User already belongs to a different workspace"
   */
  message?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
  /**
   * The workspace ID the user currently belongs to
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  workspace_id?: string;
}

/** Standard error response format used across all partner API endpoints. This format is used by both partner admin and partner user APIs for consistency. DEPRECATION NOTICE (v2.0): The 'message' field will be removed in the next major release. Partners should migrate to using the 'error' field instead. */
export interface ErrorsPartnerErrorResponse {
  /**
   * Unique identifier for the error type, useful for programmatic error handling
   * @example "invalid_request"
   */
  code?: string;
  /**
   * User-friendly description of what went wrong
   * @example "Invalid request"
   */
  error?: string;
  /**
   * Deprecated: Use 'error' field instead. Will be removed in v2.0
   * @example "Invalid request"
   */
  message?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export type HealthListData = OauthHealthResponse;

export type HealthListError = ErrorsErrorResponse;

export type InitiateCreateData = OauthPartnerAuthInitiateResponse;

export type InitiateCreateError =
  | ErrorsErrorResponse
  | ErrorsPartnerErrorResponse
  | ErrorsPartnerConflictErrorResponse;

export type IntrospectCreateData =
  RomeApiControllersExternalPartnerOauthTokenIntrospection;

export type IntrospectCreateError = ErrorsErrorResponse;

export interface IntrospectCreatePayload {
  /** Access token to introspect */
  token: string;
}

export type JwksJsonListData =
  RomeApiControllersExternalPartnerOauthJWKSResponse;

export type JwksJsonListError = ErrorsErrorResponse;

export interface MeetingAddParticipantRequest {
  /** @example "john.doe@example.com" */
  email: string;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "John Doe"
   */
  name: string;
  /** @example "EDITOR" */
  role: "EDITOR" | "VIEWER";
}

export interface MeetingCreateAgendaItemRequest {
  /**
   * @maxLength 5000
   * @example "Review and discuss Q1 objectives"
   */
  description?: string;
  /** @example "DISCUSSION" */
  item_type: "DISCUSSION" | "DECISION" | "ACTION_ITEM" | "INFORMATION";
  /** @example ["123e4567-e89b-12d3-a456-426614174003"] */
  presenters?: string[];
  /** @example false */
  restricted_to_leads?: boolean;
  /**
   * @min 0
   * @max 1440
   * @example 15
   */
  time_allocation_minutes?: number;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Q1 Planning Discussion"
   */
  title: string;
}

/** Bad request error for creating a meeting */
export interface MeetingCreateMeetingError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_start_time"
   */
  code?:
    | "invalid_request"
    | "invalid_start_time"
    | "invalid_end_time"
    | "invalid_time_range"
    | "invalid_start_date";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid start time format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

/** Bad request error for listing meetings */
export interface MeetingGetMeetingsError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_start_date"
   */
  code?: "invalid_start_date" | "invalid_end_date";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid start_date format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface MeetingPartnerAgendaItemResponse {
  /**
   * Timestamp when the agenda item was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Detailed description of the agenda item
   * @example "Review and discuss Q1 objectives"
   */
  description?: string;
  /**
   * Unique identifier for the agenda item
   * @example "123e4567-e89b-12d3-a456-426614174005"
   */
  id?: string;
  /**
   * Type of agenda item (DISCUSSION, DECISION, ACTION_ITEM, INFORMATION)
   * @example "DISCUSSION"
   */
  item_type?: string;
  /**
   * ID of the meeting this agenda item belongs to
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  meeting_id?: string;
  /**
   * User IDs of the presenters for this agenda item
   * @example ["123e4567-e89b-12d3-a456-426614174003"]
   */
  presenters?: string[];
  /**
   * Whether this item is restricted to meeting leads only
   * @example false
   */
  restricted_to_leads?: boolean;
  /**
   * Order sequence of the agenda item
   * @example "1"
   */
  sequence?: string;
  /**
   * Current status (pending, in_progress, completed)
   * @example "pending"
   */
  status?: string;
  /**
   * Allocated time for this agenda item in minutes
   * @example 15
   */
  time_allocation_minutes?: number;
  /**
   * Title of the agenda item
   * @example "Q1 Planning Discussion"
   */
  title?: string;
  /**
   * Timestamp when the agenda item was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
}

export interface MeetingPartnerCreateMeetingRequest {
  /** @example "STANDARD" */
  detail_level?: "BULLET_POINTS" | "STANDARD" | "VERBATIM";
  /** @example "2023-01-01T11:00:00Z" */
  end_time?: string;
  /** @example false */
  is_instant?: boolean;
  /** @example "2023-01-01T10:00:00Z" */
  start_time?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174004" */
  template_id?: string;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Weekly Team Sync"
   */
  title: string;
}

export interface MeetingPartnerMeetingParticipantResponse {
  /**
   * Timestamp when the participant was added
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Participant's email address
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * Unique identifier for the participant record
   * @example "123e4567-e89b-12d3-a456-426614174004"
   */
  id?: string;
  /**
   * Whether the participant attended the meeting
   * @example true
   */
  is_attended?: boolean;
  /**
   * ID of the meeting this participant belongs to
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  meeting_id?: string;
  /**
   * Participant's display name
   * @example "John Doe"
   */
  name?: string;
  /**
   * Participant's role in the meeting (EDITOR or VIEWER)
   * @example "EDITOR"
   */
  role?: string;
  /**
   * Timestamp when the participant record was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
  /**
   * ID of the user if they have a Contio account
   * @example "123e4567-e89b-12d3-a456-426614174003"
   */
  user_id?: string;
}

export interface MeetingPartnerUpdateMeetingRequest {
  /** @example "STANDARD" */
  detail_level?: "BULLET_POINTS" | "STANDARD" | "VERBATIM";
  /** @example "2023-01-01T11:00:00Z" */
  end_time?: string;
  /** @example "2023-01-01T10:00:00Z" */
  start_time?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174004" */
  template_id?: string;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Updated Team Sync"
   */
  title?: string;
}

export interface MeetingUpdateAgendaItemRequest {
  /**
   * @maxLength 5000
   * @example "Updated description"
   */
  description?: string;
  /** @example "DISCUSSION" */
  item_type?: "DISCUSSION" | "DECISION" | "ACTION_ITEM" | "INFORMATION";
  /** @example ["123e4567-e89b-12d3-a456-426614174003"] */
  presenters?: string[];
  /** @example true */
  restricted_to_leads?: boolean;
  /** @example "in_progress" */
  status?: "pending" | "in_progress" | "completed";
  /**
   * @min 0
   * @max 1440
   * @example 20
   */
  time_allocation_minutes?: number;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Updated Discussion"
   */
  title?: string;
}

/** Bad request error for updating a meeting */
export interface MeetingUpdateMeetingError400 {
  /**
   * Unique identifier for the error type
   * @example "invalid_meeting_id"
   */
  code?:
    | "invalid_meeting_id"
    | "invalid_request"
    | "invalid_start_time"
    | "invalid_end_time"
    | "invalid_time_range";
  /**
   * User-friendly description of what went wrong
   * @example "Invalid meeting ID format"
   */
  error?: string;
  /**
   * Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export interface OauthHealthResponse {
  checks?: Record<string, unknown>;
  /** @example "partner-oauth" */
  service?: string;
  /** @example "healthy" */
  status?: string;
  /** @example "2024-01-14T10:00:00Z" */
  timestamp?: string;
}

export interface OauthOAuthConsentCheckRequest {
  /** @example "partner_abc123" */
  client_id: string;
  /** @example "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM" */
  code_challenge?: string;
  /** @example "S256" */
  code_challenge_method?: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "https://partner.example.com/callback" */
  redirect_uri?: string;
  /** @example "code" */
  response_type?: string;
  /** @example ["openid","profile","email"] */
  scopes?: string[];
  /** @example "abc123state" */
  state?: string;
}

export interface OauthOAuthConsentCheckResponse {
  /** @example true */
  has_consent?: boolean;
  /** @example "https://partner.example.com/callback?code=abc123" */
  redirect_url?: string;
  /** @example false */
  requires_consent?: boolean;
  /** @example true */
  session_valid?: boolean;
}

export interface OauthOAuthConsentRequest {
  /** @example "partner_abc123" */
  client_id: string;
  /** @example "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM" */
  code_challenge?: string;
  /** @example "S256" */
  code_challenge_method?: string;
  /** @example true */
  consent: boolean;
  /** @example "user@example.com" */
  email: string;
  /** @example "https://partner.example.com/callback" */
  redirect_uri: string;
  /** @example "code" */
  response_type: string;
  /** @example "openid profile email" */
  scope?: string;
  /** @example "abc123state" */
  state?: string;
}

export interface OauthOAuthConsentResponse {
  /** @example "auth_code_abc123" */
  code?: string;
  /** @example "https://partner.example.com/callback?code=auth_code_abc123&state=abc123state" */
  redirect_url?: string;
  /** @example "abc123state" */
  state?: string;
}

export interface OauthPartnerAuthInitiateRequest {
  /** @example "partner_abc123" */
  client_id: string;
  /** @example "user@example.com" */
  email: string;
  /** @example false */
  is_admin?: boolean;
  /** @example "John Doe" */
  name?: string;
  /** @example "550e8400-e29b-41d4-a716-446655440000" */
  workspace_id?: string;
}

export interface OauthPartnerAuthInitiateResponse {
  /** @example "CUSTOM_CHALLENGE" */
  challenge_name?: string;
  challenge_params?: Record<string, string>;
  /** @example "AYABeExample..." */
  session?: string;
  /**
   * Indicates if user was newly created
   * @example false
   */
  user_provisioned?: boolean;
}

export interface OauthPartnerAuthResponse {
  /** @example "eyJraWQiOiJrZXkxIiwiYWxnIjoiUlMyNTYifQ..." */
  access_token?: string;
  /** @example 3600 */
  expires_in?: number;
  /** @example "eyJraWQiOiJrZXkxIiwiYWxnIjoiUlMyNTYifQ..." */
  id_token?: string;
  /** @example "Authentication successful" */
  message?: string;
  /** @example "https://app.example.com/dashboard" */
  redirect?: string;
  /** @example "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIn0..." */
  refresh_token?: string;
  /** @example true */
  success?: boolean;
}

export interface OauthPartnerAuthVerifyRequest {
  /** @example "partner_abc123" */
  client_id: string;
  /** @example "123456" */
  code: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "AYABeExample..." */
  session: string;
}

export interface OauthPartnerInfoResponse {
  /** @example "partner_abc123" */
  client_id?: string;
  /** @example "Powered by Contio" */
  co_brand_name?: string;
  /** @example "Acme Corporation" */
  company_name?: string;
  /** @example "Acme CRM" */
  name?: string;
}

export interface OauthScopesResponse {
  scopes?: string[];
}

export type OpenidConfigurationListData =
  RomeApiControllersExternalPartnerOauthDiscoveryDocument;

export type OpenidConfigurationListError = ErrorsErrorResponse;

export type PartnerAdminAppListData = AdminPartnerAppResponse;

export type PartnerAdminAppListError = ErrorsPartnerErrorResponse;

export type PartnerAdminAppStatusUpdateData = AdminPartnerAppResponse;

export type PartnerAdminAppStatusUpdateError =
  | AdminUpdateAppStatusError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminAppUpdateData = AdminPartnerAppResponse;

export type PartnerAdminAppUpdateError =
  | AdminUpdateAppError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminAppWebhookFilterDeleteData = AdminPartnerAppResponse;

export type PartnerAdminAppWebhookFilterDeleteError =
  ErrorsPartnerErrorResponse;

export type PartnerAdminAppWebhookFilterUpdateData = AdminPartnerAppResponse;

export type PartnerAdminAppWebhookFilterUpdateError =
  | AdminUpdateWebhookFilterError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminAppWebhookStatusUpdateData = AdminPartnerAppResponse;

export type PartnerAdminAppWebhookStatusUpdateError =
  ErrorsPartnerErrorResponse;

export type PartnerAdminConnectionsDeleteData = any;

export type PartnerAdminConnectionsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminConnectionsDeleteParams {
  /** Connection ID */
  connectionId: string;
}

export type PartnerAdminConnectionsDetailData = AdminUserConnectionResponse;

export type PartnerAdminConnectionsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminConnectionsDetailParams {
  /** Connection ID */
  connectionId: string;
}

export type PartnerAdminConnectionsListData =
  AdminListResponseAdminUserConnectionResponse;

export type PartnerAdminConnectionsListError = ErrorsPartnerErrorResponse;

export interface PartnerAdminConnectionsListParams {
  /**
   * Limit
   * @default 50
   */
  limit?: number;
  /**
   * Offset
   * @default 0
   */
  offset?: number;
  /** Filter by connection status */
  status?: "active" | "revoked" | "expired";
  /**
   * Filter by user ID
   * @example ""123e4567-e89b-12d3-a456-426614174000""
   */
  user_id?: string;
}

export type PartnerAdminCredentialsApiKeyRotateCreateData =
  AdminCredentialRotationResponse;

export type PartnerAdminCredentialsApiKeyRotateCreateError =
  | AdminRotateAPIKeyError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminCredentialsClientSecretRotateCreateData =
  AdminCredentialRotationResponse;

export type PartnerAdminCredentialsClientSecretRotateCreateError =
  | AdminRotateClientSecretError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminCredentialsHistoryListData = Record<string, unknown>;

export type PartnerAdminCredentialsHistoryListError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminCredentialsHistoryListParams {
  /** Filter by credential type */
  credential_type?: string;
  /**
   * Number of events to return
   * @default 20
   */
  limit?: number;
  /**
   * Number of events to skip
   * @default 0
   */
  offset?: number;
}

export type PartnerAdminCredentialsListData = Record<
  string,
  AdminCredentialStatusResponse
>;

export type PartnerAdminCredentialsListError = ErrorsPartnerErrorResponse;

export type PartnerAdminCredentialsWebhookSecretRotateCreateData =
  AdminCredentialRotationResponse;

export type PartnerAdminCredentialsWebhookSecretRotateCreateError =
  | AdminRotateWebhookSecretError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminIdpCreateData = AdminIdPConfigResponse;

export type PartnerAdminIdpCreateError =
  | AdminCreateIdPConfigError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminIdpDeleteData = any;

export type PartnerAdminIdpDeleteError = ErrorsPartnerErrorResponse;

export type PartnerAdminIdpListData = AdminIdPConfigResponse;

export type PartnerAdminIdpListError = ErrorsPartnerErrorResponse;

export type PartnerAdminIdpUpdateData = AdminIdPConfigResponse;

export type PartnerAdminIdpUpdateError =
  | AdminUpdateIdPConfigError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminWebhookDeliveriesDetailData =
  AdminWebhookDeliveryResponse;

export type PartnerAdminWebhookDeliveriesDetailError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminWebhookDeliveriesDetailParams {
  /** Webhook Delivery ID */
  deliveryId: string;
}

export type PartnerAdminWebhookDeliveriesListData =
  AdminWebhookDeliveriesResponse;

export type PartnerAdminWebhookDeliveriesListError = ErrorsPartnerErrorResponse;

export interface PartnerAdminWebhookDeliveriesListParams {
  /** Filter by event type (e.g., meeting.created, workflow.assignment.created) */
  event_type?: string;
  /** Maximum number of results to return (default 50, max 100) */
  limit?: number;
  /** Number of results to skip (default 0) */
  offset?: number;
  /** Filter by delivery status (pending, delivered, failed, abandoned) */
  status?: string;
}

export type PartnerAdminWebhookDeliveriesRetryCreateData = Record<string, unknown>;

export type PartnerAdminWebhookDeliveriesRetryCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminWebhookDeliveriesRetryCreateParams {
  /** Webhook Delivery ID */
  deliveryId: string;
}

export type PartnerAdminWorkflowsCreateData = AdminWorkflowResponse;

export type PartnerAdminWorkflowsCreateError =
  | AdminCreateWorkflowError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminWorkflowsDeleteData = any;

export type PartnerAdminWorkflowsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminWorkflowsDeleteParams {
  /** Workflow ID */
  workflowId: string;
}

export type PartnerAdminWorkflowsDetailData = AdminWorkflowResponse;

export type PartnerAdminWorkflowsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminWorkflowsDetailParams {
  /** Workflow ID */
  workflowId: string;
}

export type PartnerAdminWorkflowsListData =
  AdminListResponseAdminWorkflowResponse;

export type PartnerAdminWorkflowsListError = ErrorsPartnerErrorResponse;

export interface PartnerAdminWorkflowsListParams {
  /**
   * Limit
   * @default 50
   */
  limit?: number;
  /**
   * Offset
   * @default 0
   */
  offset?: number;
}

export type PartnerAdminWorkflowsUpdateData = AdminWorkflowResponse;

export type PartnerAdminWorkflowsUpdateError =
  | AdminUpdateWorkflowError400
  | ErrorsPartnerErrorResponse;

export interface PartnerAdminWorkflowsUpdateParams {
  /** Workflow ID */
  workflowId: string;
}

export type PartnerInfoPublicListData = OauthPartnerInfoResponse;

export type PartnerInfoPublicListError = ErrorsErrorResponse;

export interface PartnerInfoPublicListParams {
  /** Partner Client ID */
  clientId: string;
}

export type PartnerSsoCallbackListError = string | Record<string, unknown>;

export interface PartnerSsoCallbackListParams {
  /** Authorization code from IdP */
  code?: string;
  /** Error code if authentication failed */
  error?: string;
  /** Error description if authentication failed */
  error_description?: string;
  /** State parameter for session validation */
  state: string;
}

export type PartnerSsoInfoDetailData = SsoPartnerSSOInfoResponse;

export type PartnerSsoInfoDetailError = SsoErrorResponse;

export interface PartnerSsoInfoDetailParams {
  /** Partner slug */
  slug: string;
}

export type PartnerSsoInitiateListData = SsoInitiateResponse;

export type PartnerSsoInitiateListError = string | Record<string, unknown>;

export interface PartnerSsoInitiateListParams {
  /** Auto-redirect to authorization URL */
  auto?: boolean;
  /** Partner app slug */
  slug: string;
  /** Target platform: web (default), desktop, backlog, or meeting:{id} */
  target?: "web" | "desktop" | "backlog";
}

export type PartnerSsoSessionDetailData = SsoSessionStatusResponse;

export type PartnerSsoSessionDetailError = Record<string, unknown>;

export interface PartnerSsoSessionDetailParams {
  /** Session ID */
  sessionId: string;
}

export type PartnerUserActionItemsCreateData =
  ActionItemPartnerActionItemResponse;

export type PartnerUserActionItemsCreateError =
  | ActionItemCreateActionItemError400
  | ErrorsPartnerErrorResponse;

export type PartnerUserActionItemsDeleteData = any;

export type PartnerUserActionItemsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerUserActionItemsDeleteParams {
  /** Action Item ID */
  id: string;
}

export type PartnerUserActionItemsDetailData =
  ActionItemPartnerActionItemResponse;

export type PartnerUserActionItemsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserActionItemsDetailParams {
  /** Action Item ID */
  id: string;
}

export type PartnerUserActionItemsListData =
  SharedListResponseActionItemPartnerActionItemResponse;

export type PartnerUserActionItemsListError =
  | ActionItemGetActionItemsError400
  | ErrorsPartnerErrorResponse;

export interface PartnerUserActionItemsListParams {
  /**
   * Filter by end date (ISO 8601)
   * @example ""2023-12-31T23:59:59Z""
   */
  end_date?: string;
  /** Filter by partner assignment */
  has_partner_assignment?: boolean;
  /** Filter by completion status */
  is_completed?: boolean;
  /**
   * Limit
   * @default 25
   */
  limit?: number;
  /**
   * Filter by meeting ID
   * @example ""123e4567-e89b-12d3-a456-426614174000""
   */
  meeting_id?: string;
  /**
   * Offset
   * @default 0
   */
  offset?: number;
  /**
   * Filter by start date (ISO 8601)
   * @example ""2023-01-01T00:00:00Z""
   */
  start_date?: string;
}

export type PartnerUserActionItemsUpdateData =
  ActionItemPartnerActionItemResponse;

export type PartnerUserActionItemsUpdateError =
  | ActionItemUpdateActionItemError400
  | ErrorsPartnerErrorResponse;

export interface PartnerUserActionItemsUpdateParams {
  /** Action Item ID */
  id: string;
}

export type PartnerUserCalendarEventsDetailData =
  CalendarPartnerCalendarEventResponse;

export type PartnerUserCalendarEventsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserCalendarEventsDetailParams {
  /**
   * Calendar Event ID
   * @example ""123e4567-e89b-12d3-a456-426614174006""
   */
  calendarEventId: string;
}

export type PartnerUserCalendarEventsListData =
  SharedListResponseCalendarPartnerCalendarEventResponse;

export type PartnerUserCalendarEventsListError =
  | CalendarGetCalendarEventsError400
  | ErrorsPartnerErrorResponse;

export interface PartnerUserCalendarEventsListParams {
  /** Sort direction: asc or desc (default: asc) */
  direction?: string;
  /**
   * Deprecated: Use end_date instead
   * @example ""2023-01-31T23:59:59Z""
   */
  end?: string;
  /**
   * End time in RFC3339 format (preferred)
   * @example ""2023-01-31T23:59:59Z""
   */
  end_date?: string;
  /** Number of results per page (default 25, max 100) */
  limit?: number;
  /** Pagination offset (default 0) */
  offset?: number;
  /**
   * Deprecated: Use start_date instead
   * @example ""2023-01-01T00:00:00Z""
   */
  start?: string;
  /**
   * Start time in RFC3339 format (preferred)
   * @example ""2023-01-01T00:00:00Z""
   */
  start_date?: string;
}

export type PartnerUserCalendarEventsMeetingCreateData =
  CalendarPartnerCreateMeetingFromCalendarEventResponse;

export type PartnerUserCalendarEventsMeetingCreateError =
  | CalendarCreateMeetingFromCalendarEventError400
  | ErrorsPartnerErrorResponse;

export interface PartnerUserCalendarEventsMeetingCreateParams {
  /**
   * Calendar Event ID
   * @example ""123e4567-e89b-12d3-a456-426614174006""
   */
  calendarEventId: string;
}

export type PartnerUserMeetingsAgendaItemsCreateData =
  MeetingPartnerAgendaItemResponse;

export type PartnerUserMeetingsAgendaItemsCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsAgendaItemsCreateParams {
  /**
   * Meeting ID
   * @format uuid
   */
  meetingId: string;
}

export type PartnerUserMeetingsAgendaItemsDeleteData = any;

export type PartnerUserMeetingsAgendaItemsDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsAgendaItemsDeleteParams {
  /**
   * Agenda Item ID
   * @format uuid
   */
  itemId: string;
  /**
   * Meeting ID
   * @format uuid
   */
  meetingId: string;
}

export type PartnerUserMeetingsAgendaItemsListData =
  SharedListResponseMeetingPartnerAgendaItemResponse;

export type PartnerUserMeetingsAgendaItemsListError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsAgendaItemsListParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsAgendaItemsUpdateData =
  MeetingPartnerAgendaItemResponse;

export type PartnerUserMeetingsAgendaItemsUpdateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsAgendaItemsUpdateParams {
  /**
   * Agenda Item ID
   * @format uuid
   */
  itemId: string;
  /**
   * Meeting ID
   * @format uuid
   */
  meetingId: string;
}

export type PartnerUserMeetingsCalendarLinkCreateData =
  CalendarLinkCalendarEventResponse;

export type PartnerUserMeetingsCalendarLinkCreateError =
  | CalendarLinkCalendarEventError400
  | ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsCalendarLinkCreateParams {
  /**
   * Meeting ID
   * @example ""123e4567-e89b-12d3-a456-426614174000""
   */
  id: string;
}

export type PartnerUserMeetingsCalendarUnlinkDeleteData =
  CalendarLinkCalendarEventResponse;

export type PartnerUserMeetingsCalendarUnlinkDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsCalendarUnlinkDeleteParams {
  /**
   * Meeting ID
   * @example ""123e4567-e89b-12d3-a456-426614174000""
   */
  id: string;
}

/** @format binary */
export type PartnerUserMeetingsContextContentListData = File;

export type PartnerUserMeetingsContextContentListError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsContextContentListParams {
  /**
   * Document ID
   * @format uuid
   */
  documentId: string;
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsContextCreateData =
  ContextMeetingContextResponse;

export type PartnerUserMeetingsContextCreateError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsContextCreateParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export interface PartnerUserMeetingsContextCreatePayload {
  /** Logical context type */
  context_type?: string;
  /** Context document file */
  file: File;
  /** Source format (json,csv,tsv,xml,html,yaml,md,txt) */
  source_format: string;
  /** Document title */
  title?: string;
}

export type PartnerUserMeetingsContextDeleteData = any;

export type PartnerUserMeetingsContextDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsContextDeleteParams {
  /**
   * Document ID
   * @format uuid
   */
  documentId: string;
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsContextDetailData =
  ContextMeetingContextResponse;

export type PartnerUserMeetingsContextDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsContextDetailParams {
  /**
   * Document ID
   * @format uuid
   */
  documentId: string;
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsContextListData =
  ContextMeetingContextListResponse;

export type PartnerUserMeetingsContextListError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsContextListParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
  /**
   * Limit
   * @default 25
   */
  limit?: number;
  /**
   * Offset
   * @default 0
   */
  offset?: number;
}

export type PartnerUserMeetingsCreateData = SharedPartnerMeetingResponse;

export type PartnerUserMeetingsCreateError =
  | MeetingCreateMeetingError400
  | ErrorsPartnerErrorResponse;

export type PartnerUserMeetingsDetailData = SharedPartnerMeetingResponse;

export type PartnerUserMeetingsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsDetailParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserMeetingsListData =
  SharedListResponseSharedPartnerMeetingResponse;

export type PartnerUserMeetingsListError =
  | MeetingGetMeetingsError400
  | ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsListParams {
  /**
   * End date filter (ISO 8601)
   * @example ""2023-12-31T23:59:59Z""
   */
  end_date?: string;
  /**
   * Limit
   * @default 25
   */
  limit?: number;
  /**
   * Offset
   * @default 0
   */
  offset?: number;
  /**
   * Start date filter (ISO 8601)
   * @example ""2023-01-01T00:00:00Z""
   */
  start_date?: string;
}

export type PartnerUserMeetingsPartialUpdateData = SharedPartnerMeetingResponse;

export type PartnerUserMeetingsPartialUpdateError =
  | MeetingUpdateMeetingError400
  | ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsPartialUpdateParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserMeetingsParticipantsCreateData =
  MeetingPartnerMeetingParticipantResponse;

export type PartnerUserMeetingsParticipantsCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsParticipantsCreateParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsParticipantsDeleteData = any;

export type PartnerUserMeetingsParticipantsDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsParticipantsDeleteParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
  /**
   * Participant ID
   * @format uuid
   */
  participantId: string;
}

export type PartnerUserMeetingsParticipantsListData =
  SharedListResponseMeetingPartnerMeetingParticipantResponse;

export type PartnerUserMeetingsParticipantsListError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsParticipantsListParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserProfileListData = ProfileUserProfileResponse;

export type PartnerUserProfileListError = ErrorsPartnerErrorResponse;

export interface PartnerWorkflowAction {
  /** @example {"url":"https://api.example.com/webhook"} */
  config?: Record<string, string>;
  /** @example "webhook" */
  type: string;
}

export interface ProfileUserProfileResponse {
  /**
   * Timestamp when the user account was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * User's display name
   * @example "John Doe"
   */
  display_name?: string;
  /**
   * User's email address
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * Unique identifier for the user
   * @example "123e4567-e89b-12d3-a456-426614174003"
   */
  id?: string;
  /**
   * ID of the workspace the user belongs to
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  workspace_id?: string;
  /**
   * Name of the workspace the user belongs to
   * @example "Acme Corp"
   */
  workspace_name?: string;
  /**
   * User's role in the workspace (e.g., WORKSPACE_OWNER, WORKSPACE_ADMIN, WORKSPACE_MEMBER)
   * @example "WORKSPACE_MEMBER"
   */
  workspace_role?: string;
}

export type RevokeCreateData = any;

export type RevokeCreateError = ErrorsErrorResponse;

export interface RevokeCreatePayload {
  /** Token to revoke */
  token: string;
  /** Hint about token type (access_token or refresh_token) */
  token_type_hint?: string;
}

export interface RomeApiControllersExternalPartnerOauthDiscoveryDocument {
  /** @example "https://auth.contio.io/oauth2/authorize" */
  authorization_endpoint?: string;
  claims_supported?: string[];
  id_token_signing_alg_values_supported?: string[];
  /** @example "https://auth.contio.io/oauth2/introspect" */
  introspection_endpoint?: string;
  /** @example "https://auth.contio.io" */
  issuer?: string;
  /** @example "https://auth.contio.io/.well-known/jwks.json" */
  jwks_uri?: string;
  response_types_supported?: string[];
  /** @example "https://auth.contio.io/oauth2/revoke" */
  revocation_endpoint?: string;
  scopes_supported?: string[];
  subject_types_supported?: string[];
  /** @example "https://auth.contio.io/oauth2/token" */
  token_endpoint?: string;
  token_endpoint_auth_methods_supported?: string[];
  /** @example "https://auth.contio.io/oauth2/userInfo" */
  userinfo_endpoint?: string;
}

export interface RomeApiControllersExternalPartnerOauthJWK {
  /** @example "RS256" */
  alg?: string;
  /**
   * For ECDSA keys
   * @example "P-256"
   */
  crv?: string;
  /** For RSA and ECDSA private keys (optional) */
  d?: string;
  /** @example "AQAB" */
  e?: string;
  /** @example "key-id-1" */
  kid?: string;
  /** @example "RSA" */
  kty?: string;
  /** @example "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw" */
  n?: string;
  /** @example "sig" */
  use?: string;
  x?: string;
  y?: string;
}

export interface RomeApiControllersExternalPartnerOauthJWKSResponse {
  keys?: RomeApiControllersExternalPartnerOauthJWK[];
}

export interface RomeApiControllersExternalPartnerOauthTokenIntrospection {
  /** @example true */
  active?: boolean;
  aud?: string[];
  /** @example "partner_abc123" */
  client_id?: string;
  /** @example 1704110400 */
  exp?: number;
  ext?: Record<string, unknown>;
  /** @example 1704106800 */
  iat?: number;
  /** @example "https://auth.contio.io" */
  iss?: string;
  /** @example 1704106800 */
  nbf?: number;
  /** @example "openid profile email" */
  scope?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  sub?: string;
  /** @example "Bearer" */
  token_type?: string;
  /** @example "user@example.com" */
  username?: string;
}

export interface RomeApiControllersExternalPartnerOauthTokenResponse {
  /** @example "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." */
  access_token?: string;
  /** @example 3600 */
  expires_in?: number;
  /** @example "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." */
  id_token?: string;
  /** @example "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIn0..." */
  refresh_token?: string;
  /** @example "openid profile email" */
  scope?: string;
  /** @example "Bearer" */
  token_type?: string;
}

export interface RomeApiControllersExternalPartnerOauthUserInfo {
  /** @example "user@example.com" */
  email?: string;
  /** @example true */
  email_verified?: boolean;
  /** @example "Doe" */
  family_name?: string;
  /** @example "John" */
  given_name?: string;
  /** @example "en-US" */
  locale?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example "+1234567890" */
  phone_number?: string;
  /** @example false */
  phone_number_verified?: boolean;
  /** @example "https://example.com/avatar.jpg" */
  picture?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  sub?: string;
}

export type ScopesListData = OauthScopesResponse;

export type ScopesListError = ErrorsErrorResponse;

export interface SharedListResponseActionItemPartnerActionItemResponse {
  /** Array of items for the current page */
  items?: ActionItemPartnerActionItemResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of items across all pages
   * @example 100
   */
  total?: number;
}

export interface SharedListResponseCalendarPartnerCalendarEventResponse {
  /** Array of items for the current page */
  items?: CalendarPartnerCalendarEventResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of items across all pages
   * @example 100
   */
  total?: number;
}

export interface SharedListResponseMeetingPartnerAgendaItemResponse {
  /** Array of items for the current page */
  items?: MeetingPartnerAgendaItemResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of items across all pages
   * @example 100
   */
  total?: number;
}

export interface SharedListResponseMeetingPartnerMeetingParticipantResponse {
  /** Array of items for the current page */
  items?: MeetingPartnerMeetingParticipantResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of items across all pages
   * @example 100
   */
  total?: number;
}

export interface SharedListResponseSharedPartnerMeetingResponse {
  /** Array of items for the current page */
  items?: SharedPartnerMeetingResponse[];
  /**
   * Maximum number of items per page
   * @example 50
   */
  limit?: number;
  /**
   * Number of items skipped from the beginning
   * @example 0
   */
  offset?: number;
  /**
   * Total number of items across all pages
   * @example 100
   */
  total?: number;
}

export interface SharedPartnerMeetingResponse {
  /**
   * ID of the linked calendar event, if any
   * @example "123e4567-e89b-12d3-a456-426614174006"
   */
  calendar_event_id?: string;
  /**
   * Timestamp when the meeting was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * ID of the user who created the meeting
   * @example "123e4567-e89b-12d3-a456-426614174003"
   */
  created_by_user_id?: string;
  /**
   * Scheduled end time in RFC3339 format
   * @example "2023-01-01T11:00:00-07:00"
   */
  end_time?: string;
  /**
   * Unique identifier for the meeting
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * ID of the meeting to redirect to if this meeting was merged
   * @example "123e4567-e89b-12d3-a456-426614174007"
   */
  redirect_to_meeting_id?: string;
  /**
   * Scheduled start time in RFC3339 format
   * @example "2023-01-01T10:00:00-07:00"
   */
  start_time?: string;
  /**
   * Current status of the meeting
   * @example "completed"
   */
  status?: "draft" | "scheduled" | "in_progress" | "ended" | "completed";
  /**
   * AI-generated summary notes from the meeting
   * @example "Post-Meeting Summarization ..."
   */
  summary_notes?: string;
  /**
   * Title of the meeting
   * @example "Weekly Team Sync"
   */
  title?: string;
  /**
   * Timestamp when the meeting was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
  /**
   * ID of the workspace this meeting belongs to
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  workspace_id?: string;
}

export interface SsoErrorResponse {
  /** @example "sso_authentication_failed" */
  code?: string;
  /** @example "Authentication failed" */
  message?: string;
}

export interface SsoInitiateResponse {
  /** @example "https://idp.example.com/authorize?client_id=abc123&..." */
  authorization_url?: string;
  /** @example "sess_abc123def456" */
  session_id?: string;
}

export interface SsoPartnerSSOInfoResponse {
  /** @example "https://cdn.example.com/logos/acme.png" */
  co_brand_logo_url?: string;
  /** @example "Powered by Contio" */
  co_brand_name?: string;
  /** @example true */
  has_idp_config?: boolean;
  /** @example true */
  is_active?: boolean;
  /** @example "Acme CRM" */
  name?: string;
  /** @example "acme-crm" */
  slug?: string;
}

export interface SsoSessionStatusResponse {
  /** @example "Session expired" */
  error?: string;
  /** @example "pending" */
  status?: string;
  /** @example "web" */
  target?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  user_id?: string;
}

export type TokenCreateData =
  RomeApiControllersExternalPartnerOauthTokenResponse;

export type TokenCreateError = ErrorsErrorResponse;

export interface TokenCreatePayload {
  /** OAuth client ID */
  client_id: string;
  /** OAuth client secret */
  client_secret?: string;
  /** Authorization code */
  code: string;
  /** PKCE code verifier */
  code_verifier?: string;
  /** OAuth grant type (authorization_code) */
  grant_type: string;
  /** OAuth redirect URI */
  redirect_uri: string;
}

export type UserInfoListData = RomeApiControllersExternalPartnerOauthUserInfo;

export type UserInfoListError = ErrorsErrorResponse;

export type VerifyCreateData = OauthPartnerAuthResponse;

export type VerifyCreateError = ErrorsErrorResponse;
