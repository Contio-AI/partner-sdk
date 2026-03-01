/**
 * Comprehensive unit tests for OAuth client
 */

import MockAdapter from 'axios-mock-adapter';
import { OAuthClient } from '../src/auth/oauth';
import { OAuthConfig, OAuthTokenResponse, AuthTokens } from '../src/models/auth';

describe('OAuthClient', () => {
  let client: OAuthClient;
  let mockAxios: MockAdapter;

  const defaultConfig: OAuthConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
    scope: ['openid', 'profile', 'meetings:read', 'meetings:write'],
  };

  beforeEach(() => {
    client = new OAuthClient(defaultConfig);
    // Mock the internal axios instance
    mockAxios = new MockAdapter((client as any).axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('constructor', () => {
    it('should initialize with default URLs', () => {
      const client = new OAuthClient(defaultConfig);
      expect(client).toBeDefined();
      expect((client as any).config.authorizationUrl).toBe('https://auth.contio.ai/oauth2/authorize');
      expect((client as any).config.tokenUrl).toBe('https://auth.contio.ai/oauth2/token');
    });

    it('should allow custom URLs', () => {
      const customConfig: OAuthConfig = {
        ...defaultConfig,
        authorizationUrl: 'https://custom.auth.example.com/authorize',
        tokenUrl: 'https://custom.auth.example.com/token',
      };
      const client = new OAuthClient(customConfig);
      expect((client as any).config.authorizationUrl).toBe('https://custom.auth.example.com/authorize');
      expect((client as any).config.tokenUrl).toBe('https://custom.auth.example.com/token');
    });
  });

  describe('getAuthorizationUrl', () => {
    it('should generate authorization URL with required parameters', () => {
      const url = client.getAuthorizationUrl();

      expect(url).toContain('https://auth.contio.ai/oauth2/authorize');
      expect(url).toContain('client_id=test-client-id');
      expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback');
      expect(url).toContain('response_type=code');
      expect(url).toContain('scope=openid+profile+meetings%3Aread+meetings%3Awrite');
    });

    it('should include state parameter when provided', () => {
      const url = client.getAuthorizationUrl('random-state-123');

      expect(url).toContain('state=random-state-123');
    });

    it('should use default scope when not configured', () => {
      const clientWithoutScope = new OAuthClient({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'http://localhost:3000/callback',
      });

      const url = clientWithoutScope.getAuthorizationUrl();
      expect(url).toContain('scope=openid+profile+meetings%3Aread+meetings%3Awrite');
    });

    it('should include login_hint when provided in options', () => {
      const url = client.getAuthorizationUrl('random-state', {
        loginHint: 'user@example.com'
      });

      expect(url).toContain('login_hint=user%40example.com');
      expect(url).toContain('state=random-state');
    });

    it('should not include login_hint when not provided', () => {
      const url = client.getAuthorizationUrl('random-state');

      expect(url).not.toContain('login_hint');
    });
  });

  describe('exchangeCodeForToken', () => {
    const mockTokenResponse: OAuthTokenResponse = {
      access_token: 'access-token-123',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'refresh-token-456',
      scope: 'openid profile meetings:read meetings:write',
    };

    it('should exchange authorization code for tokens', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(200, mockTokenResponse);

      const tokens = await client.exchangeCodeForToken('auth-code-123');

      expect(tokens.accessToken).toBe('access-token-123');
      expect(tokens.refreshToken).toBe('refresh-token-456');
      expect(tokens.scope).toEqual(['openid', 'profile', 'meetings:read', 'meetings:write']);
      expect(tokens.expiresAt).toBeInstanceOf(Date);
    });

    it('should use Basic Auth with client credentials', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200, mockTokenResponse];
      });

      await client.exchangeCodeForToken('auth-code-123');
    });

    it('should send correct request body', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const params = new URLSearchParams(config.data);
        expect(params.get('grant_type')).toBe('authorization_code');
        expect(params.get('code')).toBe('auth-code-123');
        expect(params.get('redirect_uri')).toBe('http://localhost:3000/callback');
        return [200, mockTokenResponse];
      });

      await client.exchangeCodeForToken('auth-code-123');
    });

    it('should store tokens internally', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(200, mockTokenResponse);

      await client.exchangeCodeForToken('auth-code-123');

      expect(client.getAccessToken()).toBe('access-token-123');
    });

    it('should throw error on failure', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(400, {
        error: 'invalid_grant',
        error_description: 'Invalid authorization code',
      });

      await expect(client.exchangeCodeForToken('invalid-code')).rejects.toThrow(
        'Failed to exchange code for token'
      );
    });
  });

  describe('refreshAccessToken', () => {
    const mockTokenResponse: OAuthTokenResponse = {
      access_token: 'new-access-token-789',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'new-refresh-token-012',
      scope: 'openid profile meetings:read meetings:write',
    };

    it('should refresh token using stored refresh token', async () => {
      // Set initial tokens
      client.setTokens({
        accessToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
      });

      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(200, mockTokenResponse);

      const tokens = await client.refreshAccessToken();

      expect(tokens.accessToken).toBe('new-access-token-789');
      expect(tokens.refreshToken).toBe('new-refresh-token-012');
    });

    it('should refresh token using provided refresh token', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const params = new URLSearchParams(config.data);
        expect(params.get('refresh_token')).toBe('custom-refresh-token');
        return [200, mockTokenResponse];
      });

      await client.refreshAccessToken('custom-refresh-token');
    });

    it('should use Basic Auth with client credentials', async () => {
      client.setTokens({ accessToken: 'token', refreshToken: 'refresh' });

      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200, mockTokenResponse];
      });

      await client.refreshAccessToken();
    });

    it('should send correct grant type', async () => {
      client.setTokens({ accessToken: 'token', refreshToken: 'refresh' });

      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const params = new URLSearchParams(config.data);
        expect(params.get('grant_type')).toBe('refresh_token');
        return [200, mockTokenResponse];
      });

      await client.refreshAccessToken();
    });

    it('should throw error when no refresh token available', async () => {
      await expect(client.refreshAccessToken()).rejects.toThrow('No refresh token available');
    });

    it('should throw error on failure', async () => {
      client.setTokens({ accessToken: 'token', refreshToken: 'refresh' });

      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(400, {
        error: 'invalid_grant',
      });

      await expect(client.refreshAccessToken()).rejects.toThrow('Failed to refresh token');
    });
  });

  describe('getClientCredentialsToken', () => {
    const mockTokenResponse: OAuthTokenResponse = {
      access_token: 'client-credentials-token',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'meetings:read meetings:write',
    };

    it('should get client credentials token', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(200, mockTokenResponse);

      const tokens = await client.getClientCredentialsToken();

      expect(tokens.accessToken).toBe('client-credentials-token');
      expect(tokens.refreshToken).toBeUndefined();
    });

    it('should use custom scope when provided', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const params = new URLSearchParams(config.data);
        expect(params.get('scope')).toBe('custom:scope another:scope');
        return [200, mockTokenResponse];
      });

      await client.getClientCredentialsToken(['custom:scope', 'another:scope']);
    });

    it('should use configured scope when not provided', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const params = new URLSearchParams(config.data);
        expect(params.get('scope')).toBe('openid profile meetings:read meetings:write');
        return [200, mockTokenResponse];
      });

      await client.getClientCredentialsToken();
    });

    it('should send correct grant type', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply((config) => {
        const params = new URLSearchParams(config.data);
        expect(params.get('grant_type')).toBe('client_credentials');
        return [200, mockTokenResponse];
      });

      await client.getClientCredentialsToken();
    });

    it('should throw error on failure', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(401, {
        error: 'invalid_client',
      });

      await expect(client.getClientCredentialsToken()).rejects.toThrow(
        'Failed to get client credentials token'
      );
    });
  });

  describe('revokeToken', () => {
    it('should revoke access token', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/revoke').reply(200);

      await client.revokeToken('token-to-revoke', 'access_token');

      const request = mockAxios.history.post[0];
      const params = new URLSearchParams(request.data);
      expect(params.get('token')).toBe('token-to-revoke');
      expect(params.get('token_type_hint')).toBe('access_token');
    });

    it('should revoke refresh token', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/revoke').reply(200);

      await client.revokeToken('refresh-token-to-revoke', 'refresh_token');

      const request = mockAxios.history.post[0];
      const params = new URLSearchParams(request.data);
      expect(params.get('token_type_hint')).toBe('refresh_token');
    });

    it('should default to access_token type', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/revoke').reply(200);

      await client.revokeToken('token-to-revoke');

      const request = mockAxios.history.post[0];
      const params = new URLSearchParams(request.data);
      expect(params.get('token_type_hint')).toBe('access_token');
    });

    it('should use Basic Auth', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/revoke').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200];
      });

      await client.revokeToken('token');
    });

    it('should throw error on failure', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/revoke').reply(400);

      await expect(client.revokeToken('token')).rejects.toThrow('Failed to revoke token');
    });
  });

  describe('getAccessToken', () => {
    it('should return undefined when no tokens set', () => {
      expect(client.getAccessToken()).toBeUndefined();
    });

    it('should return access token when tokens are set', () => {
      client.setTokens({ accessToken: 'test-token' });
      expect(client.getAccessToken()).toBe('test-token');
    });
  });

  describe('setTokens', () => {
    it('should store tokens', () => {
      const tokens: AuthTokens = {
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
        expiresAt: new Date('2025-01-01'),
        scope: ['openid', 'profile'],
      };

      client.setTokens(tokens);

      expect(client.getAccessToken()).toBe('access-123');
      expect((client as any).tokens).toEqual(tokens);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false when no tokens set', () => {
      expect(client.isTokenExpired()).toBe(false);
    });

    it('should return false when no expiration set', () => {
      client.setTokens({ accessToken: 'token' });
      expect(client.isTokenExpired()).toBe(false);
    });

    it('should return false when token not expired', () => {
      const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
      client.setTokens({ accessToken: 'token', expiresAt: futureDate });
      expect(client.isTokenExpired()).toBe(false);
    });

    it('should return true when token expired', () => {
      const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
      client.setTokens({ accessToken: 'token', expiresAt: pastDate });
      expect(client.isTokenExpired()).toBe(true);
    });
  });

  describe('getUserInfo', () => {
    const mockUserInfo = {
      sub: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
      picture: 'https://example.com/avatar.jpg',
    };

    it('should get user info with stored token', async () => {
      client.setTokens({ accessToken: 'stored-token' });

      mockAxios.onGet('https://auth.contio.ai/oauth2/userInfo').reply(200, mockUserInfo);

      const userInfo = await client.getUserInfo();

      expect(userInfo).toEqual(mockUserInfo);
    });

    it('should get user info with provided token', async () => {
      mockAxios.onGet('https://auth.contio.ai/oauth2/userInfo').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer custom-token');
        return [200, mockUserInfo];
      });

      await client.getUserInfo('custom-token');
    });

    it('should use Bearer token authentication (RFC 6750)', async () => {
      client.setTokens({ accessToken: 'test-token' });

      mockAxios.onGet('https://auth.contio.ai/oauth2/userInfo').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer test-token');
        return [200, mockUserInfo];
      });

      await client.getUserInfo();
    });

    it('should throw error when no token available', async () => {
      await expect(client.getUserInfo()).rejects.toThrow('No access token available');
    });

    it('should throw error on failure', async () => {
      client.setTokens({ accessToken: 'token' });

      mockAxios.onGet('https://auth.contio.ai/oauth2/userInfo').reply(401);

      await expect(client.getUserInfo()).rejects.toThrow('Failed to get user info');
    });
  });

  describe('initiatePartnerAuth', () => {
    const mockResponse = {
      session: 'session-123',
      challengeName: 'CUSTOM_CHALLENGE',
      challengeParams: { email: 'user@example.com' },
      userProvisioned: true,
    };

    it('should initiate partner authentication', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply(200, mockResponse);

      const result = await client.initiatePartnerAuth('user@example.com');

      expect(result.session).toBe('session-123');
      expect(result.challengeName).toBe('CUSTOM_CHALLENGE');
      expect(result.userProvisioned).toBe(true);
    });

    it('should send email and client_id', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.email).toBe('user@example.com');
        expect(body.client_id).toBe('test-client-id');
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com');
    });

    it('should include name when provided', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Test User');
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com', 'Test User');
    });

    it('should use Basic Auth with client credentials', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com');
    });

    it('should use JSON content type', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        expect(config.headers?.['Content-Type']).toBe('application/json');
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com');
    });

    it('should include workspace_id when provided', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.workspace_id).toBe('ws-uuid-123');
        expect(body.is_admin).toBeUndefined();
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com', 'Test User', {
        workspace_id: 'ws-uuid-123',
      });
    });

    it('should include is_admin when provided', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.workspace_id).toBe('ws-uuid-123');
        expect(body.is_admin).toBe(true);
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com', 'Test User', {
        workspace_id: 'ws-uuid-123',
        is_admin: true,
      });
    });

    it('should include is_admin as false when explicitly set', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.workspace_id).toBe('ws-uuid-123');
        expect(body.is_admin).toBe(false);
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com', undefined, {
        workspace_id: 'ws-uuid-123',
        is_admin: false,
      });
    });

    it('should not include workspace fields when options not provided', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.workspace_id).toBeUndefined();
        expect(body.is_admin).toBeUndefined();
        return [200, mockResponse];
      });

      await client.initiatePartnerAuth('user@example.com');
    });

    it('should throw error on failure', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/initiate').reply(400, {
        error: 'invalid_request',
      });

      await expect(client.initiatePartnerAuth('user@example.com')).rejects.toThrow(
        'Failed to initiate partner authentication'
      );
    });
  });

  describe('verifyPartnerAuth', () => {
    const mockResponse = {
      redirectUrl: 'https://auth.contio.ai/oauth2/authorize?code=auth-code-123',
    };

    it('should verify partner authentication', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/verify').reply(200, mockResponse);

      const result = await client.verifyPartnerAuth('user@example.com', '123456', 'session-123');

      expect(result.redirectUrl).toBe('https://auth.contio.ai/oauth2/authorize?code=auth-code-123');
    });

    it('should send all required parameters', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/verify').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.email).toBe('user@example.com');
        expect(body.code).toBe('123456');
        expect(body.session).toBe('session-123');
        expect(body.client_id).toBe('test-client-id');
        return [200, mockResponse];
      });

      await client.verifyPartnerAuth('user@example.com', '123456', 'session-123');
    });

    it('should use Basic Auth with client credentials', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/verify').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200, mockResponse];
      });

      await client.verifyPartnerAuth('user@example.com', '123456', 'session-123');
    });

    it('should throw error on failure', async () => {
      mockAxios.onPost('https://auth.contio.ai/auth/verify').reply(400, {
        error: 'invalid_code',
      });

      await expect(
        client.verifyPartnerAuth('user@example.com', 'wrong-code', 'session-123')
      ).rejects.toThrow('Failed to verify partner authentication');
    });
  });

  describe('checkConsent', () => {
    const mockResponse = {
      hasConsent: true,
      requiresConsent: false,
      redirectUrl: 'https://auth.contio.ai/oauth2/authorize?code=auth-code-123',
    };

    it('should check consent status', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/check-consent').reply(200, mockResponse);

      const result = await client.checkConsent('user@example.com');

      expect(result.hasConsent).toBe(true);
      expect(result.requiresConsent).toBe(false);
      expect(result.redirectUrl).toBeDefined();
    });

    it('should send email, client_id, and scope', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/check-consent').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.email).toBe('user@example.com');
        expect(body.client_id).toBe('test-client-id');
        expect(body.scope).toBe('openid profile meetings:read meetings:write');
        return [200, mockResponse];
      });

      await client.checkConsent('user@example.com');
    });

    it('should use Basic Auth with client credentials', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/check-consent').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200, mockResponse];
      });

      await client.checkConsent('user@example.com');
    });

    it('should throw error on failure', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/check-consent').reply(400);

      await expect(client.checkConsent('user@example.com')).rejects.toThrow(
        'Failed to check consent'
      );
    });
  });

  describe('getPartnerInfo', () => {
    const mockPartnerInfo = {
      name: 'Test Partner',
      description: 'A test partner application',
      logoUrl: 'https://example.com/logo.png',
      websiteUrl: 'https://example.com',
    };

    it('should get partner info from public endpoint', async () => {
      mockAxios
        .onGet('https://auth.contio.ai/v1/partner/info/test-client-id/public')
        .reply(200, mockPartnerInfo);

      const info = await client.getPartnerInfo();

      expect(info.name).toBe('Test Partner');
      expect(info.description).toBe('A test partner application');
      expect(info.logoUrl).toBe('https://example.com/logo.png');
      expect(info.websiteUrl).toBe('https://example.com');
    });

    it('should not require authentication (public endpoint)', async () => {
      mockAxios
        .onGet('https://auth.contio.ai/v1/partner/info/test-client-id/public')
        .reply((config) => {
          // Should not have Authorization header
          expect(config.headers?.Authorization).toBeUndefined();
          return [200, mockPartnerInfo];
        });

      await client.getPartnerInfo();
    });

    it('should throw error on failure', async () => {
      mockAxios
        .onGet('https://auth.contio.ai/v1/partner/info/test-client-id/public')
        .reply(404);

      await expect(client.getPartnerInfo()).rejects.toThrow('Failed to get partner info');
    });
  });

  describe('getAvailableScopes', () => {
    const mockScopes = {
      scopes: ['openid', 'profile', 'email', 'meetings:read', 'meetings:write', 'action-items:read'],
    };

    it('should get available scopes', async () => {
      mockAxios.onGet('https://auth.contio.ai/oauth2/scopes').reply(200, mockScopes);

      const scopes = await client.getAvailableScopes();

      expect(scopes).toEqual(mockScopes.scopes);
    });

    it('should use Basic Auth with client credentials', async () => {
      mockAxios.onGet('https://auth.contio.ai/oauth2/scopes').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200, mockScopes];
      });

      await client.getAvailableScopes();
    });

    it('should return empty array when no scopes in response', async () => {
      mockAxios.onGet('https://auth.contio.ai/oauth2/scopes').reply(200, {});

      const scopes = await client.getAvailableScopes();

      expect(scopes).toEqual([]);
    });

    it('should throw error on failure', async () => {
      mockAxios.onGet('https://auth.contio.ai/oauth2/scopes').reply(401);

      await expect(client.getAvailableScopes()).rejects.toThrow('Failed to get available scopes');
    });
  });

  describe('introspectToken', () => {
    const mockIntrospection = {
      active: true,
      scope: 'openid profile meetings:read',
      clientId: 'test-client-id',
      username: 'user@example.com',
      exp: 1735689600,
      iat: 1735686000,
    };

    it('should introspect token', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/introspect').reply(200, mockIntrospection);

      const result = await client.introspectToken('token-to-introspect');

      expect(result.active).toBe(true);
      expect(result.scope).toBe('openid profile meetings:read');
      expect(result.clientId).toBe('test-client-id');
    });

    it('should send token in request body', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/introspect').reply((config) => {
        const params = new URLSearchParams(config.data);
        expect(params.get('token')).toBe('token-to-introspect');
        return [200, mockIntrospection];
      });

      await client.introspectToken('token-to-introspect');
    });

    it('should use Basic Auth with client credentials', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/introspect').reply((config) => {
        const expectedAuth = Buffer.from('test-client-id:test-client-secret').toString('base64');
        expect(config.headers?.Authorization).toBe(`Basic ${expectedAuth}`);
        return [200, mockIntrospection];
      });

      await client.introspectToken('token-to-introspect');
    });

    it('should handle inactive token', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/introspect').reply(200, {
        active: false,
      });

      const result = await client.introspectToken('expired-token');

      expect(result.active).toBe(false);
    });

    it('should throw error on failure', async () => {
      mockAxios.onPost('https://auth.contio.ai/oauth2/introspect').reply(400);

      await expect(client.introspectToken('token')).rejects.toThrow('Failed to introspect token');
    });
  });

  describe('Token parsing', () => {
    it('should parse token response with all fields', async () => {
      const mockResponse: OAuthTokenResponse = {
        access_token: 'access-123',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'refresh-456',
        scope: 'openid profile meetings:read',
      };

      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(200, mockResponse);

      const tokens = await client.exchangeCodeForToken('code');

      expect(tokens.accessToken).toBe('access-123');
      expect(tokens.refreshToken).toBe('refresh-456');
      expect(tokens.scope).toEqual(['openid', 'profile', 'meetings:read']);
      expect(tokens.expiresAt).toBeInstanceOf(Date);

      // Check expiration is approximately 1 hour from now
      const expectedExpiry = Date.now() + 3600000;
      const actualExpiry = tokens.expiresAt!.getTime();
      expect(Math.abs(actualExpiry - expectedExpiry)).toBeLessThan(1000); // Within 1 second
    });

    it('should handle response without refresh token', async () => {
      const mockResponse: OAuthTokenResponse = {
        access_token: 'access-123',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(200, mockResponse);

      const tokens = await client.getClientCredentialsToken();

      expect(tokens.accessToken).toBe('access-123');
      expect(tokens.refreshToken).toBeUndefined();
    });

    it('should handle response without scope', async () => {
      const mockResponse: OAuthTokenResponse = {
        access_token: 'access-123',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      mockAxios.onPost('https://auth.contio.ai/oauth2/token').reply(200, mockResponse);

      const tokens = await client.exchangeCodeForToken('code');

      expect(tokens.scope).toBeUndefined();
    });
  });
});
