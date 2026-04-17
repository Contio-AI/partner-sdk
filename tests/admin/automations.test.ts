/**
 * Tests for Automation endpoints.
 */

import {
  Automation,
  AutomationListResponse,
  CreateAutomationRequest,
  UpdateAutomationRequest,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Automations', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  describe('createAutomation', () => {
    const createRequest: CreateAutomationRequest = {
      name: 'Create Jira Ticket',
      description: 'Automatically create Jira tickets for action items',
      trigger_type: 'action_item.created',
      actions: [
        {
          type: 'jira.create_issue',
          config: {
            project: 'PROJ',
            issue_type: 'Task',
          },
        },
      ],
    };

    const mockCreatedAutomation: Automation = {
      id: 'automation-123',
      partner_app_id: 'app-456',
      name: createRequest.name,
      description: createRequest.description,
      trigger_type: createRequest.trigger_type,
      actions: createRequest.actions,
      status: 'active',
      created_at: '2025-01-08T12:00:00Z',
      updated_at: '2025-01-08T12:00:00Z',
    };

    it('should create a new automation', async () => {
      ctx.mockAxios.onPost('/automations').reply(201, mockCreatedAutomation);

      const automation = await ctx.adminClient.createAutomation(createRequest);

      expect(automation.id).toBe('automation-123');
      expect(automation.name).toBe('Create Jira Ticket');
      expect(automation.status).toBe('active');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/automations').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Create Jira Ticket');
        expect(body.trigger_type).toBe('action_item.created');
        expect(body.actions).toHaveLength(1);
        return [201, mockCreatedAutomation];
      });

      await ctx.adminClient.createAutomation(createRequest);
    });
  });

  describe('getAutomations', () => {
    const mockAutomationsResponse: AutomationListResponse = {
      items: [
        {
          id: 'automation-1',
          partner_app_id: 'app-456',
          name: 'Create Jira Ticket',
          trigger_type: 'action_item.created',
          actions: [{ type: 'jira.create_issue' }],
          status: 'active',
          created_at: '2025-01-07T10:00:00Z',
          updated_at: '2025-01-07T10:00:00Z',
        },
        {
          id: 'automation-2',
          partner_app_id: 'app-456',
          name: 'Send Slack Notification',
          trigger_type: 'meeting.completed',
          actions: [{ type: 'slack.send_message' }],
          status: 'active',
          created_at: '2025-01-06T14:00:00Z',
          updated_at: '2025-01-06T14:00:00Z',
        },
      ],
      total: 2,
      limit: 20,
      offset: 0,
    };

    it('should get list of automations', async () => {
      ctx.mockAxios.onGet('/automations').reply(200, mockAutomationsResponse);

      const response = await ctx.adminClient.getAutomations();

      expect(response.items).toHaveLength(2);
      expect(response.items[0].name).toBe('Create Jira Ticket');
      expect(response.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/automations').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(100);
        return [200, mockAutomationsResponse];
      });

      await ctx.adminClient.getAutomations({ limit: 50, offset: 100 });
    });
  });

  describe('getAutomation', () => {
    const mockAutomation: Automation = {
      id: 'automation-123',
      partner_app_id: 'app-456',
      name: 'Create Jira Ticket',
      description: 'Automatically create Jira tickets',
      trigger_type: 'action_item.created',
      actions: [{ type: 'jira.create_issue', config: { project: 'PROJ' } }],
      status: 'active',
      created_at: '2025-01-05T10:00:00Z',
      updated_at: '2025-01-05T10:00:00Z',
    };

    it('should get a specific automation by ID', async () => {
      ctx.mockAxios.onGet('/automations/automation-123').reply(200, mockAutomation);

      const automation = await ctx.adminClient.getAutomation('automation-123');

      expect(automation.id).toBe('automation-123');
      expect(automation.name).toBe('Create Jira Ticket');
      expect(automation.actions).toHaveLength(1);
    });
  });



  describe('updateAutomation', () => {
    const updateRequest: UpdateAutomationRequest = {
      name: 'Updated Automation Name',
      status: 'inactive',
    };

    const mockUpdatedAutomation: Automation = {
      id: 'automation-123',
      partner_app_id: 'app-456',
      name: 'Updated Automation Name',
      trigger_type: 'action_item.created',
      actions: [{ type: 'jira.create_issue' }],
      status: 'inactive',
      created_at: '2025-01-05T10:00:00Z',
      updated_at: '2025-01-08T14:00:00Z',
    };

    it('should update an existing automation', async () => {
      ctx.mockAxios.onPut('/automations/automation-123').reply(200, mockUpdatedAutomation);

      const automation = await ctx.adminClient.updateAutomation('automation-123', updateRequest);

      expect(automation.name).toBe('Updated Automation Name');
      expect(automation.status).toBe('inactive');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPut('/automations/automation-123').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Updated Automation Name');
        expect(body.status).toBe('inactive');
        return [200, mockUpdatedAutomation];
      });

      await ctx.adminClient.updateAutomation('automation-123', updateRequest);
    });
  });

  describe('deleteAutomation', () => {
    it('should delete a automation', async () => {
      ctx.mockAxios.onDelete('/automations/automation-123').reply(204);

      await ctx.adminClient.deleteAutomation('automation-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/automations/automation-123');
    });
  });
});