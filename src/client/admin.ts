/**
 * Partner Admin API client for API key-authenticated endpoints
 */

import { InternalAxiosRequestConfig } from 'axios';
import { BaseClient, ClientConfig } from './base';
import { ApiKeyClient } from '../auth/apiKey';
import {
  Workflow,
  WorkflowListParams,
  WorkflowListResponse,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  WebhookDelivery,
  WebhookDeliveryListParams,
  WebhookDeliveryListResponse,
  PartnerApp,
  UpdatePartnerAppRequest,
  UpdatePartnerAppStatusRequest,
  UserConnection,
  UserConnectionListParams,
  UserConnectionListResponse,
  CredentialStatusResponse,
  CredentialRotationRequest,
  CredentialRotationResponse,
  CredentialRollbackRequest,
  CredentialAuditHistoryParams,
  CredentialAuditHistoryResponse,
  PartnerIdPConfig,
  CreateIdPConfigRequest,
  UpdateIdPConfigRequest,
} from '../models';

/**
 * Partner Admin API client for API key-authenticated admin endpoints.
 *
 * Provides access to partner app configuration, workflows, webhook deliveries,
 * user connections, credential management, and IdP configuration.
 * Requires an API key for authentication.
 *
 * @example
 * ```typescript
 * const { admin } = ContioPartnerSDK.forAdmin({
 *   apiKey: 'your-api-key'
 * });
 *
 * const app = await admin.getApp();
 * const workflows = await admin.getWorkflows();
 * ```
 */
export class PartnerAdminClient extends BaseClient {
  private apiKeyClient: ApiKeyClient;

  /**
   * Create a new PartnerAdminClient instance.
   *
   * @param apiKeyClient - Configured ApiKeyClient with API key
   * @param config - Optional client configuration (baseURL, timeout, etc.)
   */
  constructor(apiKeyClient: ApiKeyClient, config?: ClientConfig) {
    const baseURL = config?.baseURL || 'https://api.contio.ai';
    const finalURL = `${baseURL}/v1/partner/admin`;
    super({
      ...config,
      baseURL: finalURL,
    });
    this.apiKeyClient = apiKeyClient;
  }

  protected addAuthHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
    config.headers = config.headers || {};
    Object.assign(config.headers, this.apiKeyClient.getHeaders());
    return config;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Workflow endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new workflow.
   *
   * Workflows define automated actions triggered by events in Contio.
   *
   * @param data - Workflow creation data
   * @param data.name - Workflow name (required)
   * @param data.description - Optional workflow description
   * @param data.trigger_type - Event that triggers the workflow (e.g., 'action_item_match')
   * @param data.actions - Actions to perform when triggered
   * @returns The newly created workflow
   * @throws {ContioAPIError} If validation fails
   */
  async createWorkflow(data: CreateWorkflowRequest): Promise<Workflow> {
    return this.post<Workflow>('/workflows', data);
  }

  /**
   * Get a paginated list of workflows.
   *
   * @param params - Optional filter and pagination parameters
   * @param params.limit - Maximum number of workflows to return
   * @param params.offset - Number of workflows to skip for pagination
   * @returns Paginated list of workflows
   * @throws {ContioAPIError} If the request fails
   */
  async getWorkflows(params?: WorkflowListParams): Promise<WorkflowListResponse> {
    return this.get<WorkflowListResponse>('/workflows', params);
  }

  /**
   * Get a specific workflow by ID.
   *
   * @param workflowId - The unique workflow ID
   * @returns The workflow with full details
   * @throws {ContioAPIError} If the workflow is not found
   */
  async getWorkflow(workflowId: string): Promise<Workflow> {
    return this.get<Workflow>(`/workflows/${workflowId}`);
  }

  /**
   * Update a workflow.
   *
   * @param workflowId - The unique workflow ID to update
   * @param data - Fields to update
   * @returns The updated workflow
   * @throws {ContioAPIError} If the workflow is not found or validation fails
   */
  async updateWorkflow(workflowId: string, data: UpdateWorkflowRequest): Promise<Workflow> {
    return this.put<Workflow>(`/workflows/${workflowId}`, data);
  }

  /**
   * Delete a workflow.
   *
   * @param workflowId - The unique workflow ID to delete
   * @throws {ContioAPIError} If the workflow is not found
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    await this.delete(`/workflows/${workflowId}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Partner App endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get partner app information.
   *
   * Returns the current configuration and status of your partner app.
   *
   * @returns The partner app details including name, status, and configuration
   * @throws {ContioAPIError} If the request fails
   */
  async getApp(): Promise<PartnerApp> {
    return this.get<PartnerApp>('/app');
  }

  /**
   * Update partner app details.
   *
   * @param data - Fields to update (name, description, webhook URL, etc.)
   * @returns The updated partner app
   * @throws {ContioAPIError} If validation fails
   */
  async updateApp(data: UpdatePartnerAppRequest): Promise<PartnerApp> {
    return this.put<PartnerApp>('/app', data);
  }

  /**
   * Update partner app status.
   *
   * Use this to enable/disable your partner app or change its visibility.
   *
   * @param data - Status update data
   * @param data.status - New status: 'active', 'inactive', or 'maintenance'
   * @returns The updated partner app
   * @throws {ContioAPIError} If the status transition is not allowed
   */
  async updateAppStatus(data: UpdatePartnerAppStatusRequest): Promise<PartnerApp> {
    return this.put<PartnerApp>('/app/status', data);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Webhook endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a paginated list of webhook deliveries.
   *
   * Use this to monitor webhook delivery status and troubleshoot failures.
   *
   * @param params - Optional filter and pagination parameters
   * @param params.limit - Maximum number of deliveries to return (default 50, max 100)
   * @param params.offset - Number of deliveries to skip for pagination (default 0)
   * @param params.status - Filter by delivery status (pending, delivered, failed, abandoned)
   * @param params.event_type - Filter by event type (e.g., meeting.created, workflow.assignment.created)
   * @returns Paginated list of webhook deliveries
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * // Get all failed deliveries for meeting.created events
   * const deliveries = await admin.getWebhookDeliveries({
   *   status: 'failed',
   *   event_type: 'meeting.created',
   *   limit: 20
   * });
   * ```
   */
  async getWebhookDeliveries(params?: WebhookDeliveryListParams): Promise<WebhookDeliveryListResponse> {
    return this.get<WebhookDeliveryListResponse>('/webhook-deliveries', params);
  }

  /**
   * Get a specific webhook delivery.
   *
   * Returns full details including request/response payloads for debugging.
   *
   * @param deliveryId - The unique delivery ID
   * @returns The webhook delivery with full details
   * @throws {ContioAPIError} If the delivery is not found
   */
  async getWebhookDelivery(deliveryId: string): Promise<WebhookDelivery> {
    return this.get<WebhookDelivery>(`/webhook-deliveries/${deliveryId}`);
  }

  /**
   * Retry a failed webhook delivery.
   *
   * Schedules an immediate retry of a failed webhook delivery.
   *
   * @param deliveryId - The unique delivery ID to retry
   * @returns Confirmation that retry was scheduled
   * @throws {ContioAPIError} If the delivery is not found or cannot be retried
   *
   * @example
   * ```typescript
   * const result = await admin.retryWebhookDelivery('delivery-id');
   * if (result.retry_scheduled) {
   *   console.log('Retry scheduled successfully');
   * }
   * ```
   */
  async retryWebhookDelivery(deliveryId: string): Promise<{ message: string; retry_scheduled: boolean }> {
    return this.post(`/webhook-deliveries/${deliveryId}/retry`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Connection endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a paginated list of user connections.
   *
   * User connections represent users who have authorized your partner app.
   *
   * @param params - Optional filter and pagination parameters
   * @param params.limit - Maximum number of connections to return
   * @param params.offset - Number of connections to skip for pagination
   * @param params.status - Filter by status: 'active', 'revoked'
   * @returns Paginated list of user connections
   * @throws {ContioAPIError} If the request fails
   */
  async getUserConnections(params?: UserConnectionListParams): Promise<UserConnectionListResponse> {
    return this.get<UserConnectionListResponse>('/connections', params);
  }

  /**
   * Get a specific user connection.
   *
   * @param connectionId - The unique connection ID
   * @returns The user connection with full details
   * @throws {ContioAPIError} If the connection is not found
   */
  async getUserConnection(connectionId: string): Promise<UserConnection> {
    return this.get<UserConnection>(`/connections/${connectionId}`);
  }

  /**
   * Revoke a user connection.
   *
   * This invalidates all tokens for the user and removes their authorization.
   * The user will need to re-authorize to use your partner app again.
   *
   * @param connectionId - The unique connection ID to revoke
   * @throws {ContioAPIError} If the connection is not found
   */
  async revokeUserConnection(connectionId: string): Promise<void> {
    await this.delete(`/connections/${connectionId}`);
  }

  // Credential Management endpoints

  /**
   * Get status of all credentials (API key, webhook secret, client secret)
   *
   * Returns health information including age, last rotation, and recommended actions
   *
   * @example
   * ```typescript
   * const status = await admin.getCredentialStatus();
   * console.log('API key age:', status.api_key.age_days, 'days');
   * console.log('Recommended action:', status.api_key.recommended_action);
   * ```
   */
  async getCredentialStatus(): Promise<CredentialStatusResponse> {
    return this.get<CredentialStatusResponse>('/credentials');
  }

  /**
   * Rotate the API key with a grace period
   *
   * During the grace period, both old and new API keys are valid.
   * After the grace period expires, only the new key works.
   *
   * @param request - Rotation request with confirmation token and optional grace period
   * @returns Response containing the new API key and rollback token
   *
   * @example
   * ```typescript
   * const result = await admin.rotateAPIKey({
   *   confirmation_token: 'confirm_rotation_12345',
   *   reason: 'Monthly security rotation',
   *   grace_period_hours: 48
   * });
   *
   * // IMPORTANT: Save these values securely!
   * console.log('New API key:', result.new_credential);
   * console.log('Rollback token:', result.rollback_token);
   * console.log('Grace period ends:', result.grace_period_ends_at);
   *
   * // Update your configuration with the new API key
   * // Both old and new keys work until grace_period_ends_at
   * ```
   */
  async rotateAPIKey(request: CredentialRotationRequest): Promise<CredentialRotationResponse> {
    return this.post<CredentialRotationResponse>('/credentials/api-key/rotate', request);
  }

  /**
   * Rotate the webhook secret (immediate rotation, no grace period)
   *
   * IMPORTANT: Webhook secrets do not support grace periods because Contio signs
   * outgoing webhooks with the current secret immediately after rotation.
   *
   * Best practices:
   * - Rotate during low-traffic periods to minimize failed deliveries
   * - Implement dual-secret verification on your webhook endpoint during rotation
   * - Use webhook redelivery if any deliveries fail during rotation
   * - The grace_period_hours parameter is ignored for webhook secrets
   *
   * @param request - Rotation request with confirmation token
   * @returns Response containing the new webhook secret (no rollback token or grace period)
   *
   * @example
   * ```typescript
   * const result = await admin.rotateWebhookSecret({
   *   confirmation_token: 'confirm_rotation_12345',
   *   reason: 'Quarterly security rotation'
   * });
   *
   * // IMPORTANT: Save the new secret securely and update your webhook verification immediately!
   * console.log('New webhook secret:', result.new_credential);
   *
   * // Implement dual-secret verification during rotation:
   * // Try verifying with new secret first, then fall back to old secret
   * ```
   */
  async rotateWebhookSecret(request: CredentialRotationRequest): Promise<CredentialRotationResponse> {
    return this.post<CredentialRotationResponse>('/credentials/webhook-secret/rotate', request);
  }

  /**
   * Rotate the OAuth client secret with a grace period
   *
   * During the grace period, both old and new client secrets work for token exchange.
   * After the grace period expires, only the new secret works.
   *
   * @param request - Rotation request with confirmation token and optional grace period
   * @returns Response containing the new client secret and rollback token
   *
   * @example
   * ```typescript
   * const result = await admin.rotateClientSecret({
   *   confirmation_token: 'confirm_rotation_12345',
   *   reason: 'Annual security rotation',
   *   grace_period_hours: 168  // 7 days
   * });
   *
   * // IMPORTANT: Save these values securely!
   * console.log('New client secret:', result.new_credential);
   * console.log('Rollback token:', result.rollback_token);
   * console.log('Grace period ends:', result.grace_period_ends_at);
   *
   * // Update your OAuth configuration with the new client secret
   * // Both old and new secrets work until grace_period_ends_at
   * ```
   */
  async rotateClientSecret(request: CredentialRotationRequest): Promise<CredentialRotationResponse> {
    return this.post<CredentialRotationResponse>('/credentials/client-secret/rotate', request);
  }

  /**
   * Rollback a credential rotation (emergency use only)
   *
   * Reverts a credential rotation using the rollback token.
   * Rollback tokens are valid for 1 hour and are single-use only.
   *
   * NOTE: Webhook secrets do not support rollback. Only API keys and client secrets can be rolled back.
   *
   * @param credentialType - Type of credential to rollback ('api-key' or 'client-secret')
   * @param request - Rollback request with the rollback token
   *
   * @example
   * ```typescript
   * // If rotation caused issues, rollback within 1 hour
   * await admin.rollbackCredential('api-key', {
   *   rollback_token: 'rb_xyz789'
   * });
   *
   * console.log('Credential rolled back to previous value');
   * ```
   */
  async rollbackCredential(
    credentialType: 'api-key' | 'client-secret',
    request: CredentialRollbackRequest
  ): Promise<void> {
    await this.post(`/credentials/${credentialType}/rollback`, request);
  }

  /**
   * Get audit history for credential operations
   *
   * Returns a log of all credential operations including rotations, access, and rollbacks.
   * Useful for security monitoring and compliance.
   *
   * @param params - Optional filters for credential type, action, pagination
   * @returns Audit events with pagination info
   *
   * @example
   * ```typescript
   * // Get recent credential operations
   * const history = await admin.getCredentialHistory({
   *   limit: 20,
   *   credential_type: 'api_key'
   * });
   *
   * history.events.forEach(event => {
   *   console.log(`${event.created_at}: ${event.action} by ${event.initiated_by}`);
   *   if (event.reason) {
   *     console.log(`  Reason: ${event.reason}`);
   *   }
   * });
   *
   * // Check for rotations in the last 24 hours
   * const recentRotations = history.events.filter(e =>
   *   e.action === 'rotated' &&
   *   new Date(e.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
   * );
   * console.log(`Rotations in last 24h: ${recentRotations.length}/3`);
   * ```
   */
  async getCredentialHistory(params?: CredentialAuditHistoryParams): Promise<CredentialAuditHistoryResponse> {
    return this.get<CredentialAuditHistoryResponse>('/credentials/history', params);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // IdP Configuration endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create IdP configuration for this partner app.
   *
   * Configures OIDC-based SSO for your partner app. The discovery URL is used to
   * automatically fetch OIDC endpoints (issuer, authorization, token, userinfo, jwks).
   *
   * @param data - IdP configuration data
   * @param data.name - Display name for this IdP configuration (required)
   * @param data.discovery_url - OIDC discovery endpoint URL (should end with /.well-known/openid-configuration) (required)
   * @param data.idp_client_id - OAuth Client ID from your Identity Provider (required)
   * @param data.idp_client_secret - OAuth Client Secret from your Identity Provider (required)
   * @param data.mode - Domain validation mode: 'strict' or 'partner_managed' (required)
   * @param data.scopes - OIDC scopes to request (optional, defaults to ["openid", "email", "profile"])
   * @param data.claim_mappings - Maps Contio user fields to IdP claim names (optional)
   * @param data.allowed_email_domains - Email domains allowed for SSO (required for strict mode)
   * @returns The created IdP configuration
   * @throws {ContioAPIError} If validation fails or IdP already exists
   *
   * @see https://docs.contio.ai/partner-api/guides/sso/
   *
   * @example
   * ```typescript
   * const idp = await admin.createIdPConfig({
   *   name: 'Okta SSO',
   *   discovery_url: 'https://yourorg.okta.com/.well-known/openid-configuration',
   *   idp_client_id: 'okta-client-id',
   *   idp_client_secret: 'okta-client-secret',
   *   mode: 'strict',
   *   allowed_email_domains: ['yourcompany.com']
   * });
   * ```
   */
  async createIdPConfig(data: CreateIdPConfigRequest): Promise<PartnerIdPConfig> {
    return this.post<PartnerIdPConfig>('/idp', data);
  }

  /**
   * Get the IdP configuration for this partner app.
   *
   * @returns The current IdP configuration, or throws if not configured
   * @throws {ContioAPIError} If IdP is not configured (404)
   */
  async getIdPConfig(): Promise<PartnerIdPConfig> {
    return this.get<PartnerIdPConfig>('/idp');
  }

  /**
   * Update the IdP configuration for this partner app.
   *
   * @param data - Fields to update (all optional)
   * @returns The updated IdP configuration
   * @throws {ContioAPIError} If IdP is not configured or validation fails
   */
  async updateIdPConfig(data: UpdateIdPConfigRequest): Promise<PartnerIdPConfig> {
    return this.put<PartnerIdPConfig>('/idp', data);
  }

  /**
   * Delete the IdP configuration for this partner app.
   *
   * This disables SSO for your partner app. Users will need to use
   * standard OAuth authorization to connect.
   *
   * @throws {ContioAPIError} If IdP is not configured
   */
  async deleteIdPConfig(): Promise<void> {
    await this.delete('/idp');
  }
}
