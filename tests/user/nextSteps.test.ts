/**
 * Tests for Meeting Next Steps and Action Buttons user endpoints.
 */

import {
  MeetingNextStep,
  MeetingNextStepListResponse,
  MeetingActionButton,
  MeetingActionButtonListResponse,
  ExecuteNextStepResponse,
  TriggerActionButtonResponse,
  NextStepResult,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Meeting Next Steps & Action Buttons', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockNextStep: MeetingNextStep = {
    id: 'nextstep-123',
    name: 'Generate Summary',
    description: 'AI-generated meeting summary',
    type: 'ai_generated',
    autopilot: false,
    action_buttons: [
      { id: 'button-1', name: 'Send Email', description: 'Email summary', is_default: true },
    ],
  };

  const mockActionButton: MeetingActionButton = {
    id: 'button-123',
    name: 'Send Email',
    description: 'Send summary via email',
    is_default: true,
  };

  describe('getMeetingNextSteps', () => {
    const mockResponse: MeetingNextStepListResponse = {
      items: [mockNextStep],
      total: 1,
      limit: 20,
      offset: 0,
    };

    it('should get next steps for a meeting', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-123/next-steps').reply(200, mockResponse);

      const response = await ctx.userClient.getMeetingNextSteps('meeting-123');

      expect(response.items).toHaveLength(1);
      expect(response.items[0].name).toBe('Generate Summary');
      expect(response.items[0].action_buttons).toHaveLength(1);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-123/next-steps').reply((config) => {
        expect(config.params.limit).toBe(10);
        return [200, mockResponse];
      });

      await ctx.userClient.getMeetingNextSteps('meeting-123', { limit: 10 });
    });
  });

  describe('executeNextStep', () => {
    const mockExecuteResponse: ExecuteNextStepResponse = {
      result_id: 'result-789',
      status: 'pending',
      message: 'Next step execution started',
    };

    it('should execute a next step', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-123/next-steps/nextstep-456/execute').reply(200, mockExecuteResponse);

      const response = await ctx.userClient.executeNextStep('meeting-123', 'nextstep-456');

      expect(response.result_id).toBe('result-789');
      expect(response.status).toBe('pending');
    });

    it('should send parameters in request body', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-123/next-steps/nextstep-456/execute').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.parameters).toEqual({ format: 'detailed' });
        return [200, mockExecuteResponse];
      });

      await ctx.userClient.executeNextStep('meeting-123', 'nextstep-456', { parameters: { format: 'detailed' } });
    });
  });

  describe('getNextStepResult', () => {
    const mockResult: NextStepResult = {
      id: 'result-789',
      next_step_id: 'nextstep-456',
      meeting_id: 'meeting-123',
      status: 'completed',
      content: '# Meeting Summary\n\nKey points discussed...',
      created_at: '2025-01-08T12:00:00Z',
      updated_at: '2025-01-08T12:05:00Z',
    };

    it('should get next step result', async () => {
      ctx.mockAxios.onGet('/next-step-results/result-789').reply(200, mockResult);

      const result = await ctx.userClient.getNextStepResult('result-789');

      expect(result.id).toBe('result-789');
      expect(result.status).toBe('completed');
      expect(result.content).toContain('Meeting Summary');
    });
  });

  describe('getMeetingActionButtons', () => {
    const mockResponse: MeetingActionButtonListResponse = {
      items: [mockActionButton],
      total: 1,
      limit: 20,
      offset: 0,
    };

    it('should get action buttons for a meeting', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-123/action-buttons').reply(200, mockResponse);

      const response = await ctx.userClient.getMeetingActionButtons('meeting-123');

      expect(response.items).toHaveLength(1);
      expect(response.items[0].name).toBe('Send Email');
    });
  });

  describe('triggerActionButton', () => {
    const mockTriggerResponse: TriggerActionButtonResponse = {
      result_id: 'trigger-result-123',
      status: 'completed',
      message: 'Email sent successfully',
      redirect_url: 'https://mail.example.com/sent/123',
    };

    it('should trigger an action button', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-123/action-buttons/button-456/trigger').reply(200, mockTriggerResponse);

      const response = await ctx.userClient.triggerActionButton('meeting-123', 'button-456');

      expect(response.result_id).toBe('trigger-result-123');
      expect(response.status).toBe('completed');
      expect(response.redirect_url).toBe('https://mail.example.com/sent/123');
    });
  });
});

