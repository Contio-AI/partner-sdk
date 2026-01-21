/**
 * Webhook event types and payload interfaces for Contio Partner API
 *
 * Types are generated from the AsyncAPI specification.
 * See: specs/asyncapi/webhooks.yaml
 *
 * Webhooks provide timely signals when partner-relevant activities occur.
 * Payloads are intentionally minimal - use the Partner User API to fetch
 * full details when needed.
 */

// Re-export all generated types from AsyncAPI spec
export {
  // Payload types (full webhook envelope)
  ActionItemCompletedPayload,
  ActionItemCreatedPayload,
  ActionItemUpdatedPayload,
  MeetingCompletedPayload,
  MeetingCreatedPayload,
  ParticipantAddedPayload,
  ParticipantRemovedPayload,
  UserConnectionRevokedPayload,
  WorkflowAssignmentCreatedPayload,
  // Data types (event-specific data)
  ActionItemCompletedData,
  ActionItemCreatedData,
  ActionItemUpdatedData,
  MeetingCompletedData,
  MeetingCreatedData,
  ParticipantAddedData,
  ParticipantRemovedData,
  ParticipantInfo,
  UserConnectionRevokedData,
  WorkflowAssignmentCreatedData,
  // Shared types
  WebhookUserContext,
  // Event type constants
  WEBHOOK_EVENT_TYPES,
  WebhookEventType,
} from '../generated/webhook-types';

import type {
  ActionItemCompletedPayload,
  ActionItemCreatedPayload,
  ActionItemUpdatedPayload,
  MeetingCompletedPayload,
  MeetingCreatedPayload,
  ParticipantAddedPayload,
  ParticipantRemovedPayload,
  UserConnectionRevokedPayload,
  WorkflowAssignmentCreatedPayload,
} from '../generated/webhook-types';

/**
 * Union type for all webhook events
 */
export type ContioWebhookEvent =
  | ActionItemCompletedPayload
  | ActionItemCreatedPayload
  | ActionItemUpdatedPayload
  | MeetingCompletedPayload
  | MeetingCreatedPayload
  | ParticipantAddedPayload
  | ParticipantRemovedPayload
  | UserConnectionRevokedPayload
  | WorkflowAssignmentCreatedPayload;

/**
 * Webhook event type constants (object form for backward compatibility)
 * @deprecated Use WEBHOOK_EVENT_TYPES array instead
 */
export const WEBHOOK_EVENTS = {
  WORKFLOW_ASSIGNMENT_CREATED: 'workflow.assignment.created',
  ACTION_ITEM_UPDATED: 'action_item.updated',
  ACTION_ITEM_CREATED: 'action_item.created',
  ACTION_ITEM_COMPLETED: 'action_item.completed',
  USER_CONNECTION_REVOKED: 'user.connection.revoked',
  MEETING_COMPLETED: 'meeting.completed',
  MEETING_CREATED: 'meeting.created',
  PARTICIPANT_ADDED: 'participant.added',
  PARTICIPANT_REMOVED: 'participant.removed',
} as const;

/**
 * Webhook verification result
 */
export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Webhook handler function type
 */
export type WebhookHandler<T extends ContioWebhookEvent = ContioWebhookEvent> = (
  event: T
) => Promise<void> | void;
