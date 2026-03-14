/**
 * Shared test setup for Admin client domain tests.
 */

import MockAdapter from 'axios-mock-adapter';
import { ApiKeyClient } from '../../src/auth/apiKey';
import { PartnerAdminClient } from '../../src/client/admin';

export const mockApiKeyConfig = {
  apiKey: 'ctio_test_api_key_12345',
  clientId: 'test-client-id',
};

export interface AdminTestContext {
  apiKeyClient: ApiKeyClient;
  adminClient: PartnerAdminClient;
  mockAxios: MockAdapter;
}

/**
 * Creates a fresh test context. Call in `beforeEach`.
 */
export function createAdminTestContext(): AdminTestContext {
  const apiKeyClient = new ApiKeyClient(mockApiKeyConfig);
  const adminClient = new PartnerAdminClient(apiKeyClient);
  const mockAxios = new MockAdapter((adminClient as any).axiosInstance);

  return { apiKeyClient, adminClient, mockAxios };
}

