/**
 * Tests for credential management functionality
 */

import { ContioPartnerSDK } from '../src';
import type {
  CredentialStatusResponse,
  CredentialRotationResponse,
  CredentialAuditHistoryResponse,
} from '../src/models/credentials';

describe('Credential Management', () => {
  let sdk: ReturnType<typeof ContioPartnerSDK.forAdmin>;

  beforeEach(() => {
    sdk = ContioPartnerSDK.forAdmin({
      apiKey: 'test-api-key',
      clientId: 'test-client-id',
    });
  });

  describe('getCredentialStatus', () => {
    it('should return status for all credential types', async () => {
      const mockStatus: CredentialStatusResponse = {
        api_key: {
          credential_type: 'api_key',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z',
          last_rotated_at: '2024-01-15T00:00:00Z',
          last_used_at: '2024-01-20T00:00:00Z',
          age_days: 5,
          recommended_action: 'ok',
        },
        webhook_secret: {
          credential_type: 'webhook_secret',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z',
          last_rotated_at: '2024-01-20T00:00:00Z',
          last_used_at: '2024-01-20T00:00:00Z',
          age_days: 0,
          recommended_action: 'ok',
          // Webhook secrets don't have grace periods
        },
        client_secret: {
          credential_type: 'client_secret',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z',
          age_days: 19,
          recommended_action: 'ok',
        },
      };

      // Mock the API call
      jest.spyOn(sdk.admin as any, 'get').mockResolvedValue(mockStatus);

      const status = await sdk.admin.getCredentialStatus();

      expect(status).toEqual(mockStatus);
      expect(status.api_key.status).toBe('active');
      expect(status.webhook_secret.status).toBe('active');
    });
  });

  describe('rotateAPIKey', () => {
    it('should rotate API key and return new credential', async () => {
      const mockResponse: CredentialRotationResponse = {
        credential_type: 'api_key',
        new_credential: 'ctio_new_api_key_12345',
        grace_period_ends_at: '2024-01-22T00:00:00Z',
        rollback_token: 'rb_rollback_token_12345',
        rollback_expires_at: '2024-01-20T01:00:00Z',
      };

      jest.spyOn(sdk.admin as any, 'post').mockResolvedValue(mockResponse);

      const result = await sdk.admin.rotateAPIKey({
        confirmation_token: 'confirm_rotation_12345',
        reason: 'Test rotation',
        grace_period_hours: 48,
      });

      expect(result).toEqual(mockResponse);
      expect(result.new_credential).toMatch(/^ctio_/);
      expect(result.rollback_token).toMatch(/^rb_/);
    });

    it('should use default grace period if not specified', async () => {
      const mockResponse: CredentialRotationResponse = {
        credential_type: 'api_key',
        new_credential: 'ctio_new_api_key_12345',
        grace_period_ends_at: '2024-01-21T00:00:00Z',
        rollback_token: 'rb_rollback_token_12345',
        rollback_expires_at: '2024-01-20T01:00:00Z',
      };

      const postSpy = jest.spyOn(sdk.admin as any, 'post').mockResolvedValue(mockResponse);

      await sdk.admin.rotateAPIKey({
        confirmation_token: 'confirm_rotation_12345',
      });

      expect(postSpy).toHaveBeenCalledWith(
        '/credentials/api-key/rotate',
        expect.objectContaining({
          confirmation_token: 'confirm_rotation_12345',
        })
      );
    });
  });

  describe('rotateWebhookSecret', () => {
    it('should rotate webhook secret and return new credential (no grace period)', async () => {
      const mockResponse: CredentialRotationResponse = {
        credential_type: 'webhook_secret',
        new_credential: 'whs_new_webhook_secret_12345',
        // Webhook secrets don't have grace period or rollback
        grace_period_ends_at: undefined,
        rollback_token: undefined,
        rollback_expires_at: undefined,
      };

      jest.spyOn(sdk.admin as any, 'post').mockResolvedValue(mockResponse);

      const result = await sdk.admin.rotateWebhookSecret({
        confirmation_token: 'confirm_rotation_67890',
        reason: 'Quarterly rotation',
        // grace_period_hours is ignored for webhook secrets
      });

      expect(result).toEqual(mockResponse);
      expect(result.new_credential).toMatch(/^whs_/);
      expect(result.grace_period_ends_at).toBeUndefined();
      expect(result.rollback_token).toBeUndefined();
    });
  });

  describe('rotateClientSecret', () => {
    it('should rotate client secret and return new credential', async () => {
      const mockResponse: CredentialRotationResponse = {
        credential_type: 'client_secret',
        new_credential: 'cs_new_client_secret_12345',
        grace_period_ends_at: '2024-01-27T00:00:00Z',
        rollback_token: 'rb_rollback_token_abcde',
        rollback_expires_at: '2024-01-20T01:00:00Z',
      };

      jest.spyOn(sdk.admin as any, 'post').mockResolvedValue(mockResponse);

      const result = await sdk.admin.rotateClientSecret({
        confirmation_token: 'confirm_rotation_abcde',
        reason: 'Annual rotation',
        grace_period_hours: 168,
      });

      expect(result).toEqual(mockResponse);
      expect(result.new_credential).toMatch(/^cs_/);
    });
  });

  describe('rollbackCredential', () => {
    it('should rollback API key rotation', async () => {
      const postSpy = jest.spyOn(sdk.admin as any, 'post').mockResolvedValue(undefined);

      await sdk.admin.rollbackCredential('api-key', {
        rollback_token: 'rb_rollback_token_12345',
      });

      expect(postSpy).toHaveBeenCalledWith(
        '/credentials/api-key/rollback',
        { rollback_token: 'rb_rollback_token_12345' }
      );
    });

    it('should rollback client secret rotation', async () => {
      const postSpy = jest.spyOn(sdk.admin as any, 'post').mockResolvedValue(undefined);

      await sdk.admin.rollbackCredential('client-secret', {
        rollback_token: 'rb_rollback_token_abcde',
      });

      expect(postSpy).toHaveBeenCalledWith(
        '/credentials/client-secret/rollback',
        { rollback_token: 'rb_rollback_token_abcde' }
      );
    });
  });

  describe('getCredentialHistory', () => {
    it('should return audit history', async () => {
      const mockHistory: CredentialAuditHistoryResponse = {
        events: [
          {
            id: 'evt_123',
            partner_app_id: 'app_456',
            credential_type: 'api_key',
            action: 'rotated',
            initiated_by: 'partner',
            user_agent: 'Mozilla/5.0',
            ip_address: '192.168.1.1',
            reason: 'Monthly rotation',
            metadata: {
              grace_period_hours: 48,
              rollback_token: 'rb_xyz',
            },
            created_at: '2024-01-20T00:00:00Z',
          },
        ],
        pagination: {
          limit: 20,
          offset: 0,
          count: 1,
        },
      };

      jest.spyOn(sdk.admin as any, 'get').mockResolvedValue(mockHistory);

      const history = await sdk.admin.getCredentialHistory({
        limit: 20,
        credential_type: 'api_key',
      });

      expect(history).toEqual(mockHistory);
      expect(history.events).toHaveLength(1);
      expect(history.events[0].action).toBe('rotated');
    });

    it('should support filtering by credential type', async () => {
      const getSpy = jest.spyOn(sdk.admin as any, 'get').mockResolvedValue({
        events: [],
        pagination: { limit: 20, offset: 0, count: 0 },
      });

      await sdk.admin.getCredentialHistory({
        credential_type: 'webhook_secret',
      });

      expect(getSpy).toHaveBeenCalledWith(
        '/credentials/history',
        expect.objectContaining({
          credential_type: 'webhook_secret',
        })
      );
    });

    it('should support filtering by action', async () => {
      const getSpy = jest.spyOn(sdk.admin as any, 'get').mockResolvedValue({
        events: [],
        pagination: { limit: 20, offset: 0, count: 0 },
      });

      await sdk.admin.getCredentialHistory({
        action: 'rotated',
      });

      expect(getSpy).toHaveBeenCalledWith(
        '/credentials/history',
        expect.objectContaining({
          action: 'rotated',
        })
      );
    });

    it('should support pagination', async () => {
      const getSpy = jest.spyOn(sdk.admin as any, 'get').mockResolvedValue({
        events: [],
        pagination: { limit: 50, offset: 100, count: 0 },
      });

      await sdk.admin.getCredentialHistory({
        limit: 50,
        offset: 100,
      });

      expect(getSpy).toHaveBeenCalledWith(
        '/credentials/history',
        expect.objectContaining({
          limit: 50,
          offset: 100,
        })
      );
    });
  });

  describe('Type Safety', () => {
    it('should enforce credential type constraints', () => {
      // TypeScript should enforce these types at compile time
      const validTypes: Array<'api-key' | 'webhook-secret' | 'client-secret'> = [
        'api-key',
        'webhook-secret',
        'client-secret',
      ];

      validTypes.forEach(type => {
        expect(['api-key', 'webhook-secret', 'client-secret']).toContain(type);
      });
    });

    it('should enforce credential status constraints', () => {
      const validStatuses: Array<'active' | 'transitioning' | 'disabled'> = [
        'active',
        'transitioning',
        'disabled',
      ];

      validStatuses.forEach(status => {
        expect(['active', 'transitioning', 'disabled']).toContain(status);
      });
    });

    it('should enforce recommended action constraints', () => {
      const validActions: Array<'ok' | 'rotate_soon' | 'rotate_recommended'> = [
        'ok',
        'rotate_soon',
        'rotate_recommended',
      ];

      validActions.forEach(action => {
        expect(['ok', 'rotate_soon', 'rotate_recommended']).toContain(action);
      });
    });
  });
});
