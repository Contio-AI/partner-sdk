/**
 * Tests for Next Step admin endpoints.
 */

import {
  NextStep,
  NextStepListResponse,
  CreateNextStepRequest,
  UpdateNextStepRequest,
  NextStepActionButton,
  NextStepActionButtonListResponse,
} from '../../src/models';
import { createAdminTestContext, AdminTestContext } from './setup';

describe('PartnerAdminClient › Next Steps', () => {
  let ctx: AdminTestContext;

  beforeEach(() => {
    ctx = createAdminTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockNextStep: NextStep = {
    id: 'nextstep-123',
    name: 'Generate Summary',
    description: 'AI-generated meeting summary',
    type: 'ai_generated',
    ai_prompt: 'Summarize the key points from this meeting',
    color: '#10B981',
    icon_name: 'document',
    created_at: '2025-01-08T12:00:00Z',
    updated_at: '2025-01-08T12:00:00Z',
  };

  describe('createNextStep', () => {
    const createRequest: CreateNextStepRequest = {
      name: 'Generate Summary',
      description: 'AI-generated meeting summary',
      type: 'ai_generated',
      ai_prompt: 'Summarize the key points from this meeting',
    };

    it('should create a new next step', async () => {
      ctx.mockAxios.onPost('/next-steps').reply(201, mockNextStep);

      const nextStep = await ctx.adminClient.createNextStep(createRequest);

      expect(nextStep.id).toBe('nextstep-123');
      expect(nextStep.name).toBe('Generate Summary');
    });

    it('should send correct request body', async () => {
      ctx.mockAxios.onPost('/next-steps').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.name).toBe('Generate Summary');
        expect(body.type).toBe('ai_generated');
        expect(body.ai_prompt).toBe('Summarize the key points from this meeting');
        return [201, mockNextStep];
      });

      await ctx.adminClient.createNextStep(createRequest);
    });
  });

  describe('getNextSteps', () => {
    const mockResponse: NextStepListResponse = {
      items: [mockNextStep],
      total: 1,
      limit: 20,
      offset: 0,
    };

    it('should get list of next steps', async () => {
      ctx.mockAxios.onGet('/next-steps').reply(200, mockResponse);

      const response = await ctx.adminClient.getNextSteps();

      expect(response.items).toHaveLength(1);
      expect(response.items[0].name).toBe('Generate Summary');
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/next-steps').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(10);
        return [200, mockResponse];
      });

      await ctx.adminClient.getNextSteps({ limit: 50, offset: 10 });
    });
  });

  describe('getNextStep', () => {
    it('should get a specific next step by ID', async () => {
      ctx.mockAxios.onGet('/next-steps/nextstep-123').reply(200, mockNextStep);

      const nextStep = await ctx.adminClient.getNextStep('nextstep-123');

      expect(nextStep.id).toBe('nextstep-123');
      expect(nextStep.type).toBe('ai_generated');
    });
  });

  describe('updateNextStep', () => {
    const updateRequest: UpdateNextStepRequest = {
      name: 'Updated Next Step',
      ai_prompt: 'New AI prompt',
    };

    it('should update an existing next step', async () => {
      const updated = { ...mockNextStep, name: 'Updated Next Step' };
      ctx.mockAxios.onPut('/next-steps/nextstep-123').reply(200, updated);

      const nextStep = await ctx.adminClient.updateNextStep('nextstep-123', updateRequest);

      expect(nextStep.name).toBe('Updated Next Step');
    });
  });

  describe('deleteNextStep', () => {
    it('should delete a next step', async () => {
      ctx.mockAxios.onDelete('/next-steps/nextstep-123').reply(204);

      await ctx.adminClient.deleteNextStep('nextstep-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
    });
  });

  describe('Next Step Action Buttons', () => {
    const mockActionButton: NextStepActionButton = {
      id: 'button-123',
      name: 'Send Email',
      description: 'Send summary via email',
      content_format: 'html',
      delivery_mechanism: 'email',
      is_default: true,
      created_at: '2025-01-08T12:00:00Z',
      updated_at: '2025-01-08T12:00:00Z',
    };

    it('should get action buttons for a next step', async () => {
      const response: NextStepActionButtonListResponse = {
        items: [mockActionButton],
        total: 1,
        limit: 20,
        offset: 0,
      };
      ctx.mockAxios.onGet('/next-steps/nextstep-123/action-buttons').reply(200, response);

      const result = await ctx.adminClient.getNextStepActionButtons('nextstep-123');

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Send Email');
    });
  });
});

