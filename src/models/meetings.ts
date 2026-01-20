/**
 * Meeting-related type definitions for the Contio Partner API
 */

export interface Meeting {
  id: string;
  title: string;
  summary_notes?: string;
  start_time?: string;
  end_time?: string;
  status: MeetingStatus;
  workspace_id: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  redirect_to_meeting_id?: string; // Smart redirect hint (CON-1640)
}

export type MeetingStatus =
  | 'draft'
  | 'scheduled'
  | 'in_progress'
  | 'ended'
  | 'completed';

export type DetailLevel =
  | 'BULLET_POINTS'
  | 'STANDARD'
  | 'VERBATIM';

export interface CreateMeetingRequest {
  title: string;
  start_time?: string;
  end_time?: string;
  template_id?: string;
  is_instant?: boolean;
  detail_level?: DetailLevel;
}

export interface UpdateMeetingRequest {
  title?: string;
  start_time?: string;
  end_time?: string;
  template_id?: string;
  detail_level?: DetailLevel;
}

export interface MeetingListParams {
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

export interface MeetingListResponse {
  items: Meeting[];
  total: number;
  limit: number;
  offset: number;
}
