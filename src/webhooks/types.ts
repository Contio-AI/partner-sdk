/**
 * Webhook event types and payload interfaces for Contio Partner API
 *
 * Webhooks provide timely signals when partner-relevant activities occur.
 * Payloads are intentionally minimal - use the Partner User API to fetch
 * full details when needed.
 */

// User context for webhooks (CON-2165)
// Identifies which user the event is being delivered for
export interface WebhookUserContext {
  id: string;
  email: string;
}

// Base webhook payload structure - all events follow this pattern
export interface WebhookPayload<T = unknown> {
  event_type: string;
  event_id: string;
  timestamp: string;
  partner_app_id: string;
  for_user?: WebhookUserContext;
  data: T;
}

// Minimal user reference for webhooks
export interface PartnerUser {
  user_id: string;
  user_email: string;
}

// Minimal meeting reference for webhooks
export interface PartnerMeetingSummary {
  meeting_id: string;
  title: string;
}

// Workflow assignment data - includes meeting context
export interface WorkflowAssignmentData {
  assignment_id: string;
  action_item_id: string;
  workflow_id: string;
  workflow_name: string;
  confidence_score?: number;
  workflow_data_payload?: Record<string, unknown>;
  status: string;
  meeting?: PartnerMeetingSummary;
  created_at: string;
}

// Action item update data - minimal, just IDs and key state
// Use Partner User API to fetch full action item details
export interface ActionItemUpdatedData {
  action_item_id: string;
  meeting_id: string;
  status: 'needs_review' | 'accepted' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  is_completed: boolean;
  updated_at: string;
}

// User connection revoked data - signals user disconnection
export interface UserConnectionRevokedData {
  connection_id: string;
  user: PartnerUser;
  revoked_at: string;
}

// Meeting completed data - signals meeting notes are ready
export interface MeetingCompletedData {
  meeting_id: string;
  workspace_id: string;
  title: string;
  completed_at: string;
}

// Meeting created data - signals a new meeting was created (CON-2165)
export interface MeetingCreatedData {
  meeting_id: string;
  workspace_id: string;
  title: string;
  created_by_user_id: string;
  created_at: string;
}

// Action item created data - signals a new action item was created (CON-2165)
export interface ActionItemCreatedData {
  action_item_id: string;
  meeting_id: string;
  title: string;
  assignee_id?: string;
  created_at: string;
}

// Action item completed data - signals an action item was completed (CON-2165)
export interface ActionItemCompletedData {
  action_item_id: string;
  meeting_id: string;
  completed_at: string;
  completed_by_user_id: string;
  assignee_id: string;
}

// Specific webhook event types
export interface WorkflowAssignmentCreatedWebhook
  extends WebhookPayload<{ assignment: WorkflowAssignmentData }> {
  event_type: 'workflow.assignment.created';
}

export interface ActionItemUpdatedWebhook
  extends WebhookPayload<{ action_item: ActionItemUpdatedData }> {
  event_type: 'action_item.updated';
}

export interface UserConnectionRevokedWebhook
  extends WebhookPayload<{ connection: UserConnectionRevokedData }> {
  event_type: 'user.connection.revoked';
}

export interface MeetingCompletedWebhook
  extends WebhookPayload<{ meeting: MeetingCompletedData }> {
  event_type: 'meeting.completed';
}

// New webhook event types (CON-2165)
export interface MeetingCreatedWebhook extends WebhookPayload<MeetingCreatedData> {
  event_type: 'meeting.created';
}

export interface ActionItemCreatedWebhook extends WebhookPayload<ActionItemCreatedData> {
  event_type: 'action_item.created';
}

export interface ActionItemCompletedWebhook extends WebhookPayload<ActionItemCompletedData> {
  event_type: 'action_item.completed';
}

// Union type for all webhook events
export type ContioWebhookEvent =
  | WorkflowAssignmentCreatedWebhook
  | ActionItemUpdatedWebhook
  | UserConnectionRevokedWebhook
  | MeetingCompletedWebhook
  | MeetingCreatedWebhook
  | ActionItemCreatedWebhook
  | ActionItemCompletedWebhook;

// Webhook event type constants
export const WEBHOOK_EVENTS = {
  WORKFLOW_ASSIGNMENT_CREATED: 'workflow.assignment.created',
  ACTION_ITEM_UPDATED: 'action_item.updated',
  USER_CONNECTION_REVOKED: 'user.connection.revoked',
  MEETING_COMPLETED: 'meeting.completed',
  MEETING_CREATED: 'meeting.created',
  ACTION_ITEM_CREATED: 'action_item.created',
  ACTION_ITEM_COMPLETED: 'action_item.completed',
} as const;

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[keyof typeof WEBHOOK_EVENTS];

// Webhook verification result
export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
}

// Webhook handler function type
export type WebhookHandler<T extends ContioWebhookEvent = ContioWebhookEvent> = (
  event: T
) => Promise<void> | void;
