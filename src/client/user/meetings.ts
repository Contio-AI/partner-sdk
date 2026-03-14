/**
 * Meeting domain delegate — meetings, participants, and agenda items.
 *
 * All functions accept an {@link HttpTransport} as first argument so they
 * can be invoked by the {@link PartnerUserClient} facade without exposing
 * BaseClient internals.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  Meeting,
  MeetingListParams,
  MeetingListResponse,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  MeetingParticipant,
  MeetingParticipantListResponse,
  AgendaItem,
  AgendaItemListResponse,
  CreateAgendaItemRequest,
  UpdateAgendaItemRequest,
} from '../../models';

// ── Meetings ────────────────────────────────────────────────────────────

export async function getMeetings(
  http: HttpTransport,
  params?: MeetingListParams,
  options?: RequestOptions,
): Promise<MeetingListResponse> {
  return http.get<MeetingListResponse>('/meetings', params, options);
}

export async function getAllMeetings(
  http: HttpTransport,
  params?: Omit<MeetingListParams, 'limit' | 'offset'>,
  options?: RequestOptions,
): Promise<Meeting[]> {
  const allItems: Meeting[] = [];
  const pageSize = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await getMeetings(http, { ...params, limit: pageSize, offset }, options);
    allItems.push(...response.items);
    total = response.total;
    offset += pageSize;
  } while (offset < total);

  return allItems;
}

export async function getMeeting(
  http: HttpTransport,
  meetingId: string,
  options?: RequestOptions,
): Promise<Meeting> {
  const response = await http.get<Meeting>(`/meetings/${meetingId}`, undefined, options);

  // Handle smart redirect (CON-1640)
  if (response.redirect_to_meeting_id) {
    return http.get<Meeting>(`/meetings/${response.redirect_to_meeting_id}`, undefined, options);
  }

  return response;
}

export async function createMeeting(
  http: HttpTransport,
  data: CreateMeetingRequest,
  options?: RequestOptions,
): Promise<Meeting> {
  return http.post<Meeting>('/meetings', data, options);
}

export async function updateMeeting(
  http: HttpTransport,
  meetingId: string,
  data: UpdateMeetingRequest,
  options?: RequestOptions,
): Promise<Meeting> {
  return http.patch<Meeting>(`/meetings/${meetingId}`, data, options);
}

// ── Participants ────────────────────────────────────────────────────────

export async function getMeetingParticipants(
  http: HttpTransport,
  meetingId: string,
  options?: RequestOptions,
): Promise<MeetingParticipantListResponse> {
  return http.get<MeetingParticipantListResponse>(`/meetings/${meetingId}/participants`, undefined, options);
}

export async function addMeetingParticipant(
  http: HttpTransport,
  meetingId: string,
  data: { email: string; name: string; role: 'EDITOR' | 'VIEWER' },
  options?: RequestOptions,
): Promise<MeetingParticipant> {
  return http.post<MeetingParticipant>(`/meetings/${meetingId}/participants`, data, options);
}

export async function removeMeetingParticipant(
  http: HttpTransport,
  meetingId: string,
  participantId: string,
  options?: RequestOptions,
): Promise<void> {
  await http.delete(`/meetings/${meetingId}/participants/${participantId}`, options);
}

// ── Agenda Items ────────────────────────────────────────────────────────

export async function getMeetingAgendaItems(
  http: HttpTransport,
  meetingId: string,
  options?: RequestOptions,
): Promise<AgendaItemListResponse> {
  return http.get<AgendaItemListResponse>(`/meetings/${meetingId}/agenda-items`, undefined, options);
}

export async function createAgendaItem(
  http: HttpTransport,
  meetingId: string,
  data: CreateAgendaItemRequest,
  options?: RequestOptions,
): Promise<AgendaItem> {
  return http.post<AgendaItem>(`/meetings/${meetingId}/agenda-items`, data, options);
}

export async function updateAgendaItem(
  http: HttpTransport,
  meetingId: string,
  itemId: string,
  data: UpdateAgendaItemRequest,
  options?: RequestOptions,
): Promise<AgendaItem> {
  return http.put<AgendaItem>(`/meetings/${meetingId}/agenda-items/${itemId}`, data, options);
}

export async function deleteAgendaItem(
  http: HttpTransport,
  meetingId: string,
  itemId: string,
  options?: RequestOptions,
): Promise<void> {
  await http.delete(`/meetings/${meetingId}/agenda-items/${itemId}`, options);
}

