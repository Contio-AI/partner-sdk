/**
 * Tests for User Template endpoints.
 */

import * as userTemplates from '../../src/client/user/templates';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Templates', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockTemplate: userTemplates.UserMeetingTemplate = {
    id: 'template-123',
    name: 'Sales Meeting Template',
    description: 'Template for sales team meetings',
    next_steps: [
      {
        id: 'nextstep-1',
        name: 'Generate Summary',
        description: 'AI-generated meeting summary',
        type: 'ai_generated',
        autopilot: false,
        action_buttons: [
          { id: 'button-1', name: 'Send Email', description: 'Email summary', is_default: true },
        ],
      },
    ],
    created_at: '2025-01-08T12:00:00Z',
    updated_at: '2025-01-08T12:00:00Z',
  };

  describe('getMeetingTemplates', () => {
    const mockResponse: userTemplates.UserMeetingTemplateListResponse = {
      items: [mockTemplate],
      total: 1,
      limit: 20,
      offset: 0,
    };

    it('should get list of meeting templates', async () => {
      ctx.mockAxios.onGet('/meeting-templates').reply(200, mockResponse);

      const response = await ctx.userClient.getMeetingTemplates();

      expect(response.items).toHaveLength(1);
      expect(response.items[0].name).toBe('Sales Meeting Template');
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/meeting-templates').reply((config) => {
        expect(config.params.limit).toBe(10);
        expect(config.params.offset).toBe(20);
        return [200, mockResponse];
      });

      await ctx.userClient.getMeetingTemplates({ limit: 10, offset: 20 });
    });

    it('should include next steps with action buttons', async () => {
      ctx.mockAxios.onGet('/meeting-templates').reply(200, mockResponse);

      const response = await ctx.userClient.getMeetingTemplates();

      expect(response.items[0].next_steps).toHaveLength(1);
      expect(response.items[0].next_steps![0].name).toBe('Generate Summary');
      expect(response.items[0].next_steps![0].action_buttons).toHaveLength(1);
    });
  });

  describe('getMeetingTemplate', () => {
    it('should get a specific meeting template by ID', async () => {
      ctx.mockAxios.onGet('/meeting-templates/template-123').reply(200, mockTemplate);

      const template = await ctx.userClient.getMeetingTemplate('template-123');

      expect(template.id).toBe('template-123');
      expect(template.name).toBe('Sales Meeting Template');
    });

    it('should include full next step and action button details', async () => {
      ctx.mockAxios.onGet('/meeting-templates/template-123').reply(200, mockTemplate);

      const template = await ctx.userClient.getMeetingTemplate('template-123');

      expect(template.next_steps).toHaveLength(1);
      expect(template.next_steps![0].type).toBe('ai_generated');
      expect(template.next_steps![0].action_buttons![0].is_default).toBe(true);
    });
  });
});

