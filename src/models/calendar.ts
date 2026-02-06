/**
 * Calendar-related type definitions for the Contio Partner API
 */

import type { UserPartnerMeetingResponse } from '../generated/api-types';

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
  id?: string;
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  meeting_id?: string;
  organizer?: CalendarEventAttendee;
  attendees?: CalendarEventAttendee[];

  // ── Deprecated fields (remove in next major version) ────────────────────
  // These fields are not returned by the API and will always be undefined.
  // They are retained here to avoid compile errors for partners who referenced them.

  /**
   * @deprecated This field is not present in the API response. Use attendees?.length instead.
   * Will be removed in the next major version.
   */
  attendee_count?: number;

  /**
   * @deprecated This field is not present in the API response.
   * Will be removed in the next major version.
   */
  is_all_day?: boolean;
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

export interface CreateMeetingFromCalendarEventResponse {
  created?: boolean;
  meeting?: UserPartnerMeetingResponse;
  message?: string;

  // ── Deprecated fields (remove in next major version) ────────────────────

  /**
   * @deprecated Use `meeting?.id` instead. This field is no longer returned by the API.
   * Will be removed in the next major version.
   */
  meeting_id?: string;
}

// =============================================================================
// DEPRECATED TYPES — remove in next major version
// =============================================================================

/**
 * @deprecated The calendar_event_id is now passed as a path parameter.
 * Use `createMeetingFromCalendarEvent(calendarEventId: string)` instead of
 * `createMeetingFromCalendarEvent({ calendar_event_id: '...' })`.
 * Will be removed in the next major version.
 */
export interface CreateMeetingFromCalendarEventRequest {
  calendar_event_id: string;
}
