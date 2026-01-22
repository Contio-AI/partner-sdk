/**
 * Comprehensive unit tests for Express Webhook Middleware
 */

import * as crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import {
  createWebhookMiddleware,
  hasWebhookEvent,
  WebhookRequest,
  WebhookMiddlewareOptions,
} from '../src/webhooks/express';
import { ContioWebhookEvent } from '../src/webhooks/types';

describe('Express Webhook Middleware', () => {
  const testSecret = 'test-webhook-secret-12345';

  // Helper to generate valid signature
  function generateSignature(payload: string | Buffer, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    return 'sha256=' + hmac.digest('hex');
  }

  // Helper to create mock request
  function createMockRequest(body: any, signature?: string): Partial<Request> {
    return {
      body,
      headers: signature ? { 'x-contio-signature': signature } : {},
    };
  }

  // Helper to create mock response
  function createMockResponse(): Partial<Response> {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res;
  }

  // Helper to create mock next function
  function createMockNext(): NextFunction {
    return jest.fn();
  }

  describe('createWebhookMiddleware - configuration', () => {
    it('should throw error when secret is missing and skipVerification is false', () => {
      expect(() => {
        createWebhookMiddleware({ secret: '' });
      }).toThrow('Webhook secret is required unless skipVerification is true');
    });

    it('should not throw error when secret is missing but skipVerification is true', () => {
      expect(() => {
        createWebhookMiddleware({ secret: '', skipVerification: true });
      }).not.toThrow();
    });

    it('should create middleware with valid secret', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });
  });

  describe('successful webhook verification', () => {
    const validEvent: ContioWebhookEvent = {
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
    };

    it('should verify valid webhook with Buffer body', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      const payloadString = JSON.stringify(validEvent);
      const bufferBody = Buffer.from(payloadString, 'utf8');
      const signature = generateSignature(bufferBody, testSecret);

      const req = createMockRequest(bufferBody, signature) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect((req as WebhookRequest).webhookEvent).toEqual(validEvent);
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(true);
      expect((req as WebhookRequest).webhookRawPayload).toBe(payloadString);
    });

    it('should verify valid webhook with string body', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      const payloadString = JSON.stringify(validEvent);
      const signature = generateSignature(payloadString, testSecret);

      const req = createMockRequest(payloadString, signature) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect((req as WebhookRequest).webhookEvent).toEqual(validEvent);
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(true);
    });

    it('should verify valid webhook with object body (re-stringified)', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      const payloadString = JSON.stringify(validEvent);
      const signature = generateSignature(payloadString, testSecret);

      const req = createMockRequest(validEvent, signature) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect((req as WebhookRequest).webhookEvent).toEqual(validEvent);
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(true);
    });

    it('should use custom signature header', () => {
      const customHeader = 'x-custom-signature';
      const middleware = createWebhookMiddleware({
        secret: testSecret,
        signatureHeader: customHeader,
      });
      const payloadString = JSON.stringify(validEvent);
      const signature = generateSignature(payloadString, testSecret);

      const req = createMockRequest(
        Buffer.from(payloadString, 'utf8')
      ) as Request;
      req.headers = { [customHeader]: signature };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect((req as WebhookRequest).webhookEvent).toEqual(validEvent);
    });
  });

  describe('signature verification failures', () => {
    const validEvent: ContioWebhookEvent = {
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
    };

    it('should reject webhook with invalid signature', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      const payloadString = JSON.stringify(validEvent);
      const invalidSignature = 'sha256=invalid-signature-000000000000000000000000000000000000000000000000';

      const req = createMockRequest(payloadString, invalidSignature) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Webhook verification failed',
        message: expect.stringContaining('Webhook verification failed'),
      });
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(false);
    });

    it('should reject webhook with missing signature header', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      const payloadString = JSON.stringify(validEvent);

      const req = createMockRequest(payloadString) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Webhook verification failed',
        message: 'Missing x-contio-signature header',
      });
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(false);
      expect((req as WebhookRequest).webhookVerification.error).toBe('Missing x-contio-signature header');
    });

    it('should reject webhook with wrong secret', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      const payloadString = JSON.stringify(validEvent);
      const wrongSignature = generateSignature(payloadString, 'wrong-secret');

      const req = createMockRequest(payloadString, wrongSignature) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(false);
    });

    it('should reject webhook with modified payload', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });
      const payloadString = JSON.stringify(validEvent);
      const signature = generateSignature(payloadString, testSecret);
      const modifiedPayload = payloadString.replace('evt_123', 'evt_999');

      const req = createMockRequest(modifiedPayload, signature) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(false);
    });
  });

  describe('skipVerification mode', () => {
    const validEvent: ContioWebhookEvent = {
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
    };

    it('should skip verification when skipVerification is true', () => {
      const middleware = createWebhookMiddleware({
        secret: '',
        skipVerification: true,
      });
      const payloadString = JSON.stringify(validEvent);

      const req = createMockRequest(payloadString) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect((req as WebhookRequest).webhookEvent).toEqual(validEvent);
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(true);
    });

    it('should skip verification with Buffer body', () => {
      const middleware = createWebhookMiddleware({
        secret: '',
        skipVerification: true,
      });
      const payloadString = JSON.stringify(validEvent);
      const bufferBody = Buffer.from(payloadString, 'utf8');

      const req = createMockRequest(bufferBody) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect((req as WebhookRequest).webhookEvent).toEqual(validEvent);
    });

    it('should skip verification even with invalid signature', () => {
      const middleware = createWebhookMiddleware({
        secret: '',
        skipVerification: true,
      });
      const payloadString = JSON.stringify(validEvent);

      const req = createMockRequest(payloadString, 'invalid-signature') as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect((req as WebhookRequest).webhookEvent).toEqual(validEvent);
    });
  });

  describe('custom error handlers', () => {
    const validEvent: ContioWebhookEvent = {
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
    };

    it('should call custom error handler on verification failure', () => {
      const customErrorHandler = jest.fn();
      const middleware = createWebhookMiddleware({
        secret: testSecret,
        onError: customErrorHandler,
      });
      const payloadString = JSON.stringify(validEvent);
      const invalidSignature = 'sha256=invalid-signature';

      const req = createMockRequest(payloadString, invalidSignature) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(customErrorHandler).toHaveBeenCalledTimes(1);
      expect(customErrorHandler).toHaveBeenCalledWith(
        expect.any(Error),
        req,
        res,
        next
      );
      expect(next).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call custom error handler on missing signature', () => {
      const customErrorHandler = jest.fn();
      const middleware = createWebhookMiddleware({
        secret: testSecret,
        onError: customErrorHandler,
      });
      const payloadString = JSON.stringify(validEvent);

      const req = createMockRequest(payloadString) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(customErrorHandler).toHaveBeenCalledTimes(1);
      const errorArg = customErrorHandler.mock.calls[0][0];
      expect(errorArg.message).toBe('Missing x-contio-signature header');
    });

    it('should allow custom error handler to call next with error', () => {
      const customErrorHandler = jest.fn((err, req, res, next) => {
        next(err);
      });
      const middleware = createWebhookMiddleware({
        secret: testSecret,
        onError: customErrorHandler,
      });
      const payloadString = JSON.stringify(validEvent);

      const req = createMockRequest(payloadString) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(customErrorHandler).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('error cases', () => {
    it('should handle null body (treated as object and stringified)', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });

      const req = createMockRequest(null) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      // null is an object in JS, so it gets stringified and then fails on missing signature
      expect(res.json).toHaveBeenCalledWith({
        error: 'Webhook verification failed',
        message: 'Missing x-contio-signature header',
      });
    });

    it('should handle invalid JSON in skipVerification mode', () => {
      const middleware = createWebhookMiddleware({
        secret: '',
        skipVerification: true,
      });

      const req = createMockRequest('{ invalid json }') as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect((req as WebhookRequest).webhookVerification.isValid).toBe(false);
    });

    it('should handle numeric body type', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });

      const req = createMockRequest(12345) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Webhook verification failed',
        message: 'Unable to get request body for webhook verification',
      });
    });

    it('should handle undefined body', () => {
      const middleware = createWebhookMiddleware({ secret: testSecret });

      const req = createMockRequest(undefined) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('hasWebhookEvent type guard', () => {
    it('should return true for request with valid webhook event', () => {
      const req = {
        webhookEvent: {
          event_type: 'meeting.created',
          event_id: 'evt_123',
          timestamp: '2025-01-08T12:00:00Z',
          partner_app_id: 'app_456',
          data: {},
        },
        webhookVerification: { isValid: true },
      } as WebhookRequest;

      expect(hasWebhookEvent(req)).toBe(true);
    });

    it('should return false for request without webhook event', () => {
      const req = {} as Request;

      expect(hasWebhookEvent(req)).toBe(false);
    });

    it('should return false for request with invalid verification', () => {
      const req = {
        webhookEvent: {
          event_type: 'meeting.created',
          event_id: 'evt_123',
          timestamp: '2025-01-08T12:00:00Z',
          partner_app_id: 'app_456',
          data: {},
        },
        webhookVerification: { isValid: false, error: 'Invalid signature' },
      } as any;

      expect(hasWebhookEvent(req)).toBe(false);
    });

    it('should return false for request with missing verification', () => {
      const req = {
        webhookEvent: {
          event_type: 'meeting.created',
          event_id: 'evt_123',
          timestamp: '2025-01-08T12:00:00Z',
          partner_app_id: 'app_456',
          data: {},
        },
      } as any;

      expect(hasWebhookEvent(req)).toBe(false);
    });
  });
});

