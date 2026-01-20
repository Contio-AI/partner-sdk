/**
 * Workflow-related type definitions for the Contio Partner API
 */

/**
 * Configuration for phrase-based matching action
 */
export interface PhraseMatchConfig {
  phrases: string[];
}

/**
 * Workflow action definition
 *
 * Currently supported action types:
 * - `phrase_match`: Matches action items based on phrase matching
 */
export interface WorkflowAction {
  type: string;
  config?: Record<string, unknown>;
}

/**
 * Type-safe phrase match action
 */
export interface PhraseMatchAction {
  type: 'phrase_match';
  config: PhraseMatchConfig;
}

/**
 * Workflow definition
 *
 * Workflows enable automatic action item assignment based on phrase matching.
 * When an action item from a meeting matches the workflow's phrases, a workflow
 * assignment is created and a webhook is sent to the partner app.
 */
export interface Workflow {
  id: string;
  partner_app_id: string;
  name: string;
  description?: string;
  /** Currently only 'action_item_match' is supported */
  trigger_type: string;
  /** Array of workflow actions (currently supports phrase_match type) */
  actions: WorkflowAction[];
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
}

export type WorkflowStatus = 'active' | 'inactive';

/**
 * Request to create a new workflow
 *
 * Example:
 * ```typescript
 * const workflow = await adminClient.createWorkflow({
 *   name: 'Create CRM Contact',
 *   description: 'Create contacts from meeting action items',
 *   trigger_type: 'action_item_match',
 *   actions: [
 *     {
 *       type: 'phrase_match',
 *       config: {
 *         phrases: ['create contact', 'add contact', 'new contact']
 *       }
 *     }
 *   ]
 * });
 * ```
 */
export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  /** Use 'action_item_match' for phrase-based matching */
  trigger_type: string;
  /** Array of workflow actions */
  actions: WorkflowAction[];
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  trigger_type?: string;
  actions?: WorkflowAction[];
  status?: WorkflowStatus;
  is_active?: boolean;
}

export interface WorkflowListParams {
  limit?: number;
  offset?: number;
}

export interface WorkflowListResponse {
  items: Workflow[];
  total: number;
  limit: number;
  offset: number;
}

export interface WebhookDelivery {
  id: string;
  partner_app_id: string;
  event_type: string;
  event_id: string;
  delivery_status: string;
  http_status_code?: number;
  retry_count: number;
  next_retry_at?: string;
  delivered_at?: string;
  error_message: string;
  created_at: string;
}

export interface WebhookDeliveryListParams {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface WebhookDeliveryListResponse {
  deliveries: WebhookDelivery[];
  total: number;
  limit: number;
  offset: number;
}

export interface PartnerApp {
  id: string;
  name: string;
  description?: string;
  company_name: string;
  client_id: string;
  primary_contact_email: string;
  webhook_url?: string;
  status: string;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdatePartnerAppRequest {
  name?: string;
  description?: string;
  webhook_url?: string | null;
  slug?: string;
}

export interface UpdatePartnerAppStatusRequest {
  status: 'active' | 'suspended' | 'inactive';
}

export interface UserConnection {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  oauth_scopes: string[];
  oauth_expires_at?: string;
  feature_activated_at?: string;
  last_used_at?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserConnectionListParams {
  limit?: number;
  offset?: number;
  user_id?: string;
  status?: 'active' | 'revoked' | 'expired';
}

export interface UserConnectionListResponse {
  items: UserConnection[];
  total: number;
  limit: number;
  offset: number;
}
