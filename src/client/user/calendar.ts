/**
 * Calendar domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  CalendarEvent,
  CalendarEventDetail,
  CalendarEventListParams,
  CalendarEventListResponse,
  LinkCalendarEventRequest,
  LinkCalendarEventResponse,
  CreateMeetingFromCalendarEventRequest,
  CreateMeetingFromCalendarEventResponse,
} from '../../models';

export async function getCalendarEvents(
  http: HttpTransport,
  params: CalendarEventListParams,
  options?: RequestOptions,
): Promise<CalendarEventListResponse> {
  return http.get<CalendarEventListResponse>('/calendar/events', params, options);
}

export async function getAllCalendarEvents(
  http: HttpTransport,
  params: Omit<CalendarEventListParams, 'limit' | 'offset'>,
  options?: RequestOptions,
): Promise<CalendarEvent[]> {
  const allItems: CalendarEvent[] = [];
  const pageSize = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await getCalendarEvents(http, { ...params, limit: pageSize, offset }, options);
    allItems.push(...(response.items || []));
    total = response.total || 0;
    offset += pageSize;
  } while (offset < total);

  return allItems;
}

export async function getCalendarEvent(
  http: HttpTransport,
  calendarEventId: string,
  options?: RequestOptions,
): Promise<CalendarEventDetail> {
  return http.get<CalendarEventDetail>(`/calendar/events/${calendarEventId}`, undefined, options);
}

export async function linkCalendarEvent(
  http: HttpTransport,
  meetingId: string,
  data: LinkCalendarEventRequest,
  options?: RequestOptions,
): Promise<LinkCalendarEventResponse> {
  return http.post<LinkCalendarEventResponse>(`/meetings/${meetingId}/calendar/link`, data, options);
}

export async function createMeetingFromCalendarEvent(
  http: HttpTransport,
  calendarEventIdOrData: string | CreateMeetingFromCalendarEventRequest,
  options?: RequestOptions,
): Promise<CreateMeetingFromCalendarEventResponse> {
  const calendarEventId = typeof calendarEventIdOrData === 'string'
    ? calendarEventIdOrData
    : calendarEventIdOrData.calendar_event_id;
  return http.post<CreateMeetingFromCalendarEventResponse>(
    `/calendar/events/${calendarEventId}/meeting`,
    undefined,
    options,
  );
}

