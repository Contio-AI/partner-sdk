/**
 * Tests for User Toolkit endpoints (install/uninstall).
 */

import {
  ToolkitWithInstallation,
  ToolkitWithInstallationListResponse,
  ToolkitInstallation,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Toolkits', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockToolkit: ToolkitWithInstallation = {
    id: 'toolkit-123',
    name: 'Sales Toolkit',
    description: 'Tools for sales team meetings',
    icon_name: 'briefcase',
    is_installed: false,
    created_at: '2025-01-08T12:00:00Z',
    updated_at: '2025-01-08T12:00:00Z',
  };

  const mockInstalledToolkit: ToolkitWithInstallation = {
    ...mockToolkit,
    is_installed: true,
    installation: {
      id: 'install-789',
      toolkit_id: 'toolkit-123',
      workspace_id: 'workspace-456',
      installed_at: '2025-01-09T10:00:00Z',
    },
  };

  describe('getToolkits', () => {
    const mockResponse: ToolkitWithInstallationListResponse = {
      items: [mockToolkit, mockInstalledToolkit],
      total: 2,
      limit: 20,
      offset: 0,
    };

    it('should get list of available toolkits', async () => {
      ctx.mockAxios.onGet('/toolkits').reply(200, mockResponse);

      const response = await ctx.userClient.getToolkits();

      expect(response.items).toHaveLength(2);
      expect(response.items[0].name).toBe('Sales Toolkit');
      expect(response.items[0].is_installed).toBe(false);
      expect(response.items[1].is_installed).toBe(true);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/toolkits').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(25);
        return [200, mockResponse];
      });

      await ctx.userClient.getToolkits({ limit: 50, offset: 25 });
    });
  });

  describe('getToolkit', () => {
    it('should get a specific toolkit by ID', async () => {
      ctx.mockAxios.onGet('/toolkits/toolkit-123').reply(200, mockToolkit);

      const toolkit = await ctx.userClient.getToolkit('toolkit-123');

      expect(toolkit.id).toBe('toolkit-123');
      expect(toolkit.name).toBe('Sales Toolkit');
      expect(toolkit.is_installed).toBe(false);
    });

    it('should return installation details if installed', async () => {
      ctx.mockAxios.onGet('/toolkits/toolkit-123').reply(200, mockInstalledToolkit);

      const toolkit = await ctx.userClient.getToolkit('toolkit-123');

      expect(toolkit.is_installed).toBe(true);
      expect(toolkit.installation?.id).toBe('install-789');
    });
  });

  describe('installToolkit', () => {
    const mockInstallation: ToolkitInstallation = {
      id: 'install-789',
      toolkit_id: 'toolkit-123',
      workspace_id: 'workspace-456',
      installed_at: '2025-01-09T10:00:00Z',
    };

    it('should install a toolkit', async () => {
      ctx.mockAxios.onPost('/toolkits/toolkit-123/install').reply(201, mockInstallation);

      const installation = await ctx.userClient.installToolkit('toolkit-123');

      expect(installation.id).toBe('install-789');
      expect(installation.toolkit_id).toBe('toolkit-123');
    });

    it('should send POST request to correct endpoint', async () => {
      ctx.mockAxios.onPost('/toolkits/toolkit-123/install').reply((config) => {
        expect(config.method).toBe('post');
        return [201, mockInstallation];
      });

      await ctx.userClient.installToolkit('toolkit-123');
    });
  });

  describe('uninstallToolkit', () => {
    it('should uninstall a toolkit', async () => {
      ctx.mockAxios.onDelete('/toolkits/toolkit-123/uninstall').reply(204);

      await ctx.userClient.uninstallToolkit('toolkit-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/toolkits/toolkit-123/uninstall');
    });
  });
});

