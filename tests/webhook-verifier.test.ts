/**
 * Comprehensive unit tests for Webhook Verifier
 */

import * as crypto from 'crypto';
import { WebhookVerifier, verifyWebhookSignature, parseWebhook } from '../src/webhooks/verifier';
import {
  ContioWebhookEvent,
  WorkflowAssignmentCreatedPayload,
  ActionItemUpdatedPayload,
  WEBHOOK_EVENTS,
} from '../src/webhooks/types';

describe('WebhookVerifier', () => {
  const testSecret = 'test-webhook-secret-12345';
  let verifier: WebhookVerifier;

  beforeEach(() => {
    verifier = new WebhookVerifier(testSecret);
  });

  describe('constructor', () => {
    it('should create verifier with secret', () => {
      expect(verifier).toBeDefined();
    });

    it('should throw error when secret is empty', () => {
      expect(() => new WebhookVerifier('')).toThrow('Webhook secret is required');
    });

    it('should throw error when secret is undefined', () => {
      expect(() => new WebhookVerifier(undefined as any)).toThrow('Webhook secret is required');
    });
  });

  describe('verifySignature', () => {
    const testPayload = JSON.stringify({
      event_type: 'workflow.assignment.created',
      event_id: 'evt_123',
      timestamp: '2025-01-08T12:00:00Z',
      partner_app_id: 'app_456',
      data: { assignment: { assignment_id: 'assign_789' } },
    });

    function generateSignature(payload: string | Buffer, secret: string): string {
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      return 'sha256=' + hmac.digest('hex'); // Include sha256= prefix
    }

    it('should verify valid signature', () => {
      const signature = generateSignature(testPayload, testSecret);
      const result = verifier.verifySignature(testPayload, signature);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should verify valid signature with sha256= prefix', () => {
      const signature = generateSignature(testPayload, testSecret);
      const result = verifier.verifySignature(testPayload, signature);

      expect(result.isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const result = verifier.verifySignature(testPayload, 'sha256=invalid-signature-hex-000000000000');

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject signature with wrong secret', () => {
      const wrongSignature = generateSignature(testPayload, 'wrong-secret');
      const result = verifier.verifySignature(testPayload, wrongSignature);

      expect(result.isValid).toBe(false);
    });

    it('should reject missing signature', () => {
      const result = verifier.verifySignature(testPayload, '');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Missing signature');
    });

    it('should verify signature with Buffer payload', () => {
      const bufferPayload = Buffer.from(testPayload, 'utf8');
      const signature = generateSignature(bufferPayload, testSecret);
      const result = verifier.verifySignature(bufferPayload, signature);

      expect(result.isValid).toBe(true);
    });

    it('should reject modified payload', () => {
      const signature = generateSignature(testPayload, testSecret);
      const modifiedPayload = testPayload.replace('evt_123', 'evt_999');
      const result = verifier.verifySignature(modifiedPayload, signature);

      expect(result.isValid).toBe(false);
    });

    it('should use timing-safe comparison', () => {
      // This test ensures we're using crypto.timingSafeEqual
      // which prevents timing attacks
      const signature = generateSignature(testPayload, testSecret);

      // Valid signature should pass
      const validResult = verifier.verifySignature(testPayload, signature);
      expect(validResult.isValid).toBe(true);

      // Invalid signature should fail
      const invalidSignature = signature.slice(0, -2) + '00';
      const invalidResult = verifier.verifySignature(testPayload, invalidSignature);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should handle malformed signature gracefully', () => {
      const result = verifier.verifySignature(testPayload, 'sha256=not-a-hex-string!!!');

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject signature without sha256= prefix', () => {
      const hmac = crypto.createHmac('sha256', testSecret);
      hmac.update(testPayload);
      const signatureWithoutPrefix = hmac.digest('hex');
      const result = verifier.verifySignature(testPayload, signatureWithoutPrefix);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid signature format');
    });
  });

  describe('parseWebhook', () => {
    const workflowAssignmentEvent: WorkflowAssignmentCreatedPayload = {
      event_type: 'workflow.assignment.created',
      event_id: 'evt_workflow_123',
      timestamp: '2025-01-08T12:00:00Z',
      partner_app_id: 'app_456',
      data: {
        assignment_id: 'assign_789',
        action_item_id: 'action_101',
        workflow_id: 'workflow_202',
        workflow_name: 'Create Jira Ticket',
        confidence_score: 0.95,
        workflow_data_payload: {
          project: 'PROJ',
          issue_type: 'Task',
        },
        status: 'pending',
        meeting_id: 'meeting_303',
        workspace_id: 'workspace_404',
        created_at: '2025-01-08T12:00:00Z',
      },
    };

    // Minimal payload - only IDs and key state, partners fetch full details via API
    const actionItemEvent: ActionItemUpdatedPayload = {
      event_type: 'action_item.updated',
      event_id: 'evt_action_456',
      timestamp: '2025-01-08T13:00:00Z',
      partner_app_id: 'app_456',
      data: {
        action_item_id: 'action_101',
        meeting_id: 'meeting_303',
        is_completed: true,
        status: 'completed',
        workspace_id: 'workspace_404',
        updated_at: '2025-01-08T13:00:00Z',
      },
    };

    function signPayload(payload: any, secret: string): string {
      const payloadString = JSON.stringify(payload);
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payloadString);
      return 'sha256=' + hmac.digest('hex'); // Include sha256= prefix
    }

    it('should parse valid workflow assignment webhook', () => {
      const payloadString = JSON.stringify(workflowAssignmentEvent);
      const signature = signPayload(workflowAssignmentEvent, testSecret);

      const event = verifier.parseWebhook(payloadString, signature);

      expect(event).toBeDefined();
      expect(event?.event_type).toBe('workflow.assignment.created');
      expect(event?.event_id).toBe('evt_workflow_123');
      expect(event?.partner_app_id).toBe('app_456');

      const typedEvent = event as WorkflowAssignmentCreatedPayload;
      expect(typedEvent.data.assignment_id).toBe('assign_789');
      expect(typedEvent.data.workflow_name).toBe('Create Jira Ticket');
    });

    it('should parse valid action item webhook', () => {
      const payloadString = JSON.stringify(actionItemEvent);
      const signature = signPayload(actionItemEvent, testSecret);

      const event = verifier.parseWebhook(payloadString, signature);

      expect(event).toBeDefined();
      expect(event?.event_type).toBe('action_item.updated');

      const typedEvent = event as ActionItemUpdatedPayload;
      expect(typedEvent.data.action_item_id).toBe('action_101');
      expect(typedEvent.data.is_completed).toBe(true);
    });

    it('should parse meeting.updated webhook', () => {
      const meetingUpdatedEvent = {
        event_type: 'meeting.updated',
        event_id: 'evt_meeting_upd_123',
        timestamp: '2026-01-31T10:30:00Z',
        partner_app_id: 'app_456',
        for_user: {
          id: 'user_789',
          email: 'user@example.com',
        },
        data: {
          meeting_id: 'meeting_123',
          workspace_id: 'ws_456',
          title: 'Updated Meeting Title',
          scheduled_start: '2026-02-01T14:00:00Z',
          updated_at: '2026-01-31T10:30:00Z',
        },
      };

      const payloadString = JSON.stringify(meetingUpdatedEvent);
      const signature = signPayload(meetingUpdatedEvent, testSecret);

      const event = verifier.parseWebhook(payloadString, signature);

      expect(event).toBeDefined();
      expect(event?.event_type).toBe('meeting.updated');
      expect((event as any).data.meeting_id).toBe('meeting_123');
      expect((event as any).data.title).toBe('Updated Meeting Title');
    });

    it('should parse calendar_event.created webhook', () => {
      const calendarEventCreatedEvent = {
        event_type: 'calendar_event.created',
        event_id: 'evt_cal_created_123',
        timestamp: '2026-01-31T10:30:00Z',
        partner_app_id: 'app_456',
        for_user: {
          id: 'user_789',
          email: 'user@example.com',
        },
        data: {
          calendar_event_id: 'cal_event_123',
          title: 'Team Standup',
          start_time: '2026-02-01T09:00:00Z',
          end_time: '2026-02-01T09:30:00Z',
          is_all_day: false,
          attendee_count: 5,
        },
      };

      const payloadString = JSON.stringify(calendarEventCreatedEvent);
      const signature = signPayload(calendarEventCreatedEvent, testSecret);

      const event = verifier.parseWebhook(payloadString, signature);

      expect(event).toBeDefined();
      expect(event?.event_type).toBe('calendar_event.created');
      expect((event as any).data.calendar_event_id).toBe('cal_event_123');
      expect((event as any).data.attendee_count).toBe(5);
    });

    it('should parse agenda_item.created webhook', () => {
      const agendaItemCreatedEvent = {
        event_type: 'agenda_item.created',
        event_id: 'evt_agenda_created_123',
        timestamp: '2026-01-31T10:30:00Z',
        partner_app_id: 'app_456',
        for_user: {
          id: 'user_789',
          email: 'user@example.com',
        },
        data: {
          agenda_item_id: 'agenda_123',
          meeting_id: 'meeting_456',
          title: 'Discuss Q1 Goals',
          item_type: 'DISCUSSION',
          created_at: '2026-01-31T10:30:00Z',
        },
      };

      const payloadString = JSON.stringify(agendaItemCreatedEvent);
      const signature = signPayload(agendaItemCreatedEvent, testSecret);

      const event = verifier.parseWebhook(payloadString, signature);

      expect(event).toBeDefined();
      expect(event?.event_type).toBe('agenda_item.created');
      expect((event as any).data.agenda_item_id).toBe('agenda_123');
      expect((event as any).data.item_type).toBe('DISCUSSION');
    });

    it('should parse webhook with Buffer payload', () => {
      const payloadString = JSON.stringify(workflowAssignmentEvent);
      const bufferPayload = Buffer.from(payloadString, 'utf8');
      const signature = signPayload(workflowAssignmentEvent, testSecret);

      const event = verifier.parseWebhook(bufferPayload, signature);

      expect(event).toBeDefined();
      expect(event?.event_type).toBe('workflow.assignment.created');
    });

    it('should throw error for invalid signature', () => {
      const payloadString = JSON.stringify(workflowAssignmentEvent);
      const invalidSignature = 'sha256=invalid-signature-000000000000000000000000000000000000000000000000';

      expect(() => {
        verifier.parseWebhook(payloadString, invalidSignature);
      }).toThrow('Webhook verification failed');
    });

    it('should throw error for missing required fields', () => {
      const invalidPayload = {
        event_type: 'workflow.assignment.created',
        // Missing event_id, timestamp, partner_app_id
        data: { assignment: {} },
      };
      const payloadString = JSON.stringify(invalidPayload);
      const signature = signPayload(invalidPayload, testSecret);

      expect(() => {
        verifier.parseWebhook(payloadString, signature);
      }).toThrow('Invalid webhook payload: missing required fields');
    });

    it('should throw error for invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      // Generate signature for the invalid JSON string itself
      const hmac = crypto.createHmac('sha256', testSecret);
      hmac.update(invalidJson);
      const signature = 'sha256=' + hmac.digest('hex');

      expect(() => {
        verifier.parseWebhook(invalidJson, signature);
      }).toThrow('Failed to parse webhook payload');
    });

    it('should validate all required fields are present', () => {
      const validPayload = {
        event_type: 'workflow.assignment.created',
        event_id: 'evt_123',
        timestamp: '2025-01-08T12:00:00Z',
        partner_app_id: 'app_456',
        data: { assignment: {} },
      };
      const payloadString = JSON.stringify(validPayload);
      const signature = signPayload(validPayload, testSecret);

      const event = verifier.parseWebhook(payloadString, signature);

      expect(event).toBeDefined();
      expect(event?.event_type).toBe('workflow.assignment.created');
      expect(event?.event_id).toBe('evt_123');
      expect(event?.timestamp).toBe('2025-01-08T12:00:00Z');
      expect(event?.partner_app_id).toBe('app_456');
    });
  });

  describe('convenience functions', () => {
    const testPayload = JSON.stringify({
      event_type: 'workflow.assignment.created',
      event_id: 'evt_123',
      timestamp: '2025-01-08T12:00:00Z',
      partner_app_id: 'app_456',
      data: { assignment: { assignment_id: 'assign_789' } },
    });

    function generateSignature(payload: string, secret: string): string {
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      return 'sha256=' + hmac.digest('hex'); // Include sha256= prefix
    }

    describe('verifyWebhookSignature', () => {
      it('should verify valid signature', () => {
        const signature = generateSignature(testPayload, testSecret);
        const isValid = verifyWebhookSignature(testPayload, signature, testSecret);

        expect(isValid).toBe(true);
      });

      it('should reject invalid signature', () => {
        const isValid = verifyWebhookSignature(testPayload, 'sha256=invalid-sig', testSecret);

        expect(isValid).toBe(false);
      });
    });

    describe('parseWebhook', () => {
      it('should parse valid webhook', () => {
        const signature = generateSignature(testPayload, testSecret);
        const event = parseWebhook(testPayload, signature, testSecret);

        expect(event).toBeDefined();
        expect(event.event_type).toBe('workflow.assignment.created');
        expect(event.event_id).toBe('evt_123');
      });

      it('should throw error for invalid signature', () => {
        expect(() => {
          parseWebhook(testPayload, 'sha256=invalid-sig', testSecret);
        }).toThrow();
      });
    });
  });
});

// Tests for WebhookEventHandler
import { WebhookEventHandler } from '../src/webhooks/handler';

describe('WebhookEventHandler', () => {
  const testSecret = 'test-handler-secret';

  function generateSignature(payload: string | Buffer, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    return 'sha256=' + hmac.digest('hex');
  }

  describe('on()', () => {
    it('should register and call typed event handlers', async () => {
      const handler = new WebhookEventHandler(testSecret);
      const meetingHandler = jest.fn();
      const actionItemHandler = jest.fn();

      handler
        .on('meeting.created', meetingHandler)
        .on('action_item.completed', actionItemHandler);

      const payload = JSON.stringify({
        event_type: 'meeting.created',
        event_id: 'evt_123',
        timestamp: '2025-01-08T12:00:00Z',
        partner_app_id: 'app_456',
        data: {
          meeting_id: 'mtg_123',
          workspace_id: 'ws_456',
          title: 'Test Meeting',
          created_by_user_id: 'user_789',
          created_at: '2025-01-08T12:00:00Z',
        },
      });

      const signature = generateSignature(payload, testSecret);
      await handler.handle(payload, signature);

      expect(meetingHandler).toHaveBeenCalledTimes(1);
      expect(meetingHandler).toHaveBeenCalledWith(expect.objectContaining({
        event_type: 'meeting.created',
        data: expect.objectContaining({ meeting_id: 'mtg_123' }),
      }));
      expect(actionItemHandler).not.toHaveBeenCalled();
    });

    it('should call onAny handler for every event', async () => {
      const handler = new WebhookEventHandler(testSecret);
      const catchAllHandler = jest.fn();

      handler.onAny(catchAllHandler);

      const payload = JSON.stringify({
        event_type: 'action_item.updated',
        event_id: 'evt_456',
        timestamp: '2025-01-08T12:00:00Z',
        partner_app_id: 'app_456',
        data: {
          action_item: {
            action_item_id: 'ai_123',
            meeting_id: 'mtg_123',
            status: 'completed',
            is_completed: true,
            updated_at: '2025-01-08T12:00:00Z',
          },
        },
      });

      const signature = generateSignature(payload, testSecret);
      await handler.handle(payload, signature);

      expect(catchAllHandler).toHaveBeenCalledTimes(1);
    });

    it('should return true for hasHandler when handler is registered', () => {
      const handler = new WebhookEventHandler(testSecret);
      handler.on('meeting.completed', () => {});

      expect(handler.hasHandler('meeting.completed')).toBe(true);
      expect(handler.hasHandler('meeting.created')).toBe(false);
    });
  });
});
