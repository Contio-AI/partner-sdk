/**
 * Tests for User client construction, authentication, token refresh,
 * rate-limit retry, and error handling.
 */

import MockAdapter from 'axios-mock-adapter';
import { OAuthClient } from '../../src/auth/oauth';
import { PartnerUserClient } from '../../src/client/user';
import { createUserTestContext, mockOAuthConfig, UserTestContext } from './setup';

describe('PartnerUserClient', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  describe('constructor', () => {
    it('should initialize with default base URL', () => {
      const client = new PartnerUserClient(ctx.oauthClient);
      expect((client as any).config.baseURL).toBe('https://api.contio.ai/v1/partner/user');
    });

    it('should allow custom base URL', () => {
      const client = new PartnerUserClient(ctx.oauthClient, {
        baseURL: 'https://custom.api.example.com',
      });
      expect((client as any).config.baseURL).toBe('https://custom.api.example.com/v1/partner/user');
    });
  });

  describe('authentication', () => {
    it('should add Bearer token to requests', async () => {
      ctx.mockAxios.onGet('/meetings').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer test-access-token');
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      await ctx.userClient.getMeetings();
    });

    it('should throw error when no access token available', async () => {
      const clientWithoutToken = new PartnerUserClient(new OAuthClient(mockOAuthConfig));
      const mockAxios2 = new MockAdapter((clientWithoutToken as any).axiosInstance);
      mockAxios2.onGet('/meetings').reply(200, { items: [], total: 0, limit: 20, offset: 0 });

      // The error is now thrown asynchronously in addAuthHeaders before the request is made
      await expect((clientWithoutToken as any).addAuthHeaders({ headers: {} }))
        .rejects.toThrow('No access token available. Please authenticate first.');

      mockAxios2.reset();
    });
  });

  describe('ensureValidToken', () => {
    it('should refresh token when expired', async () => {
      // Set expired token
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago
      ctx.oauthClient.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        expiresAt: expiredDate,
      });

      const refreshSpy = jest.spyOn(ctx.oauthClient, 'refreshAccessToken').mockResolvedValue({
        accessToken: 'new-token',
        refreshToken: 'new-refresh-token',
      });

      await ctx.userClient.ensureValidToken();

      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should not refresh token when still valid', async () => {
      // Set valid token
      const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
      ctx.oauthClient.setTokens({
        accessToken: 'valid-token',
        expiresAt: futureDate,
      });

      const refreshSpy = jest.spyOn(ctx.oauthClient, 'refreshAccessToken');

      await ctx.userClient.ensureValidToken();

      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });

  describe('Automatic token refresh', () => {
    it('should refresh token when expired before making request', async () => {
      // Create a client with an expired token
      const expiredOAuth = new OAuthClient(mockOAuthConfig);
      expiredOAuth.setTokens({
        accessToken: 'expired-token',
        refreshToken: 'valid-refresh',
        expiresAt: new Date(Date.now() - 1000), // Already expired
      });

      const clientWithExpired = new PartnerUserClient(expiredOAuth);
      const mockAxios2 = new MockAdapter((clientWithExpired as any).axiosInstance);

      // Mock the token refresh
      jest.spyOn(expiredOAuth, 'refreshAccessToken').mockResolvedValue({
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        expiresAt: new Date(Date.now() + 3600000),
      });

      mockAxios2.onGet('/meetings').reply(200, { items: [], total: 0, limit: 20, offset: 0 });

      await clientWithExpired.getMeetings();

      expect(expiredOAuth.refreshAccessToken).toHaveBeenCalled();
      mockAxios2.reset();
    });
  });

  describe('Rate limit handling', () => {
    it('should retry on 429 with exponential backoff', async () => {
      // Create client with fast retry for testing
      const fastRetryClient = new PartnerUserClient(ctx.oauthClient, { retries: 3, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      let requestCount = 0;
      fastMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount < 3) {
          return [429, { error: 'rate_limited' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      const result = await fastRetryClient.getMeetings();

      expect(requestCount).toBe(3);
      expect(result.items).toEqual([]);
      fastMockAxios.reset();
    });

    it('should respect Retry-After header in seconds', async () => {
      let requestCount = 0;
      ctx.mockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [429, { error: 'rate_limited' }, { 'retry-after': '1' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      const start = Date.now();
      await ctx.userClient.getMeetings();
      const elapsed = Date.now() - start;

      expect(requestCount).toBe(2);
      expect(elapsed).toBeGreaterThanOrEqual(900); // At least ~1 second
    });

    it('should throw after max retries on 429', async () => {
      // Create client with fast retry for testing
      const fastRetryClient = new PartnerUserClient(ctx.oauthClient, { retries: 2, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);
      fastMockAxios.onGet('/meetings').reply(429, { error: 'rate_limited' });

      await expect(fastRetryClient.getMeetings()).rejects.toThrow();
      fastMockAxios.reset();
    });
  });

  describe('Error response request_id', () => {
    it('should surface request_id from error responses', async () => {
      const noRetryClient = new PartnerUserClient(ctx.oauthClient, { retries: 0, retryDelay: 0 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);
      noRetryMockAxios.onGet('/meetings').reply(400, {
        code: 'invalid_request',
        error: 'Invalid parameters',
        request_id: 'req-abc-123',
      });

      try {
        await noRetryClient.getMeetings();
        fail('Expected ContioAPIError to be thrown');
      } catch (err: any) {
        expect(err.name).toBe('ContioAPIError');
        expect(err.code).toBe('invalid_request');
        expect(err.message).toBe('Invalid parameters');
        expect(err.requestId).toBe('req-abc-123');
        expect(err.response.request_id).toBe('req-abc-123');
      }

      noRetryMockAxios.reset();
    });
  });
});

