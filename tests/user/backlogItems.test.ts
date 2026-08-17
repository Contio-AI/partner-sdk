/**
 * Tests for Backlog Item endpoints.
 */

import {
  BacklogItem,
  BacklogItemListResponse,
  CreateBacklogItemRequest,
  UpdateBacklogItemRequest,
  AssignBacklogItemRequest,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Backlog Items', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockBacklogItem: BacklogItem = {
    id: 'backlog-1',
    title: 'Q3 roadmap review',
    description: 'Review the Q3 roadmap',
    item_type: 'DISCUSSION',
    origin_type: 'MANUAL',
    presenters: ['user-123'],
    time_allocation_minutes: 15,
    talking_points: 'Key points: budget, timeline',
  };

  describe('getBacklogItems', () => {
    const mockResponse: BacklogItemListResponse = {
      items: [mockBacklogItem],
      total: 1,
      limit: 25,
      offset: 0,
    };

    it('should list active backlog items', async () => {
      ctx.mockAxios.onGet('/backlog-items').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(10);
        expect(config.params.sort_order).toBe('asc');
        return [200, mockResponse];
      });

      const response = await ctx.userClient.getBacklogItems({ limit: 50, offset: 10, sort_order: 'asc' });

      expect(response.items).toHaveLength(1);
      expect(response.items[0].id).toBe('backlog-1');
      expect(response.total).toBe(1);
    });
  });

  describe('getAllBacklogItems', () => {
    it('should fetch all active backlog items across pages', async () => {
      ctx.mockAxios
        .onGet('/backlog-items')
        .replyOnce(200, {
          items: [{ id: 'backlog-1', title: 'Item 1' }],
          total: 150,
          limit: 100,
          offset: 0,
        })
        .onGet('/backlog-items')
        .replyOnce(200, {
          items: [{ id: 'backlog-2', title: 'Item 2' }],
          total: 150,
          limit: 100,
          offset: 100,
        });

      const items = await ctx.userClient.getAllBacklogItems({ sort_order: 'desc' });

      expect(items).toHaveLength(2);
      expect(ctx.mockAxios.history.get[0].params.sort_order).toBe('desc');
    });
  });

  describe('createBacklogItem', () => {
    const createRequest: CreateBacklogItemRequest = {
      title: 'New backlog item',
      item_type: 'QUESTIONS_TO_ANSWER',
      description: 'What are the blockers?',
      time_allocation_minutes: 10,
      presenters: ['user-456'],
      talking_points: 'Private notes',
    };

    it('should create a backlog item', async () => {
      ctx.mockAxios.onPost('/backlog-items').reply(201, mockBacklogItem);

      const item = await ctx.userClient.createBacklogItem(createRequest);

      expect(item.id).toBe('backlog-1');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/backlog-items').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.title).toBe('New backlog item');
        expect(body.item_type).toBe('QUESTIONS_TO_ANSWER');
        expect(body.presenters).toEqual(['user-456']);
        return [201, mockBacklogItem];
      });

      await ctx.userClient.createBacklogItem(createRequest);
    });
  });

  describe('getBacklogItem', () => {
    it('should get a single backlog item', async () => {
      ctx.mockAxios.onGet('/backlog-items/backlog-1').reply(200, mockBacklogItem);

      const item = await ctx.userClient.getBacklogItem('backlog-1');

      expect(item.id).toBe('backlog-1');
      expect(item.title).toBe('Q3 roadmap review');
    });
  });

  describe('updateBacklogItem', () => {
    const updateRequest: UpdateBacklogItemRequest = {
      title: 'Updated backlog title',
      time_allocation_minutes: 20,
    };

    it('should update a backlog item', async () => {
      ctx.mockAxios.onPut('/backlog-items/backlog-1').reply(200, { ...mockBacklogItem, ...updateRequest });

      const item = await ctx.userClient.updateBacklogItem('backlog-1', updateRequest);

      expect(item.title).toBe('Updated backlog title');
      expect(item.time_allocation_minutes).toBe(20);
    });
  });

  describe('deleteBacklogItem', () => {
    it('should delete a backlog item', async () => {
      ctx.mockAxios.onDelete('/backlog-items/backlog-1').reply(204);

      await ctx.userClient.deleteBacklogItem('backlog-1');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/backlog-items/backlog-1');
    });
  });

  describe('assignBacklogItem', () => {
    const assignRequest: AssignBacklogItemRequest = { meeting_id: 'meeting-456' };

    it('should assign a backlog item to a meeting', async () => {
      ctx.mockAxios.onPost('/backlog-items/backlog-1/assign').reply(200, {
        agenda_item_id: 'agenda-123',
        backlog_item_id: 'backlog-1',
        meeting_id: 'meeting-456',
      });

      const result = await ctx.userClient.assignBacklogItem('backlog-1', assignRequest);

      expect(result.agenda_item_id).toBe('agenda-123');
      expect(result.meeting_id).toBe('meeting-456');
    });
  });

  describe('getBacklogItemHistory', () => {
    const mockHistory: BacklogItemListResponse = {
      items: [
        {
          ...mockBacklogItem,
          assigned_at: '2026-01-01T00:00:00Z',
          destination_meeting_id: 'meeting-456',
        },
      ],
      total: 1,
      limit: 25,
      offset: 0,
    };

    it('should list backlog item history', async () => {
      ctx.mockAxios.onGet('/backlog-items/history').reply(200, mockHistory);

      const response = await ctx.userClient.getBacklogItemHistory({ limit: 25, offset: 0 });

      expect(response.items).toHaveLength(1);
      expect(response.items[0].destination_meeting_id).toBe('meeting-456');
    });
  });

  describe('getAllBacklogItemHistory', () => {
    it('should fetch all backlog history across pages', async () => {
      ctx.mockAxios
        .onGet('/backlog-items/history')
        .replyOnce(200, {
          items: [{ id: 'backlog-1' }],
          total: 150,
          limit: 100,
          offset: 0,
        })
        .onGet('/backlog-items/history')
        .replyOnce(200, {
          items: [{ id: 'backlog-2' }],
          total: 150,
          limit: 100,
          offset: 100,
        });

      const items = await ctx.userClient.getAllBacklogItemHistory({ sort_order: 'asc' });

      expect(items).toHaveLength(2);
    });
  });
});
