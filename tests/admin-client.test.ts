/**
 * Comprehensive unit tests for Partner Admin Client
 */

import MockAdapter from 'axios-mock-adapter';
import { ApiKeyClient } from '../src/auth/apiKey';
import { PartnerAdminClient } from '../src/client/admin';
import {
  Workflow,
  WorkflowListResponse,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  PartnerApp,
  UpdatePartnerAppRequest,
  UpdatePartnerAppStatusRequest,
  WebhookDelivery,
  WebhookDeliveryListResponse,
  UserConnection,
  UserConnectionListResponse,
} from '../src/models';

describe('PartnerAdminClient', () => {
  let apiKeyClient: ApiKeyClient;
  let adminClient: PartnerAdminClient;
  let mockAxios: MockAdapter;

  const mockApiKeyConfig = {
    apiKey: 'ctio_test_api_key_12345',
    clientId: 'test-client-id',
  };

  beforeEach(() => {
    apiKeyClient = new ApiKeyClient(mockApiKeyConfig);
    adminClient = new PartnerAdminClient(apiKeyClient);
    mockAxios = new MockAdapter((adminClient as any).axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('constructor', () => {
    it('should initialize with default base URL', () => {
      const client = new PartnerAdminClient(apiKeyClient);
      expect((client as any).config.baseURL).toBe('https://api.contio.ai/v1/partner/admin');
    });

    it('should allow custom base URL', () => {
      const client = new PartnerAdminClient(apiKeyClient, {
        baseURL: 'https://custom.api.example.com',
      });
      expect((client as any).config.baseURL).toBe('https://custom.api.example.com/v1/partner/admin');
    });
  });

  describe('authentication', () => {
    it('should add API key headers to requests', async () => {
      mockAxios.onGet('/app').reply((config) => {
        expect(config.headers?.['X-API-Key']).toBe('ctio_test_api_key_12345');
        expect(config.headers?.['X-Client-ID']).toBe('test-client-id');
        return [200, { id: 'app-123', name: 'Test App' }];
      });

      await adminClient.getApp();
    });
  });

  describe('Workflow endpoints', () => {
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
        mockAxios.onPost('/workflows').reply(201, mockCreatedWorkflow);

        const workflow = await adminClient.createWorkflow(createRequest);

        expect(workflow.id).toBe('workflow-123');
        expect(workflow.name).toBe('Create Jira Ticket');
        expect(workflow.status).toBe('active');
      });

      it('should send correct request body', async () => {
        mockAxios.onPost('/workflows').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.name).toBe('Create Jira Ticket');
          expect(body.trigger_type).toBe('action_item.created');
          expect(body.actions).toHaveLength(1);
          return [201, mockCreatedWorkflow];
        });

        await adminClient.createWorkflow(createRequest);
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
        mockAxios.onGet('/workflows').reply(200, mockWorkflowsResponse);

        const response = await adminClient.getWorkflows();

        expect(response.items).toHaveLength(2);
        expect(response.items[0].name).toBe('Create Jira Ticket');
        expect(response.total).toBe(2);
      });

      it('should support pagination parameters', async () => {
        mockAxios.onGet('/workflows').reply((config) => {
          expect(config.params.limit).toBe(50);
          expect(config.params.offset).toBe(100);
          return [200, mockWorkflowsResponse];
        });

        await adminClient.getWorkflows({ limit: 50, offset: 100 });
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
        mockAxios.onGet('/workflows/workflow-123').reply(200, mockWorkflow);

        const workflow = await adminClient.getWorkflow('workflow-123');

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
        mockAxios.onPut('/workflows/workflow-123').reply(200, mockUpdatedWorkflow);

        const workflow = await adminClient.updateWorkflow('workflow-123', updateRequest);

        expect(workflow.name).toBe('Updated Workflow Name');
        expect(workflow.status).toBe('inactive');
      });

      it('should send correct request body', async () => {
        mockAxios.onPut('/workflows/workflow-123').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.name).toBe('Updated Workflow Name');
          expect(body.status).toBe('inactive');
          return [200, mockUpdatedWorkflow];
        });

        await adminClient.updateWorkflow('workflow-123', updateRequest);
      });
    });

    describe('deleteWorkflow', () => {
      it('should delete a workflow', async () => {
        mockAxios.onDelete('/workflows/workflow-123').reply(204);

        await adminClient.deleteWorkflow('workflow-123');

        expect(mockAxios.history.delete).toHaveLength(1);
        expect(mockAxios.history.delete[0].url).toBe('/workflows/workflow-123');
      });
    });
  });

  describe('Partner App endpoints', () => {
    describe('getApp', () => {
      const mockPartnerApp: PartnerApp = {
        id: 'app-123',
        client_id: 'test-client-id',
        name: 'Test Partner App',
        description: 'A test partner application',
        company_name: 'Test Company Inc.',
        primary_contact_email: 'contact@testcompany.com',
        webhook_url: 'https://partner.example.com/webhooks',
        status: 'active',
        created_at: '2024-12-01T00:00:00Z',
        updated_at: '2025-01-08T10:00:00Z',
      };

      it('should get partner app information', async () => {
        mockAxios.onGet('/app').reply(200, mockPartnerApp);

        const app = await adminClient.getApp();

        expect(app.id).toBe('app-123');
        expect(app.name).toBe('Test Partner App');
        expect(app.status).toBe('active');
        expect(app.company_name).toBe('Test Company Inc.');
      });
    });

    describe('updateApp', () => {
      const updateRequest: UpdatePartnerAppRequest = {
        name: 'Updated App Name',
        description: 'Updated description',
        webhook_url: 'https://partner.example.com/new-webhooks',
      };

      const mockUpdatedApp: PartnerApp = {
        id: 'app-123',
        client_id: 'test-client-id',
        name: 'Updated App Name',
        description: 'Updated description',
        company_name: 'Test Company Inc.',
        primary_contact_email: 'contact@testcompany.com',
        webhook_url: 'https://partner.example.com/new-webhooks',
        status: 'active',
        created_at: '2024-12-01T00:00:00Z',
        updated_at: '2025-01-08T14:00:00Z',
      };

      it('should update partner app details', async () => {
        mockAxios.onPut('/app').reply(200, mockUpdatedApp);

        const app = await adminClient.updateApp(updateRequest);

        expect(app.name).toBe('Updated App Name');
        expect(app.webhook_url).toBe('https://partner.example.com/new-webhooks');
      });
    });

    describe('updateAppStatus', () => {
      const statusRequest: UpdatePartnerAppStatusRequest = {
        status: 'inactive',
      };

      const mockUpdatedApp: PartnerApp = {
        id: 'app-123',
        client_id: 'test-client-id',
        name: 'Test Partner App',
        company_name: 'Test Company Inc.',
        primary_contact_email: 'contact@testcompany.com',
        status: 'inactive',
        created_at: '2024-12-01T00:00:00Z',
        updated_at: '2025-01-08T14:00:00Z',
      };

      it('should update partner app status', async () => {
        mockAxios.onPut('/app/status').reply(200, mockUpdatedApp);

        const app = await adminClient.updateAppStatus(statusRequest);

        expect(app.status).toBe('inactive');
      });
    });
  });

  describe('Webhook Delivery endpoints', () => {
    describe('getWebhookDeliveries', () => {
      const mockDeliveriesResponse: WebhookDeliveryListResponse = {
        deliveries: [
          {
            id: 'delivery-1',
            partner_app_id: 'app-456',
            event_type: 'workflow.assignment.created',
            event_id: 'evt_123',
            delivery_status: 'delivered',
            http_status_code: 200,
            retry_count: 0,
            error_message: '',
            created_at: '2025-01-08T10:00:00Z',
            delivered_at: '2025-01-08T10:00:05Z',
          },
          {
            id: 'delivery-2',
            partner_app_id: 'app-456',
            event_type: 'action_item.updated',
            event_id: 'evt_456',
            delivery_status: 'failed',
            http_status_code: 500,
            retry_count: 3,
            next_retry_at: '2025-01-08T11:00:00Z',
            error_message: 'Internal server error',
            created_at: '2025-01-08T09:00:00Z',
          },
        ],
        total: 2,
        limit: 20,
        offset: 0,
      };

      it('should get list of webhook deliveries', async () => {
        mockAxios.onGet('/webhook-deliveries').reply(200, mockDeliveriesResponse);

        const response = await adminClient.getWebhookDeliveries();

        expect(response.deliveries).toHaveLength(2);
        expect(response.deliveries[0].delivery_status).toBe('delivered');
        expect(response.deliveries[1].delivery_status).toBe('failed');
      });

      it('should support pagination and filtering', async () => {
        mockAxios.onGet('/webhook-deliveries').reply((config) => {
          expect(config.params.limit).toBe(50);
          expect(config.params.offset).toBe(100);
          expect(config.params.status).toBe('failed');
          return [200, mockDeliveriesResponse];
        });

        await adminClient.getWebhookDeliveries({
          limit: 50,
          offset: 100,
          status: 'failed',
        });
      });
    });

    describe('getWebhookDelivery', () => {
      const mockDelivery: WebhookDelivery = {
        id: 'delivery-123',
        partner_app_id: 'app-456',
        event_type: 'workflow.assignment.created',
        event_id: 'evt_789',
        delivery_status: 'delivered',
        http_status_code: 200,
        retry_count: 0,
        error_message: '',
        created_at: '2025-01-08T10:00:00Z',
        delivered_at: '2025-01-08T10:00:05Z',
      };

      it('should get a specific webhook delivery', async () => {
        mockAxios.onGet('/webhook-deliveries/delivery-123').reply(200, mockDelivery);

        const delivery = await adminClient.getWebhookDelivery('delivery-123');

        expect(delivery.id).toBe('delivery-123');
        expect(delivery.delivery_status).toBe('delivered');
        expect(delivery.http_status_code).toBe(200);
      });
    });

    describe('retryWebhookDelivery', () => {
      it('should retry a failed webhook delivery', async () => {
        const mockResponse = {
          message: 'Webhook delivery retry scheduled',
          retry_scheduled: true,
        };

        mockAxios.onPost('/webhook-deliveries/delivery-123/retry').reply(200, mockResponse);

        const result = await adminClient.retryWebhookDelivery('delivery-123');

        expect(result.retry_scheduled).toBe(true);
        expect(result.message).toBe('Webhook delivery retry scheduled');
      });
    });
  });

  describe('User Connection endpoints', () => {
    describe('getUserConnections', () => {
      const mockConnectionsResponse: UserConnectionListResponse = {
        items: [
          {
            id: 'conn-1',
            user_id: 'user-123',
            user_name: 'John Doe',
            user_email: 'john@example.com',
            oauth_scopes: ['openid', 'profile', 'meetings:read', 'meetings:write'],
            status: 'active',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
          {
            id: 'conn-2',
            user_id: 'user-456',
            user_name: 'Jane Smith',
            user_email: 'jane@example.com',
            oauth_scopes: ['openid', 'profile', 'meetings:read'],
            status: 'active',
            created_at: '2025-01-05T00:00:00Z',
            updated_at: '2025-01-05T00:00:00Z',
          },
        ],
        total: 2,
        limit: 20,
        offset: 0,
      };

      it('should get list of user connections', async () => {
        mockAxios.onGet('/connections').reply(200, mockConnectionsResponse);

        const response = await adminClient.getUserConnections();

        expect(response.items).toHaveLength(2);
        expect(response.items[0].status).toBe('active');
        expect(response.total).toBe(2);
      });

      it('should support pagination parameters', async () => {
        mockAxios.onGet('/connections').reply((config) => {
          expect(config.params.limit).toBe(50);
          expect(config.params.offset).toBe(100);
          return [200, mockConnectionsResponse];
        });

        await adminClient.getUserConnections({ limit: 50, offset: 100 });
      });
    });

    describe('getUserConnection', () => {
      const mockConnection: UserConnection = {
        id: 'conn-123',
        user_id: 'user-789',
        user_name: 'Bob Johnson',
        user_email: 'bob@example.com',
        oauth_scopes: ['openid', 'profile', 'meetings:read', 'meetings:write', 'action-items:read'],
        status: 'active',
        last_used_at: '2025-01-08T10:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-08T10:00:00Z',
      };

      it('should get a specific user connection', async () => {
        mockAxios.onGet('/connections/conn-123').reply(200, mockConnection);

        const connection = await adminClient.getUserConnection('conn-123');

        expect(connection.id).toBe('conn-123');
        expect(connection.user_id).toBe('user-789');
        expect(connection.oauth_scopes).toHaveLength(5);
      });
    });

    describe('revokeUserConnection', () => {
      it('should revoke a user connection', async () => {
        mockAxios.onDelete('/connections/conn-123').reply(204);

        await adminClient.revokeUserConnection('conn-123');

        expect(mockAxios.history.delete).toHaveLength(1);
        expect(mockAxios.history.delete[0].url).toBe('/connections/conn-123');
      });
    });
  });
});
