/**
 * Tests for Webhook Management and Webhook Delivery endpoints.
 */

import {
  PartnerApp,
  UpdateWebhookStatusRequest,
  SetWebhookFilterRequest,
  WebhookDelivery,
  WebhookDeliveryListResponse,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Webhooks', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const basePartnerApp: PartnerApp = {
    id: 'app-123',
    client_id: 'test-client-id',
    name: 'Test Partner App',
    description: 'A test partner application',
    company_name: 'Test Company Inc.',
    primary_contact_email: 'contact@testcompany.com',
    webhook_url: 'https://partner.example.com/webhooks',
    webhook_enabled: true,
    webhook_filter: null,
    status: 'active',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2025-01-08T10:00:00Z',
  };

  describe('Webhook Management', () => {
    describe('updateWebhookStatus', () => {
      it('should enable webhook delivery', async () => {
        const statusRequest: UpdateWebhookStatusRequest = {
          enabled: true,
          pending_disposition: 'abandon',
        };
        const mockUpdatedApp: PartnerApp = {
          ...basePartnerApp,
          webhook_enabled: true,
          updated_at: '2025-01-08T14:00:00Z',
        };

        ctx.mockAxios.onPut('/app/webhook-status').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.enabled).toBe(true);
          expect(body.pending_disposition).toBe('abandon');
          return [200, mockUpdatedApp];
        });

        const app = await ctx.adminClient.updateWebhookStatus(statusRequest);

        expect(app.webhook_enabled).toBe(true);
      });

      it('should disable webhook delivery', async () => {
        const statusRequest: UpdateWebhookStatusRequest = {
          enabled: false,
        };
        const mockUpdatedApp: PartnerApp = {
          ...basePartnerApp,
          webhook_enabled: false,
          updated_at: '2025-01-08T15:00:00Z',
        };

        ctx.mockAxios.onPut('/app/webhook-status').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.enabled).toBe(false);
          expect(body.pending_disposition).toBeUndefined();
          return [200, mockUpdatedApp];
        });

        const app = await ctx.adminClient.updateWebhookStatus(statusRequest);

        expect(app.webhook_enabled).toBe(false);
      });
    });

    describe('setWebhookFilter', () => {
      it('should set an include webhook filter', async () => {
        const filterRequest: SetWebhookFilterRequest = {
          type: 'include',
          events: ['meeting.created', 'meeting.completed'],
        };
        const mockUpdatedApp: PartnerApp = {
          ...basePartnerApp,
          webhook_filter: {
            type: 'include',
            events: ['meeting.created', 'meeting.completed'],
          },
          updated_at: '2025-01-08T16:00:00Z',
        };

        ctx.mockAxios.onPut('/app/webhook-filter').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.type).toBe('include');
          expect(body.events).toEqual(['meeting.created', 'meeting.completed']);
          return [200, mockUpdatedApp];
        });

        const app = await ctx.adminClient.setWebhookFilter(filterRequest);

        expect(app.webhook_filter).toEqual({
          type: 'include',
          events: ['meeting.created', 'meeting.completed'],
        });
      });

      it('should set an exclude webhook filter', async () => {
        const filterRequest: SetWebhookFilterRequest = {
          type: 'exclude',
          events: ['participant.added'],
        };
        const mockUpdatedApp: PartnerApp = {
          ...basePartnerApp,
          webhook_filter: {
            type: 'exclude',
            events: ['participant.added'],
          },
          updated_at: '2025-01-08T17:00:00Z',
        };

        ctx.mockAxios.onPut('/app/webhook-filter').reply((config) => {
          const body = JSON.parse(config.data);
          expect(body.type).toBe('exclude');
          expect(body.events).toEqual(['participant.added']);
          return [200, mockUpdatedApp];
        });

        const app = await ctx.adminClient.setWebhookFilter(filterRequest);

        expect(app.webhook_filter).toEqual({
          type: 'exclude',
          events: ['participant.added'],
        });
      });
    });



    describe('removeWebhookFilter', () => {
      it('should remove the webhook filter', async () => {
        const mockUpdatedApp: PartnerApp = {
          ...basePartnerApp,
          webhook_filter: null,
          updated_at: '2025-01-08T18:00:00Z',
        };

        ctx.mockAxios.onDelete('/app/webhook-filter').reply(200, mockUpdatedApp);

        const app = await ctx.adminClient.removeWebhookFilter();

        expect(ctx.mockAxios.history.delete).toHaveLength(1);
        expect(ctx.mockAxios.history.delete[0].url).toBe('/app/webhook-filter');
        expect(app.webhook_filter).toBeNull();
      });
    });
  });

  describe('Webhook Deliveries', () => {
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
        ctx.mockAxios.onGet('/webhook-deliveries').reply(200, mockDeliveriesResponse);

        const response = await ctx.adminClient.getWebhookDeliveries();

        expect(response.deliveries).toHaveLength(2);
        expect(response.deliveries[0].delivery_status).toBe('delivered');
        expect(response.deliveries[1].delivery_status).toBe('failed');
      });

      it('should support pagination and filtering', async () => {
        ctx.mockAxios.onGet('/webhook-deliveries').reply((config) => {
          expect(config.params.limit).toBe(50);
          expect(config.params.offset).toBe(100);
          expect(config.params.status).toBe('failed');
          return [200, mockDeliveriesResponse];
        });

        await ctx.adminClient.getWebhookDeliveries({
          limit: 50,
          offset: 100,
          status: 'failed',
        });
      });

      it('should support filtering by event_type', async () => {
        ctx.mockAxios.onGet('/webhook-deliveries').reply((config) => {
          expect(config.params.event_type).toBe('meeting.created');
          expect(config.params.status).toBe('failed');
          return [200, mockDeliveriesResponse];
        });

        await ctx.adminClient.getWebhookDeliveries({
          event_type: 'meeting.created',
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
        ctx.mockAxios.onGet('/webhook-deliveries/delivery-123').reply(200, mockDelivery);

        const delivery = await ctx.adminClient.getWebhookDelivery('delivery-123');

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

        ctx.mockAxios.onPost('/webhook-deliveries/delivery-123/retry').reply(200, mockResponse);

        const result = await ctx.adminClient.retryWebhookDelivery('delivery-123');

        expect(result.retry_scheduled).toBe(true);
        expect(result.message).toBe('Webhook delivery retry scheduled');
      });
    });
  });
});