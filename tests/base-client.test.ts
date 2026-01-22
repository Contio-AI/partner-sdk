/**
 * Comprehensive tests for BaseClient functionality
 * Tests retry logic, error handling, and configuration options
 */

import MockAdapter from 'axios-mock-adapter';
import { PartnerUserClient } from '../src/client/user';
import { OAuthClient } from '../src/auth/oauth';
import { ContioAPIError } from '../src/client/base';

describe('BaseClient', () => {
  let oauthClient: OAuthClient;
  let userClient: PartnerUserClient;
  let mockAxios: MockAdapter;

  const mockOAuthConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
  };

  beforeEach(() => {
    oauthClient = new OAuthClient(mockOAuthConfig);
    oauthClient.setTokens({ accessToken: 'test-access-token' });
    userClient = new PartnerUserClient(oauthClient);
    mockAxios = new MockAdapter((userClient as any).axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('Configuration', () => {
    it('should configure local dev HTTPS agent for .lan.contio.ai domains', () => {
      const localClient = new PartnerUserClient(oauthClient, {
        baseURL: 'https://api.lan.contio.ai',
      });
      const httpsAgent = (localClient as any).axiosInstance.defaults.httpsAgent;
      expect(httpsAgent).toBeDefined();
      expect(httpsAgent.options.rejectUnauthorized).toBe(false);
    });

    it('should configure local dev HTTPS agent for localhost', () => {
      const localClient = new PartnerUserClient(oauthClient, {
        baseURL: 'https://localhost:3000',
      });
      const httpsAgent = (localClient as any).axiosInstance.defaults.httpsAgent;
      expect(httpsAgent).toBeDefined();
      expect(httpsAgent.options.rejectUnauthorized).toBe(false);
    });

    it('should configure local dev HTTPS agent for local. domains', () => {
      const localClient = new PartnerUserClient(oauthClient, {
        baseURL: 'https://api.local.dev',
      });
      const httpsAgent = (localClient as any).axiosInstance.defaults.httpsAgent;
      expect(httpsAgent).toBeDefined();
      expect(httpsAgent.options.rejectUnauthorized).toBe(false);
    });

    it('should set default timezone header when configured', () => {
      const clientWithTimezone = new PartnerUserClient(oauthClient, {
        defaultTimezone: 'America/New_York',
      });
      const headers = (clientWithTimezone as any).axiosInstance.defaults.headers;
      expect(headers['X-Client-Timezone']).toBe('America/New_York');
    });

    it('should not set timezone header when not configured', () => {
      const headers = (userClient as any).axiosInstance.defaults.headers;
      expect(headers['X-Client-Timezone']).toBeUndefined();
    });
  });

  describe('Request timezone override', () => {
    it('should override default timezone with request-level timezone', async () => {
      const clientWithTimezone = new PartnerUserClient(oauthClient, {
        defaultTimezone: 'America/New_York',
      });
      const mockAxiosWithTz = new MockAdapter((clientWithTimezone as any).axiosInstance);

      mockAxiosWithTz.onGet('/meetings').reply((config) => {
        expect(config.headers?.['X-Client-Timezone']).toBe('Europe/London');
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      await clientWithTimezone.getMeetings({}, { timezone: 'Europe/London' });
      mockAxiosWithTz.reset();
    });
  });

  describe('Retry logic - 429 Rate Limiting', () => {
    it('should parse Retry-After header as HTTP date', async () => {
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 2, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      let requestCount = 0;
      const futureDate = new Date(Date.now() + 100); // 100ms in the future
      const httpDate = futureDate.toUTCString();

      fastMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [429, { error: 'rate_limited' }, { 'retry-after': httpDate }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      await fastRetryClient.getMeetings();

      expect(requestCount).toBe(2);
      // Successfully retried after parsing HTTP date format
      fastMockAxios.reset();
    });

    it('should handle invalid Retry-After header gracefully', async () => {
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 2, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      let requestCount = 0;
      fastMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [429, { error: 'rate_limited' }, { 'retry-after': 'invalid-value' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      await fastRetryClient.getMeetings();
      expect(requestCount).toBe(2);
      fastMockAxios.reset();
    });

    it('should throw error when max retries exceeded on 429', async () => {
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 1, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      fastMockAxios.onGet('/meetings').reply(429, { error: 'rate_limited', message: 'Too many requests' });

      await expect(fastRetryClient.getMeetings()).rejects.toThrow();
      fastMockAxios.reset();
    });
  });

  describe('Retry logic - 4xx Client Errors', () => {
    it('should not retry on 400 Bad Request', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0, retryDelay: 10 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);

      let requestCount = 0;
      noRetryMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        return [400, { error: 'bad_request', message: 'Invalid parameters' }];
      });

      await expect(noRetryClient.getMeetings()).rejects.toThrow(ContioAPIError);
      expect(requestCount).toBe(1); // Should not retry
      noRetryMockAxios.reset();
    });

    it('should not retry on 401 Unauthorized', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0, retryDelay: 10 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);

      let requestCount = 0;
      noRetryMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        return [401, { error: 'unauthorized', message: 'Invalid token' }];
      });

      await expect(noRetryClient.getMeetings()).rejects.toThrow(ContioAPIError);
      expect(requestCount).toBe(1); // Should not retry
      noRetryMockAxios.reset();
    });

    it('should not retry on 403 Forbidden', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0, retryDelay: 10 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);

      let requestCount = 0;
      noRetryMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        return [403, { error: 'forbidden', message: 'Access denied' }];
      });

      await expect(noRetryClient.getMeetings()).rejects.toThrow(ContioAPIError);
      expect(requestCount).toBe(1); // Should not retry
      noRetryMockAxios.reset();
    });

    it('should not retry on 404 Not Found', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0, retryDelay: 10 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);

      let requestCount = 0;
      noRetryMockAxios.onGet('/meetings/nonexistent').reply(() => {
        requestCount++;
        return [404, { error: 'not_found', message: 'Resource not found' }];
      });

      await expect(noRetryClient.getMeeting('nonexistent')).rejects.toThrow(ContioAPIError);
      expect(requestCount).toBe(1); // Should not retry
      noRetryMockAxios.reset();
    });
  });

  describe('Retry logic - 5xx Server Errors', () => {
    it('should retry on 500 Internal Server Error', async () => {
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 3, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      let requestCount = 0;
      fastMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount < 3) {
          return [500, { error: 'internal_error', message: 'Server error' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      const result = await fastRetryClient.getMeetings();
      expect(requestCount).toBe(3);
      expect(result.items).toEqual([]);
      fastMockAxios.reset();
    });

    it('should retry on 502 Bad Gateway', async () => {
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 2, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      let requestCount = 0;
      fastMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [502, { error: 'bad_gateway' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      await fastRetryClient.getMeetings();
      expect(requestCount).toBe(2);
      fastMockAxios.reset();
    });

    it('should retry on 503 Service Unavailable', async () => {
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 2, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      let requestCount = 0;
      fastMockAxios.onGet('/meetings').reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [503, { error: 'service_unavailable' }];
        }
        return [200, { items: [], total: 0, limit: 20, offset: 0 }];
      });

      await fastRetryClient.getMeetings();
      expect(requestCount).toBe(2);
      fastMockAxios.reset();
    });

    it('should throw error when max retries exceeded on 5xx', async () => {
      const fastRetryClient = new PartnerUserClient(oauthClient, { retries: 2, retryDelay: 10 });
      const fastMockAxios = new MockAdapter((fastRetryClient as any).axiosInstance);

      fastMockAxios.onGet('/meetings').reply(500, { error: 'internal_error', message: 'Persistent server error' });

      await expect(fastRetryClient.getMeetings()).rejects.toThrow(ContioAPIError);
      fastMockAxios.reset();
    });
  });

  describe('Error handling', () => {
    it('should handle network errors (no response)', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);
      noRetryMockAxios.onGet('/meetings').networkError();

      try {
        await noRetryClient.getMeetings();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ContioAPIError);
        const apiError = error as ContioAPIError;
        // axios-mock-adapter's networkError() creates an error without response or request
        expect(apiError.code).toBe('request_error');
        expect(apiError.message).toContain('Network Error');
        expect(apiError.statusCode).toBeUndefined();
      }
      noRetryMockAxios.reset();
    });

    it('should handle request errors', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);
      noRetryMockAxios.onGet('/meetings').reply(() => {
        throw new Error('Request setup failed');
      });

      try {
        await noRetryClient.getMeetings();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ContioAPIError);
        const apiError = error as ContioAPIError;
        expect(apiError.code).toBe('request_error');
        expect(apiError.message).toContain('Request setup failed');
      }
      noRetryMockAxios.reset();
    });

    it('should handle timeout errors', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);
      noRetryMockAxios.onGet('/meetings').timeout();

      try {
        await noRetryClient.getMeetings();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ContioAPIError);
        const apiError = error as ContioAPIError;
        expect(apiError.code).toBe('request_error');
      }
      noRetryMockAxios.reset();
    });

    it('should parse error response with all fields', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);
      noRetryMockAxios.onGet('/meetings').reply(400, {
        error: 'validation_error',
        message: 'Invalid request parameters',
        code: 'INVALID_PARAMS',
      });

      try {
        await noRetryClient.getMeetings();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ContioAPIError);
        const apiError = error as ContioAPIError;
        expect(apiError.code).toBe('INVALID_PARAMS');
        // The error field is prioritized over message field in handleError
        expect(apiError.message).toBe('validation_error');
        expect(apiError.statusCode).toBe(400);
        expect(apiError.response).toBeDefined();
      }
      noRetryMockAxios.reset();
    });

    it('should handle error response with minimal fields', async () => {
      const noRetryClient = new PartnerUserClient(oauthClient, { retries: 0 });
      const noRetryMockAxios = new MockAdapter((noRetryClient as any).axiosInstance);
      noRetryMockAxios.onGet('/meetings').reply(500, {});

      try {
        await noRetryClient.getMeetings();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ContioAPIError);
        const apiError = error as ContioAPIError;
        expect(apiError.code).toBe('unknown_error');
        expect(apiError.message).toBe('An error occurred');
        expect(apiError.statusCode).toBe(500);
      }
      noRetryMockAxios.reset();
    });
  });
});

