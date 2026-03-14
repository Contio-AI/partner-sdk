/**
 * Tests for Calendar endpoints.
 */

import {
  CalendarEventListResponse,
  LinkCalendarEventRequest,
  LinkCalendarEventResponse,
  CreateMeetingFromCalendarEventRequest,
  CreateMeetingFromCalendarEventResponse,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Calendar', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

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
      ctx.mockAxios.onGet('/calendar/events').reply(200, mockCalendarEventsResponse);

      const response = await ctx.userClient.getCalendarEvents({
        start_date: '2025-01-10T00:00:00Z',
        end_date: '2025-01-17T23:59:59Z',
      });

      expect(response.items).toHaveLength(1);
      expect(response.items![0].title).toBe('Weekly Team Sync');
      expect(response.total).toBe(1);
    });

    it('should send correct query parameters with start_date/end_date', async () => {
      ctx.mockAxios.onGet('/calendar/events').reply((config) => {
        expect(config.params.start_date).toBe('2025-01-10T00:00:00Z');
        expect(config.params.end_date).toBe('2025-01-17T23:59:59Z');
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(10);
        return [200, mockCalendarEventsResponse];
      });

      await ctx.userClient.getCalendarEvents({
        start_date: '2025-01-10T00:00:00Z',
        end_date: '2025-01-17T23:59:59Z',
        limit: 50,
        offset: 10,
      });
    });

    it('should still support deprecated start/end parameters', async () => {
      ctx.mockAxios.onGet('/calendar/events').reply((config) => {
        expect(config.params.start).toBe('2025-01-10T00:00:00Z');
        expect(config.params.end).toBe('2025-01-17T23:59:59Z');
        return [200, mockCalendarEventsResponse];
      });

      await ctx.userClient.getCalendarEvents({
        start: '2025-01-10T00:00:00Z',
        end: '2025-01-17T23:59:59Z',
      });
    });
  });

  describe('getAllCalendarEvents', () => {
    it('should fetch all pages of calendar events', async () => {
      ctx.mockAxios.onGet('/calendar/events').replyOnce(200, {
        items: [{ id: 'evt-1', title: 'Event 1' }, { id: 'evt-2', title: 'Event 2' }],
        total: 150,
        limit: 100,
        offset: 0,
      });
      ctx.mockAxios.onGet('/calendar/events').replyOnce(200, {
        items: [{ id: 'evt-3', title: 'Event 3' }],
        total: 150,
        limit: 100,
        offset: 100,
      });

      const events = await ctx.userClient.getAllCalendarEvents({
        start_date: '2026-01-01T00:00:00Z',
        end_date: '2026-01-31T23:59:59Z',
      });

      expect(events).toHaveLength(3);
      expect(events[0].id).toBe('evt-1');
      expect(events[2].id).toBe('evt-3');
      expect(ctx.mockAxios.history.get).toHaveLength(2);
    });

    it('should pass date params to each page request', async () => {
      ctx.mockAxios.onGet('/calendar/events').reply(200, {
        items: [{ id: 'evt-1', title: 'Event 1' }],
        total: 1,
        limit: 100,
        offset: 0,
      });

      await ctx.userClient.getAllCalendarEvents({
        start_date: '2026-01-01T00:00:00Z',
        end_date: '2026-01-31T23:59:59Z',
        direction: 'desc',
      });

      expect(ctx.mockAxios.history.get[0].params.start_date).toBe('2026-01-01T00:00:00Z');
      expect(ctx.mockAxios.history.get[0].params.end_date).toBe('2026-01-31T23:59:59Z');
      expect(ctx.mockAxios.history.get[0].params.direction).toBe('desc');
    });



    it('should handle empty response', async () => {
      ctx.mockAxios.onGet('/calendar/events').reply(200, {
        items: [],
        total: 0,
        limit: 100,
        offset: 0,
      });

      const events = await ctx.userClient.getAllCalendarEvents({
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
      ctx.mockAxios.onGet('/calendar/events/cal-event-123').reply(200, mockCalendarEventDetail);

      const event = await ctx.userClient.getCalendarEvent('cal-event-123');

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
      ctx.mockAxios.onPost('/meetings/meeting-456/calendar/link').reply(200, mockLinkResponse);

      const response = await ctx.userClient.linkCalendarEvent('meeting-456', linkRequest);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Meeting linked to calendar event successfully');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-456/calendar/link').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.calendar_event_id).toBe('event-123');
        return [200, mockLinkResponse];
      });

      await ctx.userClient.linkCalendarEvent('meeting-456', linkRequest);
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
      ctx.mockAxios.onPost('/calendar/events/event-789/meeting').reply(201, mockCreateResponse);

      const response = await ctx.userClient.createMeetingFromCalendarEvent('event-789');

      expect(response.created).toBe(true);
      expect(response.meeting?.id).toBe('meeting-new');
      expect(response.message).toBe('Meeting created from calendar event successfully');
    });

    it('should use calendar event ID as path parameter', async () => {
      ctx.mockAxios.onPost('/calendar/events/event-789/meeting').reply((config) => {
        expect(config.url).toBe('/calendar/events/event-789/meeting');
        return [201, mockCreateResponse];
      });

      await ctx.userClient.createMeetingFromCalendarEvent('event-789');
    });

    it('should support deprecated object-based calling convention', async () => {
      ctx.mockAxios.onPost('/calendar/events/event-789/meeting').reply(201, mockCreateResponse);

      const request: CreateMeetingFromCalendarEventRequest = {
        calendar_event_id: 'event-789',
      };
      const response = await ctx.userClient.createMeetingFromCalendarEvent(request);

      expect(response.created).toBe(true);
      expect(response.meeting?.id).toBe('meeting-new');
      expect(response.message).toBe('Meeting created from calendar event successfully');
    });
  });
});