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
export type {
  // Payload types (full webhook envelope)
  ActionButtonTriggeredPayload,
  ActionItemCompletedPayload,
  ActionItemCreatedPayload,
  ActionItemUpdatedPayload,
  AgendaItemCreatedPayload,
  AgendaItemDeletedPayload,
  AgendaItemUpdatedPayload,
  CalendarEventCreatedPayload,
  CalendarEventDeletedPayload,
  CalendarEventUpdatedPayload,
  MeetingCompletedPayload,
  MeetingContextCreatedPayload,
  MeetingContextDeletedPayload,
  MeetingContextProcessedPayload,
  MeetingCreatedPayload,
  MeetingTemplateAppliedPayload,
  MeetingUpdatedPayload,
  NextStepCompletedPayload,
  ParticipantAddedPayload,
  ParticipantRemovedPayload,
  SessionExpiredPayload,
  SessionTurnCompletedPayload,
  SessionTurnFailedPayload,
  UserConnectionRevokedPayload,
  AutomationAssignmentCreatedPayload,
  // Data types (event-specific data)
  ActionButtonTriggeredData,
  ActionItemCompletedData,
  ActionItemCreatedData,
  ActionItemUpdatedData,
  AgendaItemCreatedData,
  AgendaItemDeletedData,
  AgendaItemUpdatedData,
  CalendarEventCreatedData,
  CalendarEventDeletedData,
  CalendarEventUpdatedData,
  MeetingCompletedData,
  MeetingContextCreatedData,
  MeetingContextDeletedData,
  MeetingContextProcessedData,
  MeetingCreatedData,
  MeetingTemplateAppliedData,
  MeetingUpdatedData,
  NextStepCompletedData,
  ParticipantAddedData,
  ParticipantRemovedData,
  SessionExpiredData,
  SessionTurnCompletedData,
  SessionTurnFailedData,
  UserConnectionRevokedData,
  AutomationAssignmentCreatedData,
  // Shared types
  WebhookUserContext,
  ParticipantInfo,
  // Event type union
  WebhookEventType,
} from '../generated/webhook-types';

// Re-export value constants
export { WEBHOOK_EVENT_TYPES } from '../generated/webhook-types';

import type {
  ActionButtonTriggeredPayload,
  ActionItemCompletedPayload,
  ActionItemCreatedPayload,
  ActionItemUpdatedPayload,
  AgendaItemCreatedPayload,
  AgendaItemDeletedPayload,
  AgendaItemUpdatedPayload,
  CalendarEventCreatedPayload,
  CalendarEventDeletedPayload,
  CalendarEventUpdatedPayload,
  MeetingCompletedPayload,
  MeetingContextCreatedPayload,
  MeetingContextDeletedPayload,
  MeetingContextProcessedPayload,
  MeetingCreatedPayload,
  MeetingTemplateAppliedPayload,
  MeetingUpdatedPayload,
  NextStepCompletedPayload,
  ParticipantAddedPayload,
  ParticipantRemovedPayload,
  SessionExpiredPayload,
  SessionTurnCompletedPayload,
  SessionTurnFailedPayload,
  UserConnectionRevokedPayload,
  AutomationAssignmentCreatedPayload,
} from '../generated/webhook-types';

/**
 * Union type for all webhook events
 */
export type ContioWebhookEvent =
  | ActionButtonTriggeredPayload
  | ActionItemCompletedPayload
  | ActionItemCreatedPayload
  | ActionItemUpdatedPayload
  | AgendaItemCreatedPayload
  | AgendaItemDeletedPayload
  | AgendaItemUpdatedPayload
  | CalendarEventCreatedPayload
  | CalendarEventDeletedPayload
  | CalendarEventUpdatedPayload
  | MeetingCompletedPayload
  | MeetingContextCreatedPayload
  | MeetingContextDeletedPayload
  | MeetingContextProcessedPayload
  | MeetingCreatedPayload
  | MeetingTemplateAppliedPayload
  | MeetingUpdatedPayload
  | NextStepCompletedPayload
  | ParticipantAddedPayload
  | ParticipantRemovedPayload
  | SessionExpiredPayload
  | SessionTurnCompletedPayload
  | SessionTurnFailedPayload
  | UserConnectionRevokedPayload
  | AutomationAssignmentCreatedPayload;

/**
 * Webhook event type constants (object form for backward compatibility)
 * @deprecated Use WEBHOOK_EVENT_TYPES array instead
 */
export const WEBHOOK_EVENTS = {
  ACTION_BUTTON_TRIGGERED: 'action_button.triggered',
  ACTION_ITEM_COMPLETED: 'action_item.completed',
  ACTION_ITEM_CREATED: 'action_item.created',
  ACTION_ITEM_UPDATED: 'action_item.updated',
  AGENDA_ITEM_CREATED: 'agenda_item.created',
  AGENDA_ITEM_DELETED: 'agenda_item.deleted',
  AGENDA_ITEM_UPDATED: 'agenda_item.updated',
  CALENDAR_EVENT_CREATED: 'calendar_event.created',
  CALENDAR_EVENT_DELETED: 'calendar_event.deleted',
  CALENDAR_EVENT_UPDATED: 'calendar_event.updated',
  MEETING_COMPLETED: 'meeting.completed',
  MEETING_CONTEXT_CREATED: 'meeting.context.created',
  MEETING_CONTEXT_DELETED: 'meeting.context.deleted',
  MEETING_CONTEXT_PROCESSED: 'meeting.context.processed',
  MEETING_CREATED: 'meeting.created',
  MEETING_UPDATED: 'meeting.updated',
  MEETING_TEMPLATE_APPLIED: 'meeting_template.applied',
  NEXT_STEP_COMPLETED: 'next_step.completed',
  PARTICIPANT_ADDED: 'participant.added',
  PARTICIPANT_REMOVED: 'participant.removed',
  SESSION_EXPIRED: 'session.expired',
  SESSION_TURN_COMPLETED: 'session.turn.completed',
  SESSION_TURN_FAILED: 'session.turn.failed',
  USER_CONNECTION_REVOKED: 'user.connection.revoked',
  WORKFLOW_ASSIGNMENT_CREATED: 'workflow.assignment.created',
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
 * @deprecated Use AutomationAssignmentCreatedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.assignment.X
 */
export type AutomationAssignmentCreatedWebhook = AutomationAssignmentCreatedPayload;

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
