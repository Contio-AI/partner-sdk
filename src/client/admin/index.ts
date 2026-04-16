/**
 * Partner Admin API client for API key-authenticated endpoints.
 *
 * This module is the public facade — it delegates to domain-specific
 * modules under `src/client/admin/` while maintaining a single class
 * surface for backward compatibility and TypeDoc generation.
 *
 * @module
 */

import { InternalAxiosRequestConfig } from 'axios';
import { BaseClient, ClientConfig, RequestOptions } from '../base';
import { HttpTransport } from '../_http';
import { ApiKeyClient } from '../../auth/apiKey';
import {
  Automation,
  AutomationListParams,
  AutomationListResponse,
  CreateAutomationRequest,
  UpdateAutomationRequest,
  WebhookDelivery,
  WebhookDeliveryListParams,
  WebhookDeliveryListResponse,
  PartnerApp,
  UpdatePartnerAppRequest,
  UpdatePartnerAppStatusRequest,
  UpdateWebhookStatusRequest,
  SetWebhookFilterRequest,
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
  // Toolkit-related imports
  Toolkit,
  ToolkitListParams,
  ToolkitListResponse,
  CreateToolkitRequest,
  UpdateToolkitRequest,
  ToolkitVersion,
  CreateToolkitVersionRequest,
  UpdateToolkitVersionRequest,
  ExportEntitiesRequest,
  ExportResponse,
  // Template-related imports
  Template,
  TemplateListParams,
  TemplateListResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateNextStep,
  TemplateNextStepListParams,
  TemplateNextStepListResponse,
  AddTemplateNextStepRequest,
  UpdateTemplateNextStepRequest,
} from '../../models';

import * as automations from './automations';
import * as app from './app';
import * as webhooks from './webhooks';
import * as connections from './connections';
import * as credentials from './credentials';
import * as idp from './idp';
import * as toolkits from './toolkits';
import * as templates from './templates';

/**
 * Partner Admin API client for API key-authenticated admin endpoints.
 *
 * Provides access to partner app configuration, automations, webhook deliveries,
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
 * const automations = await admin.getAutomations();
 * ```
 */
export class PartnerAdminClient extends BaseClient {
  private apiKeyClient: ApiKeyClient;
  private readonly http: HttpTransport;

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

    // Use arrow functions so jest.spyOn() on the instance methods works
    // (bind() captures the reference at construction time, defeating spies).
    this.http = {
      get: (...args) => this.get(...args),
      post: (...args) => this.post(...args),
      put: (...args) => this.put(...args),
      patch: (...args) => this.patch(...args),
      delete: (...args) => this.delete(...args),
      postForm: (...args) => this.postForm(...args),
      getRaw: (...args) => this.getRaw(...args),
    };
  }

  protected addAuthHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
    config.headers = config.headers || {};
    Object.assign(config.headers, this.apiKeyClient.getHeaders());
    return config;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Automation endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new automation.
   *
   * Automations define automated actions triggered by events in Contio.
   *
   * @param data - Automation creation data
   * @param data.name - Automation name (required)
   * @param data.description - Optional automation description
   * @param data.trigger_type - Event that triggers the automation (e.g., 'action_item_match')
   * @param data.actions - Actions to perform when triggered
   * @returns The newly created automation
   * @throws {ContioAPIError} If validation fails
   */
  async createAutomation(data: CreateAutomationRequest): Promise<Automation> {
    return automations.createAutomation(this.http, data);
  }

  /**
   * Get a paginated list of automations.
   *
   * @param params - Optional filter and pagination parameters
   * @param params.limit - Maximum number of automations to return
   * @param params.offset - Number of automations to skip for pagination
   * @returns Paginated list of automations
   * @throws {ContioAPIError} If the request fails
   */
  async getAutomations(params?: AutomationListParams): Promise<AutomationListResponse> {
    return automations.getAutomations(this.http, params);
  }

  /**
   * Get a specific automation by ID.
   *
   * @param automationId - The unique automation ID
   * @returns The automation with full details
   * @throws {ContioAPIError} If the automation is not found
   */
  async getAutomation(automationId: string): Promise<Automation> {
    return automations.getAutomation(this.http, automationId);
  }



  /**
   * Update a automation.
   *
   * @param automationId - The unique automation ID to update
   * @param data - Fields to update
   * @returns The updated automation
   * @throws {ContioAPIError} If the automation is not found or validation fails
   */
  async updateAutomation(automationId: string, data: UpdateAutomationRequest): Promise<Automation> {
    return automations.updateAutomation(this.http, automationId, data);
  }

  /**
   * Delete a automation.
   *
   * @param automationId - The unique automation ID to delete
   * @throws {ContioAPIError} If the automation is not found
   */
  async deleteAutomation(automationId: string): Promise<void> {
    return automations.deleteAutomation(this.http, automationId);
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
    return app.getApp(this.http);
  }

  /**
   * Update partner app details.
   *
   * @param data - Fields to update (name, description, webhook URL, etc.)
   * @returns The updated partner app
   * @throws {ContioAPIError} If validation fails
   */
  async updateApp(data: UpdatePartnerAppRequest): Promise<PartnerApp> {
    return app.updateApp(this.http, data);
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
    return app.updateAppStatus(this.http, data);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Webhook Delivery endpoints
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
   * @param params.event_type - Filter by event type (e.g., meeting.created, automation.assignment.created)
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
    return webhooks.getWebhookDeliveries(this.http, params);
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
    return webhooks.getWebhookDelivery(this.http, deliveryId);
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
    return webhooks.retryWebhookDelivery(this.http, deliveryId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Webhook Management endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Enable or disable webhook delivery for your partner app.
   *
   * Use this to temporarily pause webhook delivery or re-enable delivery after
   * resolving endpoint issues.
   *
   * @param data - Webhook status update data
   * @param data.enabled - Whether webhook delivery should be enabled
   * @param data.pending_disposition - Required when re-enabling to dispose of pending deliveries
   * @returns The updated partner app configuration
   * @throws {ContioAPIError} If the request is invalid or the status change is not allowed
   *
   * @example
   * ```typescript
   * await admin.updateWebhookStatus({
   *   enabled: false
   * });
   * ```
   *
   * @example
   * ```typescript
   * const app = await admin.updateWebhookStatus({
   *   enabled: true,
   *   pending_disposition: 'abandon'
   * });
   *
   * console.log('Webhook enabled:', app.webhook_enabled);
   * ```
   */
  async updateWebhookStatus(data: UpdateWebhookStatusRequest): Promise<PartnerApp> {
    return webhooks.updateWebhookStatus(this.http, data);
  }

  /**
   * Configure event filtering for webhook delivery.
   *
   * Use include filters to allow only specific events, or exclude filters to
   * suppress selected events from being delivered.
   *
   * @param data - Webhook filter configuration
   * @param data.type - Filter mode: include or exclude
   * @param data.events - Event types to include or exclude
   * @returns The updated partner app configuration
   * @throws {ContioAPIError} If the request is invalid or includes unsupported event types
   *
   * @example
   * ```typescript
   * const app = await admin.setWebhookFilter({
   *   type: 'include',
   *   events: ['meeting.created', 'meeting.completed']
   * });
   *
   * console.log(app.webhook_filter);
   * ```
   *
   * @example
   * ```typescript
   * await admin.setWebhookFilter({
   *   type: 'exclude',
   *   events: ['participant.added']
   * });
   * ```
   */
  async setWebhookFilter(data: SetWebhookFilterRequest): Promise<PartnerApp> {
    return webhooks.setWebhookFilter(this.http, data);
  }

  /**
   * Remove the webhook event filter for your partner app.
   *
   * After removing the filter, all supported webhook events will be eligible
   * for delivery again.
   *
   * @returns The updated partner app configuration
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * const app = await admin.removeWebhookFilter();
   * console.log(app.webhook_filter); // null
   * ```
   */
  async removeWebhookFilter(): Promise<PartnerApp> {
    return webhooks.removeWebhookFilter(this.http);
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
    return connections.getUserConnections(this.http, params);
  }

  /**
   * Get a specific user connection.
   *
   * @param connectionId - The unique connection ID
   * @returns The user connection with full details
   * @throws {ContioAPIError} If the connection is not found
   */
  async getUserConnection(connectionId: string): Promise<UserConnection> {
    return connections.getUserConnection(this.http, connectionId);
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
    return connections.revokeUserConnection(this.http, connectionId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Credential Management endpoints
  // ─────────────────────────────────────────────────────────────────────────────

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
    return credentials.getCredentialStatus(this.http);
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
    return credentials.rotateAPIKey(this.http, request);
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
    return credentials.rotateWebhookSecret(this.http, request);
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
    return credentials.rotateClientSecret(this.http, request);
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
    return credentials.rollbackCredential(this.http, credentialType, request);
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
    return credentials.getCredentialHistory(this.http, params);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // IdP Configuration endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create IdP configuration for this partner app.
   *
   * Configures SAML/OIDC identity provider settings for SSO.
   *
   * @param data - IdP configuration including provider type, metadata URL, etc.
   * @returns The created IdP configuration
   * @throws {ContioAPIError} If configuration already exists or validation fails
   *
   * @example
   * ```typescript
   * const config = await admin.createIdPConfig({
   *   provider_type: 'saml',
   *   metadata_url: 'https://idp.example.com/metadata',
   *   entity_id: 'https://idp.example.com'
   * });
   * ```
   */
  async createIdPConfig(data: CreateIdPConfigRequest): Promise<PartnerIdPConfig> {
    return idp.createIdPConfig(this.http, data);
  }

  /**
   * Get the current IdP configuration.
   *
   * @returns The IdP configuration
   * @throws {ContioAPIError} If no IdP configuration exists
   */
  async getIdPConfig(): Promise<PartnerIdPConfig> {
    return idp.getIdPConfig(this.http);
  }

  /**
   * Update the IdP configuration.
   *
   * @param data - Fields to update
   * @returns The updated IdP configuration
   * @throws {ContioAPIError} If no IdP configuration exists or validation fails
   */
  async updateIdPConfig(data: UpdateIdPConfigRequest): Promise<PartnerIdPConfig> {
    return idp.updateIdPConfig(this.http, data);
  }

  /**
   * Delete the IdP configuration.
   *
   * Removes the SAML/OIDC configuration. Users will no longer be able to SSO
   * through this partner's identity provider.
   *
   * @throws {ContioAPIError} If no IdP configuration exists
   */
  async deleteIdPConfig(): Promise<void> {
    return idp.deleteIdPConfig(this.http);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Toolkit endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new toolkit.
   *
   * Toolkits are collections of related entities (templates, next steps, action buttons)
   * that can be installed and uninstalled as a unit.
   *
   * @param data - Toolkit creation data including name, slug, version, and manifest
   * @returns The newly created toolkit
   * @throws {ContioAPIError} If validation fails
   */
  async createToolkit(data: CreateToolkitRequest): Promise<Toolkit> {
    return toolkits.createToolkit(this.http, data);
  }

  /**
   * Get a paginated list of toolkits.
   *
   * @param params - Optional pagination parameters
   * @returns Paginated list of toolkits
   * @throws {ContioAPIError} If the request fails
   */
  async getToolkits(params?: ToolkitListParams): Promise<ToolkitListResponse> {
    return toolkits.getToolkits(this.http, params);
  }

  /**
   * Get a specific toolkit by ID.
   *
   * @param toolkitId - The unique toolkit ID
   * @returns The toolkit with full details including manifest
   * @throws {ContioAPIError} If the toolkit is not found
   */
  async getToolkit(toolkitId: string): Promise<Toolkit> {
    return toolkits.getToolkit(this.http, toolkitId);
  }

  /**
   * Update a toolkit.
   *
   * @param toolkitId - The unique toolkit ID to update
   * @param data - Fields to update (name, description, version, is_active, manifest)
   * @returns The updated toolkit
   * @throws {ContioAPIError} If the toolkit is not found or validation fails
   */
  async updateToolkit(toolkitId: string, data: UpdateToolkitRequest): Promise<Toolkit> {
    return toolkits.updateToolkit(this.http, toolkitId, data);
  }

  /**
   * Delete a toolkit.
   *
   * @param toolkitId - The unique toolkit ID to delete
   * @throws {ContioAPIError} If the toolkit is not found
   */
  async deleteToolkit(toolkitId: string): Promise<void> {
    return toolkits.deleteToolkit(this.http, toolkitId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Toolkit Version endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all versions for a toolkit.
   *
   * @param toolkitId - The unique toolkit ID
   * @returns Array of all versions ordered by version number
   * @throws {ContioAPIError} If the toolkit is not found
   */
  async listToolkitVersions(toolkitId: string): Promise<ToolkitVersion[]> {
    return toolkits.listToolkitVersions(this.http, toolkitId);
  }

  /**
   * Create a new draft version for a toolkit.
   *
   * Only one DRAFT version can exist at a time. Once created, update the draft
   * with {@link updateToolkitVersion} and publish it with {@link publishToolkitVersion}.
   *
   * @param toolkitId - The unique toolkit ID
   * @param data - Version creation data (version_label, manifest, optional changelog)
   * @returns The newly created draft version
   * @throws {ContioAPIError} 409 if a draft version already exists
   */
  async createToolkitVersion(toolkitId: string, data: CreateToolkitVersionRequest): Promise<ToolkitVersion> {
    return toolkits.createToolkitVersion(this.http, toolkitId, data);
  }

  /**
   * Get a specific toolkit version by ID.
   *
   * @param toolkitId - The unique toolkit ID
   * @param versionId - The unique version ID
   * @returns The toolkit version with full details
   * @throws {ContioAPIError} If the version is not found
   */
  async getToolkitVersion(toolkitId: string, versionId: string): Promise<ToolkitVersion> {
    return toolkits.getToolkitVersion(this.http, toolkitId, versionId);
  }

  /**
   * Update a draft toolkit version.
   *
   * Only DRAFT versions can be updated. Use this to revise the manifest, label,
   * or changelog before publishing.
   *
   * @param toolkitId - The unique toolkit ID
   * @param versionId - The unique version ID (must be in DRAFT status)
   * @param data - Fields to update (all optional)
   * @returns The updated draft version
   * @throws {ContioAPIError} 400 if the version is not in DRAFT status
   */
  async updateToolkitVersion(toolkitId: string, versionId: string, data: UpdateToolkitVersionRequest): Promise<ToolkitVersion> {
    return toolkits.updateToolkitVersion(this.http, toolkitId, versionId, data);
  }

  /**
   * Publish a draft toolkit version.
   *
   * Transitions the version from DRAFT to PUBLISHED. Any previously published
   * version is automatically deprecated.
   *
   * @param toolkitId - The unique toolkit ID
   * @param versionId - The unique version ID (must be in DRAFT status)
   * @throws {ContioAPIError} 400 if the version is not in DRAFT status
   */
  async publishToolkitVersion(toolkitId: string, versionId: string): Promise<void> {
    return toolkits.publishToolkitVersion(this.http, toolkitId, versionId);
  }

  /**
   * Republish a deprecated toolkit version.
   *
   * Transitions the version from DEPRECATED back to PUBLISHED. Any currently
   * published version is automatically deprecated.
   *
   * @param toolkitId - The unique toolkit ID
   * @param versionId - The unique version ID (must be in DEPRECATED status)
   * @throws {ContioAPIError} 400 if the version is not in DEPRECATED status
   */
  async republishToolkitVersion(toolkitId: string, versionId: string): Promise<void> {
    return toolkits.republishToolkitVersion(this.http, toolkitId, versionId);
  }

  /**
   * Discard a draft toolkit version.
   *
   * Permanently deletes a DRAFT version. Only draft versions can be discarded.
   * This action is irreversible.
   *
   * @param toolkitId - The unique toolkit ID
   * @param versionId - The unique version ID (must be in DRAFT status)
   * @throws {ContioAPIError} 400 if the version is not in DRAFT status
   */
  async discardToolkitVersion(toolkitId: string, versionId: string): Promise<void> {
    return toolkits.discardToolkitVersion(this.http, toolkitId, versionId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Template endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new template.
   *
   * Templates define reusable meeting structures with associated next steps.
   *
   * @param data - Template creation data
   * @returns The newly created template
   * @throws {ContioAPIError} If validation fails
   */
  async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    return templates.createTemplate(this.http, data);
  }

  /**
   * Get a paginated list of templates.
   *
   * @param params - Optional pagination parameters
   * @returns Paginated list of templates
   * @throws {ContioAPIError} If the request fails
   */
  async getTemplates(params?: TemplateListParams): Promise<TemplateListResponse> {
    return templates.getTemplates(this.http, params);
  }

  /**
   * Get a specific template by ID.
   *
   * @param templateId - The unique template ID
   * @returns The template with full details
   * @throws {ContioAPIError} If the template is not found
   */
  async getTemplate(templateId: string): Promise<Template> {
    return templates.getTemplate(this.http, templateId);
  }

  /**
   * Update a template.
   *
   * @param templateId - The unique template ID to update
   * @param data - Fields to update
   * @returns The updated template
   * @throws {ContioAPIError} If the template is not found or validation fails
   */
  async updateTemplate(templateId: string, data: UpdateTemplateRequest): Promise<Template> {
    return templates.updateTemplate(this.http, templateId, data);
  }

  /**
   * Delete a template.
   *
   * @param templateId - The unique template ID to delete
   * @throws {ContioAPIError} If the template is not found
   */
  async deleteTemplate(templateId: string): Promise<void> {
    return templates.deleteTemplate(this.http, templateId);
  }

  /**
   * Get next steps associated with a template.
   *
   * @param templateId - The unique template ID
   * @param params - Optional pagination parameters
   * @returns Paginated list of template next steps
   * @throws {ContioAPIError} If the template is not found
   */
  async getTemplateNextSteps(
    templateId: string,
    params?: TemplateNextStepListParams,
  ): Promise<TemplateNextStepListResponse> {
    return templates.getTemplateNextSteps(this.http, templateId, params);
  }

  /**
   * Add a next step to a template.
   *
   * @param templateId - The unique template ID
   * @param data - Next step association data
   * @returns The template next step association
   * @throws {ContioAPIError} If the template or next step is not found
   */
  async addTemplateNextStep(
    templateId: string,
    data: AddTemplateNextStepRequest,
  ): Promise<TemplateNextStep> {
    return templates.addTemplateNextStep(this.http, templateId, data);
  }

  /**
   * Update a template next step association.
   *
   * @param templateId - The unique template ID
   * @param nextStepId - The unique next step ID
   * @param data - Fields to update (autopilot setting)
   * @returns The updated template next step association
   * @throws {ContioAPIError} If the association is not found
   */
  async updateTemplateNextStep(
    templateId: string,
    nextStepId: string,
    data: UpdateTemplateNextStepRequest,
  ): Promise<TemplateNextStep> {
    return templates.updateTemplateNextStep(this.http, templateId, nextStepId, data);
  }

  /**
   * Remove a next step from a template.
   *
   * @param templateId - The unique template ID
   * @param nextStepId - The unique next step ID to remove
   * @throws {ContioAPIError} If the association is not found
   */
  async removeTemplateNextStep(templateId: string, nextStepId: string): Promise<void> {
    return templates.removeTemplateNextStep(this.http, templateId, nextStepId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Toolkit Export endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Export a portable manifest from selected entity IDs (assembly-mode).
   *
   * Builds a portable toolkit manifest from the given entity IDs. Dependencies
   * (e.g. action buttons referenced by next steps) are auto-discovered.
   *
   * @param data - Export request with entity IDs (at least one array must be non-empty)
   * @returns The portable manifest with metadata, summary, and optional warnings
   * @throws {ContioAPIError} If no entities are specified or entities are not found
   *
   * @example
   * ```typescript
   * const exported = await admin.exportEntities({
   *   template_ids: ['template-uuid'],
   *   name: 'My Exported Bundle',
   * });
   * console.log(exported.manifest);
   * ```
   */
  async exportEntities(data: ExportEntitiesRequest): Promise<ExportResponse> {
    return toolkits.exportEntities(this.http, data);
  }

  /**
   * Export an existing toolkit as a portable manifest.
   *
   * Resolves the toolkit's manifest into a portable format with `$id`/`$ref`
   * identifiers, suitable for re-import into a different toolkit.
   *
   * @param toolkitId - The unique toolkit ID
   * @returns The portable manifest with metadata, summary, and optional warnings
   * @throws {ContioAPIError} If the toolkit is not found
   *
   * @example
   * ```typescript
   * const exported = await admin.exportToolkit('toolkit-uuid');
   *
   * // Re-import into a new toolkit
   * const newToolkit = await admin.createToolkit({
   *   name: 'Cloned Toolkit',
   *   slug: 'cloned-toolkit',
   *   version: '1.0.0',
   *   manifest: exported.manifest,
   * });
   * ```
   */
  async exportToolkit(toolkitId: string): Promise<ExportResponse> {
    return toolkits.exportToolkit(this.http, toolkitId);
  }
}