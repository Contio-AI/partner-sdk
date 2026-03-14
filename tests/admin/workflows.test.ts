/**
 * Tests for Workflow endpoints.
 */

import {
  Workflow,
  WorkflowListResponse,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Workflows', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  describe('createWorkflow', () => {
    const createRequest: CreateWorkflowRequest = {
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

    const mockCreatedWorkflow: Workflow = {
      id: 'workflow-123',
      partner_app_id: 'app-456',
      name: createRequest.name,
      description: createRequest.description,
      trigger_type: createRequest.trigger_type,
      actions: createRequest.actions,
      status: 'active',
      created_at: '2025-01-08T12:00:00Z',
      updated_at: '2025-01-08T12:00:00Z',
    };

    it('should create a new workflow', async () => {
      ctx.mockAxios.onPost('/workflows').reply(201, mockCreatedWorkflow);

      const workflow = await ctx.adminClient.createWorkflow(createRequest);

      expect(workflow.id).toBe('workflow-123');
      expect(workflow.name).toBe('Create Jira Ticket');
      expect(workflow.status).toBe('active');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/workflows').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Create Jira Ticket');
        expect(body.trigger_type).toBe('action_item.created');
        expect(body.actions).toHaveLength(1);
        return [201, mockCreatedWorkflow];
      });

      await ctx.adminClient.createWorkflow(createRequest);
    });
  });

  describe('getWorkflows', () => {
    const mockWorkflowsResponse: WorkflowListResponse = {
      items: [
        {
          id: 'workflow-1',
          partner_app_id: 'app-456',
          name: 'Create Jira Ticket',
          trigger_type: 'action_item.created',
          actions: [{ type: 'jira.create_issue' }],
          status: 'active',
          created_at: '2025-01-07T10:00:00Z',
          updated_at: '2025-01-07T10:00:00Z',
        },
        {
          id: 'workflow-2',
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

    it('should get list of workflows', async () => {
      ctx.mockAxios.onGet('/workflows').reply(200, mockWorkflowsResponse);

      const response = await ctx.adminClient.getWorkflows();

      expect(response.items).toHaveLength(2);
      expect(response.items[0].name).toBe('Create Jira Ticket');
      expect(response.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/workflows').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(100);
        return [200, mockWorkflowsResponse];
      });

      await ctx.adminClient.getWorkflows({ limit: 50, offset: 100 });
    });
  });

  describe('getWorkflow', () => {
    const mockWorkflow: Workflow = {
      id: 'workflow-123',
      partner_app_id: 'app-456',
      name: 'Create Jira Ticket',
      description: 'Automatically create Jira tickets',
      trigger_type: 'action_item.created',
      actions: [{ type: 'jira.create_issue', config: { project: 'PROJ' } }],
      status: 'active',
      created_at: '2025-01-05T10:00:00Z',
      updated_at: '2025-01-05T10:00:00Z',
    };

    it('should get a specific workflow by ID', async () => {
      ctx.mockAxios.onGet('/workflows/workflow-123').reply(200, mockWorkflow);

      const workflow = await ctx.adminClient.getWorkflow('workflow-123');

      expect(workflow.id).toBe('workflow-123');
      expect(workflow.name).toBe('Create Jira Ticket');
      expect(workflow.actions).toHaveLength(1);
    });
  });



  describe('updateWorkflow', () => {
    const updateRequest: UpdateWorkflowRequest = {
      name: 'Updated Workflow Name',
      status: 'inactive',
    };

    const mockUpdatedWorkflow: Workflow = {
      id: 'workflow-123',
      partner_app_id: 'app-456',
      name: 'Updated Workflow Name',
      trigger_type: 'action_item.created',
      actions: [{ type: 'jira.create_issue' }],
      status: 'inactive',
      created_at: '2025-01-05T10:00:00Z',
      updated_at: '2025-01-08T14:00:00Z',
    };

    it('should update an existing workflow', async () => {
      ctx.mockAxios.onPut('/workflows/workflow-123').reply(200, mockUpdatedWorkflow);

      const workflow = await ctx.adminClient.updateWorkflow('workflow-123', updateRequest);

      expect(workflow.name).toBe('Updated Workflow Name');
      expect(workflow.status).toBe('inactive');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPut('/workflows/workflow-123').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Updated Workflow Name');
        expect(body.status).toBe('inactive');
        return [200, mockUpdatedWorkflow];
      });

      await ctx.adminClient.updateWorkflow('workflow-123', updateRequest);
    });
  });

  describe('deleteWorkflow', () => {
    it('should delete a workflow', async () => {
      ctx.mockAxios.onDelete('/workflows/workflow-123').reply(204);

      await ctx.adminClient.deleteWorkflow('workflow-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/workflows/workflow-123');
    });
  });
});