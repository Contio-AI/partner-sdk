/**
 * Partner User API client for OAuth-authenticated endpoints
 */

import { InternalAxiosRequestConfig } from 'axios';
import { BaseClient, ClientConfig, RequestOptions } from './base';
import { OAuthClient } from '../auth/oauth';
import {
  Meeting,
  MeetingListParams,
  MeetingListResponse,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  ActionItem,
  ActionItemListParams,
  ActionItemListResponse,
  CreateActionItemRequest,
  UpdateActionItemRequest,
  UserProfile,
  CalendarEvent,
  CalendarEventDetail,
  CalendarEventListParams,
  CalendarEventListResponse,
  LinkCalendarEventRequest,
  LinkCalendarEventResponse,
  CreateMeetingFromCalendarEventRequest,
  CreateMeetingFromCalendarEventResponse,
  MeetingParticipant,
  MeetingParticipantListResponse,
  AgendaItem,
  AgendaItemListResponse,
  CreateAgendaItemRequest,
  UpdateAgendaItemRequest,
} from '../models';

/**
 * Partner User API client for OAuth-authenticated user endpoints.
 *
 * Provides access to meetings, action items, calendar events, and user profile
 * for the authenticated user. Requires an OAuth access token.
 *
 * @example
 * ```typescript
 * const { oauth, user } = ContioPartnerSDK.forUser({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   redirectUri: 'https://your-app.com/callback'
 * });
 *
 * // After OAuth flow completes
 * const meetings = await user.getMeetings({ limit: 10 });
 * ```
 */
export class PartnerUserClient extends BaseClient {
  private oauthClient: OAuthClient;

  /**
   * Create a new PartnerUserClient instance.
   *
   * @param oauthClient - Configured OAuthClient with access token
   * @param config - Optional client configuration (baseURL, timeout, etc.)
   */
  constructor(oauthClient: OAuthClient, config?: ClientConfig) {
    const baseURL = config?.baseURL || 'https://api.contio.ai';
    const finalURL = `${baseURL}/v1/partner/user`;
    super({
      ...config,
      baseURL: finalURL,
    });
    this.oauthClient = oauthClient;
  }

  /**
   * Add authorization headers, automatically refreshing the token if expired.
   * @internal
   */
  protected async addAuthHeaders(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    // Check if token is expired and refresh if needed
    if (this.oauthClient.isTokenExpired()) {
      try {
        await this.oauthClient.refreshAccessToken();
      } catch (_error) {
        // If refresh fails, continue with existing token - the API will return 401
        // and the caller can handle re-authentication
      }
    }

    const token = this.oauthClient.getAccessToken();
    if (!token) {
      throw new Error('No access token available. Please authenticate first.');
    }

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a paginated list of meetings accessible to the authenticated user.
   *
   * @param params - Optional filter and pagination parameters
   * @param params.limit - Maximum number of meetings to return (default: 20, max: 100)
   * @param params.offset - Number of meetings to skip for pagination
   * @param params.start_date - Filter meetings starting on or after this date (ISO 8601)
   * @param params.end_date - Filter meetings starting on or before this date (ISO 8601)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Paginated list of meetings with total count
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * // Get first page of meetings
   * const response = await user.getMeetings({ limit: 20 });
   * console.log(`Found ${response.total} meetings`);
   *
   * // Get meetings from a specific date range
   * const meetings = await user.getMeetings({
   *   start_date: '2026-01-01T00:00:00Z',
   *   end_date: '2026-01-31T23:59:59Z'
   * });
   * ```
   */
  async getMeetings(params?: MeetingListParams, options?: RequestOptions): Promise<MeetingListResponse> {
    return this.get<MeetingListResponse>('/meetings', params, options);
  }

  /**
   * Get all meetings by automatically paginating through all pages.
   *
   * Use this when you need to fetch all meetings without manually handling pagination.
   * For large datasets, consider using `getMeetings()` with pagination for better control.
   *
   * @param params - Optional filter parameters (limit/offset are managed automatically)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Array of all meetings matching the filter criteria
   * @throws {ContioAPIError} If any request fails
   *
   * @example
   * ```typescript
   * // Get all meetings in January
   * const allMeetings = await user.getAllMeetings({
   *   start_date: '2026-01-01T00:00:00Z',
   *   end_date: '2026-01-31T23:59:59Z'
   * });
   * console.log(`Total: ${allMeetings.length} meetings`);
   * ```
   */
  async getAllMeetings(params?: Omit<MeetingListParams, 'limit' | 'offset'>, options?: RequestOptions): Promise<Meeting[]> {
    const allItems: Meeting[] = [];
    const pageSize = 100; // Max page size for efficiency
    let offset = 0;
    let total = 0;

    do {
      const response = await this.getMeetings({ ...params, limit: pageSize, offset }, options);
      allItems.push(...response.items);
      total = response.total;
      offset += pageSize;
    } while (offset < total);

    return allItems;
  }

  /**
   * Get a specific meeting by ID.
   *
   * Automatically follows smart redirects if the meeting has been copied
   * to the user's workspace (e.g., shared meeting notes).
   *
   * @param meetingId - The unique meeting ID (UUID format)
   * @param options - Optional request options (e.g., timezone override)
   * @returns The meeting object with full details
   * @throws {ContioAPIError} If the meeting is not found or access is denied
   *
   * @example
   * ```typescript
   * const meeting = await user.getMeeting('550e8400-e29b-41d4-a716-446655440000');
   * console.log(meeting.title, meeting.status);
   * ```
   */
  async getMeeting(meetingId: string, options?: RequestOptions): Promise<Meeting> {
    const response = await this.get<Meeting>(`/meetings/${meetingId}`, undefined, options);

    // Handle smart redirect (CON-1640)
    // If the API returns a redirect hint, automatically fetch the redirected meeting
    if (response.redirect_to_meeting_id) {
      return this.get<Meeting>(`/meetings/${response.redirect_to_meeting_id}`, undefined, options);
    }

    return response;
  }

  /**
   * Create a new meeting.
   *
   * @param data - Meeting creation data
   * @param data.title - Meeting title (required)
   * @param data.start_time - Scheduled start time (ISO 8601)
   * @param data.end_time - Scheduled end time (ISO 8601)
   * @param data.template_id - Optional template ID to use for the meeting
   * @param data.is_instant - If true, creates an instant meeting (default: false)
   * @param data.detail_level - Note detail level: 'BULLET_POINTS', 'STANDARD', or 'VERBATIM'
   * @param options - Optional request options
   * @returns The newly created meeting
   * @throws {ContioAPIError} If validation fails or creation is denied
   *
   * @example
   * ```typescript
   * const meeting = await user.createMeeting({
   *   title: 'Weekly Team Sync',
   *   start_time: '2026-01-20T10:00:00Z',
   *   end_time: '2026-01-20T11:00:00Z',
   *   detail_level: 'STANDARD'
   * });
   * ```
   */
  async createMeeting(data: CreateMeetingRequest, options?: RequestOptions): Promise<Meeting> {
    return this.post<Meeting>('/meetings', data, options);
  }

  /**
   * Update an existing meeting.
   *
   * @param meetingId - The unique meeting ID to update
   * @param data - Fields to update (all optional)
   * @param options - Optional request options
   * @returns The updated meeting
   * @throws {ContioAPIError} If the meeting is not found or update is denied
   *
   * @example
   * ```typescript
   * const updated = await user.updateMeeting('meeting-id', {
   *   title: 'Updated Title',
   *   detail_level: 'VERBATIM'
   * });
   * ```
   */
  async updateMeeting(meetingId: string, data: UpdateMeetingRequest, options?: RequestOptions): Promise<Meeting> {
    return this.patch<Meeting>(`/meetings/${meetingId}`, data, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Action Item endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a paginated list of action items accessible to the authenticated user.
   *
   * @param params - Optional filter and pagination parameters
   * @param params.limit - Maximum number of items to return (default: 20, max: 100)
   * @param params.offset - Number of items to skip for pagination
   * @param params.meeting_id - Filter action items by meeting ID
   * @param params.is_completed - Filter by completion status
   * @param params.has_partner_assignment - Filter by partner assignment status
   * @param options - Optional request options
   * @returns Paginated list of action items with total count
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * // Get all incomplete action items
   * const items = await user.getActionItems({ is_completed: false });
   *
   * // Get action items for a specific meeting
   * const meetingItems = await user.getActionItems({ meeting_id: 'meeting-uuid' });
   * ```
   */
  async getActionItems(params?: ActionItemListParams, options?: RequestOptions): Promise<ActionItemListResponse> {
    return this.get<ActionItemListResponse>('/action-items', params, options);
  }

  /**
   * Get all action items by automatically paginating through all pages.
   *
   * Use this when you need to fetch all action items without manually handling pagination.
   * For large datasets, consider using `getActionItems()` with pagination for better control.
   *
   * @param params - Optional filter parameters (limit/offset are managed automatically)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Array of all action items matching the filter criteria
   * @throws {ContioAPIError} If any request fails
   *
   * @example
   * ```typescript
   * // Get all incomplete action items
   * const allItems = await user.getAllActionItems({ is_completed: false });
   * console.log(`${allItems.length} items need attention`);
   *
   * // Get all action items for a meeting
   * const meetingItems = await user.getAllActionItems({ meeting_id: 'meeting-uuid' });
   * ```
   */
  async getAllActionItems(params?: Omit<ActionItemListParams, 'limit' | 'offset'>, options?: RequestOptions): Promise<ActionItem[]> {
    const allItems: ActionItem[] = [];
    const pageSize = 100; // Max page size for efficiency
    let offset = 0;
    let total = 0;

    do {
      const response = await this.getActionItems({ ...params, limit: pageSize, offset }, options);
      allItems.push(...response.items);
      total = response.total;
      offset += pageSize;
    } while (offset < total);

    return allItems;
  }

  /**
   * Get a specific action item by ID.
   *
   * @param actionItemId - The unique action item ID (UUID format)
   * @param options - Optional request options
   * @returns The action item with full details
   * @throws {ContioAPIError} If the action item is not found or access is denied
   */
  async getActionItem(actionItemId: string, options?: RequestOptions): Promise<ActionItem> {
    return this.get<ActionItem>(`/action-items/${actionItemId}`, undefined, options);
  }

  /**
   * Create a new action item.
   *
   * @param data - Action item creation data
   * @param data.meeting_id - Meeting ID to associate with (required)
   * @param data.title - Action item title (required)
   * @param data.description - Optional detailed description
   * @param data.status - Optional initial status
   * @param data.due_date - Optional due date (ISO 8601)
   * @param data.partner_context - Optional partner-specific metadata
   * @param options - Optional request options
   * @returns The newly created action item
   * @throws {ContioAPIError} If validation fails
   *
   * @example
   * ```typescript
   * const item = await user.createActionItem({
   *   meeting_id: 'meeting-456',
   *   title: 'Follow up with client',
   *   due_date: '2026-01-25T17:00:00Z',
   *   status: 'needs_review'
   * });
   * ```
   */
  async createActionItem(data: CreateActionItemRequest, options?: RequestOptions): Promise<ActionItem> {
    return this.post<ActionItem>('/action-items', data, options);
  }

  /**
   * Update an existing action item.
   *
   * @param actionItemId - The unique action item ID to update
   * @param data - Fields to update (all optional)
   * @param options - Optional request options
   * @returns The updated action item
   * @throws {ContioAPIError} If the action item is not found or update is denied
   *
   * @example
   * ```typescript
   * // Mark as completed
   * const updated = await user.updateActionItem('item-id', {
   *   status: 'completed'
   * });
   * ```
   */
  async updateActionItem(actionItemId: string, data: UpdateActionItemRequest, options?: RequestOptions): Promise<ActionItem> {
    return this.put<ActionItem>(`/action-items/${actionItemId}`, data, options);
  }

  /**
   * Delete an action item.
   *
   * @param actionItemId - The unique action item ID to delete
   * @param options - Optional request options
   * @throws {ContioAPIError} If the action item is not found or deletion is denied
   */
  async deleteActionItem(actionItemId: string, options?: RequestOptions): Promise<void> {
    await this.delete(`/action-items/${actionItemId}`, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Profile endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get the authenticated user's profile.
   *
   * @param options - Optional request options
   * @returns The user's profile including name, email, and preferences
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * const profile = await user.getUserProfile();
   * console.log(`Logged in as ${profile.name} (${profile.email})`);
   * ```
   */
  async getUserProfile(options?: RequestOptions): Promise<UserProfile> {
    return this.get<UserProfile>('/profile', undefined, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calendar endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get calendar events for the authenticated user within a time range.
   *
   * Requires the user to have connected their calendar via OAuth.
   *
   * @param params - Filter parameters (required)
   * @param params.start - Start of the time range (RFC3339 format, required)
   * @param params.end - End of the time range (RFC3339 format, required)
   * @param params.limit - Maximum number of events to return (default 25, max 100)
   * @param params.offset - Pagination offset (default 0)
   * @param params.direction - Sort direction: 'asc' or 'desc' (default: 'asc')
   * @param options - Optional request options
   * @returns List of calendar events within the specified range
   * @throws {ContioAPIError} If calendar is not connected or request fails
   *
   * @example
   * ```typescript
   * const events = await user.getCalendarEvents({
   *   start: '2026-01-20T00:00:00Z',
   *   end: '2026-01-27T23:59:59Z'
   * });
   * ```
   */
  async getCalendarEvents(params: CalendarEventListParams, options?: RequestOptions): Promise<CalendarEventListResponse> {
    return this.get<CalendarEventListResponse>('/calendar/events', params, options);
  }

  /**
   * Get all calendar events within a date range by automatically paginating through all pages.
   *
   * Use this when you need to fetch all events without manually handling pagination.
   * For large date ranges, consider using `getCalendarEvents()` with pagination for better control.
   *
   * @param params - Required start and end dates, optional direction (limit/offset managed automatically)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Array of all calendar events within the date range
   * @throws {ContioAPIError} If calendar is not connected or request fails
   *
   * @example
   * ```typescript
   * // Get all events for the month
   * const allEvents = await user.getAllCalendarEvents({
   *   start: '2026-01-01T00:00:00Z',
   *   end: '2026-01-31T23:59:59Z'
   * });
   * console.log(`Found ${allEvents.length} events`);
   * ```
   */
  async getAllCalendarEvents(params: Omit<CalendarEventListParams, 'limit' | 'offset'>, options?: RequestOptions): Promise<CalendarEvent[]> {
    const allItems: CalendarEvent[] = [];
    const pageSize = 100; // Max page size for efficiency
    let offset = 0;
    let total = 0;

    do {
      const response = await this.getCalendarEvents({ ...params, limit: pageSize, offset }, options);
      allItems.push(...(response.items || []));
      total = response.total || 0;
      offset += pageSize;
    } while (offset < total);

    return allItems;
  }

  /**
   * Get detailed information about a specific calendar event.
   *
   * Retrieves complete calendar event details including title, times, attendees,
   * and organizer information. Requires the user to have a synced calendar connection.
   *
   * @param calendarEventId - The calendar event ID to retrieve
   * @param options - Optional request options
   * @returns Complete calendar event details
   * @throws {ContioAPIError} If the event is not found or user doesn't have access
   *
   * @example
   * ```typescript
   * const event = await user.getCalendarEvent('cal-event-123');
   * console.log(`Event: ${event.title}`);
   * console.log(`Attendees: ${event.attendee_count}`);
   * ```
   */
  async getCalendarEvent(calendarEventId: string, options?: RequestOptions): Promise<CalendarEventDetail> {
    return this.get<CalendarEventDetail>(`/calendar/events/${calendarEventId}`, undefined, options);
  }

  /**
   * Link a calendar event to an existing meeting.
   *
   * Associates a calendar event with a Contio meeting for automatic
   * scheduling and reminder integration.
   *
   * @param meetingId - The meeting ID to link to
   * @param data - Calendar event linking data
   * @param data.calendar_event_id - The calendar event ID to link
   * @param options - Optional request options
   * @returns Confirmation of the link with event details
   * @throws {ContioAPIError} If the meeting or event is not found
   */
  async linkCalendarEvent(meetingId: string, data: LinkCalendarEventRequest, options?: RequestOptions): Promise<LinkCalendarEventResponse> {
    return this.post<LinkCalendarEventResponse>(`/meetings/${meetingId}/calendar/link`, data, options);
  }

  /**
   * Create a new meeting from a calendar event.
   *
   * Automatically populates meeting details from the calendar event
   * including title, time, and participants.
   *
   * @param data - Calendar event to meeting conversion data
   * @param data.calendar_event_id - The calendar event ID to convert (required)
   * @param options - Optional request options
   * @returns The newly created meeting linked to the calendar event
   * @throws {ContioAPIError} If the calendar event is not found
   *
   * @example
   * ```typescript
   * const result = await user.createMeetingFromCalendarEvent({
   *   calendar_event_id: 'cal-event-123'
   * });
   * console.log('Created meeting:', result.meeting_id);
   * ```
   */
  async createMeetingFromCalendarEvent(data: CreateMeetingFromCalendarEventRequest, options?: RequestOptions): Promise<CreateMeetingFromCalendarEventResponse> {
    return this.post<CreateMeetingFromCalendarEventResponse>('/calendar/events/meeting', data, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting Participant endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get participants for a specific meeting.
   *
   * @param meetingId - The meeting ID to get participants for
   * @param options - Optional request options
   * @returns List of meeting participants with their roles
   * @throws {ContioAPIError} If the meeting is not found or access is denied
   */
  async getMeetingParticipants(meetingId: string, options?: RequestOptions): Promise<MeetingParticipantListResponse> {
    return this.get<MeetingParticipantListResponse>(`/meetings/${meetingId}/participants`, undefined, options);
  }

  /**
   * Add a participant to a meeting.
   *
   * @param meetingId - The meeting ID to add the participant to
   * @param data - Participant data
   * @param data.email - Participant's email address (required)
   * @param data.name - Participant's display name (required)
   * @param data.role - Participant's role: 'EDITOR' (can modify) or 'VIEWER' (read-only)
   * @param options - Optional request options
   * @returns The added participant details
   * @throws {ContioAPIError} If the meeting is not found or participant already exists
   *
   * @example
   * ```typescript
   * await user.addMeetingParticipant('meeting-id', {
   *   email: 'colleague@example.com',
   *   name: 'Jane Doe',
   *   role: 'EDITOR'
   * });
   * ```
   */
  async addMeetingParticipant(meetingId: string, data: { email: string; name: string; role: 'EDITOR' | 'VIEWER' }, options?: RequestOptions): Promise<MeetingParticipant> {
    return this.post<MeetingParticipant>(`/meetings/${meetingId}/participants`, data, options);
  }

  /**
   * Remove a participant from a meeting.
   *
   * @param meetingId - The meeting ID to remove the participant from
   * @param participantId - The participant ID to remove
   * @param options - Optional request options
   * @throws {ContioAPIError} If the meeting or participant is not found
   */
  async removeMeetingParticipant(meetingId: string, participantId: string, options?: RequestOptions): Promise<void> {
    await this.delete(`/meetings/${meetingId}/participants/${participantId}`, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Agenda Item endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get agenda items for a specific meeting.
   *
   * @param meetingId - The meeting ID to get agenda items for
   * @param options - Optional request options
   * @returns List of agenda items in display order
   * @throws {ContioAPIError} If the meeting is not found or access is denied
   */
  async getMeetingAgendaItems(meetingId: string, options?: RequestOptions): Promise<AgendaItemListResponse> {
    return this.get<AgendaItemListResponse>(`/meetings/${meetingId}/agenda-items`, undefined, options);
  }

  /**
   * Create a new agenda item for a meeting.
   *
   * @param meetingId - The meeting ID to add the agenda item to
   * @param data - Agenda item creation data
   * @param data.item_type - Type of agenda item: 'DISCUSSION', 'DECISION', 'ACTION_ITEM', or 'INFORMATION' (required)
   * @param data.title - Agenda item title (required)
   * @param data.description - Optional detailed description
   * @param data.time_allocation_minutes - Optional estimated duration in minutes
   * @param data.presenters - Optional array of presenter names or emails
   * @param data.restricted_to_leads - Optional flag to restrict visibility to meeting leads
   * @param options - Optional request options
   * @returns The newly created agenda item
   * @throws {ContioAPIError} If the meeting is not found or validation fails
   *
   * @example
   * ```typescript
   * const item = await user.createAgendaItem('meeting-id', {
   *   item_type: 'DISCUSSION',
   *   title: 'Q1 Review',
   *   time_allocation_minutes: 15,
   *   presenters: ['manager@example.com']
   * });
   * ```
   */
  async createAgendaItem(meetingId: string, data: CreateAgendaItemRequest, options?: RequestOptions): Promise<AgendaItem> {
    return this.post<AgendaItem>(`/meetings/${meetingId}/agenda-items`, data, options);
  }

  /**
   * Update an existing agenda item.
   *
   * @param meetingId - The meeting ID containing the agenda item
   * @param itemId - The agenda item ID to update
   * @param data - Fields to update (all optional)
   * @param options - Optional request options
   * @returns The updated agenda item
   * @throws {ContioAPIError} If the meeting or item is not found
   */
  async updateAgendaItem(meetingId: string, itemId: string, data: UpdateAgendaItemRequest, options?: RequestOptions): Promise<AgendaItem> {
    return this.put<AgendaItem>(`/meetings/${meetingId}/agenda-items/${itemId}`, data, options);
  }

  /**
   * Delete an agenda item.
   *
   * @param meetingId - The meeting ID containing the agenda item
   * @param itemId - The agenda item ID to delete
   * @param options - Optional request options
   * @throws {ContioAPIError} If the meeting or item is not found
   */
  async deleteAgendaItem(meetingId: string, itemId: string, options?: RequestOptions): Promise<void> {
    await this.delete(`/meetings/${meetingId}/agenda-items/${itemId}`, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Ensure the OAuth access token is valid, refreshing if necessary.
   *
   * Call this before making API requests if you want to proactively
   * refresh expired tokens rather than handling refresh on error.
   *
   * @throws {ContioAPIError} If token refresh fails
   *
   * @example
   * ```typescript
   * // Proactively refresh before a batch of operations
   * await user.ensureValidToken();
   * const meetings = await user.getMeetings();
   * const items = await user.getActionItems();
   * ```
   */
  async ensureValidToken(): Promise<void> {
    if (this.oauthClient.isTokenExpired()) {
      await this.oauthClient.refreshAccessToken();
    }
  }
}
