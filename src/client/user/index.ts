/**
 * Partner User API client for OAuth-authenticated endpoints.
 *
 * This file is the public facade. Each domain's implementation lives in a
 * sibling module (meetings.ts, actionItems.ts, calendar.ts, context.ts,
 * profile.ts) and is delegated to from the methods below.
 */

import { InternalAxiosRequestConfig } from 'axios';
import { BaseClient, ClientConfig, RequestOptions } from '../base';
import { HttpTransport } from '../_http';
import { OAuthClient } from '../../auth/oauth';
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
  MeetingContextDocument,
  MeetingContextListParams,
  MeetingContextListResponse,
  UploadMeetingContextRequest,
  MeetingContextContentResponse,
  ChatSession,
  ChatSessionListParams,
  ChatSessionListResponse,
  ChatTurn,
  CreateChatSessionRequest,
  GetChatSessionParams,
  SendChatMessageRequest,
  SendChatMessageResponse,
  // Toolkit-related imports
  ToolkitListParams,
  ToolkitWithInstallation,
  ToolkitWithInstallationListResponse,
  ToolkitInstallation,
  // Next Steps & Action Buttons imports
  MeetingNextStepListParams,
  MeetingNextStepListResponse,
  MeetingActionButtonListParams,
  MeetingActionButtonListResponse,
  ExecuteNextStepRequest,
  ExecuteNextStepResponse,
  TriggerActionButtonRequest,
  TriggerActionButtonResponse,
  NextStepResult,
} from '../../models';

import * as meetings from './meetings';
import * as actionItems from './actionItems';
import * as calendar from './calendar';
import * as context from './context';
import * as profile from './profile';
import * as chat from './chat';
import * as userToolkits from './toolkits';
import * as userTemplates from './templates';

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
  /** @internal */
  private readonly http: HttpTransport;

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

    // Use arrow functions so jest.spyOn() on the instance methods works
    // (bind() captures the reference at construction time, defeating spies).
    this.http = {
      get: (...args) => this.get(...args),
      post: (...args) => this.post(...args),
      put: (...args) => this.put(...args),
      patch: (...args) => this.patch(...args),
      delete: (...args) => this.delete(...args),
      postForm: (...args) => this.postForm(...args),
      getRaw: (...args) => this.getRaw(...args),
    };
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
   * Get a paginated list of meetings for the authenticated user.
   *
   * @param params - Optional pagination and filter parameters
   * @param options - Optional request options (e.g., timezone override)
   * @returns Paginated meeting list with total count
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * const response = await user.getMeetings({ limit: 10 });
   * console.log(`Found ${response.total} meetings`);
   * ```
   */
  async getMeetings(params?: MeetingListParams, options?: RequestOptions): Promise<MeetingListResponse> {
    return meetings.getMeetings(this.http, params, options);
  }

  /**
   * Get all meetings by automatically paginating through all pages.
   *
   * @param params - Optional filter parameters (limit/offset are managed automatically)
   * @param options - Optional request options
   * @returns Array of all meetings matching the filter criteria
   * @throws {ContioAPIError} If any request fails
   *
   * @example
   * ```typescript
   * const allMeetings = await user.getAllMeetings();
   * console.log(`${allMeetings.length} total meetings`);
   * ```
   */
  async getAllMeetings(params?: Omit<MeetingListParams, 'limit' | 'offset'>, options?: RequestOptions): Promise<Meeting[]> {
    return meetings.getAllMeetings(this.http, params, options);
  }

  /**
   * Get a specific meeting by ID.
   *
   * Automatically follows smart-redirect references (CON-1640) — if the
   * meeting has been merged or moved, the response from the canonical meeting
   * is returned transparently.
   *
   * @param meetingId - The unique meeting ID (UUID format)
   * @param options - Optional request options
   * @returns The meeting with full details
   * @throws {ContioAPIError} If the meeting is not found or access is denied
   *
   * @example
   * ```typescript
   * const meeting = await user.getMeeting('meeting-uuid');
   * console.log(meeting.title);
   * ```
   */
  async getMeeting(meetingId: string, options?: RequestOptions): Promise<Meeting> {
    return meetings.getMeeting(this.http, meetingId, options);
  }

  /**
   * Create a new meeting.
   *
   * @param data - Meeting creation data
   * @param options - Optional request options
   * @returns The newly created meeting
   * @throws {ContioAPIError} If validation fails
   *
   * @example
   * ```typescript
   * const meeting = await user.createMeeting({
   *   title: 'Weekly Standup',
   *   scheduled_start: '2026-01-20T10:00:00Z',
   * });
   * ```
   */
  async createMeeting(data: CreateMeetingRequest, options?: RequestOptions): Promise<Meeting> {
    return meetings.createMeeting(this.http, data, options);
  }

  /**
   * Update an existing meeting.
   *
   * @param meetingId - The meeting ID to update
   * @param data - Fields to update (all optional)
   * @param options - Optional request options
   * @returns The updated meeting
   * @throws {ContioAPIError} If the meeting is not found or update is denied
   */
  async updateMeeting(meetingId: string, data: UpdateMeetingRequest, options?: RequestOptions): Promise<Meeting> {
    return meetings.updateMeeting(this.http, meetingId, data, options);
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
   * @throws {ContioAPIError} If the meeting is not found
   */
  async getMeetingParticipants(meetingId: string, options?: RequestOptions): Promise<MeetingParticipantListResponse> {
    return meetings.getMeetingParticipants(this.http, meetingId, options);
  }

  /**
   * Add a participant to a meeting.
   *
   * @param meetingId - The meeting ID to add the participant to
   * @param data - Participant data including email, name, and role
   * @param options - Optional request options
   * @returns The newly added participant
   * @throws {ContioAPIError} If the meeting is not found or participant already exists
   */
  async addMeetingParticipant(meetingId: string, data: { email: string; name: string; role: 'EDITOR' | 'VIEWER' }, options?: RequestOptions): Promise<MeetingParticipant> {
    return meetings.addMeetingParticipant(this.http, meetingId, data, options);
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
    return meetings.removeMeetingParticipant(this.http, meetingId, participantId, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Agenda Item endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get agenda items for a specific meeting.
   *
   * @param meetingId - The meeting ID to get agenda items for
   * @param options - Optional request options
   * @returns List of agenda items for the meeting
   * @throws {ContioAPIError} If the meeting is not found
   */
  async getMeetingAgendaItems(meetingId: string, options?: RequestOptions): Promise<AgendaItemListResponse> {
    return meetings.getMeetingAgendaItems(this.http, meetingId, options);
  }

  /**
   * Create a new agenda item for a meeting.
   *
   * @param meetingId - The meeting ID to add the agenda item to
   * @param data - Agenda item creation data
   * @param options - Optional request options
   * @returns The newly created agenda item
   * @throws {ContioAPIError} If the meeting is not found or validation fails
   *
   * @example
   * ```typescript
   * const item = await user.createAgendaItem('meeting-id', {
   *   title: 'Review Q1 metrics',
   *   description: 'Discuss performance trends',
   * });
   * ```
   */
  async createAgendaItem(meetingId: string, data: CreateAgendaItemRequest, options?: RequestOptions): Promise<AgendaItem> {
    return meetings.createAgendaItem(this.http, meetingId, data, options);
  }

  /**
   * Update an existing agenda item.
   *
   * @param meetingId - The meeting ID the agenda item belongs to
   * @param itemId - The agenda item ID to update
   * @param data - Fields to update
   * @param options - Optional request options
   * @returns The updated agenda item
   * @throws {ContioAPIError} If the item is not found
   */
  async updateAgendaItem(meetingId: string, itemId: string, data: UpdateAgendaItemRequest, options?: RequestOptions): Promise<AgendaItem> {
    return meetings.updateAgendaItem(this.http, meetingId, itemId, data, options);
  }

  /**
   * Delete an agenda item.
   *
   * @param meetingId - The meeting ID the agenda item belongs to
   * @param itemId - The agenda item ID to delete
   * @param options - Optional request options
   * @throws {ContioAPIError} If the item is not found
   */
  async deleteAgendaItem(meetingId: string, itemId: string, options?: RequestOptions): Promise<void> {
    return meetings.deleteAgendaItem(this.http, meetingId, itemId, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting Next Steps endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get next steps for a specific meeting.
   *
   * Returns the next steps associated with the meeting, including any
   * available action buttons for each next step.
   *
   * @param meetingId - The meeting ID
   * @param params - Optional pagination parameters
   * @param options - Request options
   * @returns Paginated list of next steps
   * @throws {ContioAPIError} If the meeting is not found
   *
   * @example
   * ```typescript
   * const nextSteps = await user.getMeetingNextSteps('meeting-uuid');
   * for (const step of nextSteps.items) {
   *   console.log(`${step.name}: ${step.action_buttons?.length ?? 0} buttons`);
   * }
   * ```
   */
  async getMeetingNextSteps(
    meetingId: string,
    params?: MeetingNextStepListParams,
    options?: RequestOptions,
  ): Promise<MeetingNextStepListResponse> {
    return meetings.getMeetingNextSteps(this.http, meetingId, params, options);
  }

  /**
   * Execute a next step for a meeting.
   *
   * Triggers the AI-powered execution of a next step, which may generate
   * content based on the meeting transcript and the step's AI prompt.
   *
   * @param meetingId - The meeting ID
   * @param nextStepId - The next step ID to execute
   * @param data - Optional execution parameters
   * @param options - Request options
   * @returns Execution response with result ID for tracking
   * @throws {ContioAPIError} If the meeting or next step is not found
   *
   * @example
   * ```typescript
   * const result = await user.executeNextStep('meeting-uuid', 'step-uuid');
   * console.log(`Execution started: ${result.result_id}`);
   *
   * // Poll for result
   * const finalResult = await user.getNextStepResult(result.result_id);
   * console.log(finalResult.content);
   * ```
   */
  async executeNextStep(
    meetingId: string,
    nextStepId: string,
    data?: ExecuteNextStepRequest,
    options?: RequestOptions,
  ): Promise<ExecuteNextStepResponse> {
    return meetings.executeNextStep(this.http, meetingId, nextStepId, data, options);
  }

  /**
   * Get the result of a next step execution.
   *
   * @param resultId - The result ID from executeNextStep
   * @param options - Request options
   * @returns The next step execution result
   * @throws {ContioAPIError} If the result is not found
   */
  async getNextStepResult(resultId: string, options?: RequestOptions): Promise<NextStepResult> {
    return meetings.getNextStepResult(this.http, resultId, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting Action Button endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get action buttons available for a meeting.
   *
   * Returns action buttons that can be triggered for the meeting,
   * typically associated with next steps.
   *
   * @param meetingId - The meeting ID
   * @param params - Optional pagination parameters
   * @param options - Request options
   * @returns Paginated list of action buttons
   * @throws {ContioAPIError} If the meeting is not found
   */
  async getMeetingActionButtons(
    meetingId: string,
    params?: MeetingActionButtonListParams,
    options?: RequestOptions,
  ): Promise<MeetingActionButtonListResponse> {
    return meetings.getMeetingActionButtons(this.http, meetingId, params, options);
  }

  /**
   * Trigger an action button for a meeting.
   *
   * Executes the action associated with the button, which may send
   * an email, create a document, trigger a webhook, or perform other actions.
   *
   * @param meetingId - The meeting ID
   * @param buttonId - The action button ID to trigger
   * @param data - Optional trigger parameters
   * @param options - Request options
   * @returns Trigger response with result information
   * @throws {ContioAPIError} If the meeting or button is not found
   *
   * @example
   * ```typescript
   * const result = await user.triggerActionButton('meeting-uuid', 'button-uuid');
   * if (result.redirect_url) {
   *   window.open(result.redirect_url);
   * }
   * ```
   */
  async triggerActionButton(
    meetingId: string,
    buttonId: string,
    data?: TriggerActionButtonRequest,
    options?: RequestOptions,
  ): Promise<TriggerActionButtonResponse> {
    return meetings.triggerActionButton(this.http, meetingId, buttonId, data, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Action Item endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a paginated list of action items for the authenticated user.
   *
   * @param params - Optional pagination and filter parameters
   * @param options - Optional request options (e.g., timezone override)
   * @returns Paginated action item list with total count
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * // Get all incomplete action items
   * const items = await user.getActionItems({ is_completed: false });
   *
   * // Get action items for a specific meeting
   * const meetingItems = await user.getActionItems({ meeting_id: 'meeting-uuid' });
   *
   * // Get action items within a date range
   * const recent = await user.getActionItems({
   *   start_date: '2026-01-01',
   *   end_date: '2026-01-31',
   * });
   * ```
   */
  async getActionItems(params?: ActionItemListParams, options?: RequestOptions): Promise<ActionItemListResponse> {
    return actionItems.getActionItems(this.http, params, options);
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
    return actionItems.getAllActionItems(this.http, params, options);
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
    return actionItems.getActionItem(this.http, actionItemId, options);
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
    return actionItems.createActionItem(this.http, data, options);
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
    return actionItems.updateActionItem(this.http, actionItemId, data, options);
  }

  /**
   * Delete an action item.
   *
   * @param actionItemId - The unique action item ID to delete
   * @param options - Optional request options
   * @throws {ContioAPIError} If the action item is not found or deletion is denied
   */
  async deleteActionItem(actionItemId: string, options?: RequestOptions): Promise<void> {
    return actionItems.deleteActionItem(this.http, actionItemId, options);
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
    return profile.getUserProfile(this.http, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calendar endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get calendar events for the authenticated user within a time range.
   *
   * Requires the user to have connected their calendar via OAuth.
   *
   * @param params - Filter parameters
   * @param params.start_date - Start of the time range (ISO 8601 format, preferred)
   * @param params.end_date - End of the time range (ISO 8601 format, preferred)
   * @param params.start - Start of the time range (RFC3339 format, deprecated — use `start_date`)
   * @param params.end - End of the time range (RFC3339 format, deprecated — use `end_date`)
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
   *   start_date: '2026-01-20T00:00:00Z',
   *   end_date: '2026-01-27T23:59:59Z'
   * });
   * ```
   */
  async getCalendarEvents(params: CalendarEventListParams, options?: RequestOptions): Promise<CalendarEventListResponse> {
    return calendar.getCalendarEvents(this.http, params, options);
  }

  /**
   * Get all calendar events within a date range by automatically paginating through all pages.
   *
   * @param params - Required date range, optional direction (limit/offset managed automatically)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Array of all calendar events within the date range
   * @throws {ContioAPIError} If calendar is not connected or request fails
   *
   * @example
   * ```typescript
   * const allEvents = await user.getAllCalendarEvents({
   *   start_date: '2026-01-01T00:00:00Z',
   *   end_date: '2026-01-31T23:59:59Z'
   * });
   * console.log(`Found ${allEvents.length} events`);
   * ```
   */
  async getAllCalendarEvents(params: Omit<CalendarEventListParams, 'limit' | 'offset'>, options?: RequestOptions): Promise<CalendarEvent[]> {
    return calendar.getAllCalendarEvents(this.http, params, options);
  }

  /**
   * Get detailed information about a specific calendar event.
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
   * console.log(`Organizer: ${event.organizer?.email}`);
   * ```
   */
  async getCalendarEvent(calendarEventId: string, options?: RequestOptions): Promise<CalendarEventDetail> {
    return calendar.getCalendarEvent(this.http, calendarEventId, options);
  }

  /**
   * Link a calendar event to an existing meeting.
   *
   * @param meetingId - The meeting ID to link to
   * @param data - Calendar event linking data
   * @param data.calendar_event_id - The calendar event ID to link
   * @param options - Optional request options
   * @returns Confirmation of the link with event details
   * @throws {ContioAPIError} If the meeting or event is not found
   */
  async linkCalendarEvent(meetingId: string, data: LinkCalendarEventRequest, options?: RequestOptions): Promise<LinkCalendarEventResponse> {
    return calendar.linkCalendarEvent(this.http, meetingId, data, options);
  }

  /**
   * Create a new meeting from a calendar event.
   *
   * Automatically populates meeting details from the calendar event
   * including title, time, and participants.
   *
   * @param calendarEventId - The calendar event ID to create a meeting from
   * @param options - Optional request options
   * @returns The newly created meeting linked to the calendar event
   * @throws {ContioAPIError} If the calendar event is not found
   *
   * @example
   * ```typescript
   * const result = await user.createMeetingFromCalendarEvent('cal-event-123');
   * console.log('Created meeting:', result.meeting?.id);
   * ```
   */
  async createMeetingFromCalendarEvent(calendarEventId: string, options?: RequestOptions): Promise<CreateMeetingFromCalendarEventResponse>;
  /**
   * @deprecated Pass the calendar event ID as a string instead of a request object.
   * Use `createMeetingFromCalendarEvent('cal-event-123')` instead of
   * `createMeetingFromCalendarEvent({ calendar_event_id: 'cal-event-123' })`.
   * This overload will be removed in the next major version.
   */
  async createMeetingFromCalendarEvent(data: CreateMeetingFromCalendarEventRequest, options?: RequestOptions): Promise<CreateMeetingFromCalendarEventResponse>;
  async createMeetingFromCalendarEvent(calendarEventIdOrData: string | CreateMeetingFromCalendarEventRequest, options?: RequestOptions): Promise<CreateMeetingFromCalendarEventResponse> {
    return calendar.createMeetingFromCalendarEvent(this.http, calendarEventIdOrData, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting Context Document endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a paginated list of context documents for a meeting.
   *
   * Returns only documents uploaded by the current partner application —
   * documents created by other partners or by users directly are not visible.
   *
   * @param meetingId - The meeting ID to list context documents for (UUID format)
   * @param params - Optional pagination parameters
   * @param params.limit - Maximum number of documents to return (default: 25, max: 100)
   * @param params.offset - Number of documents to skip for pagination (default: 0)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Paginated list of context documents with total count
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * const response = await user.getMeetingContextDocuments('meeting-id', {
   *   limit: 10,
   * });
   * console.log(`Found ${response.total} context documents`);
   * for (const doc of response.items) {
   *   console.log(`${doc.title} (${doc.source_format})`);
   * }
   * ```
   */
  async getMeetingContextDocuments(
    meetingId: string,
    params?: MeetingContextListParams,
    options?: RequestOptions,
  ): Promise<MeetingContextListResponse> {
    return context.getMeetingContextDocuments(this.http, meetingId, params, options);
  }

  /**
   * Get all context documents for a meeting by automatically paginating
   * through all pages.
   *
   * @param meetingId - The meeting ID to list context documents for (UUID format)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Array of all context documents for the meeting
   * @throws {ContioAPIError} If any page request fails
   *
   * @example
   * ```typescript
   * const allDocs = await user.getAllMeetingContextDocuments('meeting-id');
   * console.log(`Total: ${allDocs.length} context documents`);
   * ```
   */
  async getAllMeetingContextDocuments(
    meetingId: string,
    options?: RequestOptions,
  ): Promise<MeetingContextDocument[]> {
    return context.getAllMeetingContextDocuments(this.http, meetingId, options);
  }

  /**
   * Get a specific context document by ID.
   *
   * @param meetingId - The meeting ID the document belongs to (UUID format)
   * @param documentId - The context document ID to retrieve (UUID format)
   * @param options - Optional request options (e.g., timezone override)
   * @returns The context document with full metadata
   * @throws {ContioAPIError} If the document is not found or access is denied
   *
   * @example
   * ```typescript
   * const doc = await user.getMeetingContextDocument('meeting-id', 'doc-id');
   * console.log(`${doc.title} — format: ${doc.source_format}`);
   * ```
   */
  async getMeetingContextDocument(
    meetingId: string,
    documentId: string,
    options?: RequestOptions,
  ): Promise<MeetingContextDocument> {
    return context.getMeetingContextDocument(this.http, meetingId, documentId, options);
  }

  /**
   * Upload a context document to a meeting.
   *
   * The file is sent as `multipart/form-data`. The SDK handles `FormData`
   * construction automatically — callers supply a plain request object.
   *
   * @param meetingId - The meeting ID to attach the document to (UUID format)
   * @param data - Upload parameters including the file, source format, and optional metadata
   * @param data.file - Document contents as a `Blob` (or `Buffer` / `File` in Node.js ≥ 22)
   * @param data.source_format - Declared format of the file (e.g. `'md'`, `'json'`)
   * @param data.title - Optional human-readable title (defaults to filename on the server)
   * @param data.context_type - Optional partner-defined category (e.g. `"agenda"`, `"crm_record"`)
   * @param options - Optional request options (e.g., timezone override)
   * @returns The newly created context document
   * @throws {ContioAPIError} If the meeting is not found, validation fails, or upload is denied
   *
   * @example
   * ```typescript
   * import { readFile } from 'node:fs/promises';
   *
   * const buffer = await readFile('./agenda.md');
   * const doc = await user.uploadMeetingContextDocument('meeting-id', {
   *   file: new Blob([buffer]),
   *   source_format: 'md',
   *   title: 'Sprint planning agenda',
   *   context_type: 'agenda',
   * });
   * console.log(`Uploaded: ${doc.id}`);
   * ```
   */
  async uploadMeetingContextDocument(
    meetingId: string,
    data: UploadMeetingContextRequest,
    options?: RequestOptions,
  ): Promise<MeetingContextDocument> {
    return context.uploadMeetingContextDocument(this.http, meetingId, data, options);
  }

  /**
   * Delete a context document from a meeting.
   *
   * This performs a soft-delete — the document's `deleted_at` timestamp is
   * set and it will no longer appear in list results or be available for
   * download.
   *
   * @param meetingId - The meeting ID the document belongs to (UUID format)
   * @param documentId - The context document ID to delete (UUID format)
   * @param options - Optional request options
   * @throws {ContioAPIError} If the document is not found or deletion is denied
   *
   * @example
   * ```typescript
   * await user.deleteMeetingContextDocument('meeting-id', 'doc-id');
   * ```
   */
  async deleteMeetingContextDocument(
    meetingId: string,
    documentId: string,
    options?: RequestOptions,
  ): Promise<void> {
    return context.deleteMeetingContextDocument(this.http, meetingId, documentId, options);
  }

  /**
   * Download the raw content of a context document.
   *
   * Returns the file bytes along with metadata extracted from the response
   * headers (filename, content type, size). The `data` field is an
   * `ArrayBuffer` that can be written to disk, converted to a `Buffer`,
   * or processed in-memory.
   *
   * @param meetingId - The meeting ID the document belongs to (UUID format)
   * @param documentId - The context document ID to download (UUID format)
   * @param options - Optional request options (e.g., timezone override)
   * @returns Structured response containing the file bytes and metadata
   * @throws {ContioAPIError} If the document is not found or access is denied
   *
   * @example
   * ```typescript
   * import { writeFile } from 'node:fs/promises';
   *
   * const content = await user.downloadMeetingContextDocumentContent(
   *   'meeting-id',
   *   'doc-id',
   * );
   * console.log(`Downloading ${content.filename} (${content.size} bytes)`);
   * await writeFile(content.filename ?? 'download.bin', Buffer.from(content.data));
   * ```
   */
  async downloadMeetingContextDocumentContent(
    meetingId: string,
    documentId: string,
    options?: RequestOptions,
  ): Promise<MeetingContextContentResponse> {
    return context.downloadMeetingContextDocumentContent(this.http, meetingId, documentId, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Chat Session endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new chat session and submit the first user message.
   *
   * The agent begins processing immediately. The response includes the session
   * and the initial user turn as `current_turn`. Listen for a
   * `session.turn.completed` webhook to know when the agent response is ready,
   * then call {@link getSession} to retrieve it.
   *
   * Requires the `chat:write` OAuth scope.
   *
   * @param data - Session creation data including the meeting ID and opening message
   * @param options - Optional request options
   * @returns The newly created session with `current_turn` populated
   * @throws {ContioAPIError} If validation fails or the meeting is not found
   *
   * @example
   * ```typescript
   * const session = await user.createChatSession({
   *   meeting_id: 'meeting-uuid',
   *   message: 'Summarize the key decisions from this meeting.',
   *   metadata: { partner_ref: 'crm-case-4821' },
   * });
   * console.log('Session created:', session.id);
   * ```
   */
  async createChatSession(data: CreateChatSessionRequest, options?: RequestOptions): Promise<ChatSession> {
    return chat.createSession(this.http, data, options);
  }

  /**
   * Get a paginated list of chat sessions for the authenticated user.
   *
   * Requires the `chat:read` OAuth scope.
   *
   * @param params - Optional filter and pagination parameters
   * @param options - Optional request options
   * @returns Paginated session list with total count
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * const response = await user.getChatSessions({ meeting_id: 'meeting-uuid' });
   * console.log(`Found ${response.total} sessions`);
   * ```
   */
  async getChatSessions(params?: ChatSessionListParams, options?: RequestOptions): Promise<ChatSessionListResponse> {
    return chat.getSessions(this.http, params, options);
  }

  /**
   * Get a specific chat session by ID, including its turns.
   *
   * By default returns only turns not yet seen by the caller (`include: 'undelivered'`).
   * Pass `include: 'all_turns'` to retrieve the full conversation history.
   *
   * Requires the `chat:read` OAuth scope.
   *
   * @param sessionId - The unique session ID (UUID format)
   * @param params - Optional query parameters (`include`, `turn_limit`, `turn_offset`)
   * @param options - Optional request options
   * @returns The session with its turns
   * @throws {ContioAPIError} If the session is not found
   *
   * @example
   * ```typescript
   * // Fetch full conversation history after receiving a webhook
   * const session = await user.getChatSession('session-uuid', { include: 'all_turns' });
   * for (const turn of session.turns?.items ?? []) {
   *   console.log(`[${turn.role}] ${turn.content}`);
   * }
   * ```
   */
  async getChatSession(sessionId: string, params?: GetChatSessionParams, options?: RequestOptions): Promise<ChatSession> {
    return chat.getSession(this.http, sessionId, params, options);
  }

  /**
   * Enqueue a new user message as the next turn in an existing session.
   *
   * Returns immediately with the queued turn and its position in the processing
   * queue. The agent processes all queued turns sequentially — wait for a
   * `session.turn.completed` webhook before calling {@link getChatSession}.
   *
   * Requires the `chat:write` OAuth scope.
   *
   * @param sessionId - The session ID to add a message to
   * @param data - The message to send
   * @param options - Optional request options
   * @returns The queued turn and its position in the processing queue
   * @throws {ContioAPIError} If the session is not found, closed, or the turn limit is reached
   *
   * @example
   * ```typescript
   * const { turn, position } = await user.sendChatMessage('session-uuid', {
   *   message: 'Create action items for each open question.',
   * });
   * console.log(`Turn ${turn.sequence_number} queued at position ${position}`);
   * ```
   */
  async sendChatMessage(sessionId: string, data: SendChatMessageRequest, options?: RequestOptions): Promise<SendChatMessageResponse> {
    return chat.sendMessage(this.http, sessionId, data, options);
  }

  /**
   * Retrieve a specific turn by ID within a session.
   *
   * This is useful when a `turn_id` is received via webhook and the partner
   * wants to fetch only that turn instead of the full session history.
   *
   * Requires the `chat:read` OAuth scope.
   *
   * @param sessionId - The session ID that contains the turn
   * @param turnId - The turn ID to retrieve
   * @param options - Optional request options
   * @returns The requested turn with full details
   * @throws {ContioAPIError} If the session or turn is not found
   *
   * @example
   * ```typescript
   * // Fetch a specific turn after receiving a webhook with turn_id
   * const turn = await user.getChatTurn('session-uuid', 'turn-uuid');
   * console.log(`[${turn.role}] ${turn.content}`);
   * ```
   */
  async getChatTurn(sessionId: string, turnId: string, options?: RequestOptions): Promise<ChatTurn> {
    return chat.getTurn(this.http, sessionId, turnId, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Toolkit endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get available toolkits with installation status.
   *
   * Returns toolkits that are active and available to install,
   * along with installation status for the user's workspace.
   *
   * @param params - Optional pagination parameters
   * @param options - Request options
   * @returns Paginated list of toolkits with installation status
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * const toolkits = await user.getToolkits({ limit: 10 });
   * for (const t of toolkits.items) {
   *   console.log(`${t.toolkit.name}: ${t.installation ? 'installed' : 'not installed'}`);
   * }
   * ```
   */
  async getToolkits(
    params?: ToolkitListParams,
    options?: RequestOptions,
  ): Promise<ToolkitWithInstallationListResponse> {
    return userToolkits.getToolkits(this.http, params, options);
  }

  /**
   * Get a specific toolkit with installation status.
   *
   * @param toolkitId - The unique toolkit ID
   * @param options - Request options
   * @returns The toolkit with installation status
   * @throws {ContioAPIError} If the toolkit is not found
   */
  async getToolkit(toolkitId: string, options?: RequestOptions): Promise<ToolkitWithInstallation> {
    return userToolkits.getToolkit(this.http, toolkitId, options);
  }

  /**
   * Install a toolkit in the user's workspace.
   *
   * Creates all toolkit entities (templates, next steps, action buttons)
   * in the user's workspace based on the toolkit manifest.
   *
   * @param toolkitId - The unique toolkit ID to install
   * @param options - Request options
   * @returns The installation record
   * @throws {ContioAPIError} If the toolkit is not found or already installed
   *
   * @example
   * ```typescript
   * const installation = await user.installToolkit('toolkit-uuid');
   * console.log(`Installed at ${installation.installed_at}`);
   * ```
   */
  async installToolkit(toolkitId: string, options?: RequestOptions): Promise<ToolkitInstallation> {
    return userToolkits.installToolkit(this.http, toolkitId, options);
  }

  /**
   * Uninstall a toolkit from the user's workspace.
   *
   * Removes all toolkit-created entities from the user's workspace.
   *
   * @param toolkitId - The unique toolkit ID to uninstall
   * @param options - Request options
   * @throws {ContioAPIError} If the toolkit is not found or not installed
   *
   * @example
   * ```typescript
   * await user.uninstallToolkit('toolkit-uuid');
   * console.log('Toolkit uninstalled');
   * ```
   */
  async uninstallToolkit(toolkitId: string, options?: RequestOptions): Promise<void> {
    return userToolkits.uninstallToolkit(this.http, toolkitId, options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting Template endpoints
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get meeting templates available to the user.
   *
   * Returns templates that the user can use to create meetings,
   * including associated next steps and action buttons.
   *
   * @param params - Optional pagination parameters
   * @param options - Request options
   * @returns Paginated list of meeting templates
   * @throws {ContioAPIError} If the request fails
   *
   * @example
   * ```typescript
   * const templates = await user.getMeetingTemplates({ limit: 10 });
   * for (const t of templates.items) {
   *   console.log(`${t.name}: ${t.next_steps?.length ?? 0} next steps`);
   * }
   * ```
   */
  async getMeetingTemplates(
    params?: userTemplates.UserMeetingTemplateListParams,
    options?: RequestOptions,
  ): Promise<userTemplates.UserMeetingTemplateListResponse> {
    return userTemplates.getMeetingTemplates(this.http, params, options);
  }

  /**
   * Get a specific meeting template.
   *
   * @param templateId - The unique template ID
   * @param options - Request options
   * @returns The meeting template with full details
   * @throws {ContioAPIError} If the template is not found
   */
  async getMeetingTemplate(
    templateId: string,
    options?: RequestOptions,
  ): Promise<userTemplates.UserMeetingTemplate> {
    return userTemplates.getMeetingTemplate(this.http, templateId, options);
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