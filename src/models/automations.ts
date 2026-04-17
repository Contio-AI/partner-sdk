/**
 * Automation-related type definitions for the Contio Partner API
 */

import { ErrorResponse } from './auth';

/**
 * Configuration for phrase-based matching action
 */
export interface PhraseMatchConfig {
  phrases: string[];
}

/**
 * Automation action definition
 *
 * Currently supported action types:
 * - `phrase_match`: Matches action items based on phrase matching
 */
export interface AutomationAction {
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
 * Automation definition
 *
 * Automations enable automatic action item assignment based on phrase matching.
 * When an action item from a meeting matches the automation's phrases, a automation
 * assignment is created and a webhook is sent to the partner app.
 */
export interface Automation {
  id: string;
  partner_app_id: string;
  name: string;
  description?: string;
  /** Currently only 'action_item_match' is supported */
  trigger_type: string;
  /** Array of automation actions (currently supports phrase_match type) */
  actions: AutomationAction[];
  status: AutomationStatus;
  created_at: string;
  updated_at: string;
}

export type AutomationStatus = 'active' | 'inactive';

/**
 * Request to create a new automation
 *
 * Example:
 * ```typescript
 * const automation = await adminClient.createAutomation({
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
export interface CreateAutomationRequest {
  name: string;
  description?: string;
  /** Use 'action_item_match' for phrase-based matching */
  trigger_type: string;
  /** Array of automation actions */
  actions: AutomationAction[];
}

export interface UpdateAutomationRequest {
  name?: string;
  description?: string;
  trigger_type?: string;
  actions?: AutomationAction[];
  status?: AutomationStatus;
  is_active?: boolean;
}

export interface AutomationListParams {
  limit?: number;
  offset?: number;
}

export interface AutomationListResponse {
  items: Automation[];
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
  /** Filter by delivery status (pending, delivered, failed, abandoned) */
  status?: string;
  /** Filter by event type (e.g., meeting.created, automation.assignment.created) */
  event_type?: string;
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
  webhook_enabled: boolean;
  webhook_filter?: { type: string; events: string[] } | null;
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

export interface UpdateWebhookStatusRequest {
  enabled: boolean;
  pending_disposition?: 'abandon' | 'deliver';
}

export interface SetWebhookFilterRequest {
  type: 'include' | 'exclude';
  events: string[];
}

export interface SetWebhookFilterError extends ErrorResponse {
  valid_event_types?: string[];
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
