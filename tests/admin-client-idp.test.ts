/**
 * Unit tests for Partner Admin Client IdP Configuration endpoints
 */

import MockAdapter from 'axios-mock-adapter';
import { ApiKeyClient } from '../src/auth/apiKey';
import { PartnerAdminClient } from '../src/client/admin';
import {
  PartnerIdPConfig,
  CreateIdPConfigRequest,
  UpdateIdPConfigRequest,
} from '../src/models';

describe('PartnerAdminClient - IdP Configuration', () => {
  let apiKeyClient: ApiKeyClient;
  let adminClient: PartnerAdminClient;
  let mockAxios: MockAdapter;

  const mockApiKeyConfig = {
    apiKey: 'ctio_test_api_key_12345',
    clientId: 'test-client-id',
  };

  const mockIdPConfig: PartnerIdPConfig = {
    id: 'idp-123',
    partner_app_id: 'app-456',
    name: 'Acme Corp SSO',
    type: 'oidc',
    discovery_url: 'https://auth.acme.com/.well-known/openid-configuration',
    idp_client_id: 'acme-client-id',
    scopes: ['openid', 'profile', 'email'],
    claim_mappings: {
      email: 'email',
      name: 'name',
    },
    mode: 'strict',
    allowed_email_domains: ['acme.com', 'acme.io'],
    is_active: true,
    issuer: 'https://auth.acme.com',
    authorization_endpoint: 'https://auth.acme.com/authorize',
    token_endpoint: 'https://auth.acme.com/token',
    userinfo_endpoint: 'https://auth.acme.com/userinfo',
    jwks_uri: 'https://auth.acme.com/.well-known/jwks.json',
    discovery_last_fetched_at: '2025-01-08T12:00:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-08T12:00:00Z',
  };

  beforeEach(() => {
    apiKeyClient = new ApiKeyClient(mockApiKeyConfig);
    adminClient = new PartnerAdminClient(apiKeyClient);
    mockAxios = new MockAdapter((adminClient as any).axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('createIdPConfig', () => {
    const createRequest: CreateIdPConfigRequest = {
      name: 'Acme Corp SSO',
      discovery_url: 'https://auth.acme.com/.well-known/openid-configuration',
      idp_client_id: 'acme-client-id',
      idp_client_secret: 'acme-client-secret',
      scopes: ['openid', 'profile', 'email'],
      claim_mappings: {
        email: 'email',
        name: 'name',
      },
      mode: 'strict',
      allowed_email_domains: ['acme.com', 'acme.io'],
    };

    it('should create a new IdP configuration', async () => {
      mockAxios.onPost('/idp').reply(201, mockIdPConfig);

      const config = await adminClient.createIdPConfig(createRequest);

      expect(config.id).toBe('idp-123');
      expect(config.name).toBe('Acme Corp SSO');
      expect(config.type).toBe('oidc');
      expect(config.mode).toBe('strict');
      expect(config.is_active).toBe(true);
    });

    it('should send correct request body', async () => {
      mockAxios.onPost('/idp').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Acme Corp SSO');
        expect(body.discovery_url).toBe('https://auth.acme.com/.well-known/openid-configuration');
        expect(body.idp_client_id).toBe('acme-client-id');
        expect(body.idp_client_secret).toBe('acme-client-secret');
        expect(body.scopes).toEqual(['openid', 'profile', 'email']);
        expect(body.mode).toBe('strict');
        expect(body.allowed_email_domains).toEqual(['acme.com', 'acme.io']);
        return [201, mockIdPConfig];
      });

      await adminClient.createIdPConfig(createRequest);
    });

    it('should create IdP config with minimal required fields', async () => {
      const minimalRequest: CreateIdPConfigRequest = {
        name: 'Simple SSO',
        discovery_url: 'https://auth.example.com/.well-known/openid-configuration',
        idp_client_id: 'example-client-id',
        idp_client_secret: 'example-client-secret',
        mode: 'partner_managed',
      };

      const minimalConfig: PartnerIdPConfig = {
        ...mockIdPConfig,
        name: 'Simple SSO',
        mode: 'partner_managed',
        allowed_email_domains: null,
        scopes: ['openid'],
        claim_mappings: {},
      };

      mockAxios.onPost('/idp').reply(201, minimalConfig);

      const config = await adminClient.createIdPConfig(minimalRequest);

      expect(config.name).toBe('Simple SSO');
      expect(config.mode).toBe('partner_managed');
      expect(config.allowed_email_domains).toBeNull();
    });
  });

  describe('getIdPConfig', () => {
    it('should get the IdP configuration', async () => {
      mockAxios.onGet('/idp').reply(200, mockIdPConfig);

      const config = await adminClient.getIdPConfig();

      expect(config.id).toBe('idp-123');
      expect(config.partner_app_id).toBe('app-456');
      expect(config.name).toBe('Acme Corp SSO');
      expect(config.type).toBe('oidc');
      expect(config.discovery_url).toBe('https://auth.acme.com/.well-known/openid-configuration');
      expect(config.idp_client_id).toBe('acme-client-id');
      expect(config.scopes).toEqual(['openid', 'profile', 'email']);
      expect(config.claim_mappings).toEqual({ email: 'email', name: 'name' });
      expect(config.mode).toBe('strict');
      expect(config.allowed_email_domains).toEqual(['acme.com', 'acme.io']);
      expect(config.is_active).toBe(true);
      expect(config.issuer).toBe('https://auth.acme.com');
      expect(config.authorization_endpoint).toBe('https://auth.acme.com/authorize');
      expect(config.token_endpoint).toBe('https://auth.acme.com/token');
      expect(config.userinfo_endpoint).toBe('https://auth.acme.com/userinfo');
      expect(config.jwks_uri).toBe('https://auth.acme.com/.well-known/jwks.json');
    });
  });

  describe('updateIdPConfig', () => {
    it('should update IdP configuration with partial data', async () => {
      const updateRequest: UpdateIdPConfigRequest = {
        name: 'Updated Acme SSO',
        is_active: false,
      };

      const updatedConfig: PartnerIdPConfig = {
        ...mockIdPConfig,
        name: 'Updated Acme SSO',
        is_active: false,
        updated_at: '2025-01-09T10:00:00Z',
      };

      mockAxios.onPut('/idp').reply(200, updatedConfig);

      const config = await adminClient.updateIdPConfig(updateRequest);

      expect(config.name).toBe('Updated Acme SSO');
      expect(config.is_active).toBe(false);
    });

    it('should send correct request body for partial update', async () => {
      const updateRequest: UpdateIdPConfigRequest = {
        name: 'Updated Name',
        scopes: ['openid', 'profile', 'email', 'groups'],
      };

      mockAxios.onPut('/idp').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Updated Name');
        expect(body.scopes).toEqual(['openid', 'profile', 'email', 'groups']);
        expect(body.discovery_url).toBeUndefined();
        expect(body.idp_client_secret).toBeUndefined();
        return [200, mockIdPConfig];
      });

      await adminClient.updateIdPConfig(updateRequest);
    });

    it('should update mode from strict to partner_managed', async () => {
      const updateRequest: UpdateIdPConfigRequest = {
        mode: 'partner_managed',
        allowed_email_domains: [],
      };

      const updatedConfig: PartnerIdPConfig = {
        ...mockIdPConfig,
        mode: 'partner_managed',
        allowed_email_domains: null,
      };

      mockAxios.onPut('/idp').reply(200, updatedConfig);

      const config = await adminClient.updateIdPConfig(updateRequest);

      expect(config.mode).toBe('partner_managed');
    });

    it('should update client credentials', async () => {
      const updateRequest: UpdateIdPConfigRequest = {
        idp_client_id: 'new-client-id',
        idp_client_secret: 'new-client-secret',
      };

      mockAxios.onPut('/idp').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.idp_client_id).toBe('new-client-id');
        expect(body.idp_client_secret).toBe('new-client-secret');
        return [200, mockIdPConfig];
      });

      await adminClient.updateIdPConfig(updateRequest);
    });
  });

  describe('deleteIdPConfig', () => {
    it('should delete the IdP configuration', async () => {
      mockAxios.onDelete('/idp').reply(204);

      await adminClient.deleteIdPConfig();

      expect(mockAxios.history.delete).toHaveLength(1);
      expect(mockAxios.history.delete[0].url).toBe('/idp');
    });
  });

  describe('authentication', () => {
    it('should add API key headers to IdP requests', async () => {
      mockAxios.onGet('/idp').reply((config) => {
        expect(config.headers?.['X-API-Key']).toBe('ctio_test_api_key_12345');
        expect(config.headers?.['X-Client-ID']).toBe('test-client-id');
        return [200, mockIdPConfig];
      });

      await adminClient.getIdPConfig();
    });
  });
});
