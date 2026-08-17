/**
 * Backlog item-related type definitions for the Contio Partner API.
 *
 * Backlog items are agenda items that live outside of a specific meeting
 * agenda. They can be created directly on the backlog or deferred from a
 * meeting, and can later be assigned onto a meeting agenda.
 */

export type BacklogItemType =
  | 'DISCUSSION'
  | 'QUESTIONS_TO_ANSWER'
  | 'BREAK'
  | 'ADJOURN';

export type BacklogItemOriginType = 'MANUAL' | 'MEETING' | 'SMS';

export interface BacklogItem {
  id?: string;
  title?: string;
  description?: string;
  item_type?: BacklogItemType;
  origin_type?: BacklogItemOriginType;
  origin_meeting_id?: string;
  origin_meeting_title?: string;
  agenda_item_id?: string;
  destination_meeting_id?: string;
  destination_agenda_item_id?: string;
  deferrer_user_id?: string;
  deferred_at?: string;
  deleted_at?: string;
  assigned_at?: string;
  presenters?: string[];
  /** Private talking points for the authenticated user on this backlog item. */
  talking_points?: string;
  time_allocation_minutes?: number;
}

export interface CreateBacklogItemRequest {
  title: string;
  description?: string;
  item_type: BacklogItemType;
  presenters?: string[];
  /** Private talking points for this backlog item. */
  talking_points?: string;
  time_allocation_minutes?: number;
}

export interface UpdateBacklogItemRequest {
  title?: string;
  description?: string;
  item_type?: BacklogItemType;
  presenters?: string[];
  /** Private talking points for this backlog item. */
  talking_points?: string;
  time_allocation_minutes?: number;
}

export interface AssignBacklogItemRequest {
  /** Meeting to move the backlog item onto. */
  meeting_id: string;
}

export interface AssignBacklogItemResponse {
  agenda_item_id?: string;
  backlog_item_id?: string;
  meeting_id?: string;
}

export interface BacklogItemListParams {
  limit?: number;
  offset?: number;
  sort_order?: 'asc' | 'desc';
}

export interface BacklogItemListResponse {
  items: BacklogItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface BacklogItemHistoryListParams {
  limit?: number;
  offset?: number;
  sort_order?: 'asc' | 'desc';
}
