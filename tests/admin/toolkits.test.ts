/**
 * Tests for Toolkit admin endpoints.
 */

import {
  Toolkit,
  ToolkitListResponse,
  CreateToolkitRequest,
  UpdateToolkitRequest,
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

