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
  /** @example "api_key" */
  credential_type?: string;
  /** @example "2024-01-15T10:30:00Z" */
  grace_period_ends_at?: string;
  /** @example "pk_live_abc123..." */
  new_credential?: string;
  /** @example "2024-01-14T10:30:00Z" */
  rollback_expires_at?: string;
  /** @example "rollback_token_xyz..." */
  rollback_token?: string;
}

export interface AdminCredentialStatusResponse {
  /** @example 5 */
  age_days?: number;
  /** @example "2024-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "api_key" */
  credential_type?: string;
  /** @example "2024-01-12T10:30:00Z" */
  grace_period_ends_at?: string;
  /** @example "2024-01-10T10:30:00Z" */
  last_rotated_at?: string;
  /** @example "2024-01-20T10:30:00Z" */
  last_used_at?: string;
  /** @example "ok" */
  recommended_action?: string;
  /** @example "active" */
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
  items?: AdminUserConnectionResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 100 */
  total?: number;
}

export interface AdminListResponseAdminWorkflowResponse {
  items?: AdminWorkflowResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 100 */
  total?: number;
}

export interface AdminPartnerAppResponse {
  /** @example "partner_1234567890_abcdef123456" */
  client_id?: string;
  /** @example "Acme Corp" */
  company_name?: string;
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "Integrates with our CRM system" */
  description?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  id?: string;
  /** @example "CRM Integration" */
  name?: string;
  /** @example "contact@example.com" */
  primary_contact_email?: string;
  /** @example "acme-crm" */
  slug?: string;
  /** @example "active" */
  status?: string;
  /** @example "2023-01-01T00:00:00Z" */
  updated_at?: string;
  /** @example "https://api.example.com/webhook" */
  webhook_url?: string;
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

export interface AdminUpdateAppStatusRequest {
  /** @example "suspended" */
  status: "active" | "suspended" | "inactive";
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
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "2023-01-01T00:00:00Z" */
  feature_activated_at?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174002" */
  id?: string;
  /** @example "2023-01-15T10:30:00Z" */
  last_used_at?: string;
  /** @example "2023-12-31T23:59:59Z" */
  oauth_expires_at?: string;
  /** @example ["['openid'"," 'profile'"," 'meetings:read']"] */
  oauth_scopes?: string[];
  /** @example "active" */
  status?: string;
  /** @example "2023-01-01T00:00:00Z" */
  updated_at?: string;
  /** @example "john.doe@example.com" */
  user_email?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174003" */
  user_id?: string;
  /** @example "John Doe" */
  user_name?: string;
}

export interface AdminWebhookDeliveriesResponse {
  deliveries?: AdminWebhookDeliveryResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 25 */
  total?: number;
}

export interface AdminWebhookDeliveryResponse {
  /** @example "2024-01-14T10:00:00Z" */
  created_at?: string;
  /** @example "2024-01-14T10:30:00Z" */
  delivered_at?: string;
  /** @example "delivered" */
  delivery_status?: string;
  /** @example "" */
  error_message?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174006" */
  event_id?: string;
  /** @example "action_item_created" */
  event_type?: string;
  /** @example 200 */
  http_status_code?: number;
  /** @example "123e4567-e89b-12d3-a456-426614174005" */
  id?: string;
  /** @example "2024-01-15T10:30:00Z" */
  next_retry_at?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  partner_app_id?: string;
  /** @example 0 */
  retry_count?: number;
}

export interface AdminWorkflowResponse {
  actions?: PartnerWorkflowAction[];
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "Sync action items to CRM" */
  description?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174001" */
  id?: string;
  /** @example "CRM Integration" */
  name?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  partner_app_id?: string;
  /** @example "active" */
  status?: string;
  /** @example "action_item_created" */
  trigger_type?: string;
  /** @example "2023-01-01T00:00:00Z" */
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

export type CheckConsentCreateData = OauthOAuthConsentCheckResponse;

export type CheckConsentCreateError = ErrorsErrorResponse;

/** Standard error response format used across all API endpoints All error responses follow this consistent structure for predictable error handling */
export interface ErrorsErrorResponse {
  /**
   * Error code identifying the specific type of error
   * @Description Unique identifier for the error type, useful for programmatic error handling
   * @Enum not_found,note_not_found,bad_request,validation_error,unauthorized,forbidden,conflict,resource_already_exists,too_many_requests,internal_server_error
   * @example "not_found"
   */
  code?: string;
  /**
   * Human-readable error message
   * @Description User-friendly description of what went wrong
   * @example "The requested resource could not be found"
   */
  message?: string;
  /**
   * RequestID is the unique request identifier for tracing
   * @Description Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

/** Standard error response format used across all partner API endpoints This format is used by both partner admin and partner user APIs for consistency */
export interface ErrorsPartnerErrorResponse {
  /**
   * Error code identifying the specific type of error
   * @Description Unique identifier for the error type, useful for programmatic error handling
   * @example "invalid_request"
   */
  code?: string;
  /**
   * Human-readable error message
   * @Description User-friendly description of what went wrong
   * @example "Invalid request"
   */
  error?: string;
  /**
   * RequestID is the unique request identifier for tracing
   * @Description Request identifier to correlate errors with logs
   * @example "abc123xyz"
   */
  request_id?: string;
}

export type HealthListData = OauthHealthResponse;

export type HealthListError = ErrorsErrorResponse;

export type InitiateCreateData = OauthPartnerAuthInitiateResponse;

export type InitiateCreateError = ErrorsErrorResponse;

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
  /** @example "John Doe" */
  name?: string;
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

export type PartnerAdminAppStatusUpdateError = ErrorsPartnerErrorResponse;

export type PartnerAdminAppUpdateData = AdminPartnerAppResponse;

export type PartnerAdminAppUpdateError = ErrorsPartnerErrorResponse;

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
  ErrorsErrorResponse;

export type PartnerAdminCredentialsClientSecretRotateCreateData =
  AdminCredentialRotationResponse;

export type PartnerAdminCredentialsClientSecretRotateCreateError =
  ErrorsErrorResponse;

export type PartnerAdminCredentialsHistoryListData = Record<string, unknown>;

export type PartnerAdminCredentialsHistoryListError = ErrorsErrorResponse;

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

export type PartnerAdminCredentialsListError = ErrorsErrorResponse;

export type PartnerAdminCredentialsWebhookSecretRotateCreateData =
  AdminCredentialRotationResponse;

export type PartnerAdminCredentialsWebhookSecretRotateCreateError =
  ErrorsErrorResponse;

export type PartnerAdminIdpCreateData = AdminIdPConfigResponse;

export type PartnerAdminIdpCreateError = ErrorsPartnerErrorResponse;

export type PartnerAdminIdpDeleteData = any;

export type PartnerAdminIdpDeleteError = ErrorsPartnerErrorResponse;

export type PartnerAdminIdpListData = AdminIdPConfigResponse;

export type PartnerAdminIdpListError = ErrorsPartnerErrorResponse;

export type PartnerAdminIdpUpdateData = AdminIdPConfigResponse;

export type PartnerAdminIdpUpdateError = ErrorsPartnerErrorResponse;

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

export type PartnerAdminWorkflowsCreateError = ErrorsPartnerErrorResponse;

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

export type PartnerAdminWorkflowsUpdateError = ErrorsPartnerErrorResponse;

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

export type PartnerUserActionItemsCreateData = UserPartnerActionItemResponse;

export type PartnerUserActionItemsCreateError = ErrorsErrorResponse;

export type PartnerUserActionItemsDeleteData = any;

export type PartnerUserActionItemsDeleteError = ErrorsErrorResponse;

export interface PartnerUserActionItemsDeleteParams {
  /** Action Item ID */
  id: string;
}

export type PartnerUserActionItemsDetailData = UserPartnerActionItemResponse;

export type PartnerUserActionItemsDetailError = ErrorsErrorResponse;

export interface PartnerUserActionItemsDetailParams {
  /** Action Item ID */
  id: string;
}

export type PartnerUserActionItemsListData =
  UserListResponseUserPartnerActionItemResponse;

export type PartnerUserActionItemsListError = ErrorsErrorResponse;

export interface PartnerUserActionItemsListParams {
  /** Filter by partner assignment */
  has_partner_assignment?: boolean;
  /** Filter by completion status */
  is_completed?: boolean;
  /**
   * Limit
   * @default 50
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
}

export type PartnerUserActionItemsUpdateData = UserPartnerActionItemResponse;

export type PartnerUserActionItemsUpdateError = ErrorsErrorResponse;

export interface PartnerUserActionItemsUpdateParams {
  /** Action Item ID */
  id: string;
}

export type PartnerUserCalendarEventsDetailData =
  UserPartnerCalendarEventResponse;

export type PartnerUserCalendarEventsDetailError = ErrorsPartnerErrorResponse;

export interface PartnerUserCalendarEventsDetailParams {
  /** Calendar Event ID */
  calendarEventId: string;
}

export type PartnerUserCalendarEventsListData =
  UserListResponseUserPartnerCalendarEventResponse;

export type PartnerUserCalendarEventsListError = ErrorsPartnerErrorResponse;

export interface PartnerUserCalendarEventsListParams {
  /** Sort direction: asc or desc (default: asc) */
  direction?: string;
  /** End time in RFC3339 format */
  end: string;
  /** Number of results per page (default 25, max 100) */
  limit?: number;
  /** Pagination offset (default 0) */
  offset?: number;
  /** Start time in RFC3339 format */
  start: string;
}

export type PartnerUserCalendarEventsMeetingCreateData =
  UserCreateMeetingFromCalendarEventResponse;

export type PartnerUserCalendarEventsMeetingCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserCalendarEventsMeetingCreateParams {
  /** Calendar Event ID */
  calendarEventId: string;
}

export type PartnerUserMeetingsAgendaItemsListData =
  UserListResponseUserPartnerAgendaItemResponse;

export type PartnerUserMeetingsAgendaItemsListError = Record<string, string>;

export interface PartnerUserMeetingsAgendaItemsListParams {
  /**
   * Meeting ID
   * @format uuid
   */
  id: string;
}

export type PartnerUserMeetingsCalendarLinkCreateData =
  UserLinkCalendarEventResponse;

export type PartnerUserMeetingsCalendarLinkCreateError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsCalendarLinkCreateParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserMeetingsCalendarUnlinkDeleteData =
  UserLinkCalendarEventResponse;

export type PartnerUserMeetingsCalendarUnlinkDeleteError =
  ErrorsPartnerErrorResponse;

export interface PartnerUserMeetingsCalendarUnlinkDeleteParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserMeetingsCreateData = UserPartnerMeetingResponse;

export type PartnerUserMeetingsCreateError = ErrorsErrorResponse;

export type PartnerUserMeetingsDetailData = UserPartnerMeetingResponse;

export type PartnerUserMeetingsDetailError = ErrorsErrorResponse;

export interface PartnerUserMeetingsDetailParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserMeetingsListData =
  UserListResponseUserPartnerMeetingResponse;

export type PartnerUserMeetingsListError = ErrorsErrorResponse;

export interface PartnerUserMeetingsListParams {
  /**
   * End date filter (ISO 8601)
   * @example ""2023-12-31T23:59:59Z""
   */
  end_date?: string;
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
  /**
   * Start date filter (ISO 8601)
   * @example ""2023-01-01T00:00:00Z""
   */
  start_date?: string;
}

export type PartnerUserMeetingsPartialUpdateData = UserPartnerMeetingResponse;

export type PartnerUserMeetingsPartialUpdateError = ErrorsErrorResponse;

export interface PartnerUserMeetingsPartialUpdateParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserMeetingsParticipantsListData =
  UserListResponseUserPartnerMeetingParticipantResponse;

export type PartnerUserMeetingsParticipantsListError = ErrorsErrorResponse;

export interface PartnerUserMeetingsParticipantsListParams {
  /** Meeting ID */
  id: string;
}

export type PartnerUserProfileListData = UserUserProfileResponse;

export type PartnerUserProfileListError = ErrorsErrorResponse;

export interface PartnerWorkflowAction {
  /** @example {"url":"https://api.example.com/webhook"} */
  config?: Record<string, string>;
  /** @example "webhook" */
  type: string;
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

export interface UserCreateActionItemRequest {
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

export interface UserCreateAgendaItemRequest {
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

export interface UserCreateMeetingFromCalendarEventResponse {
  /** @example true */
  created?: boolean;
  meeting?: UserPartnerMeetingResponse;
  /** @example "Meeting created successfully from calendar event" */
  message?: string;
}

export interface UserCreateMeetingRequest {
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

export type UserInfoListData = RomeApiControllersExternalPartnerOauthUserInfo;

export type UserInfoListError = ErrorsErrorResponse;

export interface UserLinkCalendarEventRequest {
  /**
   * @maxLength 255
   * @example "123e4567-e89b-12d3-a456-426614174006"
   */
  calendar_event_id: string;
}

export interface UserLinkCalendarEventResponse {
  /** @example "Meeting linked to calendar event successfully" */
  message?: string;
  /** @example true */
  success?: boolean;
}

export interface UserListResponseUserPartnerActionItemResponse {
  items?: UserPartnerActionItemResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 100 */
  total?: number;
}

export interface UserListResponseUserPartnerAgendaItemResponse {
  items?: UserPartnerAgendaItemResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 100 */
  total?: number;
}

export interface UserListResponseUserPartnerCalendarEventResponse {
  items?: UserPartnerCalendarEventResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 100 */
  total?: number;
}

export interface UserListResponseUserPartnerMeetingParticipantResponse {
  items?: UserPartnerMeetingParticipantResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 100 */
  total?: number;
}

export interface UserListResponseUserPartnerMeetingResponse {
  items?: UserPartnerMeetingResponse[];
  /** @example 50 */
  limit?: number;
  /** @example 0 */
  offset?: number;
  /** @example 100 */
  total?: number;
}

export type UserMeetingsAgendaItemsCreateData = UserPartnerAgendaItemResponse;

export type UserMeetingsAgendaItemsCreateError = ErrorsPartnerErrorResponse;

export interface UserMeetingsAgendaItemsCreateParams {
  /**
   * Meeting ID
   * @format uuid
   */
  meetingId: string;
}

export type UserMeetingsAgendaItemsDeleteData = any;

export type UserMeetingsAgendaItemsDeleteError = ErrorsPartnerErrorResponse;

export interface UserMeetingsAgendaItemsDeleteParams {
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

export type UserMeetingsAgendaItemsUpdateData = UserPartnerAgendaItemResponse;

export type UserMeetingsAgendaItemsUpdateError = ErrorsPartnerErrorResponse;

export interface UserMeetingsAgendaItemsUpdateParams {
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

export interface UserPartnerActionItemResponse {
  /** @example "123e4567-e89b-12d3-a456-426614174003" */
  assigned_to_user_id?: string;
  /** @example "2023-01-08T18:00:00-07:00" */
  completed_at?: string;
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "Follow up with client about proposal" */
  description?: string;
  /**
   * YYYY-MM-DD format
   * @example "2023-01-08"
   */
  due_date?: string;
  /** @example true */
  has_partner_assignment?: boolean;
  /** @example "123e4567-e89b-12d3-a456-426614174001" */
  id?: string;
  /** @example false */
  is_completed?: boolean;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  meeting_id?: string;
  partner_context?: Record<string, unknown>;
  /** @example "accepted" */
  status?: string;
  /** @example "Client follow-up call" */
  title?: string;
  /** @example "2023-01-01T00:00:00Z" */
  updated_at?: string;
}

export interface UserPartnerAgendaItemResponse {
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "Review and discuss Q1 objectives" */
  description?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174005" */
  id?: string;
  /** @example "DISCUSSION" */
  item_type?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  meeting_id?: string;
  /** @example ["123e4567-e89b-12d3-a456-426614174003"] */
  presenters?: string[];
  /** @example false */
  restricted_to_leads?: boolean;
  /** @example "1" */
  sequence?: string;
  /** @example "pending" */
  status?: string;
  /** @example 15 */
  time_allocation_minutes?: number;
  /** @example "Q1 Planning Discussion" */
  title?: string;
  /** @example "2023-01-01T00:00:00Z" */
  updated_at?: string;
}

export interface UserPartnerCalendarEventAttendee {
  /** @example "john.doe@example.com" */
  email?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example "accepted" */
  status?: string;
  /** @example "required" */
  type?: string;
}

export interface UserPartnerCalendarEventResponse {
  attendees?: UserPartnerCalendarEventAttendee[];
  /** @example "Discuss project updates" */
  description?: string;
  /** @example "2023-01-01T11:00:00-07:00" */
  end_time?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174006" */
  id?: string;
  /** @example "Conference Room A" */
  location?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  meeting_id?: string;
  organizer?: UserPartnerCalendarEventAttendee;
  /** @example "2023-01-01T10:00:00-07:00" */
  start_time?: string;
  /** @example "Weekly Team Sync" */
  title?: string;
}

export interface UserPartnerMeetingParticipantResponse {
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "john.doe@example.com" */
  email?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174004" */
  id?: string;
  /** @example true */
  is_attended?: boolean;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  meeting_id?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example "EDITOR" */
  role?: string;
  /** @example "2023-01-01T00:00:00Z" */
  updated_at?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174003" */
  user_id?: string;
}

export interface UserPartnerMeetingResponse {
  /** @example "123e4567-e89b-12d3-a456-426614174006" */
  calendar_event_id?: string;
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174003" */
  created_by_user_id?: string;
  /** @example "2023-01-01T11:00:00-07:00" */
  end_time?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  id?: string;
  /**
   * Smart redirect hint (CON-1640)
   * @example "123e4567-e89b-12d3-a456-426614174007"
   */
  redirect_to_meeting_id?: string;
  /** @example "2023-01-01T10:00:00-07:00" */
  start_time?: string;
  /** @example "completed" */
  status?: string;
  /** @example "Post-Meeting Summarization ..." */
  summary_notes?: string;
  /** @example "Weekly Team Sync" */
  title?: string;
  /** @example "2023-01-01T00:00:00Z" */
  updated_at?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174002" */
  workspace_id?: string;
}

export interface UserUpdateActionItemRequest {
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

export interface UserUpdateAgendaItemRequest {
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

export interface UserUpdateMeetingRequest {
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

export interface UserUserProfileResponse {
  /** @example "2023-01-01T00:00:00Z" */
  created_at?: string;
  /** @example "John Doe" */
  display_name?: string;
  /** @example "john.doe@example.com" */
  email?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174003" */
  id?: string;
}

export type VerifyCreateData = OauthPartnerAuthResponse;

export type VerifyCreateError = ErrorsErrorResponse;
