/**
 * Action item-related type definitions for the Contio Partner API
 */

/**
 * Status of an action item
 */
export type ActionItemStatus =
  | 'needs_review'
  | 'accepted'
  | 'in_progress'
  | 'blocked'
  | 'completed'
  | 'cancelled';

export interface ActionItem {
  id: string;
  meeting_id: string;
  assigned_to_user_id?: string;
  title: string;
  description?: string;
  status: ActionItemStatus;
  is_completed: boolean;
  due_date?: string;
  completed_at?: string;
  has_partner_assignment: boolean;
  partner_context?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateActionItemRequest {
  meeting_id: string;
  title: string;
  description?: string;
  status?: ActionItemStatus;
  due_date?: string;
  partner_context?: Record<string, unknown>;
}

export interface UpdateActionItemRequest {
  title?: string;
  description?: string;
  status?: ActionItemStatus;
  is_completed?: boolean;
  due_date?: string;
  partner_context?: Record<string, unknown>;
}

export interface ActionItemListParams {
  limit?: number;
  offset?: number;
  meeting_id?: string;
  is_completed?: boolean;
  has_partner_assignment?: boolean;
}

export interface ActionItemListResponse {
  items: ActionItem[];
  total: number;
  limit: number;
  offset: number;
}
