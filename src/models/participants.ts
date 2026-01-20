/**
 * Meeting participant-related type definitions for the Contio Partner API
 */

export interface MeetingParticipant {
  id?: string;
  meeting_id?: string;
  user_id?: string;
  name?: string;
  email?: string;
  role?: string;
  is_attended?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MeetingParticipantListResponse {
  items?: MeetingParticipant[];
  total?: number;
  limit?: number;
  offset?: number;
}
