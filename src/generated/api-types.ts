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

export interface ActionButtonActionButtonResponse {
  /**
   * Content format: rich_text, markdown, plain_text, html
   * @example "markdown"
   */
  content_format?: string;
  /**
   * When the action button was created
   * @example "2024-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Delivery mechanism: webhook, redirect, email, clipboard, file_download, integration, os_email_client
   * @example "webhook"
   */
  delivery_mechanism?: string;
  /**
   * File format for file_download delivery mechanism
   * @example "pdf"
   */
  file_format?: string;
  /**
   * Icon URL for the action button
   * @example "https://cdn.example.com/icon.png"
   */
  icon_url?: string;
  /**
   * Unique identifier for the action button
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Integration type for integration delivery mechanism
   * @example "slack"
   */
  integration_type?: string;
  /**
   * Whether the action button is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Whether this is the default action button for next steps
   * @example false
   */
  is_default_for_next_step?: boolean;
  /**
   * Name of the action button
   * @example "Send to Slack"
   */
  name?: string;
  /**
   * Redirect URL for redirect delivery mechanism
   * @example "https://partner.example.com/action"
   */
  redirect_url?: string;
  /**
   * Whether the action button requires a connected integration
   * @example false
   */
  requires_connected_integration?: boolean;
  /**
   * Sort order for display
   * @example 1
   */
  sort_order?: number;
  /**
   * When the action button was last updated
   * @example "2024-01-01T00:00:00Z"
   */
  updated_at?: string;
  /**
   * Webhook URL for webhook delivery mechanism
   * @example "https://partner.example.com/webhook"
   */
  webhook_url?: string;
}

export interface ActionButtonCreateActionButtonRequest {
  /**
   * Content format: rich_text, markdown, plain_text, html
   * @example "markdown"
   */
  content_format: "rich_text" | "markdown" | "plain_text" | "html";
  /**
   * Delivery mechanism: webhook, redirect, email, clipboard, file_download, integration, os_email_client
   * @example "webhook"
   */
  delivery_mechanism:
    | "webhook"
    | "redirect"
    | "email"
    | "clipboard"
    | "file_download"
    | "integration"
    | "os_email_client";
  /**
   * File format for file_download delivery mechanism
   * @maxLength 50
   * @example "pdf"
   */
  file_format?: string;
  /**
   * Optional icon URL for the action button
   * @maxLength 2000
   * @example "https://cdn.example.com/icon.png"
   */
  icon_url?: string;
  /**
   * Integration type for integration delivery mechanism
   * @maxLength 100
   * @example "slack"
   */
  integration_type?: string;
  /**
   * Whether this is the default action button for next steps
   * @example false
   */
  is_default_for_next_step?: boolean;
  /**
   * Name of the action button
   * @minLength 1
   * @maxLength 255
   * @example "Send to Slack"
   */
  name: string;
  /**
   * Redirect URL for redirect delivery mechanism
   * @maxLength 2000
   * @example "https://partner.example.com/action"
   */
  redirect_url?: string;
  /**
   * Whether the action button requires a connected integration
   * @example false
   */
  requires_connected_integration?: boolean;
  /**
   * Sort order for display
   * @example 1
   */
  sort_order?: number;
  /**
   * Webhook URL for webhook delivery mechanism
   * @maxLength 2000
   * @example "https://partner.example.com/webhook"
   */
  webhook_url?: string;
}

export interface ActionButtonUpdateActionButtonRequest {
  /**
   * Content format: rich_text, markdown, plain_text, html
   * @example "markdown"
   */
  content_format?: "rich_text" | "markdown" | "plain_text" | "html";
  /**
   * Delivery mechanism: webhook, redirect, email, clipboard, file_download, integration, os_email_client
   * @example "webhook"
   */
  delivery_mechanism?:
    | "webhook"
    | "redirect"
    | "email"
    | "clipboard"
    | "file_download"
    | "integration"
    | "os_email_client";
  /**
   * File format for file_download delivery mechanism
   * @maxLength 50
   * @example "pdf"
   */
  file_format?: string;
  /**
   * Icon URL for the action button
   * @maxLength 2000
   * @example "https://cdn.example.com/icon.png"
   */
  icon_url?: string;
  /**
   * Integration type for integration delivery mechanism
   * @maxLength 100
   * @example "slack"
   */
  integration_type?: string;
  /**
   * Whether the action button is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Whether this is the default action button for next steps
   * @example false
   */
  is_default_for_next_step?: boolean;
  /**
   * Name of the action button
   * @minLength 1
   * @maxLength 255
   * @example "Send to Slack"
   */
  name?: string;
  /**
   * Redirect URL for redirect delivery mechanism
   * @maxLength 2000
   * @example "https://partner.example.com/action"
   */
  redirect_url?: string;
  /**
   * Whether the action button requires a connected integration
   * @example false
   */
  requires_connected_integration?: boolean;
  /**
   * Sort order for display
   * @example 1
   */
  sort_order?: number;
  /**
   * Webhook URL for webhook delivery mechanism
   * @maxLength 2000
   * @example "https://partner.example.com/webhook"
   */
  webhook_url?: string;
}

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

export interface AppManagementSetWebhookFilterRequest {
  /** @minItems 1 */
  events: string[];
  /** @example "include" */
  type: "include" | "exclude";
}

/** Bad request error for updating partner app */
export interface AppManagementUpdateAppError400 {
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

export interface AppManagementUpdateAppRequest {
  /** @example "123e4567-e89b-12d3-a456-426614174001" */
  default_toolkit_id?: string;
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
  /**
   * @maxLength 2000
   * @example "https://api.example.com/webhook"
   */
  webhook_url?: string;
}

/** Bad request error for updating partner app status */
export interface AppManagementUpdateAppStatusError400 {
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

export interface AppManagementUpdateAppStatusRequest {
  /** @example "suspended" */
  status: "active" | "suspended" | "inactive";
}

/** Bad request error for updating partner app webhook filters */
export interface AppManagementUpdateWebhookFilterError400 {
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

export interface AppManagementUpdateWebhookStatusRequest {
  /** @example true */
  enabled: boolean;
  /** @example "abandon" */
  pending_disposition?: "deliver" | "abandon";
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
   * IDs of all linked Contio meetings, sorted by creation date (oldest first)
   * @example ["[\"123e4567-e89b-12d3-a456-426614174000\"]"]
   */
  linked_meetings?: string[];
  /**
   * Location of the event (physical or virtual)
   * @example "Conference Room A"
   */
  location?: string;
  /**
   * Deprecated: Use linked_meetings instead. ID of the first (oldest) linked Contio meeting.
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

export interface ConnectionUserConnectionResponse {
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
  file_status?: string;
  id?: string;
  meeting_id?: string;
  model_id?: string;
  partner_app_id?: string;
  platform_name?: string;
  source_format?: string;
  title?: string;
  updated_at?: string;
  workspace_id?: string;
}

export interface CredentialCredentialRollbackRequest {
  /** @example "Detected issues" */
  reason?: string;
  /** @example "rollback_token_xyz..." */
  rollback_token: string;
}

export interface CredentialCredentialRotationRequest {
  /** @example "confirm-rotation-12345" */
  confirmation_token: string;
  /** @example 48 */
  grace_period_hours?: number;
  /** @example "Scheduled rotation" */
  reason?: string;
}

export interface CredentialCredentialRotationResponse {
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

export interface CredentialCredentialStatusResponse {
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

/** Bad request error for rotating API key */
export interface CredentialRotateAPIKeyError400 {
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
export interface CredentialRotateClientSecretError400 {
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
export interface CredentialRotateWebhookSecretError400 {
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

/** Bad request error for creating IdP configuration */
export interface IdpCreateIdPConfigError400 {
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

export interface IdpCreateIdPConfigRequest {
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

export interface IdpIdPConfigResponse {
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

/** Bad request error for updating IdP configuration */
export interface IdpUpdateIdPConfigError400 {
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

export interface IdpUpdateIdPConfigRequest {
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

export interface MeetingTemplateAppliedItemsCountsResponse {
  /**
   * Number of agenda items applied
   * @example 5
   */
  agenda_items?: number;
  /**
   * Number of documents applied
   * @example 2
   */
  documents?: number;
  /**
   * Number of participants applied
   * @example 3
   */
  participants?: number;
}

export interface MeetingTemplateApplyTemplateRequest {
  /**
   * ID of the meeting to apply the template to
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  meeting_id: string;
}

export interface MeetingTemplateApplyTemplateResponse {
  /**
   * Unique identifier for the application record
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  application_id?: string;
  /** Counts of items applied from the template */
  applied_items?: MeetingTemplateAppliedItemsCountsResponse;
  /**
   * Whether the operation was successful
   * @example true
   */
  success?: boolean;
}

export interface MeetingTemplatePartnerMeetingTemplateDetailResponse {
  /**
   * Number of agenda items in the template
   * @example 5
   */
  agenda_item_count?: number;
  /**
   * Whether the current user can edit this template
   * @example true
   */
  can_edit?: boolean;
  /**
   * Timestamp when the template was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Description of the template
   * @example "Standard agenda for weekly team meetings"
   */
  description?: string;
  /**
   * Number of documents in the template
   * @example 2
   */
  document_count?: number;
  /**
   * Unique identifier for the meeting template
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Whether the template is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Name of the template
   * @example "Weekly Team Sync Template"
   */
  name?: string;
  /**
   * Ownership level of the template (SYSTEM, VERTICAL, WORKSPACE, USER)
   * @example "WORKSPACE"
   */
  ownership_type?: "SYSTEM" | "VERTICAL" | "WORKSPACE" | "USER";
  /**
   * Number of participants in the template
   * @example 3
   */
  participant_count?: number;
  /**
   * Timestamp when the template was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
}

export interface MeetingTemplatePartnerMeetingTemplateResponse {
  /**
   * Timestamp when the template was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Description of the template
   * @example "Standard agenda for weekly team meetings"
   */
  description?: string;
  /**
   * Unique identifier for the meeting template
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Whether the template is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Name of the template
   * @example "Weekly Team Sync Template"
   */
  name?: string;
  /**
   * Ownership level of the template (SYSTEM, VERTICAL, WORKSPACE, USER)
   * @example "WORKSPACE"
   */
  ownership_type?: "SYSTEM" | "VERTICAL" | "WORKSPACE" | "USER";
  /**
   * Timestamp when the template was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
}

export interface MeetingTemplateTemplateNextStepResponse {
  /**
   * Whether autopilot is enabled for this next step on the template
   * @example true
   */
  autopilot?: boolean;
  /**
   * Color of the next step
   * @example "#4F46E5"
   */
  color?: string;
  /**
   * Description of the next step
   * @example "AI-powered summary generation"
   */
  description?: string;
  /**
   * Icon name for the next step
   * @example "document-text"
   */
  icon_name?: string;
  /**
   * Unique identifier for the next step
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Name of the next step
   * @example "Generate Meeting Summary"
   */
  name?: string;
  /**
   * Sort order of the next step
   * @example 1
   */
  sort_order?: number;
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

export interface NextStepActionButtonAddActionButtonToNextStepRequest {
  /**
   * ID of the action button to add
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  action_button_id: string;
  /**
   * Sort order for the action button (optional, defaults to 0)
   * @example 1
   */
  sort_order?: number;
}

export interface NextStepActionButtonNextStepActionButtonResponse {
  /**
   * Delivery mechanism
   * @example "webhook"
   */
  delivery_mechanism?: string;
  /**
   * Icon URL for the action button
   * @example "https://cdn.example.com/icon.png"
   */
  icon_url?: string;
  /**
   * Unique identifier for the action button
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Whether this is the default action button for the next step
   * @example true
   */
  is_default?: boolean;
  /**
   * Name of the action button
   * @example "Send to Slack"
   */
  name?: string;
  /**
   * Sort order within the next step
   * @example 1
   */
  sort_order?: number;
}

export interface NextStepActionButtonSetDefaultActionButtonRequest {
  /**
   * ID of the action button to set as default
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  action_button_id: string;
}

export interface NextStepCreateNextStepRequest {
  /**
   * AI prompt template for AI type next steps
   * @example "Generate an invoice based on the meeting summary and action items"
   */
  ai_prompt?: string;
  /**
   * Optional color for the next step
   * @maxLength 50
   * @example "#FF5733"
   */
  color?: string;
  /**
   * Optional description of the next step
   * @maxLength 1000
   * @example "Generates an invoice from meeting action items"
   */
  description?: string;
  /**
   * Optional icon name for the next step
   * @maxLength 100
   * @example "receipt"
   */
  icon_name?: string;
  /**
   * Name of the next step
   * @minLength 1
   * @maxLength 255
   * @example "Generate Invoice"
   */
  name: string;
  /**
   * Redirect URL for redirect type next steps
   * @maxLength 2000
   * @example "https://partner.example.com/invoice"
   */
  redirect_url?: string;
  /**
   * Type of next step: "ai" or "redirect"
   * @example "ai"
   */
  type: "ai" | "redirect";
}

export interface NextStepNextStepResponse {
  /**
   * AI prompt template
   * @example "Generate an invoice based on the meeting summary"
   */
  ai_prompt?: string;
  /**
   * Color for the next step
   * @example "#FF5733"
   */
  color?: string;
  /**
   * When the next step was created
   * @example "2024-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Description of the next step
   * @example "Generates an invoice from meeting action items"
   */
  description?: string;
  /**
   * Icon name for the next step
   * @example "receipt"
   */
  icon_name?: string;
  /**
   * Unique identifier for the next step
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Whether the next step is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Name of the next step
   * @example "Generate Invoice"
   */
  name?: string;
  /**
   * Redirect URL for redirect type next steps
   * @example "https://partner.example.com/invoice"
   */
  redirect_url?: string;
  /**
   * Display order for sorting
   * @example 1
   */
  sort_order?: number;
  /**
   * Type of next step: "ai" or "redirect"
   * @example "ai"
   */
  type?: string;
  /**
   * When the next step was last updated
   * @example "2024-01-01T00:00:00Z"
   */
  updated_at?: string;
}

export interface NextStepResultNextStepResultResponse {
  /**
   * The format of the generated content
   * @example "markdown"
   */
  content_format?: string;
  /**
   * When the result was created
   * @example "2026-03-25T10:00:00Z"
   */
  created_at?: string;
  /**
   * The execution log ID that produced this result
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  execution_log_id?: string;
  /**
   * When the result expires
   * @example "2026-04-01T10:00:00Z"
   */
  expires_at?: string;
  /**
   * The AI-generated text content
   * @example "# Meeting Summary
   *
   * Key discussion points..."
   */
  generated_text?: string;
  /**
   * Unique identifier for the result
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
}

export interface NextStepUpdateNextStepRequest {
  /**
   * AI prompt template for AI type next steps
   * @example "Generate an invoice based on the meeting summary and action items"
   */
  ai_prompt?: string;
  /**
   * Color for the next step
   * @maxLength 50
   * @example "#FF5733"
   */
  color?: string;
  /**
   * Description of the next step
   * @maxLength 1000
   * @example "Generates an invoice from meeting action items"
   */
  description?: string;
  /**
   * Icon name for the next step
   * @maxLength 100
   * @example "receipt"
   */
  icon_name?: string;
  /**
   * Whether the next step is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Name of the next step
   * @minLength 1
   * @maxLength 255
   * @example "Generate Invoice"
   */
  name?: string;
  /**
   * Redirect URL for redirect type next steps
   * @maxLength 2000
   * @example "https://partner.example.com/invoice"
   */
  redirect_url?: string;
  /**
   * Type of next step: "ai" or "redirect"
   * @example "ai"
   */
  type?: "ai" | "redirect";
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

export type PartnerAdminActionButtonsCreateData =
  ActionButtonActionButtonResponse;

export type PartnerAdminActionButtonsCreateError = ErrorsPartnerErrorResponse;

export type PartnerAdminActionButtonsDeleteData = any;

export type PartnerAdminActionButtonsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminActionButtonsDeleteParams {
  /** Action button ID */
  id: string;
}

export type PartnerAdminActionButtonsDetailData =
  ActionButtonActionButtonResponse;

export type PartnerAdminActionButtonsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminActionButtonsDetailParams {
  /** Action button ID */
  id: string;
}

export type PartnerAdminActionButtonsListData =
  RomeApiControllersExternalPartnerAdminSharedListResponseActionButtonActionButtonResponse;

export type PartnerAdminActionButtonsListError = ErrorsPartnerErrorResponse;

export interface PartnerAdminActionButtonsListParams {
  /**
   * Maximum number of items to return
   * @default 25
   */
  limit?: number;
  /**
   * Number of items to skip
   * @default 0
   */
  offset?: number;
}

export type PartnerAdminActionButtonsUpdateData =
  ActionButtonActionButtonResponse;

export type PartnerAdminActionButtonsUpdateError = ErrorsPartnerErrorResponse;

export interface PartnerAdminActionButtonsUpdateParams {
  /** Action button ID */
  id: string;
}

export type PartnerAdminAppListData = SharedPartnerAppResponse;

export type PartnerAdminAppListError = ErrorsPartnerErrorResponse;

export type PartnerAdminAppStatusUpdateData = SharedPartnerAppResponse;

export type PartnerAdminAppStatusUpdateError =
  | AppManagementUpdateAppStatusError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminAppUpdateData = SharedPartnerAppResponse;

export type PartnerAdminAppUpdateError =
  | AppManagementUpdateAppError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminConnectionsDeleteData = any;

export type PartnerAdminConnectionsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminConnectionsDeleteParams {
  /** Connection ID */
  connectionId: string;
}

export type PartnerAdminConnectionsDetailData =
  ConnectionUserConnectionResponse;

export type PartnerAdminConnectionsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminConnectionsDetailParams {
  /** Connection ID */
  connectionId: string;
}

export type PartnerAdminConnectionsListData =
  RomeApiControllersExternalPartnerAdminSharedListResponseConnectionUserConnectionResponse;

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

export type PartnerAdminCredentialsApiKeyRollbackCreateData = any;

export type PartnerAdminCredentialsApiKeyRollbackCreateError =
  ErrorsPartnerErrorResponse;

export type PartnerAdminCredentialsApiKeyRotateCreateData =
  CredentialCredentialRotationResponse;

export type PartnerAdminCredentialsApiKeyRotateCreateError =
  | CredentialRotateAPIKeyError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminCredentialsClientSecretRollbackCreateData = any;

export type PartnerAdminCredentialsClientSecretRollbackCreateError =
  ErrorsPartnerErrorResponse;

export type PartnerAdminCredentialsClientSecretRotateCreateData =
  CredentialCredentialRotationResponse;

export type PartnerAdminCredentialsClientSecretRotateCreateError =
  | CredentialRotateClientSecretError400
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
  CredentialCredentialStatusResponse
>;

export type PartnerAdminCredentialsListError = ErrorsPartnerErrorResponse;

export type PartnerAdminCredentialsWebhookSecretRotateCreateData =
  CredentialCredentialRotationResponse;

export type PartnerAdminCredentialsWebhookSecretRotateCreateError =
  | CredentialRotateWebhookSecretError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminIdpCreateData = IdpIdPConfigResponse;

export type PartnerAdminIdpCreateError =
  | IdpCreateIdPConfigError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminIdpDeleteData = any;

export type PartnerAdminIdpDeleteError = ErrorsPartnerErrorResponse;

export type PartnerAdminIdpListData = IdpIdPConfigResponse;

export type PartnerAdminIdpListError = ErrorsPartnerErrorResponse;

export type PartnerAdminIdpUpdateData = IdpIdPConfigResponse;

export type PartnerAdminIdpUpdateError =
  | IdpUpdateIdPConfigError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminNextStepsActionButtonsCreateData = any;

export type PartnerAdminNextStepsActionButtonsCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsActionButtonsCreateParams {
  /** Next step ID */
  nextStepId: string;
}

export type PartnerAdminNextStepsActionButtonsDeleteData = any;

export type PartnerAdminNextStepsActionButtonsDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsActionButtonsDeleteParams {
  /** Action button ID (UUID format) */
  actionButtonId: string;
  /** Next step ID (UUID format) */
  nextStepId: string;
}

export type PartnerAdminNextStepsActionButtonsListData =
  RomeApiControllersExternalPartnerAdminSharedListResponseNextStepActionButtonNextStepActionButtonResponse;

export type PartnerAdminNextStepsActionButtonsListError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsActionButtonsListParams {
  /** Next step ID */
  nextStepId: string;
}

export type PartnerAdminNextStepsCreateData = NextStepNextStepResponse;

export type PartnerAdminNextStepsCreateError = ErrorsPartnerErrorResponse;

export type PartnerAdminNextStepsDefaultActionButtonUpdateData = any;

export type PartnerAdminNextStepsDefaultActionButtonUpdateError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsDefaultActionButtonUpdateParams {
  /** Next step ID (UUID format) */
  nextStepId: string;
}

export type PartnerAdminNextStepsDeleteData = any;

export type PartnerAdminNextStepsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsDeleteParams {
  /**
   * Next Step ID
   * @format uuid
   */
  nextStepId: string;
}

export type PartnerAdminNextStepsDetailData = NextStepNextStepResponse;

export type PartnerAdminNextStepsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsDetailParams {
  /**
   * Next Step ID
   * @format uuid
   */
  nextStepId: string;
}

export type PartnerAdminNextStepsListData =
  RomeApiControllersExternalPartnerAdminSharedListResponseNextStepNextStepResponse;

export type PartnerAdminNextStepsListError = ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsListParams {
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

export type PartnerAdminNextStepsUpdateData = NextStepNextStepResponse;

export type PartnerAdminNextStepsUpdateError = ErrorsPartnerErrorResponse;

export interface PartnerAdminNextStepsUpdateParams {
  /**
   * Next Step ID
   * @format uuid
   */
  nextStepId: string;
}

export type PartnerAdminTemplatesCreateData = TemplateTemplateResponse;

export type PartnerAdminTemplatesCreateError = ErrorsPartnerErrorResponse;

export type PartnerAdminTemplatesDeleteData = any;

export type PartnerAdminTemplatesDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesDeleteParams {
  /** Template ID */
  templateId: string;
}

export type PartnerAdminTemplatesDetailData = TemplateTemplateResponse;

export type PartnerAdminTemplatesDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesDetailParams {
  /** Template ID */
  templateId: string;
}

export type PartnerAdminTemplatesListData =
  RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateResponse;

export type PartnerAdminTemplatesListError = ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesListParams {
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

export type PartnerAdminTemplatesNextStepsCreateData = any;

export type PartnerAdminTemplatesNextStepsCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesNextStepsCreateParams {
  /** Template ID */
  templateId: string;
}

export type PartnerAdminTemplatesNextStepsDeleteData = any;

export type PartnerAdminTemplatesNextStepsDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesNextStepsDeleteParams {
  /** Next Step ID */
  nextStepId: string;
  /** Template ID */
  templateId: string;
}

export type PartnerAdminTemplatesNextStepsListData =
  RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateNextStepResponse;

export type PartnerAdminTemplatesNextStepsListError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesNextStepsListParams {
  /** Template ID */
  templateId: string;
}

export type PartnerAdminTemplatesNextStepsUpdateData = any;

export type PartnerAdminTemplatesNextStepsUpdateError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesNextStepsUpdateParams {
  /** Next Step ID */
  nextStepId: string;
  /** Template ID */
  templateId: string;
}

export type PartnerAdminTemplatesUpdateData = TemplateTemplateResponse;

export type PartnerAdminTemplatesUpdateError = ErrorsPartnerErrorResponse;

export interface PartnerAdminTemplatesUpdateParams {
  /** Template ID */
  templateId: string;
}

export type PartnerAdminToolkitsCreateData =
  RomeApiControllersExternalPartnerAdminToolkitToolkitResponse;

export type PartnerAdminToolkitsCreateError = ErrorsPartnerErrorResponse;

export type PartnerAdminToolkitsDeleteData = any;

export type PartnerAdminToolkitsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminToolkitsDeleteParams {
  /** Toolkit ID */
  toolkitId: string;
}

export type PartnerAdminToolkitsDetailData =
  RomeApiControllersExternalPartnerAdminToolkitToolkitResponse;

export type PartnerAdminToolkitsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminToolkitsDetailParams {
  /** Toolkit ID */
  toolkitId: string;
}

export type PartnerAdminToolkitsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerAdminToolkitToolkitResponse;

export type PartnerAdminToolkitsListError = ErrorsPartnerErrorResponse;

export interface PartnerAdminToolkitsListParams {
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

export type PartnerAdminToolkitsUpdateData =
  RomeApiControllersExternalPartnerAdminToolkitToolkitResponse;

export type PartnerAdminToolkitsUpdateError = ErrorsPartnerErrorResponse;

export interface PartnerAdminToolkitsUpdateParams {
  /** Toolkit ID */
  toolkitId: string;
}

export type PartnerAdminWebhookDeliveriesDetailData =
  WebhookWebhookDeliveryResponse;

export type PartnerAdminWebhookDeliveriesDetailError =
  ErrorsPartnerErrorResponse;

export interface PartnerAdminWebhookDeliveriesDetailParams {
  /** Webhook Delivery ID */
  deliveryId: string;
}

export type PartnerAdminWebhookDeliveriesListData =
  WebhookWebhookDeliveriesResponse;

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

export type PartnerAdminWebhookFilterDeleteData = SharedPartnerAppResponse;

export type PartnerAdminWebhookFilterDeleteError = ErrorsPartnerErrorResponse;

export type PartnerAdminWebhookFilterUpdateData = SharedPartnerAppResponse;

export type PartnerAdminWebhookFilterUpdateError =
  | AppManagementUpdateWebhookFilterError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminWebhookStatusUpdateData = SharedPartnerAppResponse;

export type PartnerAdminWebhookStatusUpdateError = ErrorsPartnerErrorResponse;

export type PartnerAdminWorkflowsCreateData = WorkflowWorkflowResponse;

export type PartnerAdminWorkflowsCreateError =
  | WorkflowCreateWorkflowError400
  | ErrorsPartnerErrorResponse;

export type PartnerAdminWorkflowsDeleteData = any;

export type PartnerAdminWorkflowsDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerAdminWorkflowsDeleteParams {
  /** Workflow ID */
  workflowId: string;
}

export type PartnerAdminWorkflowsDetailData = WorkflowWorkflowResponse;

export type PartnerAdminWorkflowsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerAdminWorkflowsDetailParams {
  /** Workflow ID */
  workflowId: string;
}

export type PartnerAdminWorkflowsListData =
  RomeApiControllersExternalPartnerAdminSharedListResponseWorkflowWorkflowResponse;

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

export type PartnerAdminWorkflowsUpdateData = WorkflowWorkflowResponse;

export type PartnerAdminWorkflowsUpdateError =
  | WorkflowUpdateWorkflowError400
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
  RomeApiControllersExternalPartnerUserSharedListResponseActionItemPartnerActionItemResponse;

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
  RomeApiControllersExternalPartnerUserSharedListResponseCalendarPartnerCalendarEventResponse;

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

export type PartnerUserMeetingTemplatesApplyCreateData =
  MeetingTemplateApplyTemplateResponse;

export type PartnerUserMeetingTemplatesApplyCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingTemplatesApplyCreateParams {
  /**
   * Template ID to apply
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingTemplatesDetailData =
  MeetingTemplatePartnerMeetingTemplateDetailResponse;

export type PartnerUserMeetingTemplatesDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingTemplatesDetailParams {
  /**
   * Meeting template ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingTemplatesListData =
  RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplatePartnerMeetingTemplateResponse;

export type PartnerUserMeetingTemplatesListError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingTemplatesListParams {
  /**
   * Maximum number of items per page
   * @min 1
   * @max 100
   * @default 25
   */
  limit?: number;
  /**
   * Number of items to skip
   * @min 0
   * @default 0
   */
  offset?: number;
}

export type PartnerUserMeetingTemplatesNextStepsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplateTemplateNextStepResponse;

export type PartnerUserMeetingTemplatesNextStepsListError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingTemplatesNextStepsListParams {
  /**
   * Meeting template ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsActionButtonsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseSharedActionButtonResponse;

export type PartnerUserMeetingsActionButtonsListError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsActionButtonsListParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsActionButtonsTriggerCreateData =
  SharedTriggerActionButtonResponse;

export type PartnerUserMeetingsActionButtonsTriggerCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsActionButtonsTriggerCreateParams {
  /** Action Button ID */
  buttonId: string;
  /** Meeting ID */
  id: string;
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
  id: string;
}

export type PartnerUserMeetingsAgendaItemsDeleteData = any;

export type PartnerUserMeetingsAgendaItemsDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsAgendaItemsDeleteParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
  /**
   * Agenda Item ID
   * @format uuid
   */
  itemId: string;
}

export type PartnerUserMeetingsAgendaItemsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerAgendaItemResponse;

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
   * Meeting ID
   * @format uuid
   */
  id: string;
  /**
   * Agenda Item ID
   * @format uuid
   */
  itemId: string;
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
   * Context ID
   * @format uuid
   */
  contextId: string;
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
  /** Context file */
  file: File;
  /** Source format (json,csv,tsv,xml,html,yaml,md,txt) */
  source_format: string;
  /** Context title */
  title?: string;
}

export type PartnerUserMeetingsContextDeleteData = any;

export type PartnerUserMeetingsContextDeleteError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsContextDeleteParams {
  /**
   * Context ID
   * @format uuid
   */
  contextId: string;
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
   * Context ID
   * @format uuid
   */
  contextId: string;
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
  RomeApiControllersExternalPartnerUserSharedListResponseSharedPartnerMeetingResponse;

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

export type PartnerUserMeetingsNextStepsExecuteCreateData =
  SharedExecuteNextStepResponse;

export type PartnerUserMeetingsNextStepsExecuteCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsNextStepsExecuteCreateParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
  /**
   * Next Step ID
   * @format uuid
   */
  nextStepId: string;
}

export type PartnerUserMeetingsNextStepsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseSharedNextStepResponse;

export type PartnerUserMeetingsNextStepsListError = ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsNextStepsListParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
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
  RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerMeetingParticipantResponse;

export type PartnerUserMeetingsParticipantsListError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsParticipantsListParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserNextStepResultsDetailData =
  NextStepResultNextStepResultResponse;

export type PartnerUserNextStepResultsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserNextStepResultsDetailParams {
  /**
   * Result ID
   * @format uuid
   */
  resultId: string;
}

export type PartnerUserProfileListData = ProfileUserProfileResponse;

export type PartnerUserProfileListError = ErrorsPartnerErrorResponse;

export type PartnerUserSessionsCreateData = SessionCreateSessionResponse;

export type PartnerUserSessionsCreateError = ErrorsPartnerErrorResponse;

export type PartnerUserSessionsDetailData = SessionGetSessionResponse;

export type PartnerUserSessionsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserSessionsDetailParams {
  /**
   * Session ID
   * @format uuid
   * @example "f7e6d5c4-b3a2-1098-7654-321fedcba098"
   */
  id: string;
  /**
   * Maximum turns to return (1-200, default: 50)
   * @min 1
   * @max 200
   */
  turn_limit?: number;
  /**
   * Pagination offset for turns
   * @min 0
   */
  turn_offset?: number;
}

export type PartnerUserSessionsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseSessionPartnerChatSessionResponse;

export type PartnerUserSessionsListError = ErrorsPartnerErrorResponse;

export interface PartnerUserSessionsListParams {
  /**
   * Maximum sessions to return (1-100, default: 25)
   * @min 1
   * @max 100
   */
  limit?: number;
  /**
   * Filter by meeting ID
   * @format uuid
   */
  meeting_id?: string;
  /**
   * Number of sessions to skip (0-based, default: 0)
   * @min 0
   */
  offset?: number;
}

export type PartnerUserSessionsTurnsDetailData = SessionGetTurnResponse;

export type PartnerUserSessionsTurnsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserSessionsTurnsDetailParams {
  /**
   * Session ID
   * @format uuid
   * @example "f7e6d5c4-b3a2-1098-7654-321fedcba098"
   */
  id: string;
  /**
   * Turn ID
   * @format uuid
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  turnId: string;
}

export type PartnerUserSessionsUpdateData = SessionSendMessageResponse;

export type PartnerUserSessionsUpdateError = ErrorsPartnerErrorResponse;

export interface PartnerUserSessionsUpdateParams {
  /** Session ID */
  id: string;
}

export type PartnerUserToolkitsInstallCreateData = ToolkitInstallationResponse;

export type PartnerUserToolkitsInstallCreateError = ErrorsPartnerErrorResponse;

export interface PartnerUserToolkitsInstallCreateParams {
  /**
   * Toolkit ID
   * @format uuid
   */
  toolkitId: string;
}

export type PartnerUserToolkitsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerUserToolkitToolkitResponse;

export type PartnerUserToolkitsListError = ErrorsPartnerErrorResponse;

export interface PartnerUserToolkitsListParams {
  /**
   * Maximum number of items per page
   * @min 1
   * @max 100
   * @default 25
   */
  limit?: number;
  /**
   * Number of items to skip
   * @min 0
   * @default 0
   */
  offset?: number;
}

export type PartnerUserWorkspacesToolkitsDeleteData = any;

export type PartnerUserWorkspacesToolkitsDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserWorkspacesToolkitsDeleteParams {
  /**
   * Toolkit ID
   * @format uuid
   */
  toolkitId: string;
  /**
   * Workspace ID
   * @format uuid
   */
  workspaceId: string;
}

export type PartnerUserWorkspacesToolkitsListData =
  RomeApiControllersExternalPartnerUserSharedListResponseToolkitToolkitWithInstallationResponse;

export type PartnerUserWorkspacesToolkitsListError = ErrorsPartnerErrorResponse;

export interface PartnerUserWorkspacesToolkitsListParams {
  /**
   * Workspace ID
   * @format uuid
   */
  workspaceId: string;
}

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

export interface RomeApiControllersExternalPartnerAdminSharedListResponseActionButtonActionButtonResponse {
  /** Array of items for the current page */
  items?: ActionButtonActionButtonResponse[];
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

export interface RomeApiControllersExternalPartnerAdminSharedListResponseConnectionUserConnectionResponse {
  /** Array of items for the current page */
  items?: ConnectionUserConnectionResponse[];
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

export interface RomeApiControllersExternalPartnerAdminSharedListResponseNextStepActionButtonNextStepActionButtonResponse {
  /** Array of items for the current page */
  items?: NextStepActionButtonNextStepActionButtonResponse[];
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

export interface RomeApiControllersExternalPartnerAdminSharedListResponseNextStepNextStepResponse {
  /** Array of items for the current page */
  items?: NextStepNextStepResponse[];
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

export interface RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateNextStepResponse {
  /** Array of items for the current page */
  items?: TemplateTemplateNextStepResponse[];
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

export interface RomeApiControllersExternalPartnerAdminSharedListResponseTemplateTemplateResponse {
  /** Array of items for the current page */
  items?: TemplateTemplateResponse[];
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

export interface RomeApiControllersExternalPartnerAdminSharedListResponseWorkflowWorkflowResponse {
  /** Array of items for the current page */
  items?: WorkflowWorkflowResponse[];
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

export interface RomeApiControllersExternalPartnerAdminToolkitToolkitResponse {
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "Complete sales workflow toolkit" */
  description?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  id?: string;
  /** @example true */
  is_active?: boolean;
  manifest?: ToolkitToolkitManifestRequest;
  /** @example "Sales Pipeline Toolkit" */
  name?: string;
  /** @example "PARTNER" */
  ownership_type?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174001" */
  partner_app_id?: string;
  /** @example "sales-pipeline" */
  slug?: string;
  /** @example "2023-01-01T00:00:00Z" */
  updated_at?: string;
  /** @example "1.0.0" */
  version?: string;
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseActionItemPartnerActionItemResponse {
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseCalendarPartnerCalendarEventResponse {
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerAgendaItemResponse {
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseMeetingPartnerMeetingParticipantResponse {
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplatePartnerMeetingTemplateResponse {
  /** Array of items for the current page */
  items?: MeetingTemplatePartnerMeetingTemplateResponse[];
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseMeetingTemplateTemplateNextStepResponse {
  /** Array of items for the current page */
  items?: MeetingTemplateTemplateNextStepResponse[];
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerAdminToolkitToolkitResponse {
  /** Array of items for the current page */
  items?: RomeApiControllersExternalPartnerAdminToolkitToolkitResponse[];
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseRomeApiControllersExternalPartnerUserToolkitToolkitResponse {
  /** Array of items for the current page */
  items?: RomeApiControllersExternalPartnerUserToolkitToolkitResponse[];
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseSessionPartnerChatSessionResponse {
  /** Array of items for the current page */
  items?: SessionPartnerChatSessionResponse[];
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseSharedActionButtonResponse {
  /** Array of items for the current page */
  items?: SharedActionButtonResponse[];
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseSharedNextStepResponse {
  /** Array of items for the current page */
  items?: SharedNextStepResponse[];
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseSharedPartnerMeetingResponse {
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

export interface RomeApiControllersExternalPartnerUserSharedListResponseToolkitToolkitWithInstallationResponse {
  /** Array of items for the current page */
  items?: ToolkitToolkitWithInstallationResponse[];
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

export interface RomeApiControllersExternalPartnerUserToolkitToolkitResponse {
  /**
   * Number of action buttons in the toolkit
   * @example 2
   */
  action_buttons_count?: number;
  /**
   * Timestamp when the toolkit was created
   * @example "2023-01-01T00:00:00Z"
   */
  created_at?: string;
  /**
   * Description of the toolkit
   * @example "A comprehensive toolkit for sales meetings"
   */
  description?: string;
  /**
   * Unique identifier for the toolkit
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Whether the toolkit is active
   * @example true
   */
  is_active?: boolean;
  /**
   * Name of the toolkit
   * @example "Sales Meeting Toolkit"
   */
  name?: string;
  /**
   * Number of next steps in the toolkit
   * @example 5
   */
  next_steps_count?: number;
  /**
   * Ownership type of the toolkit
   * @example "PARTNER"
   */
  ownership_type?: "SYSTEM" | "PARTNER";
  /**
   * URL-friendly slug for the toolkit
   * @example "sales-meeting-toolkit"
   */
  slug?: string;
  /**
   * Number of templates in the toolkit
   * @example 3
   */
  templates_count?: number;
  /**
   * Timestamp when the toolkit was last updated
   * @example "2023-01-01T00:00:00Z"
   */
  updated_at?: string;
  /**
   * Version of the toolkit
   * @example "1.0.0"
   */
  version?: string;
}

export type ScopesListData = OauthScopesResponse;

export type ScopesListError = ErrorsErrorResponse;

export interface SessionCreateSessionRequest {
  /**
   * Optional context document IDs to prime the agent with specific documents
   * @example ["d4e5f6a7-b8c9-0123-4567-890abcdef012"]
   */
  context_document_ids?: string[];
  /**
   * Optional ID of the meeting to associate this session with (user must be a participant)
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  meeting_id?: string;
  /**
   * First user message to start the conversation (1-10,000 characters)
   * @minLength 1
   * @maxLength 10000
   * @example "Summarize the key decisions from this meeting"
   */
  message: string;
  /** Partner-supplied metadata for tracking (max 10 keys, 256 char keys, 1024 char values) */
  metadata?: Record<string, string>;
}

export interface SessionCreateSessionResponse {
  /**
   * Timestamp when the session was created
   * @example "2026-03-16T14:30:00Z"
   */
  created_at?: string;
  /**
   * Unique identifier for the session
   * @example "f7e6d5c4-b3a2-1098-7654-321fedcba098"
   */
  id?: string;
  /** Initial turn if message was provided */
  initial_turn?: SessionPartnerTurnResponse;
  /**
   * ID of the associated meeting
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  meeting_id?: string;
  /** Partner-supplied metadata */
  metadata?: Record<string, string>;
  /**
   * Current session status: active, closed, or expired
   * @example "active"
   */
  status?: "active" | "closed" | "expired";
}

export interface SessionGetSessionResponse {
  /** Session details */
  session?: SessionPartnerChatSessionResponse;
  /** Pagination info for turns */
  turn_pagination?: SessionTurnPaginationResponse;
  /** Turns in this session (based on turn_limit parameter) */
  turns?: SessionPartnerTurnResponse[];
}

export interface SessionGetTurnResponse {
  /** The requested turn details */
  turn?: SessionPartnerTurnResponse;
}

export interface SessionPartnerAgentMetadataResponse {
  /** Context document IDs the agent referenced */
  referenced_documents?: string[];
  /** Token usage statistics */
  token_usage?: SessionPartnerTokenUsageResponse;
  /** Tools the agent invoked during this turn */
  tool_calls?: SessionPartnerToolCallResponse[];
}

export interface SessionPartnerChatSessionResponse {
  /**
   * Timestamp when the session was created
   * @example "2026-03-16T14:30:00Z"
   */
  created_at?: string;
  /**
   * Unique identifier for the session
   * @example "f7e6d5c4-b3a2-1098-7654-321fedcba098"
   */
  id?: string;
  /**
   * ID of the associated meeting (if any)
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  meeting_id?: string;
  /** Partner-supplied metadata */
  metadata?: Record<string, string>;
  /**
   * Current session status: active, closed, or expired
   * @example "active"
   */
  status?: "active" | "closed" | "expired";
  /**
   * Session title (if any)
   * @example "Quarterly Product Review Planning"
   */
  title?: string;
  /**
   * Total number of turns in this session (user + agent messages)
   * @example 4
   */
  turn_count?: number;
  /**
   * Timestamp when the session was last updated
   * @example "2026-03-16T14:35:12Z"
   */
  updated_at?: string;
}

export interface SessionPartnerTokenUsageResponse {
  /**
   * Number of output tokens
   * @example 200
   */
  completion_tokens?: number;
  /**
   * Number of input tokens
   * @example 150
   */
  prompt_tokens?: number;
  /**
   * Total tokens used
   * @example 350
   */
  total_tokens?: number;
}

export interface SessionPartnerToolCallResponse {
  /**
   * Name of the tool
   * @example "search_meeting_notes"
   */
  name?: string;
  /**
   * Execution status
   * @example "success"
   */
  status?: "success" | "failure";
}

export interface SessionPartnerTurnErrorResponse {
  /**
   * Error code
   * @example "agent_error"
   */
  code?: string;
  /**
   * Human-readable error message
   * @example "Agent processing failed"
   */
  message?: string;
}

export interface SessionPartnerTurnResponse {
  /** Agent execution metadata (present only for role=agent turns) */
  agent_metadata?: SessionPartnerAgentMetadataResponse;
  /**
   * Timestamp when the turn finished processing (null if not completed)
   * @example "2026-03-16T14:30:15Z"
   */
  completed_at?: string;
  /**
   * Message text content
   * @example "Summarize the key decisions from this meeting"
   */
  content?: string;
  /**
   * Timestamp when the turn was created/enqueued
   * @example "2026-03-16T14:30:00Z"
   */
  created_at?: string;
  /** Error details when status=failed */
  error?: SessionPartnerTurnErrorResponse;
  /**
   * Unique identifier for the turn (message ID)
   * @example "turn-uuid-1234"
   */
  id?: string;
  /**
   * Role of the message author: user or agent
   * @example "user"
   */
  role?: "user" | "agent";
  /**
   * Sequence number in the conversation
   * @example 1
   */
  sequence_number?: number;
  /**
   * ID of the session this turn belongs to
   * @example "f7e6d5c4-b3a2-1098-7654-321fedcba098"
   */
  session_id?: string;
  /**
   * Turn processing status: queued, processing, completed, or failed
   * @example "completed"
   */
  status?: "queued" | "processing" | "completed" | "failed";
}

export interface SessionSendMessageRequest {
  /**
   * Optional ID of the meeting to associate this session with (user must be a participant)
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  meeting_id?: string;
  /**
   * User message to add to the conversation (1-10,000 characters)
   * @minLength 1
   * @maxLength 10000
   * @example "Can you create action items from those decisions?"
   */
  message: string;
}

export interface SessionSendMessageResponse {
  /** The created user turn */
  turn?: SessionPartnerTurnResponse;
}

export interface SessionTurnPaginationResponse {
  /**
   * Whether there are more turns
   * @example false
   */
  has_more?: boolean;
  /**
   * Limit used
   * @example 50
   */
  limit?: number;
  /**
   * Current offset
   * @example 0
   */
  offset?: number;
  /**
   * Total turns in the session
   * @example 12
   */
  total?: number;
}

export interface SharedActionButtonResponse {
  /**
   * Icon URL for the action button
   * @example "https://example.com/icon.png"
   */
  icon_url?: string;
  /**
   * Unique identifier for the action button
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Whether this is the default action button
   * @example false
   */
  is_default?: boolean;
  /**
   * Name of the action button
   * @example "Send Email"
   */
  name?: string;
}

export interface SharedExecuteNextStepRequest {
  /**
   * Action button ID if triggered via a specific action button
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  action_button_id?: string;
}

export interface SharedExecuteNextStepResponse {
  /**
   * Content format of the generated text
   * @example "markdown"
   */
  content_format?: string;
  /**
   * Unique identifier for the execution log entry
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  execution_log_id?: string;
  /**
   * Generated text content (only included for sync execution of AI-type)
   * @example "# Meeting Summary
   *
   * Key points discussed..."
   */
  generated_text?: string;
  /**
   * Redirect URL for redirect-type next steps
   * @example "https://partner.example.com/invoice?meeting_id=abc"
   */
  redirect_url?: string;
  /**
   * Result ID for AI-type next steps (use to retrieve generated content)
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  result_id?: string;
  /**
   * Execution status
   * @example "completed"
   */
  status?: string;
}

export interface SharedNextStepResponse {
  /** Action buttons associated with this next step */
  action_buttons?: SharedActionButtonResponse[];
  /**
   * Color for the next step
   * @example "#FF5733"
   */
  color?: string;
  /**
   * Description of the next step
   * @example "Generates an invoice from meeting action items"
   */
  description?: string;
  /**
   * Icon name for the next step
   * @example "receipt"
   */
  icon_name?: string;
  /**
   * Unique identifier for the next step
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Name of the next step
   * @example "Generate Invoice"
   */
  name?: string;
  /**
   * Redirect URL for redirect type next steps
   * @example "https://partner.example.com/invoice"
   */
  redirect_url?: string;
  /**
   * Display order for sorting
   * @example 1
   */
  sort_order?: number;
  /**
   * Type of next step: "ai" or "redirect"
   * @example "ai"
   */
  type?: string;
}

export interface SharedPartnerAppResponse {
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
   * Default toolkit ID to auto-install when a workspace is provisioned via this partner app
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  default_toolkit_id?: string;
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
  webhook_filter?: SharedWebhookFilterResponse;
  /**
   * Webhook URL for receiving event notifications
   * @example "https://api.example.com/webhook"
   */
  webhook_url?: string;
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

export interface SharedTriggerActionButtonRequest {
  /**
   * Next step ID if triggered in the context of a next step
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  next_step_id?: string;
  /**
   * Result ID if triggered in the context of a next step result
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  result_id?: string;
}

export interface SharedTriggerActionButtonResponse {
  /**
   * Success message
   * @example "Action button triggered successfully"
   */
  message?: string;
}

export interface SharedWebhookFilterResponse {
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

export interface TemplateAddToTemplateRequest {
  /** @example false */
  autopilot?: boolean;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  next_step_id: string;
  /** @example 1 */
  sort_order?: number;
}

export interface TemplateCreateTemplateRequest {
  /**
   * Optional ID of an existing meeting to use as the source for the template's content.
   * The meeting's agenda items, participants, and talking points will be copied to the new template.
   * The partner must have access to the workspace containing the meeting.
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  backing_meeting_id?: string;
  /**
   * Optional description of the template
   * @maxLength 1000
   * @example "Invoice template for new clients"
   */
  description?: string;
  /**
   * Name of the template
   * @minLength 1
   * @maxLength 255
   * @example "Invoice Template"
   */
  name: string;
}

export interface TemplateTemplateNextStepResponse {
  /**
   * Whether autopilot is enabled for this next step on the template
   * @example true
   */
  autopilot?: boolean;
  /**
   * Unique identifier for the next step
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Name of the next step
   * @example "Generate Invoice"
   */
  name?: string;
  /**
   * Sort order of the next step
   * @example 1
   */
  sort_order?: number;
}

export interface TemplateTemplateResponse {
  /**
   * BackingMeetingID is the ID of the meeting this template was created from, if any
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  backing_meeting_id?: string;
  /**
   * Timestamp when the template was created
   * @example "2024-01-01T00:00:00Z"
   */
  created_at?: string;
  /** @example "Invoice template for new clients" */
  description?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174001" */
  id?: string;
  /** @example "Invoice Template" */
  name?: string;
  /**
   * Timestamp when the template was last updated
   * @example "2024-01-01T00:00:00Z"
   */
  updated_at?: string;
}

export interface TemplateUpdateTemplateNextStepRequest {
  /** @example true */
  autopilot?: boolean;
}

export interface TemplateUpdateTemplateRequest {
  /**
   * Optional description of the template
   * @maxLength 1000
   * @example "Updated invoice template for new clients"
   */
  description?: string;
  /**
   * Name of the template
   * @minLength 1
   * @maxLength 255
   * @example "Updated Invoice Template"
   */
  name?: string;
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

export interface ToolkitCreateToolkitRequest {
  /**
   * @maxLength 1000
   * @example "Complete sales workflow toolkit"
   */
  description?: string;
  manifest: ToolkitToolkitManifestRequest;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Sales Pipeline Toolkit"
   */
  name: string;
  /**
   * @minLength 1
   * @maxLength 100
   * @example "sales-pipeline"
   */
  slug: string;
  /** @example "1.0.0" */
  version: string;
}

export interface ToolkitInstallationResponse {
  /**
   * Unique identifier for the installation
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /**
   * Timestamp when the toolkit was installed
   * @example "2023-01-01T00:00:00Z"
   */
  installed_at?: string;
  /**
   * ID of the user who installed the toolkit
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  installed_by?: string;
  /**
   * ID of the installed toolkit
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  toolkit_id?: string;
  /**
   * ID of the workspace where the toolkit is installed
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  workspace_id?: string;
}

export interface ToolkitManifestActionButton {
  /**
   * ID references an existing action button (mutually exclusive with Spec)
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /** Spec defines a new action button to create on installation (mutually exclusive with ID) */
  spec?: ToolkitManifestActionButtonSpec;
}

export interface ToolkitManifestActionButtonSpec {
  /**
   * RefID is the manifest-internal identifier for this entity (used by $ref in other entries)
   * @maxLength 100
   * @example "my-action-button"
   */
  $id?: string;
  /**
   * Content format: rich_text, markdown, plain_text, html
   * @example "plain_text"
   */
  content_format: "rich_text" | "markdown" | "plain_text" | "html";
  /**
   * Delivery mechanism: clipboard, email, os_email_client, file_download, integration, webhook, redirect
   * @example "webhook"
   */
  delivery_mechanism:
    | "clipboard"
    | "email"
    | "os_email_client"
    | "file_download"
    | "integration"
    | "webhook"
    | "redirect";
  /**
   * File format for file delivery
   * @maxLength 50
   * @example "pdf"
   */
  file_format?: string;
  /**
   * Icon URL for display
   * @maxLength 2000
   * @example "https://cdn.example.com/icon.png"
   */
  icon_url?: string;
  /**
   * Integration type
   * @maxLength 100
   * @example "salesforce"
   */
  integration_type?: string;
  /**
   * Whether this is the default action for a next step
   * @example false
   */
  is_default_for_next_step?: boolean;
  /**
   * Name of the action button
   * @minLength 1
   * @maxLength 255
   * @example "Send to CRM"
   */
  name: string;
  /**
   * Redirect URL for redirect delivery
   * @maxLength 2000
   * @example "https://app.example.com/action"
   */
  redirect_url?: string;
  /**
   * Whether this action requires a connected integration
   * @example false
   */
  requires_connected_integration?: boolean;
  /**
   * Sort order for display
   * @example 1
   */
  sort_order?: number;
  /**
   * Webhook URL for webhook delivery
   * @maxLength 2000
   * @example "https://api.example.com/webhook"
   */
  webhook_url?: string;
}

export interface ToolkitManifestNextStep {
  /** ActionButtons defines the action buttons to attach to this next step with junction fields */
  action_buttons?: ToolkitNextStepActionButtonRelation[];
  /** DefaultActionButton specifies the default action button for this next step (by $ref or $id) */
  default_action_button?: ToolkitManifestRef;
  /**
   * ID references an existing next step (mutually exclusive with Spec)
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /** Spec defines a new next step to create on installation (mutually exclusive with ID) */
  spec?: ToolkitManifestNextStepSpec;
}

export interface ToolkitManifestNextStepSpec {
  /**
   * RefID is the manifest-internal identifier for this entity (used by $ref in other entries)
   * @maxLength 100
   * @example "my-next-step"
   */
  $id?: string;
  /**
   * AI prompt for AI-type next steps
   * @example "Generate an invoice..."
   */
  ai_prompt?: string;
  /**
   * Color for display
   * @maxLength 50
   * @example "#FF5733"
   */
  color?: string;
  /**
   * Description of the next step
   * @maxLength 1000
   * @example "Generates an invoice from meeting notes"
   */
  description?: string;
  /**
   * Icon name for display
   * @maxLength 100
   * @example "receipt"
   */
  icon_name?: string;
  /**
   * Name of the next step
   * @minLength 1
   * @maxLength 255
   * @example "Generate Invoice"
   */
  name: string;
  /**
   * Redirect URL for redirect-type next steps
   * @maxLength 2000
   * @example "https://partner.example.com/invoice"
   */
  redirect_url?: string;
  /**
   * Sort order for display
   * @example 1
   */
  sort_order?: number;
  /**
   * Type of next step: "ai" or "redirect"
   * @example "ai"
   */
  type: "ai" | "redirect";
}

export interface ToolkitManifestRef {
  /**
   * ID references an existing entity by its database ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  $id?: string;
  /**
   * Ref references an entity defined in the same manifest via its $id value
   * @example "my-next-step"
   */
  $ref?: string;
}

export interface ToolkitManifestTemplate {
  /**
   * ID references an existing template (mutually exclusive with Spec)
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id?: string;
  /** NextSteps defines the next steps to attach to this template with junction fields */
  next_steps?: ToolkitTemplateNextStepRelation[];
  /** Spec defines a new template to create on installation (mutually exclusive with ID) */
  spec?: ToolkitManifestTemplateSpec;
}

export interface ToolkitManifestTemplateSpec {
  /**
   * RefID is the manifest-internal identifier for this entity (used by $ref in other entries)
   * @maxLength 100
   * @example "my-template"
   */
  $id?: string;
  /**
   * BackingMeetingID references an existing meeting to use as the content source for this template.
   * When specified, the meeting's agenda items, participants, documents, and talking points
   * are copied to the new template's backing meeting during toolkit installation.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  backing_meeting_id?: string;
  /**
   * Description of the template
   * @maxLength 1000
   * @example "Template for sales meetings"
   */
  description?: string;
  /**
   * Name of the template
   * @minLength 1
   * @maxLength 255
   * @example "Sales Meeting Template"
   */
  name: string;
}

export interface ToolkitNextStepActionButtonRelation {
  /** ActionButton is the reference to the action button entity ($ref or $id) */
  action_button: ToolkitManifestRef;
  /**
   * SortOrder is the display order of the action button within the next step
   * @example 1
   */
  sort_order?: number;
}

export interface ToolkitTemplateNextStepRelation {
  /**
   * Autopilot indicates if the next step should auto-execute when the meeting is finalized
   * @example false
   */
  autopilot?: boolean;
  /** NextStep is the reference to the next step entity ($ref or $id) */
  next_step: ToolkitManifestRef;
  /**
   * SortOrder is the display order of the next step within the template
   * @example 1
   */
  sort_order?: number;
}

export interface ToolkitToolkitManifestRequest {
  /**
   * Action buttons included in the toolkit
   * Note: No omitempty - empty slices should serialize as [] for API consistency
   */
  action_buttons?: ToolkitManifestActionButton[];
  /**
   * Next steps included in the toolkit
   * Note: No omitempty - empty slices should serialize as [] for API consistency
   */
  next_steps?: ToolkitManifestNextStep[];
  /**
   * Templates included in the toolkit
   * Note: No omitempty - empty slices should serialize as [] for API consistency
   */
  templates?: ToolkitManifestTemplate[];
}

export interface ToolkitToolkitWithInstallationResponse {
  /** Installation details (nil if not installed) */
  installation?: ToolkitInstallationResponse;
  /** Toolkit details */
  toolkit?: RomeApiControllersExternalPartnerUserToolkitToolkitResponse;
}

export interface ToolkitUpdateToolkitRequest {
  /**
   * @maxLength 1000
   * @example "Updated description"
   */
  description?: string;
  is_active?: boolean;
  manifest?: ToolkitToolkitManifestRequest;
  /**
   * @minLength 1
   * @maxLength 255
   * @example "Updated Toolkit Name"
   */
  name?: string;
  /** @example "1.1.0" */
  version?: string;
}

export type UserInfoListData = RomeApiControllersExternalPartnerOauthUserInfo;

export type UserInfoListError = ErrorsErrorResponse;

export type VerifyCreateData = OauthPartnerAuthResponse;

export type VerifyCreateError = ErrorsErrorResponse;

export interface WebhookWebhookDeliveriesResponse {
  /** Array of webhook delivery records */
  deliveries?: WebhookWebhookDeliveryResponse[];
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

export interface WebhookWebhookDeliveryResponse {
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

/** Bad request error for creating a workflow */
export interface WorkflowCreateWorkflowError400 {
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

export interface WorkflowCreateWorkflowRequest {
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

/** Bad request error for updating a workflow */
export interface WorkflowUpdateWorkflowError400 {
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

export interface WorkflowUpdateWorkflowRequest {
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

export interface WorkflowWorkflowResponse {
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
