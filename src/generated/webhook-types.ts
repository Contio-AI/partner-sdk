/**
 * Webhook event types generated from AsyncAPI spec
 *
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT
 *
 * Source: specs/asyncapi/webhooks.yaml
 * Spec version: 1.5.0
 * Generated: 2026-04-16T18:20:25.284Z
 *
 * Regenerate: npm run gen-webhook-types
 */

export interface ActionButtonTriggeredPayload {
  'data': ActionButtonTriggeredData;
  'event_id': string;
  'event_type': 'action_button.triggered';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ActionButtonTriggeredData {
  'action_button_id': string;
  'action_button_name': string;
  'meeting_id': string;
  'next_step_id'?: string | null;
  'result_id'?: string | null;
  'trigger_mode': string;
  'triggered_at': string;
  'triggered_by': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface WebhookUserContext {
  'email': string;
  'id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ActionItemCompletedPayload {
  'data': ActionItemCompletedData;
  'event_id': string;
  'event_type': 'action_item.completed';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ActionItemCompletedData {
  'action_item_id': string;
  'assignee_id'?: string | null;
  'completed_at': string;
  'completed_by_user_id': string;
  'meeting_id': string;
  'title': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ActionItemCreatedPayload {
  'data': ActionItemCreatedData;
  'event_id': string;
  'event_type': 'action_item.created';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ActionItemCreatedData {
  'action_item_id': string;
  'assignee_id'?: string | null;
  'created_at': string;
  'meeting_id': string;
  'title': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ActionItemUpdatedPayload {
  'data': ActionItemUpdatedData;
  'event_id': string;
  'event_type': 'action_item.updated';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ActionItemUpdatedData {
  'action_item_id': string;
  'assignee_id'?: string | null;
  'is_completed': boolean;
  'meeting_id': string;
  'status': ActionItemStatus;
  'updated_at': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export type ActionItemStatus = "needs_review" | "accepted" | "in_progress" | "completed" | "cancelled" | "blocked";

export interface AgendaItemCreatedPayload {
  'data': AgendaItemCreatedData;
  'event_id': string;
  'event_type': 'agenda_item.created';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AgendaItemCreatedData {
  'agenda_item_id': string;
  'created_at': string;
  'item_type': string;
  'meeting_id'?: string | null;
  'title': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AgendaItemDeletedPayload {
  'data': AgendaItemDeletedData;
  'event_id': string;
  'event_type': 'agenda_item.deleted';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AgendaItemDeletedData {
  'agenda_item_id': string;
  'deleted_at': string;
  'meeting_id'?: string | null;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AgendaItemUpdatedPayload {
  'data': AgendaItemUpdatedData;
  'event_id': string;
  'event_type': 'agenda_item.updated';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AgendaItemUpdatedData {
  'agenda_item_id': string;
  'item_type': string;
  'meeting_id'?: string | null;
  'status': string;
  'title': string;
  'updated_at': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AutomationAssignmentCreatedPayload {
  'data': AutomationAssignmentCreatedData;
  'event_id': string;
  'event_type': 'automation.assignment.created';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AutomationAssignmentCreatedData {
  'action_item_id': string;
  'assignment_id': string;
  'automation_data_payload'?: Record<string, unknown>;
  'automation_id': string;
  'automation_name': string;
  'confidence_score'?: number;
  'created_at': string;
  'meeting_id': string;
  'status': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface CalendarEventCreatedPayload {
  'data': CalendarEventCreatedData;
  'event_id': string;
  'event_type': 'calendar_event.created';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface CalendarEventCreatedData {
  'attendee_count': number;
  'calendar_event_id': string;
  'end_time': string;
  'is_all_day': boolean;
  'start_time': string;
  'title': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface CalendarEventDeletedPayload {
  'data': CalendarEventDeletedData;
  'event_id': string;
  'event_type': 'calendar_event.deleted';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface CalendarEventDeletedData {
  'calendar_event_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface CalendarEventUpdatedPayload {
  'data': CalendarEventUpdatedData;
  'event_id': string;
  'event_type': 'calendar_event.updated';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface CalendarEventUpdatedData {
  'attendee_count': number;
  'calendar_event_id': string;
  'end_time': string;
  'is_all_day': boolean;
  'start_time': string;
  'title': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingCompletedPayload {
  'data': MeetingCompletedData;
  'event_id': string;
  'event_type': 'meeting.completed';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingCompletedData {
  'completed_at': string;
  'meeting_id': string;
  'title': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingContextCreatedPayload {
  'data': MeetingContextCreatedData;
  'event_id': string;
  'event_type': 'meeting.context.created';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingContextCreatedData {
  'context_id': string;
  'created_at': string;
  'meeting_id': string;
  'title'?: string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingContextDeletedPayload {
  'data': MeetingContextDeletedData;
  'event_id': string;
  'event_type': 'meeting.context.deleted';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingContextDeletedData {
  'context_id': string;
  'deleted_at': string;
  'meeting_id': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingContextProcessedPayload {
  'data': MeetingContextProcessedData;
  'event_id': string;
  'event_type': 'meeting.context.processed';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingContextProcessedData {
  'context_id': string;
  'meeting_id': string;
  'processed_at': string;
  'sanitization_report': AnonymousSchema_117;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AnonymousSchema_117 {
  'formula_escaped': boolean;
  'pii_detected': boolean;
  'redactions'?: AnonymousSchema_121[];
  'secrets_detected': boolean;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AnonymousSchema_121 {
  'count': number;
  'type': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingCreatedPayload {
  'data': MeetingCreatedData;
  'event_id': string;
  'event_type': 'meeting.created';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingCreatedData {
  'created_at': string;
  'created_by_user_id': string;
  'meeting_id': string;
  'title': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingUpdatedPayload {
  'data': MeetingUpdatedData;
  'event_id': string;
  'event_type': 'meeting.updated';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingUpdatedData {
  'meeting_id': string;
  'scheduled_start'?: string | null;
  'title': string;
  'updated_at': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingTemplateAppliedPayload {
  'data': MeetingTemplateAppliedData;
  'event_id': string;
  'event_type': 'meeting_template.applied';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface MeetingTemplateAppliedData {
  'applied_at': string;
  'applied_by_user_id': string;
  'applied_items': AnonymousSchema_144;
  'meeting_id': string;
  'template_id': string;
  'template_name': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface AnonymousSchema_144 {
  'agenda_items': number;
  'documents': number;
  'participants': number;
  'additionalProperties'?: Record<string, unknown>;
}

export interface NextStepCompletedPayload {
  'data': NextStepCompletedData;
  'event_id': string;
  'event_type': 'next_step.completed';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface NextStepCompletedData {
  'executed_at': string;
  'executed_by': string;
  'execution_mode': string;
  'meeting_id': string;
  'next_step_id': string;
  'next_step_name': string;
  'result_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ParticipantAddedPayload {
  'data': ParticipantAddedData;
  'event_id': string;
  'event_type': 'participant.added';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ParticipantAddedData {
  'added_at': string;
  'meeting_id': string;
  'participants': ParticipantInfo[];
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ParticipantInfo {
  'guest_email'?: string | null;
  'participant_id': string;
  'role': string;
  'user_id'?: string | null;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ParticipantRemovedPayload {
  'data': ParticipantRemovedData;
  'event_id': string;
  'event_type': 'participant.removed';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface ParticipantRemovedData {
  'guest_email'?: string | null;
  'meeting_id': string;
  'participant_id': string;
  'removed_at': string;
  'user_id'?: string | null;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface SessionExpiredPayload {
  'data': SessionExpiredData;
  'event_id': string;
  'event_type': 'session.expired';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface SessionExpiredData {
  'expired_at': string;
  'last_activity_at': string;
  'meeting_id'?: string | null;
  'session_id': string;
  'turn_count': number;
  'additionalProperties'?: Record<string, unknown>;
}

export interface SessionTurnCompletedPayload {
  'data': SessionTurnCompletedData;
  'event_id': string;
  'event_type': 'session.turn.completed';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface SessionTurnCompletedData {
  'completed_at': string;
  'meeting_id'?: string | null;
  'sequence_number': number;
  'session_id': string;
  'turn_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface SessionTurnFailedPayload {
  'data': SessionTurnFailedData;
  'event_id': string;
  'event_type': 'session.turn.failed';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface SessionTurnFailedData {
  'error_code': string;
  'error_message': string;
  'failed_at': string;
  'meeting_id'?: string | null;
  'sequence_number': number;
  'session_id': string;
  'turn_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface UserConnectionRevokedPayload {
  'data': UserConnectionRevokedData;
  'event_id': string;
  'event_type': 'user.connection.revoked';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface UserConnectionRevokedData {
  'connection_id': string;
  'revoked_at': string;
  'additionalProperties'?: Record<string, unknown>;
}

/**
 * All webhook event type names
 */
export const WEBHOOK_EVENT_TYPES = [
  'action_button.triggered',
  'action_item.completed',
  'action_item.created',
  'action_item.updated',
  'agenda_item.created',
  'agenda_item.deleted',
  'agenda_item.updated',
  'automation.assignment.created',
  'calendar_event.created',
  'calendar_event.deleted',
  'calendar_event.updated',
  'meeting.completed',
  'meeting.context.created',
  'meeting.context.deleted',
  'meeting.context.processed',
  'meeting.created',
  'meeting.updated',
  'meeting_template.applied',
  'next_step.completed',
  'participant.added',
  'participant.removed',
  'session.expired',
  'session.turn.completed',
  'session.turn.failed',
  'user.connection.revoked',
] as const;

export type WebhookEventType = typeof WEBHOOK_EVENT_TYPES[number];
