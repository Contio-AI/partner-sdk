/**
 * Tests for Admin client construction and authentication.
 */

import { ApiKeyClient } from '../../src/auth/apiKey';
import { PartnerAdminClient } from '../../src/client/admin';
import { createAdminTestContext, mockApiKeyConfig, AdminTestContext } from './setup';

describe('PartnerAdminClient', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  describe('constructor', () => {
    it('should initialize with default base URL', () => {
      const client = new PartnerAdminClient(ctx.apiKeyClient);
      expect((client as any).config.baseURL).toBe('https://api.contio.ai/v1/partner/admin');
    });

    it('should allow custom base URL', () => {
      const client = new PartnerAdminClient(ctx.apiKeyClient, {
        baseURL: 'https://custom.api.example.com',
      });
      expect((client as any).config.baseURL).toBe('https://custom.api.example.com/v1/partner/admin');
    });
  });

  describe('authentication', () => {
    it('should add API key headers to requests', async () => {
      ctx.mockAxios.onGet('/app').reply((config) => {
        expect(config.headers?.['X-API-Key']).toBe('ctio_test_api_key_12345');
        expect(config.headers?.['X-Client-ID']).toBe('test-client-id');
        return [200, { id: 'app-123', name: 'Test App' }];
      });

      await ctx.adminClient.getApp();
    });
  });
});

