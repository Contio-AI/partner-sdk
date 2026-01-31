/**
 * Webhook event types generated from AsyncAPI spec
 *
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT
 *
 * Source: specs/asyncapi/webhooks.yaml
 * Spec version: 1.4.0
 * Generated: 2026-01-31T06:55:58.504Z
 *
 * Regenerate: npm run gen-webhook-types
 */

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
  'assignee_id': string;
  'completed_at': string;
  'completed_by_user_id': string;
  'meeting_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface WebhookUserContext {
  'email': string;
  'id': string;
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
  'assignee_id'?: string;
  'created_at': string;
  'meeting_id': string;
  'title': string;
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
  'meeting_id'?: string;
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
  'meeting_id'?: string;
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
  'meeting_id'?: string;
  'status': string;
  'title': string;
  'updated_at': string;
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
  'scheduled_start'?: string;
  'title': string;
  'updated_at': string;
  'workspace_id': string;
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
  'additionalProperties'?: Record<string, unknown>;
}

export interface ParticipantInfo {
  'guest_email'?: string;
  'participant_id': string;
  'role': string;
  'user_id'?: string;
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
  'guest_email'?: string;
  'meeting_id': string;
  'participant_id': string;
  'removed_at': string;
  'user_id'?: string;
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

export interface WorkflowAssignmentCreatedPayload {
  'data': WorkflowAssignmentCreatedData;
  'event_id': string;
  'event_type': 'workflow.assignment.created';
  'for_user'?: WebhookUserContext;
  'partner_app_id': string;
  'timestamp': string;
  'additionalProperties'?: Record<string, unknown>;
}

export interface WorkflowAssignmentCreatedData {
  'action_item_id': string;
  'assignment_id': string;
  'confidence_score'?: number;
  'created_at': string;
  'meeting_id': string;
  'status': string;
  'workflow_data_payload'?: Record<string, unknown>;
  'workflow_id': string;
  'workflow_name': string;
  'workspace_id': string;
  'additionalProperties'?: Record<string, unknown>;
}

/**
 * All webhook event type names
 */
export const WEBHOOK_EVENT_TYPES = [
  'action_item.completed',
  'action_item.created',
  'action_item.updated',
  'agenda_item.created',
  'agenda_item.deleted',
  'agenda_item.updated',
  'calendar_event.created',
  'calendar_event.deleted',
  'calendar_event.updated',
  'meeting.completed',
  'meeting.created',
  'meeting.updated',
  'participant.added',
  'participant.removed',
  'user.connection.revoked',
  'workflow.assignment.created',
] as const;

export type WebhookEventType = typeof WEBHOOK_EVENT_TYPES[number];
