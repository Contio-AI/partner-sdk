/**
 * Tests for User Profile endpoints.
 */

import { UserProfile } from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › User Profile', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  describe('getUserProfile', () => {
    const mockUserProfile: UserProfile = {
      id: 'user-123',
      display_name: 'John Doe',
      email: 'john.doe@example.com',
      created_at: '2024-01-01T00:00:00Z',
      workspace_id: 'ws-uuid-456',
      workspace_name: 'Acme Corp',
      workspace_role: 'WORKSPACE_MEMBER',
    };

    it('should get user profile', async () => {
      ctx.mockAxios.onGet('/profile').reply(200, mockUserProfile);

      const profile = await ctx.userClient.getUserProfile();

      expect(profile.id).toBe('user-123');
      expect(profile.display_name).toBe('John Doe');
      expect(profile.email).toBe('john.doe@example.com');
    });

    it('should include workspace fields in profile', async () => {
      ctx.mockAxios.onGet('/profile').reply(200, mockUserProfile);

      const profile = await ctx.userClient.getUserProfile();

      expect(profile.workspace_id).toBe('ws-uuid-456');
      expect(profile.workspace_name).toBe('Acme Corp');
      expect(profile.workspace_role).toBe('WORKSPACE_MEMBER');
    });

    it('should handle workspace admin role in profile', async () => {
      const adminProfile: UserProfile = {
        ...mockUserProfile,
        workspace_role: 'WORKSPACE_ADMIN',
      };
      ctx.mockAxios.onGet('/profile').reply(200, adminProfile);

      const profile = await ctx.userClient.getUserProfile();

      expect(profile.workspace_role).toBe('WORKSPACE_ADMIN');
    });

    it('should handle workspace owner role in profile', async () => {
      const ownerProfile: UserProfile = {
        ...mockUserProfile,
        workspace_role: 'WORKSPACE_OWNER',
      };
      ctx.mockAxios.onGet('/profile').reply(200, ownerProfile);

      const profile = await ctx.userClient.getUserProfile();

      expect(profile.workspace_role).toBe('WORKSPACE_OWNER');
    });
  });
});

