/**
 * Calendar-related type definitions for the Contio Partner API
 */

export interface CalendarEventAttendee {
  email?: string;
  name?: string;
  status?: string;
  type?: string;
}

export interface CalendarEvent {
  id?: string;
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  meeting_id?: string;
  attendees?: CalendarEventAttendee[];
  organizer?: CalendarEventAttendee;
}

/**
 * Detailed calendar event information returned by GET /calendar/events/{id}
 */
export interface CalendarEventDetail {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  location?: string;
  attendee_count: number;
  organizer?: {
    email: string;
    name?: string;
    response_status?: string;
  };
  attendees?: Array<{
    email: string;
    name?: string;
    response_status?: string;
  }>;
}

export interface CalendarEventListParams {
  /** Start time in RFC3339 format */
  start: string;
  /** End time in RFC3339 format */
  end: string;
  /** Number of results per page (default 25, max 100) */
  limit?: number;
  /** Pagination offset (default 0) */
  offset?: number;
  /** Sort direction: asc or desc (default: asc) */
  direction?: string;
}

export interface CalendarEventListResponse {
  items?: CalendarEvent[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface LinkCalendarEventRequest {
  calendar_event_id: string;
}

export interface LinkCalendarEventResponse {
  success?: boolean;
  message?: string;
}

export interface CreateMeetingFromCalendarEventRequest {
  calendar_event_id: string;
}

export interface CreateMeetingFromCalendarEventResponse {
  meeting_id?: string;
  message?: string;
}
