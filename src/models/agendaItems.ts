/**
 * Agenda item-related type definitions for the Contio Partner API
 */

export type AgendaItemType =
  | 'DISCUSSION'
  | 'QUESTIONS_TO_ANSWER'
  | 'BREAK'
  | 'ADJOURN';

export type AgendaItemStatus = 'pending' | 'in_progress' | 'completed';

export interface PresenterDetails {
  user_id: string;
  name?: string;
  email?: string;
}

export interface AgendaItem {
  id?: string;
  meeting_id?: string;
  title?: string;
  description?: string;
  item_type?: AgendaItemType;
  status?: AgendaItemStatus;
  sequence?: string;
  time_allocation_minutes?: number;
  /** @deprecated Use {@link presenter_details} instead. */
  presenters?: string[];
  presenter_details?: PresenterDetails[];
  /** Private talking points / notes for this agenda item. */
  talking_points?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAgendaItemRequest {
  item_type: AgendaItemType;
  title: string;
  description?: string;
  sequence?: string;
  time_allocation_minutes?: number;
  presenters?: string[];
  /** Private talking points / notes for this agenda item. */
  talking_points?: string;
}

export interface UpdateAgendaItemRequest {
  item_type?: AgendaItemType;
  title?: string;
  description?: string;
  status?: AgendaItemStatus;
  sequence?: string;
  time_allocation_minutes?: number;
  presenters?: string[];
  /** Private talking points / notes for this agenda item. */
  talking_points?: string;
}

export interface AgendaItemListResponse {
  items?: AgendaItem[];
  total?: number;
  limit?: number;
  offset?: number;
}
