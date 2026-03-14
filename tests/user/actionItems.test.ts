/**
 * Tests for Action Item endpoints.
 */

import {
  ActionItem,
  ActionItemListResponse,
  CreateActionItemRequest,
  UpdateActionItemRequest,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Action Items', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

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
      ctx.mockAxios.onGet('/action-items').reply(200, mockActionItemsResponse);

      const response = await ctx.userClient.getActionItems();

      expect(response.items).toHaveLength(2);
      expect(response.items[0].title).toBe('Review PR');
      expect(response.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/action-items').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(100);
        return [200, mockActionItemsResponse];
      });

      await ctx.userClient.getActionItems({ limit: 50, offset: 100 });
    });

    it('should support is_completed filter', async () => {
      ctx.mockAxios.onGet('/action-items').reply((config) => {
        expect(config.params.is_completed).toBe(true);
        return [200, mockActionItemsResponse];
      });

      await ctx.userClient.getActionItems({ is_completed: true });
    });

    it('should support meeting_id filter', async () => {
      ctx.mockAxios.onGet('/action-items').reply((config) => {
        expect(config.params.meeting_id).toBe('meeting-123');
        return [200, mockActionItemsResponse];
      });

      await ctx.userClient.getActionItems({ meeting_id: 'meeting-123' });
    });

    it('should support date range filters', async () => {
      ctx.mockAxios.onGet('/action-items').reply((config) => {
        expect(config.params.start_date).toBe('2025-01-01');
        expect(config.params.end_date).toBe('2025-01-31');
        return [200, mockActionItemsResponse];
      });

      await ctx.userClient.getActionItems({
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
      ctx.mockAxios.onGet('/action-items/action-123').reply(200, mockActionItem);

      const actionItem = await ctx.userClient.getActionItem('action-123');

      expect(actionItem.id).toBe('action-123');
      expect(actionItem.title).toBe('Complete feature implementation');
      expect(actionItem.is_completed).toBe(false);
    });
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
      ctx.mockAxios.onPost('/action-items').reply(201, mockCreatedActionItem);

      const actionItem = await ctx.userClient.createActionItem(createRequest);

      expect(actionItem.id).toBe('action-new');
      expect(actionItem.title).toBe('A new action item to complete');
      expect(actionItem.is_completed).toBe(false);
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/action-items').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.meeting_id).toBe('meeting-456');
        expect(body.title).toBe('A new action item to complete');
        expect(body.due_date).toBe('2025-01-25T00:00:00Z');
        return [201, mockCreatedActionItem];
      });

      await ctx.userClient.createActionItem(createRequest);
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
      ctx.mockAxios.onPut('/action-items/action-123').reply(200, mockUpdatedActionItem);

      const actionItem = await ctx.userClient.updateActionItem('action-123', updateRequest);

      expect(actionItem.title).toBe('Updated action item title');
      expect(actionItem.is_completed).toBe(true);
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPut('/action-items/action-123').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.title).toBe('Updated action item title');
        expect(body.is_completed).toBe(true);
        return [200, mockUpdatedActionItem];
      });

      await ctx.userClient.updateActionItem('action-123', updateRequest);
    });
  });

  describe('deleteActionItem', () => {
    it('should delete an action item', async () => {
      ctx.mockAxios.onDelete('/action-items/action-123').reply(204);

      await ctx.userClient.deleteActionItem('action-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/action-items/action-123');
    });
  });

  describe('getAllActionItems', () => {
    it('should fetch all pages of action items', async () => {
      ctx.mockAxios.onGet('/action-items').replyOnce(200, {
        items: [{ id: 'ai-1', title: 'Item 1' }, { id: 'ai-2', title: 'Item 2' }],
        total: 150,
        limit: 100,
        offset: 0,
      });
      ctx.mockAxios.onGet('/action-items').replyOnce(200, {
        items: [{ id: 'ai-3', title: 'Item 3' }],
        total: 150,
        limit: 100,
        offset: 100,
      });

      const items = await ctx.userClient.getAllActionItems();

      expect(items).toHaveLength(3);
      expect(items[0].id).toBe('ai-1');
      expect(items[2].id).toBe('ai-3');
      expect(ctx.mockAxios.history.get).toHaveLength(2);
    });
  });
});
