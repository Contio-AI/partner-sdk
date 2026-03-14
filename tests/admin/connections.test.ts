/**
 * Tests for User Connection endpoints.
 */

import {
  UserConnection,
  UserConnectionListResponse,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › User Connections', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  describe('getUserConnections', () => {
    const mockConnectionsResponse: UserConnectionListResponse = {
      items: [
        {
          id: 'conn-1',
          user_id: 'user-123',
          user_name: 'John Doe',
          user_email: 'john@example.com',
          oauth_scopes: ['openid', 'profile', 'meetings:read', 'meetings:write'],
          status: 'active',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: 'conn-2',
          user_id: 'user-456',
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          oauth_scopes: ['openid', 'profile', 'meetings:read'],
          status: 'active',
          created_at: '2025-01-05T00:00:00Z',
          updated_at: '2025-01-05T00:00:00Z',
        },
      ],
      total: 2,
      limit: 20,
      offset: 0,
    };

    it('should get list of user connections', async () => {
      ctx.mockAxios.onGet('/connections').reply(200, mockConnectionsResponse);

      const response = await ctx.adminClient.getUserConnections();

      expect(response.items).toHaveLength(2);
      expect(response.items[0].status).toBe('active');
      expect(response.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/connections').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(100);
        return [200, mockConnectionsResponse];
      });

      await ctx.adminClient.getUserConnections({ limit: 50, offset: 100 });
    });
  });

  describe('getUserConnection', () => {
    const mockConnection: UserConnection = {
      id: 'conn-123',
      user_id: 'user-789',
      user_name: 'Bob Johnson',
      user_email: 'bob@example.com',
      oauth_scopes: ['openid', 'profile', 'meetings:read', 'meetings:write', 'action-items:read'],
      status: 'active',
      last_used_at: '2025-01-08T10:00:00Z',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-08T10:00:00Z',
    };

    it('should get a specific user connection', async () => {
      ctx.mockAxios.onGet('/connections/conn-123').reply(200, mockConnection);

      const connection = await ctx.adminClient.getUserConnection('conn-123');

      expect(connection.id).toBe('conn-123');
      expect(connection.user_id).toBe('user-789');
      expect(connection.oauth_scopes).toHaveLength(5);
    });
  });

  describe('revokeUserConnection', () => {
    it('should revoke a user connection', async () => {
      ctx.mockAxios.onDelete('/connections/conn-123').reply(204);

      await ctx.adminClient.revokeUserConnection('conn-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/connections/conn-123');
    });
  });
});

