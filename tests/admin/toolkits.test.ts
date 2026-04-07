/**
 * Tests for Toolkit admin endpoints.
 */

import {
  Toolkit,
  ToolkitListResponse,
  CreateToolkitRequest,
  UpdateToolkitRequest,
  ToolkitVersion,
  CreateToolkitVersionRequest,
  UpdateToolkitVersionRequest,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Toolkits', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockToolkit: Toolkit = {
    id: 'toolkit-123',
    name: 'Sales Toolkit',
    description: 'Tools for sales team meetings',
    icon_name: 'briefcase',
    created_at: '2025-01-08T12:00:00Z',
    updated_at: '2025-01-08T12:00:00Z',
  };

  describe('createToolkit', () => {
    const createRequest: CreateToolkitRequest = {
      name: 'Sales Toolkit',
      description: 'Tools for sales team meetings',
      icon_name: 'briefcase',
    };

    it('should create a new toolkit', async () => {
      ctx.mockAxios.onPost('/toolkits').reply(201, mockToolkit);

      const toolkit = await ctx.adminClient.createToolkit(createRequest);

      expect(toolkit.id).toBe('toolkit-123');
      expect(toolkit.name).toBe('Sales Toolkit');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/toolkits').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Sales Toolkit');
        expect(body.description).toBe('Tools for sales team meetings');
        return [201, mockToolkit];
      });

      await ctx.adminClient.createToolkit(createRequest);
    });
  });

  describe('getToolkits', () => {
    const mockResponse: ToolkitListResponse = {
      items: [mockToolkit],
      total: 1,
      limit: 20,
      offset: 0,
    };

    it('should get list of toolkits', async () => {
      ctx.mockAxios.onGet('/toolkits').reply(200, mockResponse);

      const response = await ctx.adminClient.getToolkits();

      expect(response.items).toHaveLength(1);
      expect(response.items[0].name).toBe('Sales Toolkit');
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/toolkits').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(100);
        return [200, mockResponse];
      });

      await ctx.adminClient.getToolkits({ limit: 50, offset: 100 });
    });
  });

  describe('getToolkit', () => {
    it('should get a specific toolkit by ID', async () => {
      ctx.mockAxios.onGet('/toolkits/toolkit-123').reply(200, mockToolkit);

      const toolkit = await ctx.adminClient.getToolkit('toolkit-123');

      expect(toolkit.id).toBe('toolkit-123');
      expect(toolkit.name).toBe('Sales Toolkit');
    });
  });

  describe('updateToolkit', () => {
    const updateRequest: UpdateToolkitRequest = {
      name: 'Updated Toolkit',
      description: 'Updated description',
    };

    const updatedToolkit: Toolkit = {
      ...mockToolkit,
      name: 'Updated Toolkit',
      description: 'Updated description',
    };

    it('should update an existing toolkit', async () => {
      ctx.mockAxios.onPut('/toolkits/toolkit-123').reply(200, updatedToolkit);

      const toolkit = await ctx.adminClient.updateToolkit('toolkit-123', updateRequest);

      expect(toolkit.name).toBe('Updated Toolkit');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPut('/toolkits/toolkit-123').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Updated Toolkit');
        return [200, updatedToolkit];
      });

      await ctx.adminClient.updateToolkit('toolkit-123', updateRequest);
    });
  });

  describe('deleteToolkit', () => {
    it('should delete a toolkit', async () => {
      ctx.mockAxios.onDelete('/toolkits/toolkit-123').reply(204);

      await ctx.adminClient.deleteToolkit('toolkit-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/toolkits/toolkit-123');
    });
  });
});

describe('PartnerAdminClient › Toolkit Versions', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockVersion: ToolkitVersion = {
    id: 'version-456',
    toolkit_id: 'toolkit-123',
    version_number: 2,
    version_label: '2.0.0',
    status: 'DRAFT',
    manifest: {
      templates: [],
      next_steps: [],
      action_buttons: [],
    },
    changelog: 'New features added',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
  };

  describe('listToolkitVersions', () => {
    it('should list all versions for a toolkit', async () => {
      ctx.mockAxios.onGet('/toolkits/toolkit-123/versions').reply(200, [mockVersion]);

      const versions = await ctx.adminClient.listToolkitVersions('toolkit-123');

      expect(versions).toHaveLength(1);
      expect(versions[0].id).toBe('version-456');
      expect(versions[0].version_label).toBe('2.0.0');
      expect(versions[0].status).toBe('DRAFT');
    });

    it('should return empty array when no versions exist', async () => {
      ctx.mockAxios.onGet('/toolkits/toolkit-123/versions').reply(200, []);

      const versions = await ctx.adminClient.listToolkitVersions('toolkit-123');

      expect(versions).toHaveLength(0);
    });
  });

  describe('createToolkitVersion', () => {
    const createRequest: CreateToolkitVersionRequest = {
      version_label: '2.0.0',
      manifest: { templates: [], next_steps: [], action_buttons: [] },
      changelog: 'New features added',
    };

    it('should create a new draft version', async () => {
      ctx.mockAxios.onPost('/toolkits/toolkit-123/versions').reply(201, mockVersion);

      const version = await ctx.adminClient.createToolkitVersion('toolkit-123', createRequest);

      expect(version.id).toBe('version-456');
      expect(version.status).toBe('DRAFT');
      expect(version.version_number).toBe(2);
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/toolkits/toolkit-123/versions').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.version_label).toBe('2.0.0');
        expect(body.changelog).toBe('New features added');
        return [201, mockVersion];
      });

      await ctx.adminClient.createToolkitVersion('toolkit-123', createRequest);
    });
  });

  describe('getToolkitVersion', () => {
    it('should get a specific version by ID', async () => {
      ctx.mockAxios.onGet('/toolkits/toolkit-123/versions/version-456').reply(200, mockVersion);

      const version = await ctx.adminClient.getToolkitVersion('toolkit-123', 'version-456');

      expect(version.id).toBe('version-456');
      expect(version.toolkit_id).toBe('toolkit-123');
    });
  });

  describe('updateToolkitVersion', () => {
    const updateRequest: UpdateToolkitVersionRequest = {
      version_label: '2.0.1',
      changelog: 'Bug fixes',
    };

    const updatedVersion: ToolkitVersion = {
      ...mockVersion,
      version_label: '2.0.1',
      changelog: 'Bug fixes',
    };

    it('should update a draft version', async () => {
      ctx.mockAxios.onPatch('/toolkits/toolkit-123/versions/version-456').reply(200, updatedVersion);

      const version = await ctx.adminClient.updateToolkitVersion('toolkit-123', 'version-456', updateRequest);

      expect(version.version_label).toBe('2.0.1');
      expect(version.changelog).toBe('Bug fixes');
    });

    it('should send correct PATCH request body', async () => {
      ctx.mockAxios.onPatch('/toolkits/toolkit-123/versions/version-456').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.version_label).toBe('2.0.1');
        expect(body.changelog).toBe('Bug fixes');
        return [200, updatedVersion];
      });

      await ctx.adminClient.updateToolkitVersion('toolkit-123', 'version-456', updateRequest);
    });
  });

  describe('publishToolkitVersion', () => {
    it('should publish a draft version', async () => {
      ctx.mockAxios.onPost('/toolkits/toolkit-123/versions/version-456/publish').reply(204);

      await ctx.adminClient.publishToolkitVersion('toolkit-123', 'version-456');

      expect(ctx.mockAxios.history.post).toHaveLength(1);
      expect(ctx.mockAxios.history.post[0].url).toBe('/toolkits/toolkit-123/versions/version-456/publish');
    });
  });

  describe('republishToolkitVersion', () => {
    it('should republish a deprecated version', async () => {
      ctx.mockAxios.onPost('/toolkits/toolkit-123/versions/version-456/republish').reply(204);

      await ctx.adminClient.republishToolkitVersion('toolkit-123', 'version-456');

      expect(ctx.mockAxios.history.post).toHaveLength(1);
      expect(ctx.mockAxios.history.post[0].url).toBe('/toolkits/toolkit-123/versions/version-456/republish');
    });
  });

  describe('discardToolkitVersion', () => {
    it('should discard a draft version', async () => {
      ctx.mockAxios.onDelete('/toolkits/toolkit-123/versions/version-456').reply(204);

      await ctx.adminClient.discardToolkitVersion('toolkit-123', 'version-456');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/toolkits/toolkit-123/versions/version-456');
    });
  });
});

