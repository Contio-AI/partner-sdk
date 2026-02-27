/**
 * Comprehensive unit tests for Partner User Client
 */

import MockAdapter from 'axios-mock-adapter';
import { OAuthClient } from '../src/auth/oauth';
import { PartnerUserClient } from '../src/client/user';
import {
  Meeting,
  MeetingListResponse,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  ActionItem,
  ActionItemListResponse,
  CreateActionItemRequest,
  UpdateActionItemRequest,
  UserProfile,
  CalendarEventListResponse,
  LinkCalendarEventRequest,
  LinkCalendarEventResponse,
  CreateMeetingFromCalendarEventRequest,
  CreateMeetingFromCalendarEventResponse,
  MeetingParticipantListResponse,
  AgendaItem,
  AgendaItemListResponse,
  CreateAgendaItemRequest,
  UpdateAgendaItemRequest,
} from '../src/models';

describe('PartnerUserClient', () => {
  let oauthClient: OAuthClient;
  let userClient: PartnerUserClient;
  let mockAxios: MockAdapter;

  const mockOAuthConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
  };

  beforeEach(() => {
    oauthClient = new OAuthClient(mockOAuthConfig);
    oauthClient.setTokens({ accessToken: 'test-access-token' });

    userClient = new PartnerUserClient(oauthClient);
    mockAxios = new MockAdapter((userClient as any).axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('constructor', () => {
    it('should initialize with default base URL', () => {
      const client = new PartnerUserClient(oauthClient);
      expect((client as any).config.baseURL).toBe('https://api.contio.ai/v1/partner/user');
    });

    it('should allow custom base URL', () => {
      const client = new PartnerUserClient(oauthClient, {
        baseURL: 'https://custom.api.example.com',
      });
      expect((client as any).config.baseURL).toBe('https://custom.api.example.com/v1/partner/user');
    });
  });

  describe('authentication', () => {
    it('should add Bearer token to requests', async () => {
      mockAxios.onGet('/meetings').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer test-access-token');
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      await userClient.getMeetings();
    });

    it('should throw error when no access token available', async () => {
      const clientWithoutToken = new PartnerUserClient(new OAuthClient(mockOAuthConfig));
      const mockAxios2 = new MockAdapter((clientWithoutToken as any).axiosInstance);
      mockAxios2.onGet('/meetings').reply(200, { items: [], total: 0, limit: 20, offset: 0 });

      // The error is now thrown asynchronously in addAuthHeaders before the request is made
      await expect((clientWithoutToken as any).addAuthHeaders({ headers: {} }))
        .rejects.toThrow('No access token available. Please authenticate first.');

      mockAxios2.reset();
    });
  });

  describe('Meeting endpoints', () => {
    describe('getMeetings', () => {
      const mockMeetingsResponse: MeetingListResponse = {
        items: [
          {
            id: 'meeting-1',
            title: 'Team Standup',
            start_time: '2025-01-08T10:00:00Z',
            end_time: '2025-01-08T10:30:00Z',
            status: 'completed',
            workspace_id: 'workspace-1',
            created_by_user_id: 'user-1',
            created_at: '2025-01-07T12:00:00Z',
            updated_at: '2025-01-08T10:30:00Z',
          },
          {
            id: 'meeting-2',
            title: 'Sprint Planning',
            start_time: '2025-01-09T14:00:00Z',
            end_time: '2025-01-09T16:00:00Z',
            status: 'scheduled',
            workspace_id: 'workspace-1',
            created_by_user_id: 'user-1',
            created_at: '2025-01-07T12:00:00Z',
            updated_at: '2025-01-07T12:00:00Z',
          },
        ],
        total: 2,
        limit: 20,
        offset: 0,
      };

      it('should get list of meetings', async () => {
        mockAxios.onGet('/meetings').reply(200, mockMeetingsResponse);

        const response = await userClient.getMeetings();

        expect(response.items).toHaveLength(2);
        expect(response.items[0].title).toBe('Team Standup');
        expect(response.total).toBe(2);
      });

      it('should support pagination parameters', async () => {
        mockAxios.onGet('/meetings').reply((config) => {
          expect(config.params.limit).toBe(50);
          expect(config.params.offset).toBe(100);
          return [200, mockMeetingsResponse];
        });

        await userClient.getMeetings({ limit: 50, offset: 100 });
      });

      it('should support date range filters', async () => {
        mockAxios.onGet('/meetings').reply((config) => {
          expect(config.params.start_date).toBe('2025-01-01');
          expect(config.params.end_date).toBe('2025-01-31');
          return [200, mockMeetingsResponse];
        });

        await userClient.getMeetings({
          start_date: '2025-01-01',
          end_date: '2025-01-31',
        });
      });
    });

    describe('getMeeting', () => {
      const mockMeeting: Meeting = {
        id: 'meeting-123',
        title: 'Product Review',
        summary_notes: 'Monthly product review meeting notes',
        start_time: '2025-01-10T15:00:00Z',
        end_time: '2025-01-10T16:00:00Z',
        status: 'scheduled',
        workspace_id: 'workspace-1',
        created_by_user_id: 'user-1',
        created_at: '2025-01-05T10:00:00Z',
        updated_at: '2025-01-05T10:00:00Z',
      };

      it('should get a specific meeting by ID', async () => {
        mockAxios.onGet('/meetings/meeting-123').reply(200, mockMeeting);

        const meeting = await userClient.getMeeting('meeting-123');

        expect(meeting.id).toBe('meeting-123');
        expect(meeting.title).toBe('Product Review');
        expect(meeting.summary_notes).toBe('Monthly product review meeting notes');
      });

      it('should automatically follow smart redirect to workspace copy', async () => {
        const redirectResponse = {
          redirect_to_meeting_id: 'meeting-copy-456',
        };

        const redirectedMeeting: Meeting = {
          id: 'meeting-copy-456',
          title: 'Product Review (Copy)',
          summary_notes: 'Workspace copy of the meeting',
          start_time: '2025-01-10T15:00:00Z',
          end_time: '2025-01-10T16:00:00Z',
          status: 'completed',
          workspace_id: 'workspace-2',
          created_by_user_id: 'user-2',
          created_at: '2025-01-10T16:00:00Z',
          updated_at: '2025-01-10T16:00:00Z',
        };

        // First request returns redirect hint
        mockAxios.onGet('/meetings/meeting-123').replyOnce(200, redirectResponse);
        // Second request fetches the redirected meeting
        mockAxios.onGet('/meetings/meeting-copy-456').replyOnce(200, redirectedMeeting);

        const meeting = await userClient.getMeeting('meeting-123');

        // Should return the redirected meeting
        expect(meeting.id).toBe('meeting-copy-456');
        expect(meeting.title).toBe('Product Review (Copy)');
        expect(meeting.workspace_id).toBe('workspace-2');

        // Verify both requests were made
        expect(mockAxios.history.get).toHaveLength(2);
        expect(mockAxios.history.get[0].url).toBe('/meetings/meeting-123');
        expect(mockAxios.history.get[1].url).toBe('/meetings/meeting-copy-456');
      });

      // Error handling tested separately - 4xx errors don't retry
    });

    describe('createMeeting', () => {
      const createRequest: CreateMeetingRequest = {
        title: 'New Meeting',
        start_time: '2025-01-15T10:00:00Z',
        end_time: '2025-01-15T11:00:00Z',
        is_instant: false,
      };

      const mockCreatedMeeting: Meeting = {
        id: 'meeting-new',
        title: createRequest.title,
        start_time: createRequest.start_time,
        end_time: createRequest.end_time,
        status: 'scheduled',
        workspace_id: 'workspace-1',
        created_by_user_id: 'user-1',
        created_at: '2025-01-08T12:00:00Z',
        updated_at: '2025-01-08T12:00:00Z',
      };

      it('should create a new meeting', async () => {
        mockAxios.onPost('/meetings').reply(201, mockCreatedMeeting);

        const meeting = await userClient.createMeeting(createRequest);

        expect(meeting.id).toBe('meeting-new');
        expect(meeting.title).toBe('New Meeting');
      });

      it('should send correct request body', async () => {
        mockAxios.onPost('/meetings').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.title).toBe('New Meeting');
          expect(body.start_time).toBe('2025-01-15T10:00:00Z');
          expect(body.end_time).toBe('2025-01-15T11:00:00Z');
          return [201, mockCreatedMeeting];
        });

        await userClient.createMeeting(createRequest);
      });

      // Error handling tested separately
    });

    describe('updateMeeting', () => {
      const updateRequest: UpdateMeetingRequest = {
        title: 'Updated Meeting Title',
        start_time: '2025-01-10T16:00:00Z',
      };

      const mockUpdatedMeeting: Meeting = {
        id: 'meeting-123',
        title: 'Updated Meeting Title',
        start_time: '2025-01-10T16:00:00Z',
        end_time: '2025-01-10T17:00:00Z',
        status: 'scheduled',
        workspace_id: 'workspace-1',
        created_by_user_id: 'user-1',
        created_at: '2025-01-05T10:00:00Z',
        updated_at: '2025-01-08T14:00:00Z',
      };

      it('should update an existing meeting', async () => {
        mockAxios.onPatch('/meetings/meeting-123').reply(200, mockUpdatedMeeting);

        const meeting = await userClient.updateMeeting('meeting-123', updateRequest);

        expect(meeting.title).toBe('Updated Meeting Title');
        expect(meeting.start_time).toBe('2025-01-10T16:00:00Z');
      });

      it('should send correct request body', async () => {
        mockAxios.onPatch('/meetings/meeting-123').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.title).toBe('Updated Meeting Title');
          expect(body.start_time).toBe('2025-01-10T16:00:00Z');
          return [200, mockUpdatedMeeting];
        });

        await userClient.updateMeeting('meeting-123', updateRequest);
      });

      it('should allow partial updates', async () => {
        mockAxios.onPatch('/meetings/meeting-123').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.title).toBe('Only Title Updated');
          expect(body.start_time).toBeUndefined();
          return [200, mockUpdatedMeeting];
        });

        await userClient.updateMeeting('meeting-123', { title: 'Only Title Updated' });
      });
    });
  });

  describe('Action Item endpoints', () => {
    describe('getActionItems', () => {
      const mockActionItemsResponse: ActionItemListResponse = {
        items: [
          {
            id: 'action-1',
            meeting_id: 'meeting-123',
            title: 'Review PR',
            is_completed: false,
            status: 'accepted',
            has_partner_assignment: true,
            created_at: '2025-01-07T10:00:00Z',
            updated_at: '2025-01-07T10:00:00Z',
          },
          {
            id: 'action-2',
            meeting_id: 'meeting-123',
            title: 'Update documentation',
            is_completed: false,
            status: 'in_progress',
            has_partner_assignment: true,
            created_at: '2025-01-06T14:00:00Z',
            updated_at: '2025-01-08T09:00:00Z',
          },
        ],
        total: 2,
        limit: 20,
        offset: 0,
      };

      it('should get list of action items', async () => {
        mockAxios.onGet('/action-items').reply(200, mockActionItemsResponse);

        const response = await userClient.getActionItems();

        expect(response.items).toHaveLength(2);
        expect(response.items[0].title).toBe('Review PR');
        expect(response.total).toBe(2);
      });

      it('should support pagination parameters', async () => {
        mockAxios.onGet('/action-items').reply((config) => {
          expect(config.params.limit).toBe(50);
          expect(config.params.offset).toBe(100);
          return [200, mockActionItemsResponse];
        });

        await userClient.getActionItems({ limit: 50, offset: 100 });
      });

      it('should support is_completed filter', async () => {
        mockAxios.onGet('/action-items').reply((config) => {
          expect(config.params.is_completed).toBe(true);
          return [200, mockActionItemsResponse];
        });

        await userClient.getActionItems({ is_completed: true });
      });

      it('should support meeting_id filter', async () => {
        mockAxios.onGet('/action-items').reply((config) => {
          expect(config.params.meeting_id).toBe('meeting-123');
          return [200, mockActionItemsResponse];
        });

        await userClient.getActionItems({ meeting_id: 'meeting-123' });
      });

      it('should support date range filters', async () => {
        mockAxios.onGet('/action-items').reply((config) => {
          expect(config.params.start_date).toBe('2025-01-01');
          expect(config.params.end_date).toBe('2025-01-31');
          return [200, mockActionItemsResponse];
        });

        await userClient.getActionItems({
          start_date: '2025-01-01',
          end_date: '2025-01-31',
        });
      });
    });

    describe('getActionItem', () => {
      const mockActionItem: ActionItem = {
        id: 'action-123',
        meeting_id: 'meeting-456',
        title: 'Complete feature implementation',
        is_completed: false,
        status: 'accepted',
        has_partner_assignment: true,
        due_date: '2025-01-20T00:00:00Z',
        partner_context: { external_id: 'ext-123' },
        created_at: '2025-01-05T10:00:00Z',
        updated_at: '2025-01-08T14:00:00Z',
      };

      it('should get a specific action item by ID', async () => {
        mockAxios.onGet('/action-items/action-123').reply(200, mockActionItem);

        const actionItem = await userClient.getActionItem('action-123');

        expect(actionItem.id).toBe('action-123');
        expect(actionItem.title).toBe('Complete feature implementation');
        expect(actionItem.is_completed).toBe(false);
      });

      // Error handling tested separately
    });

    describe('createActionItem', () => {
      const createRequest: CreateActionItemRequest = {
        meeting_id: 'meeting-456',
        title: 'A new action item to complete',
        due_date: '2025-01-25T00:00:00Z',
        partner_context: { external_id: 'ext-new' },
      };

      const mockCreatedActionItem: ActionItem = {
        id: 'action-new',
        meeting_id: createRequest.meeting_id,
        title: createRequest.title,
        is_completed: false,
        status: 'needs_review',
        has_partner_assignment: true,
        due_date: createRequest.due_date,
        partner_context: createRequest.partner_context,
        created_at: '2025-01-08T12:00:00Z',
        updated_at: '2025-01-08T12:00:00Z',
      };

      it('should create a new action item', async () => {
        mockAxios.onPost('/action-items').reply(201, mockCreatedActionItem);

        const actionItem = await userClient.createActionItem(createRequest);

        expect(actionItem.id).toBe('action-new');
        expect(actionItem.title).toBe('A new action item to complete');
        expect(actionItem.is_completed).toBe(false);
      });

      it('should send correct request body', async () => {
        mockAxios.onPost('/action-items').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.meeting_id).toBe('meeting-456');
          expect(body.title).toBe('A new action item to complete');
          expect(body.due_date).toBe('2025-01-25T00:00:00Z');
          return [201, mockCreatedActionItem];
        });

        await userClient.createActionItem(createRequest);
      });
    });

    describe('updateActionItem', () => {
      const updateRequest: UpdateActionItemRequest = {
        title: 'Updated action item title',
        is_completed: true,
      };

      const mockUpdatedActionItem: ActionItem = {
        id: 'action-123',
        meeting_id: 'meeting-456',
        title: 'Updated action item title',
        is_completed: true,
        status: 'completed',
        has_partner_assignment: true,
        completed_at: '2025-01-08T16:00:00Z',
        created_at: '2025-01-05T10:00:00Z',
        updated_at: '2025-01-08T16:00:00Z',
      };

      it('should update an existing action item', async () => {
        mockAxios.onPut('/action-items/action-123').reply(200, mockUpdatedActionItem);

        const actionItem = await userClient.updateActionItem('action-123', updateRequest);

        expect(actionItem.title).toBe('Updated action item title');
        expect(actionItem.is_completed).toBe(true);
      });

      it('should send correct request body', async () => {
        mockAxios.onPut('/action-items/action-123').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.title).toBe('Updated action item title');
          expect(body.is_completed).toBe(true);
          return [200, mockUpdatedActionItem];
        });

        await userClient.updateActionItem('action-123', updateRequest);
      });
    });

    describe('deleteActionItem', () => {
      it('should delete an action item', async () => {
        mockAxios.onDelete('/action-items/action-123').reply(204);

        await userClient.deleteActionItem('action-123');

        expect(mockAxios.history.delete).toHaveLength(1);
        expect(mockAxios.history.delete[0].url).toBe('/action-items/action-123');
      });

      // Error handling tested separately
    });
  });

  describe('User Profile endpoints', () => {
    describe('getUserProfile', () => {
      const mockUserProfile: UserProfile = {
        id: 'user-123',
        display_name: 'John Doe',
        email: 'john.doe@example.com',
        created_at: '2024-01-01T00:00:00Z',
        workspace_id: 'ws-uuid-456',
        workspace_name: 'Acme Corp',
        workspace_role: 'WORKSPACE_MEMBER',
      };

      it('should get user profile', async () => {
        mockAxios.onGet('/profile').reply(200, mockUserProfile);

        const profile = await userClient.getUserProfile();

        expect(profile.id).toBe('user-123');
        expect(profile.display_name).toBe('John Doe');
        expect(profile.email).toBe('john.doe@example.com');
      });

      it('should include workspace fields in profile', async () => {
        mockAxios.onGet('/profile').reply(200, mockUserProfile);

        const profile = await userClient.getUserProfile();

        expect(profile.workspace_id).toBe('ws-uuid-456');
        expect(profile.workspace_name).toBe('Acme Corp');
        expect(profile.workspace_role).toBe('WORKSPACE_MEMBER');
      });

      it('should handle workspace admin role in profile', async () => {
        const adminProfile: UserProfile = {
          ...mockUserProfile,
          workspace_role: 'WORKSPACE_ADMIN',
        };
        mockAxios.onGet('/profile').reply(200, adminProfile);

        const profile = await userClient.getUserProfile();

        expect(profile.workspace_role).toBe('WORKSPACE_ADMIN');
      });

      it('should handle workspace owner role in profile', async () => {
        const ownerProfile: UserProfile = {
          ...mockUserProfile,
          workspace_role: 'WORKSPACE_OWNER',
        };
        mockAxios.onGet('/profile').reply(200, ownerProfile);

        const profile = await userClient.getUserProfile();

        expect(profile.workspace_role).toBe('WORKSPACE_OWNER');
      });

      // Error handling tested separately
    });
  });

  describe('ensureValidToken', () => {
    it('should refresh token when expired', async () => {
      // Set expired token
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago
      oauthClient.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: expiredDate,
      });

      const refreshSpy = jest.spyOn(oauthClient, 'refreshAccessToken').mockResolvedValue({
        accessToken: 'new-token',
        refreshToken: 'new-refresh-token',
      });

      await userClient.ensureValidToken();

      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should not refresh token when still valid', async () => {
      // Set valid token
      const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
      oauthClient.setTokens({
        accessToken: 'valid-token',
        expiresAt: futureDate,
      });

      const refreshSpy = jest.spyOn(oauthClient, 'refreshAccessToken');

      await userClient.ensureValidToken();

      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });

  describe('Calendar endpoints', () => {
    describe('getCalendarEvents', () => {
      const mockCalendarEventsResponse: CalendarEventListResponse = {
        items: [
          {
            id: 'event-1',
            title: 'Weekly Team Sync',
            description: 'Discuss project updates',
            start_time: '2025-01-10T10:00:00-07:00',
            end_time: '2025-01-10T11:00:00-07:00',
            location: 'Conference Room A',
            attendees: [
              {
                email: 'john.doe@example.com',
                name: 'John Doe',
                status: 'accepted',
                type: 'required',
              },
            ],
            organizer: {
              email: 'jane.smith@example.com',
              name: 'Jane Smith',
            },
          },
        ],
        total: 1,
        limit: 25,
        offset: 0,
      };

      it('should get calendar events within time range', async () => {
        mockAxios.onGet('/calendar/events').reply(200, mockCalendarEventsResponse);

        const response = await userClient.getCalendarEvents({
          start_date: '2025-01-10T00:00:00Z',
          end_date: '2025-01-17T23:59:59Z',
        });

        expect(response.items).toHaveLength(1);
        expect(response.items![0].title).toBe('Weekly Team Sync');
        expect(response.total).toBe(1);
      });

      it('should send correct query parameters with start_date/end_date', async () => {
        mockAxios.onGet('/calendar/events').reply((config) => {
          expect(config.params.start_date).toBe('2025-01-10T00:00:00Z');
          expect(config.params.end_date).toBe('2025-01-17T23:59:59Z');
          expect(config.params.limit).toBe(50);
          expect(config.params.offset).toBe(10);
          return [200, mockCalendarEventsResponse];
        });

        await userClient.getCalendarEvents({
          start_date: '2025-01-10T00:00:00Z',
          end_date: '2025-01-17T23:59:59Z',
          limit: 50,
          offset: 10,
        });
      });

      it('should still support deprecated start/end parameters', async () => {
        mockAxios.onGet('/calendar/events').reply((config) => {
          expect(config.params.start).toBe('2025-01-10T00:00:00Z');
          expect(config.params.end).toBe('2025-01-17T23:59:59Z');
          return [200, mockCalendarEventsResponse];
        });

        await userClient.getCalendarEvents({
          start: '2025-01-10T00:00:00Z',
          end: '2025-01-17T23:59:59Z',
        });
      });
    });

    describe('getAllCalendarEvents', () => {
      it('should fetch all pages of calendar events', async () => {
        // Mock 2 pages (total: 150, page size: 100)
        mockAxios.onGet('/calendar/events').replyOnce(200, {
          items: [{ id: 'evt-1', title: 'Event 1' }, { id: 'evt-2', title: 'Event 2' }],
          total: 150,
          limit: 100,
          offset: 0,
        });
        mockAxios.onGet('/calendar/events').replyOnce(200, {
          items: [{ id: 'evt-3', title: 'Event 3' }],
          total: 150,
          limit: 100,
          offset: 100,
        });

        const events = await userClient.getAllCalendarEvents({
          start_date: '2026-01-01T00:00:00Z',
          end_date: '2026-01-31T23:59:59Z',
        });

        expect(events).toHaveLength(3);
        expect(events[0].id).toBe('evt-1');
        expect(events[2].id).toBe('evt-3');
        expect(mockAxios.history.get).toHaveLength(2);
      });

      it('should pass date params to each page request', async () => {
        mockAxios.onGet('/calendar/events').reply(200, {
          items: [{ id: 'evt-1', title: 'Event 1' }],
          total: 1,
          limit: 100,
          offset: 0,
        });

        await userClient.getAllCalendarEvents({
          start_date: '2026-01-01T00:00:00Z',
          end_date: '2026-01-31T23:59:59Z',
          direction: 'desc',
        });

        expect(mockAxios.history.get[0].params.start_date).toBe('2026-01-01T00:00:00Z');
        expect(mockAxios.history.get[0].params.end_date).toBe('2026-01-31T23:59:59Z');
        expect(mockAxios.history.get[0].params.direction).toBe('desc');
      });

      it('should handle empty response', async () => {
        mockAxios.onGet('/calendar/events').reply(200, {
          items: [],
          total: 0,
          limit: 100,
          offset: 0,
        });

        const events = await userClient.getAllCalendarEvents({
          start_date: '2026-01-01T00:00:00Z',
          end_date: '2026-01-31T23:59:59Z',
        });

        expect(events).toHaveLength(0);
      });
    });

    describe('getCalendarEvent', () => {
      const mockCalendarEventDetail = {
        id: 'cal-event-123',
        title: 'Product Planning Meeting',
        description: 'Q1 product roadmap discussion',
        start_time: '2026-01-31T14:00:00Z',
        end_time: '2026-01-31T15:30:00Z',
        location: 'Conference Room B',
        meeting_id: 'meeting-456',
        organizer: {
          email: 'product@example.com',
          name: 'Product Manager',
          status: 'accepted',
        },
        attendees: [
          {
            email: 'dev1@example.com',
            name: 'Developer One',
            status: 'accepted',
          },
          {
            email: 'dev2@example.com',
            name: 'Developer Two',
            status: 'tentative',
          },
        ],
      };

      it('should get calendar event details by ID', async () => {
        mockAxios.onGet('/calendar/events/cal-event-123').reply(200, mockCalendarEventDetail);

        const event = await userClient.getCalendarEvent('cal-event-123');

        expect(event.id).toBe('cal-event-123');
        expect(event.title).toBe('Product Planning Meeting');
        expect(event.meeting_id).toBe('meeting-456');
        expect(event.organizer?.email).toBe('product@example.com');
        expect(event.attendees).toHaveLength(2);
      });
    });

    describe('linkCalendarEvent', () => {
      const linkRequest: LinkCalendarEventRequest = {
        calendar_event_id: 'event-123',
      };

      const mockLinkResponse: LinkCalendarEventResponse = {
        success: true,
        message: 'Meeting linked to calendar event successfully',
      };

      it('should link calendar event to meeting', async () => {
        mockAxios.onPost('/meetings/meeting-456/calendar/link').reply(200, mockLinkResponse);

        const response = await userClient.linkCalendarEvent('meeting-456', linkRequest);

        expect(response.success).toBe(true);
        expect(response.message).toBe('Meeting linked to calendar event successfully');
      });

      it('should send correct request body', async () => {
        mockAxios.onPost('/meetings/meeting-456/calendar/link').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.calendar_event_id).toBe('event-123');
          return [200, mockLinkResponse];
        });

        await userClient.linkCalendarEvent('meeting-456', linkRequest);
      });
    });

    describe('createMeetingFromCalendarEvent', () => {
      const mockCreateResponse: CreateMeetingFromCalendarEventResponse = {
        created: true,
        meeting: {
          id: 'meeting-new',
          title: 'Weekly Team Sync',
        },
        message: 'Meeting created from calendar event successfully',
      };

      it('should create meeting from calendar event', async () => {
        mockAxios.onPost('/calendar/events/event-789/meeting').reply(201, mockCreateResponse);

        const response = await userClient.createMeetingFromCalendarEvent('event-789');

        expect(response.created).toBe(true);
        expect(response.meeting?.id).toBe('meeting-new');
        expect(response.message).toBe('Meeting created from calendar event successfully');
      });

      it('should use calendar event ID as path parameter', async () => {
        mockAxios.onPost('/calendar/events/event-789/meeting').reply((config) => {
          expect(config.url).toBe('/calendar/events/event-789/meeting');
          return [201, mockCreateResponse];
        });

        await userClient.createMeetingFromCalendarEvent('event-789');
      });

      it('should support deprecated object-based calling convention', async () => {
        mockAxios.onPost('/calendar/events/event-789/meeting').reply(201, mockCreateResponse);

        const request: CreateMeetingFromCalendarEventRequest = {
          calendar_event_id: 'event-789',
        };
        const response = await userClient.createMeetingFromCalendarEvent(request);

        expect(response.created).toBe(true);
        expect(response.meeting?.id).toBe('meeting-new');
        expect(response.message).toBe('Meeting created from calendar event successfully');
      });
    });
  });

  describe('Meeting Participant endpoints', () => {
    describe('getMeetingParticipants', () => {
      const mockParticipantsResponse: MeetingParticipantListResponse = {
        items: [
          {
            id: 'participant-1',
            meeting_id: 'meeting-123',
            user_id: 'user-456',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'EDITOR',
            is_attended: true,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          {
            id: 'participant-2',
            meeting_id: 'meeting-123',
            user_id: 'user-789',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'VIEWER',
            is_attended: false,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
        ],
        total: 2,
        limit: 20,
        offset: 0,
      };

      it('should get participants for a meeting', async () => {
        mockAxios.onGet('/meetings/meeting-123/participants').reply(200, mockParticipantsResponse);

        const response = await userClient.getMeetingParticipants('meeting-123');

        expect(response.items).toHaveLength(2);
        expect(response.items![0].name).toBe('John Doe');
        expect(response.items![0].role).toBe('EDITOR');
        expect(response.items![1].name).toBe('Jane Smith');
        expect(response.total).toBe(2);
      });

      it('should use correct URL path', async () => {
        mockAxios.onGet('/meetings/meeting-456/participants').reply(200, mockParticipantsResponse);

        await userClient.getMeetingParticipants('meeting-456');

        expect(mockAxios.history.get).toHaveLength(1);
        expect(mockAxios.history.get[0].url).toBe('/meetings/meeting-456/participants');
      });
    });
  });

  describe('Agenda Item endpoints', () => {
    describe('getMeetingAgendaItems', () => {
      const mockAgendaItemsResponse: AgendaItemListResponse = {
        items: [
          {
            id: 'agenda-1',
            meeting_id: 'meeting-123',
            title: 'Q1 Planning Discussion',
            description: 'Review and discuss Q1 objectives',
            item_type: 'DISCUSSION',
            status: 'pending',
            sequence: '1',
            time_allocation_minutes: 15,
            presenters: ['user-456'],
            restricted_to_leads: false,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          {
            id: 'agenda-2',
            meeting_id: 'meeting-123',
            title: 'Budget Approval',
            item_type: 'DECISION',
            status: 'in_progress',
            sequence: '2',
            time_allocation_minutes: 10,
            restricted_to_leads: true,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
        ],
        total: 2,
        limit: 20,
        offset: 0,
      };

      it('should get agenda items for a meeting', async () => {
        mockAxios.onGet('/meetings/meeting-123/agenda-items').reply(200, mockAgendaItemsResponse);

        const response = await userClient.getMeetingAgendaItems('meeting-123');

        expect(response.items).toHaveLength(2);
        expect(response.items![0].title).toBe('Q1 Planning Discussion');
        expect(response.items![0].item_type).toBe('DISCUSSION');
        expect(response.items![1].title).toBe('Budget Approval');
        expect(response.items![1].item_type).toBe('DECISION');
        expect(response.total).toBe(2);
      });
    });

    describe('createAgendaItem', () => {
      const createRequest: CreateAgendaItemRequest = {
        item_type: 'DISCUSSION',
        title: 'New Discussion Topic',
        description: 'Discuss new feature requirements',
        time_allocation_minutes: 20,
        presenters: ['user-123'],
        restricted_to_leads: false,
      };

      const mockCreatedAgendaItem: AgendaItem = {
        id: 'agenda-new',
        meeting_id: 'meeting-456',
        title: createRequest.title,
        description: createRequest.description,
        item_type: createRequest.item_type,
        status: 'pending',
        sequence: '3',
        time_allocation_minutes: createRequest.time_allocation_minutes,
        presenters: createRequest.presenters,
        restricted_to_leads: createRequest.restricted_to_leads,
        created_at: '2025-01-08T12:00:00Z',
        updated_at: '2025-01-08T12:00:00Z',
      };

      it('should create a new agenda item', async () => {
        mockAxios.onPost('/meetings/meeting-456/agenda-items').reply(201, mockCreatedAgendaItem);

        const agendaItem = await userClient.createAgendaItem('meeting-456', createRequest);

        expect(agendaItem.id).toBe('agenda-new');
        expect(agendaItem.title).toBe('New Discussion Topic');
        expect(agendaItem.item_type).toBe('DISCUSSION');
      });

      it('should send correct request body', async () => {
        mockAxios.onPost('/meetings/meeting-456/agenda-items').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.item_type).toBe('DISCUSSION');
          expect(body.title).toBe('New Discussion Topic');
          expect(body.time_allocation_minutes).toBe(20);
          return [201, mockCreatedAgendaItem];
        });

        await userClient.createAgendaItem('meeting-456', createRequest);
      });
    });

    describe('updateAgendaItem', () => {
      const updateRequest: UpdateAgendaItemRequest = {
        title: 'Updated Agenda Item Title',
        status: 'in_progress',
        time_allocation_minutes: 25,
      };

      const mockUpdatedAgendaItem: AgendaItem = {
        id: 'agenda-123',
        meeting_id: 'meeting-456',
        title: 'Updated Agenda Item Title',
        item_type: 'DISCUSSION',
        status: 'in_progress',
        sequence: '1',
        time_allocation_minutes: 25,
        created_at: '2025-01-05T10:00:00Z',
        updated_at: '2025-01-08T16:00:00Z',
      };

      it('should update an existing agenda item', async () => {
        mockAxios.onPut('/meetings/meeting-456/agenda-items/agenda-123').reply(200, mockUpdatedAgendaItem);

        const agendaItem = await userClient.updateAgendaItem('meeting-456', 'agenda-123', updateRequest);

        expect(agendaItem.title).toBe('Updated Agenda Item Title');
        expect(agendaItem.status).toBe('in_progress');
        expect(agendaItem.time_allocation_minutes).toBe(25);
      });

      it('should send correct request body', async () => {
        mockAxios.onPut('/meetings/meeting-456/agenda-items/agenda-123').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.title).toBe('Updated Agenda Item Title');
          expect(body.status).toBe('in_progress');
          expect(body.time_allocation_minutes).toBe(25);
          return [200, mockUpdatedAgendaItem];
        });

        await userClient.updateAgendaItem('meeting-456', 'agenda-123', updateRequest);
      });
    });

    describe('deleteAgendaItem', () => {
      it('should delete an agenda item', async () => {
        mockAxios.onDelete('/meetings/meeting-456/agenda-items/agenda-123').reply(204);

        await userClient.deleteAgendaItem('meeting-456', 'agenda-123');

        expect(mockAxios.history.delete).toHaveLength(1);
        expect(mockAxios.history.delete[0].url).toBe('/meetings/meeting-456/agenda-items/agenda-123');
      });
    });
  });

  describe('Pagination helpers', () => {
    describe('getAllMeetings', () => {
      it('should fetch all pages of meetings', async () => {
        // Mock 2 pages of meetings (total: 150 items, page size: 100)
        mockAxios.onGet('/meetings').replyOnce(200, {
          items: [{ id: 'mtg-1', title: 'Meeting 1' }],
          total: 150, // Total > 100 to trigger second page
          limit: 100,
          offset: 0,
        });
        mockAxios.onGet('/meetings').replyOnce(200, {
          items: [{ id: 'mtg-2', title: 'Meeting 2' }],
          total: 150,
          limit: 100,
          offset: 100,
        });

        const meetings = await userClient.getAllMeetings();

        expect(meetings).toHaveLength(2);
        expect(meetings[0].id).toBe('mtg-1');
        expect(meetings[1].id).toBe('mtg-2');
        expect(mockAxios.history.get).toHaveLength(2);
      });

      it('should pass filter params to each page request', async () => {
        mockAxios.onGet('/meetings').reply(200, {
          items: [{ id: 'mtg-1', title: 'Meeting 1' }],
          total: 1,
          limit: 100,
          offset: 0,
        });

        await userClient.getAllMeetings({ start_date: '2026-01-01' });

        expect(mockAxios.history.get[0].params.start_date).toBe('2026-01-01');
      });
    });

    describe('getAllActionItems', () => {
      it('should fetch all pages of action items', async () => {
        // Mock 2 pages (total: 150, page size: 100)
        mockAxios.onGet('/action-items').replyOnce(200, {
          items: [{ id: 'ai-1', title: 'Item 1' }, { id: 'ai-2', title: 'Item 2' }],
          total: 150, // Total > 100 to trigger second page
          limit: 100,
          offset: 0,
        });
        mockAxios.onGet('/action-items').replyOnce(200, {
          items: [{ id: 'ai-3', title: 'Item 3' }],
          total: 150,
          limit: 100,
          offset: 100,
        });

        const items = await userClient.getAllActionItems();

        expect(items).toHaveLength(3);
        expect(items[0].id).toBe('ai-1');
        expect(items[2].id).toBe('ai-3');
        expect(mockAxios.history.get).toHaveLength(2);
      });
    });
  });

  describe('Automatic token refresh', () => {
    it('should refresh token when expired before making request', async () => {
      // Create a client with an expired token
      const expiredOAuth = new OAuthClient(mockOAuthConfig);
      expiredOAuth.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'valid-refresh',
        expiresAt: new Date(Date.now() - 1000), // Already expired
      });

      const clientWithExpired = new PartnerUserClient(expiredOAuth);
      const mockAxios2 = new MockAdapter((clientWithExpired as any).axiosInstance);

      // Mock the token refresh
      jest.spyOn(expiredOAuth, 'refreshAccessToken').mockResolvedValue({
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        expiresAt: new Date(Date.now() + 3600000),
      });

      mockAxios2.onGet('/meetings').reply(200, { items: [], total: 0, limit: 20, offset: 0 });

      await clientWithExpired.getMeetings();

      expect(expiredOAuth.refreshAccessToken).toHaveBeenCalled();
      mockAxios2.reset();
    });
  });

  describe('Rate limit handling', () => {
    it('should retry on 429 with exponential backoff', async () => {
      // Create client with fast retry for testing
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 3, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      let requestCount = 0;
      fastMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount < 3) {
          return [429, { error: 'rate_limited' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      const result = await fastRetryClient.getMeetings();

      expect(requestCount).toBe(3);
      expect(result.items).toEqual([]);
      fastMockAxios.reset();
    });

    it('should respect Retry-After header in seconds', async () => {
      let requestCount = 0;
      mockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [429, { error: 'rate_limited' }, { 'retry-after': '1' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      const start = Date.now();
      await userClient.getMeetings();
      const elapsed = Date.now() - start;

      expect(requestCount).toBe(2);
      expect(elapsed).toBeGreaterThanOrEqual(900); // At least ~1 second
    });

    it('should throw after max retries on 429', async () => {
      // Create client with fast retry for testing
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 2, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);
      fastMockAxios.onGet('/meetings').reply(429, { error: 'rate_limited' });

      await expect(fastRetryClient.getMeetings()).rejects.toThrow();
      fastMockAxios.reset();
    });
  });

  describe('Error response request_id', () => {
    it('should surface request_id from error responses', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0, retryDelay: 0 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);
      noRetryMockAxios.onGet('/meetings').reply(400, {
        code: 'invalid_request',
        error: 'Invalid parameters',
        request_id: 'req-abc-123',
      });

      try {
        await noRetryClient.getMeetings();
        fail('Expected ContioAPIError to be thrown');
      } catch (err: any) {
        expect(err.name).toBe('ContioAPIError');
        expect(err.code).toBe('invalid_request');
        expect(err.message).toBe('Invalid parameters');
        expect(err.requestId).toBe('req-abc-123');
        expect(err.response.request_id).toBe('req-abc-123');
      }

      noRetryMockAxios.reset();
    });
  });
});
