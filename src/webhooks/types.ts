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
  AgendaItemCreatedPayload,
  AgendaItemUpdatedPayload,
  AgendaItemDeletedPayload,
  CalendarEventCreatedPayload,
  CalendarEventUpdatedPayload,
  CalendarEventDeletedPayload,
  MeetingCompletedPayload,
  MeetingCreatedPayload,
  MeetingUpdatedPayload,
  ParticipantAddedPayload,
  ParticipantRemovedPayload,
  UserConnectionRevokedPayload,
  WorkflowAssignmentCreatedPayload,
  // Data types (event-specific data)
  ActionItemCompletedData,
  ActionItemCreatedData,
  ActionItemUpdatedData,
  AgendaItemCreatedData,
  AgendaItemUpdatedData,
  AgendaItemDeletedData,
  CalendarEventCreatedData,
  CalendarEventUpdatedData,
  CalendarEventDeletedData,
  MeetingCompletedData,
  MeetingCreatedData,
  MeetingUpdatedData,
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
  AgendaItemCreatedPayload,
  AgendaItemUpdatedPayload,
  AgendaItemDeletedPayload,
  CalendarEventCreatedPayload,
  CalendarEventUpdatedPayload,
  CalendarEventDeletedPayload,
  MeetingCompletedPayload,
  MeetingCreatedPayload,
  MeetingUpdatedPayload,
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
  | AgendaItemCreatedPayload
  | AgendaItemUpdatedPayload
  | AgendaItemDeletedPayload
  | CalendarEventCreatedPayload
  | CalendarEventUpdatedPayload
  | CalendarEventDeletedPayload
  | MeetingCompletedPayload
  | MeetingCreatedPayload
  | MeetingUpdatedPayload
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
  AGENDA_ITEM_CREATED: 'agenda_item.created',
  AGENDA_ITEM_UPDATED: 'agenda_item.updated',
  AGENDA_ITEM_DELETED: 'agenda_item.deleted',
  CALENDAR_EVENT_CREATED: 'calendar_event.created',
  CALENDAR_EVENT_UPDATED: 'calendar_event.updated',
  CALENDAR_EVENT_DELETED: 'calendar_event.deleted',
  USER_CONNECTION_REVOKED: 'user.connection.revoked',
  MEETING_COMPLETED: 'meeting.completed',
  MEETING_CREATED: 'meeting.created',
  MEETING_UPDATED: 'meeting.updated',
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

// =============================================================================
// Deprecated type aliases for backward compatibility
// These will be removed in the next major version
// =============================================================================

/**
 * @deprecated Use WorkflowAssignmentCreatedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.assignment.X
 */
export type WorkflowAssignmentCreatedWebhook = WorkflowAssignmentCreatedPayload;

/**
 * @deprecated Use ActionItemUpdatedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.action_item.X
 */
export type ActionItemUpdatedWebhook = ActionItemUpdatedPayload;

/**
 * @deprecated Use UserConnectionRevokedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.connection.X
 */
export type UserConnectionRevokedWebhook = UserConnectionRevokedPayload;

/**
 * @deprecated Use MeetingCompletedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.meeting.X
 */
export type MeetingCompletedWebhook = MeetingCompletedPayload;

/**
 * @deprecated Use MeetingCreatedPayload instead.
 */
export type MeetingCreatedWebhook = MeetingCreatedPayload;

/**
 * @deprecated Use ActionItemCreatedPayload instead.
 */
export type ActionItemCreatedWebhook = ActionItemCreatedPayload;

/**
 * @deprecated Use ActionItemCompletedPayload instead.
 */
export type ActionItemCompletedWebhook = ActionItemCompletedPayload;
