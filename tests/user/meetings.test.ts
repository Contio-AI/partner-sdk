/**
 * Tests for Meeting, Participant, and Agenda Item endpoints.
 */

import {
  Meeting,
  MeetingListResponse,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  MeetingParticipantListResponse,
  AgendaItem,
  AgendaItemListResponse,
  CreateAgendaItemRequest,
  UpdateAgendaItemRequest,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Meetings', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

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
      ctx.mockAxios.onGet('/meetings').reply(200, mockMeetingsResponse);

      const response = await ctx.userClient.getMeetings();

      expect(response.items).toHaveLength(2);
      expect(response.items[0].title).toBe('Team Standup');
      expect(response.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/meetings').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(100);
        return [200, mockMeetingsResponse];
      });

      await ctx.userClient.getMeetings({ limit: 50, offset: 100 });
    });

    it('should support date range filters', async () => {
      ctx.mockAxios.onGet('/meetings').reply((config) => {
        expect(config.params.start_date).toBe('2025-01-01');
        expect(config.params.end_date).toBe('2025-01-31');
        return [200, mockMeetingsResponse];
      });

      await ctx.userClient.getMeetings({
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
      ctx.mockAxios.onGet('/meetings/meeting-123').reply(200, mockMeeting);

      const meeting = await ctx.userClient.getMeeting('meeting-123');

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
      ctx.mockAxios.onGet('/meetings/meeting-123').replyOnce(200, redirectResponse);
      // Second request fetches the redirected meeting
      ctx.mockAxios.onGet('/meetings/meeting-copy-456').replyOnce(200, redirectedMeeting);

      const meeting = await ctx.userClient.getMeeting('meeting-123');

      // Should return the redirected meeting
      expect(meeting.id).toBe('meeting-copy-456');
      expect(meeting.title).toBe('Product Review (Copy)');
      expect(meeting.workspace_id).toBe('workspace-2');

      // Verify both requests were made
      expect(ctx.mockAxios.history.get).toHaveLength(2);
      expect(ctx.mockAxios.history.get[0].url).toBe('/meetings/meeting-123');
      expect(ctx.mockAxios.history.get[1].url).toBe('/meetings/meeting-copy-456');
    });
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
      ctx.mockAxios.onPost('/meetings').reply(201, mockCreatedMeeting);

      const meeting = await ctx.userClient.createMeeting(createRequest);

      expect(meeting.id).toBe('meeting-new');
      expect(meeting.title).toBe('New Meeting');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/meetings').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.title).toBe('New Meeting');
        expect(body.start_time).toBe('2025-01-15T10:00:00Z');
        expect(body.end_time).toBe('2025-01-15T11:00:00Z');
        return [201, mockCreatedMeeting];
      });

      await ctx.userClient.createMeeting(createRequest);
    });
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
      ctx.mockAxios.onPatch('/meetings/meeting-123').reply(200, mockUpdatedMeeting);

      const meeting = await ctx.userClient.updateMeeting('meeting-123', updateRequest);

      expect(meeting.title).toBe('Updated Meeting Title');
      expect(meeting.start_time).toBe('2025-01-10T16:00:00Z');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPatch('/meetings/meeting-123').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.title).toBe('Updated Meeting Title');
        expect(body.start_time).toBe('2025-01-10T16:00:00Z');
        return [200, mockUpdatedMeeting];
      });

      await ctx.userClient.updateMeeting('meeting-123', updateRequest);
    });

    it('should allow partial updates', async () => {
      ctx.mockAxios.onPatch('/meetings/meeting-123').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.title).toBe('Only Title Updated');
        expect(body.start_time).toBeUndefined();
        return [200, mockUpdatedMeeting];
      });

      await ctx.userClient.updateMeeting('meeting-123', { title: 'Only Title Updated' });
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
        ctx.mockAxios.onGet('/meetings/meeting-123/participants').reply(200, mockParticipantsResponse);

        const response = await ctx.userClient.getMeetingParticipants('meeting-123');

        expect(response.items).toHaveLength(2);
        expect(response.items![0].name).toBe('John Doe');
        expect(response.items![0].role).toBe('EDITOR');
        expect(response.items![1].name).toBe('Jane Smith');
        expect(response.total).toBe(2);
      });

      it('should use correct URL path', async () => {
        ctx.mockAxios.onGet('/meetings/meeting-456/participants').reply(200, mockParticipantsResponse);

        await ctx.userClient.getMeetingParticipants('meeting-456');

        expect(ctx.mockAxios.history.get).toHaveLength(1);
        expect(ctx.mockAxios.history.get[0].url).toBe('/meetings/meeting-456/participants');
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
        ctx.mockAxios.onGet('/meetings/meeting-123/agenda-items').reply(200, mockAgendaItemsResponse);

        const response = await ctx.userClient.getMeetingAgendaItems('meeting-123');

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
        ctx.mockAxios.onPost('/meetings/meeting-456/agenda-items').reply(201, mockCreatedAgendaItem);

        const agendaItem = await ctx.userClient.createAgendaItem('meeting-456', createRequest);

        expect(agendaItem.id).toBe('agenda-new');
        expect(agendaItem.title).toBe('New Discussion Topic');
        expect(agendaItem.item_type).toBe('DISCUSSION');
      });

      it('should send correct request body', async () => {
        ctx.mockAxios.onPost('/meetings/meeting-456/agenda-items').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.item_type).toBe('DISCUSSION');
          expect(body.title).toBe('New Discussion Topic');
          expect(body.time_allocation_minutes).toBe(20);
          return [201, mockCreatedAgendaItem];
        });

        await ctx.userClient.createAgendaItem('meeting-456', createRequest);
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
        ctx.mockAxios.onPut('/meetings/meeting-456/agenda-items/agenda-123').reply(200, mockUpdatedAgendaItem);

        const agendaItem = await ctx.userClient.updateAgendaItem('meeting-456', 'agenda-123', updateRequest);

        expect(agendaItem.title).toBe('Updated Agenda Item Title');
        expect(agendaItem.status).toBe('in_progress');
        expect(agendaItem.time_allocation_minutes).toBe(25);
      });

      it('should send correct request body', async () => {
        ctx.mockAxios.onPut('/meetings/meeting-456/agenda-items/agenda-123').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.title).toBe('Updated Agenda Item Title');
          expect(body.status).toBe('in_progress');
          expect(body.time_allocation_minutes).toBe(25);
          return [200, mockUpdatedAgendaItem];
        });

        await ctx.userClient.updateAgendaItem('meeting-456', 'agenda-123', updateRequest);
      });
    });

    describe('deleteAgendaItem', () => {
      it('should delete an agenda item', async () => {
        ctx.mockAxios.onDelete('/meetings/meeting-456/agenda-items/agenda-123').reply(204);

        await ctx.userClient.deleteAgendaItem('meeting-456', 'agenda-123');

        expect(ctx.mockAxios.history.delete).toHaveLength(1);
        expect(ctx.mockAxios.history.delete[0].url).toBe('/meetings/meeting-456/agenda-items/agenda-123');
      });
    });
  });

  describe('getAllMeetings', () => {
    it('should fetch all pages of meetings', async () => {
      ctx.mockAxios.onGet('/meetings').replyOnce(200, {
        items: [{ id: 'mtg-1', title: 'Meeting 1' }],
        total: 150,
        limit: 100,
        offset: 0,
      });
      ctx.mockAxios.onGet('/meetings').replyOnce(200, {
        items: [{ id: 'mtg-2', title: 'Meeting 2' }],
        total: 150,
        limit: 100,
        offset: 100,
      });

      const meetings = await ctx.userClient.getAllMeetings();

      expect(meetings).toHaveLength(2);
      expect(meetings[0].id).toBe('mtg-1');
      expect(meetings[1].id).toBe('mtg-2');
      expect(ctx.mockAxios.history.get).toHaveLength(2);
    });

    it('should pass filter params to each page request', async () => {
      ctx.mockAxios.onGet('/meetings').reply(200, {
        items: [{ id: 'mtg-1', title: 'Meeting 1' }],
        total: 1,
        limit: 100,
        offset: 0,
      });

      await ctx.userClient.getAllMeetings({ start_date: '2026-01-01' });

      expect(ctx.mockAxios.history.get[0].params.start_date).toBe('2026-01-01');
    });
  });
});