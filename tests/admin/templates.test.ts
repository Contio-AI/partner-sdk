/**
 * Tests for Template admin endpoints.
 */

import {
  Template,
  TemplateListResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateNextStep,
  TemplateNextStepListResponse,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Templates', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockTemplate: Template = {
    id: 'template-123',
    toolkit_id: 'toolkit-456',
    name: 'Sales Meeting Template',
    description: 'Template for sales team meetings',
    color: '#3B82F6',
    icon_name: 'chart',
    is_default: false,
    created_at: '2025-01-08T12:00:00Z',
    updated_at: '2025-01-08T12:00:00Z',
  };

  describe('createTemplate', () => {
    const createRequest: CreateTemplateRequest = {
      toolkit_id: 'toolkit-456',
      name: 'Sales Meeting Template',
      description: 'Template for sales team meetings',
      color: '#3B82F6',
      icon_name: 'chart',
    };

    it('should create a new template', async () => {
      ctx.mockAxios.onPost('/templates').reply(201, mockTemplate);

      const template = await ctx.adminClient.createTemplate(createRequest);

      expect(template.id).toBe('template-123');
      expect(template.name).toBe('Sales Meeting Template');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/templates').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.toolkit_id).toBe('toolkit-456');
        expect(body.name).toBe('Sales Meeting Template');
        return [201, mockTemplate];
      });

      await ctx.adminClient.createTemplate(createRequest);
    });
  });

  describe('getTemplates', () => {
    const mockResponse: TemplateListResponse = {
      items: [mockTemplate],
      total: 1,
      limit: 20,
      offset: 0,
    };

    it('should get list of templates', async () => {
      ctx.mockAxios.onGet('/templates').reply(200, mockResponse);

      const response = await ctx.adminClient.getTemplates();

      expect(response.items).toHaveLength(1);
      expect(response.items[0].name).toBe('Sales Meeting Template');
    });

    it('should filter by toolkit_id', async () => {
      ctx.mockAxios.onGet('/templates').reply((config) => {
        expect(config.params.toolkit_id).toBe('toolkit-456');
        return [200, mockResponse];
      });

      await ctx.adminClient.getTemplates({ toolkit_id: 'toolkit-456' });
    });
  });

  describe('getTemplate', () => {
    it('should get a specific template by ID', async () => {
      ctx.mockAxios.onGet('/templates/template-123').reply(200, mockTemplate);

      const template = await ctx.adminClient.getTemplate('template-123');

      expect(template.id).toBe('template-123');
      expect(template.toolkit_id).toBe('toolkit-456');
    });
  });

  describe('updateTemplate', () => {
    const updateRequest: UpdateTemplateRequest = {
      name: 'Updated Template',
      is_default: true,
    };

    it('should update an existing template', async () => {
      const updatedTemplate = { ...mockTemplate, name: 'Updated Template', is_default: true };
      ctx.mockAxios.onPut('/templates/template-123').reply(200, updatedTemplate);

      const template = await ctx.adminClient.updateTemplate('template-123', updateRequest);

      expect(template.name).toBe('Updated Template');
      expect(template.is_default).toBe(true);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a template', async () => {
      ctx.mockAxios.onDelete('/templates/template-123').reply(204);

      await ctx.adminClient.deleteTemplate('template-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
    });
  });

  describe('Template Next Steps', () => {
    const mockNextStep: TemplateNextStep = {
      id: 'nextstep-123',
      name: 'Generate Summary',
      description: 'AI-generated meeting summary',
      display_order: 1,
      autopilot: false,
    };

    it('should get template next steps', async () => {
      const response: TemplateNextStepListResponse = {
        items: [mockNextStep],
        total: 1,
        limit: 20,
        offset: 0,
      };
      ctx.mockAxios.onGet('/templates/template-123/next-steps').reply(200, response);

      const result = await ctx.adminClient.getTemplateNextSteps('template-123');

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Generate Summary');
    });
  });
});

