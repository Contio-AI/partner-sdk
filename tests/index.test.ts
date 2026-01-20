/**
 * Basic tests for the Contio Partner SDK
 */

import { ContioPartnerSDK, OAuthClient, ApiKeyClient, PartnerUserClient, PartnerAdminClient } from '../src/index';

describe('ContioPartnerSDK', () => {
  describe('exports', () => {
    it('should export all required classes', () => {
      expect(ContioPartnerSDK).toBeDefined();
      expect(OAuthClient).toBeDefined();
      expect(ApiKeyClient).toBeDefined();
      expect(PartnerUserClient).toBeDefined();
      expect(PartnerAdminClient).toBeDefined();
    });
  });

  describe('forUser', () => {
    it('should create OAuth and user clients', () => {
      const config = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'http://localhost:3000/callback'
      };

      const { oauth, user } = ContioPartnerSDK.forUser(config);

      expect(oauth).toBeInstanceOf(OAuthClient);
      expect(user).toBeInstanceOf(PartnerUserClient);
    });
  });

  describe('forAdmin', () => {
    it('should create API key and admin clients', () => {
      const config = {
        apiKey: 'test-api-key'
      };

      const { apiKey, admin } = ContioPartnerSDK.forAdmin(config);

      expect(apiKey).toBeInstanceOf(ApiKeyClient);
      expect(admin).toBeInstanceOf(PartnerAdminClient);
    });
  });

  describe('constructor', () => {
    it('should throw error when no auth config provided', () => {
      expect(() => {
        new ContioPartnerSDK({});
      }).toThrow('Either OAuth or API Key configuration must be provided');
    });

    it('should initialize with OAuth config', () => {
      const sdk = new ContioPartnerSDK({
        oauth: {
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          redirectUri: 'http://localhost:3000/callback'
        }
      });

      expect(sdk.oauth).toBeInstanceOf(OAuthClient);
      expect(sdk.user).toBeInstanceOf(PartnerUserClient);
      expect(sdk.apiKey).toBeNull();
      expect(sdk.admin).toBeNull();
    });

    it('should initialize with API key config', () => {
      const sdk = new ContioPartnerSDK({
        apiKey: 'test-api-key'
      });

      expect(sdk.apiKey).toBeInstanceOf(ApiKeyClient);
      expect(sdk.admin).toBeInstanceOf(PartnerAdminClient);
      expect(sdk.oauth).toBeNull();
      expect(sdk.user).toBeNull();
    });
  });
});
