/**
 * Shared test setup for User client domain tests.
 */

import MockAdapter from 'axios-mock-adapter';
import { OAuthClient } from '../../src/auth/oauth';
import { PartnerUserClient } from '../../src/client/user';

export const mockOAuthConfig = {
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  redirectUri: 'http://localhost:3000/callback',
};

export interface UserTestContext {
  oauthClient: OAuthClient;
  userClient: PartnerUserClient;
  mockAxios: MockAdapter;
}

/**
 * Creates a fresh test context. Call in `beforeEach`.
 */
export function createUserTestContext(): UserTestContext {
  const oauthClient = new OAuthClient(mockOAuthConfig);
  oauthClient.setTokens({ accessToken: 'test-access-token' });

  const userClient = new PartnerUserClient(oauthClient);
  const mockAxios = new MockAdapter((userClient as any).axiosInstance);

  return { oauthClient, userClient, mockAxios };
}

