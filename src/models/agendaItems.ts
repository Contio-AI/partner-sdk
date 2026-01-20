/**
 * Agenda item-related type definitions for the Contio Partner API
 */

export type AgendaItemType = 'DISCUSSION' | 'DECISION' | 'ACTION_ITEM' | 'INFORMATION';
export type AgendaItemStatus = 'pending' | 'in_progress' | 'completed';

export interface AgendaItem {
  id?: string;
  meeting_id?: string;
  title?: string;
  description?: string;
  item_type?: AgendaItemType;
  status?: AgendaItemStatus;
  sequence?: string;
  time_allocation_minutes?: number;
  presenters?: string[];
  restricted_to_leads?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAgendaItemRequest {
  item_type: AgendaItemType;
  title: string;
  description?: string;
  time_allocation_minutes?: number;
  presenters?: string[];
  restricted_to_leads?: boolean;
}

export interface UpdateAgendaItemRequest {
  item_type?: AgendaItemType;
  title?: string;
  description?: string;
  status?: AgendaItemStatus;
  time_allocation_minutes?: number;
  presenters?: string[];
  restricted_to_leads?: boolean;
}

export interface AgendaItemListResponse {
  items?: AgendaItem[];
  total?: number;
  limit?: number;
  offset?: number;
}
