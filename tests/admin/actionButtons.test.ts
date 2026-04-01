/**
 * Tests for Action Button admin endpoints.
 */

import {
  ActionButton,
  ActionButtonListResponse,
  CreateActionButtonRequest,
  UpdateActionButtonRequest,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Action Buttons', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockActionButton: ActionButton = {
    id: 'button-123',
    name: 'Send Email Summary',
    description: 'Send meeting summary via email',
    content_format: 'html',
    delivery_mechanism: 'email',
    email_subject_template: 'Meeting Summary: {{meeting.title}}',
    icon_url: 'https://example.com/email-icon.png',
    created_at: '2025-01-08T12:00:00Z',
    updated_at: '2025-01-08T12:00:00Z',
  };

  describe('createActionButton', () => {
    const createRequest: CreateActionButtonRequest = {
      name: 'Send Email Summary',
      description: 'Send meeting summary via email',
      content_format: 'html',
      delivery_mechanism: 'email',
      email_subject_template: 'Meeting Summary: {{meeting.title}}',
    };

    it('should create a new action button', async () => {
      ctx.mockAxios.onPost('/action-buttons').reply(201, mockActionButton);

      const button = await ctx.adminClient.createActionButton(createRequest);

      expect(button.id).toBe('button-123');
      expect(button.name).toBe('Send Email Summary');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/action-buttons').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Send Email Summary');
        expect(body.delivery_mechanism).toBe('email');
        expect(body.content_format).toBe('html');
        return [201, mockActionButton];
      });

      await ctx.adminClient.createActionButton(createRequest);
    });
  });

  describe('getActionButtons', () => {
    const mockResponse: ActionButtonListResponse = {
      items: [mockActionButton],
      total: 1,
      limit: 20,
      offset: 0,
    };

    it('should get list of action buttons', async () => {
      ctx.mockAxios.onGet('/action-buttons').reply(200, mockResponse);

      const response = await ctx.adminClient.getActionButtons();

      expect(response.items).toHaveLength(1);
      expect(response.items[0].name).toBe('Send Email Summary');
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/action-buttons').reply((config) => {
        expect(config.params.limit).toBe(25);
        expect(config.params.offset).toBe(50);
        return [200, mockResponse];
      });

      await ctx.adminClient.getActionButtons({ limit: 25, offset: 50 });
    });
  });

  describe('getActionButton', () => {
    it('should get a specific action button by ID', async () => {
      ctx.mockAxios.onGet('/action-buttons/button-123').reply(200, mockActionButton);

      const button = await ctx.adminClient.getActionButton('button-123');

      expect(button.id).toBe('button-123');
      expect(button.delivery_mechanism).toBe('email');
    });
  });

  describe('updateActionButton', () => {
    const updateRequest: UpdateActionButtonRequest = {
      name: 'Updated Button Name',
      description: 'Updated description',
    };

    it('should update an existing action button', async () => {
      const updated = { ...mockActionButton, name: 'Updated Button Name' };
      ctx.mockAxios.onPut('/action-buttons/button-123').reply(200, updated);

      const button = await ctx.adminClient.updateActionButton('button-123', updateRequest);

      expect(button.name).toBe('Updated Button Name');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPut('/action-buttons/button-123').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Updated Button Name');
        expect(body.description).toBe('Updated description');
        return [200, { ...mockActionButton, ...updateRequest }];
      });

      await ctx.adminClient.updateActionButton('button-123', updateRequest);
    });
  });

  describe('deleteActionButton', () => {
    it('should delete an action button', async () => {
      ctx.mockAxios.onDelete('/action-buttons/button-123').reply(204);

      await ctx.adminClient.deleteActionButton('button-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/action-buttons/button-123');
    });
  });
});

