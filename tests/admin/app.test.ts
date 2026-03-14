/**
 * Tests for Partner App endpoints.
 */

import {
  PartnerApp,
  UpdatePartnerAppRequest,
  UpdatePartnerAppStatusRequest,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Partner App', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  describe('getApp', () => {
    const mockPartnerApp: PartnerApp = {
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

    it('should get partner app information', async () => {
      ctx.mockAxios.onGet('/app').reply(200, mockPartnerApp);

      const app = await ctx.adminClient.getApp();

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
      webhook_enabled: true,
      webhook_filter: null,
      status: 'active',
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2025-01-08T14:00:00Z',
    };

    it('should update partner app details', async () => {
      ctx.mockAxios.onPut('/app').reply(200, mockUpdatedApp);

      const app = await ctx.adminClient.updateApp(updateRequest);

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
      webhook_enabled: true,
      webhook_filter: null,
      status: 'inactive',
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2025-01-08T14:00:00Z',
    };

    it('should update partner app status', async () => {
      ctx.mockAxios.onPut('/app/status').reply(200, mockUpdatedApp);

      const app = await ctx.adminClient.updateAppStatus(statusRequest);

      expect(app.status).toBe('inactive');
    });
  });
});

