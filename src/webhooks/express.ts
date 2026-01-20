/**
 * Express middleware for Contio webhook handling
 *
 * Provides middleware to verify webhook signatures and parse payloads
 * with proper error handling.
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createWebhookMiddleware, WebhookRequest } from '@contio/partner-sdk';
 *
 * const app = express();
 *
 * // Use raw body parser for webhook route
 * app.post('/webhook',
 *   express.raw({ type: 'application/json' }),
 *   createWebhookMiddleware({ secret: process.env.WEBHOOK_SECRET! }),
 *   (req: WebhookRequest, res) => {
 *     const event = req.webhookEvent;
 *     console.log('Received webhook:', event.event_type);
 *     res.status(200).json({ received: true });
 *   }
 * );
 * ```
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { WebhookVerifier } from './verifier';
import { ContioWebhookEvent, WebhookVerificationResult } from './types';

/**
 * Extended Express Request with parsed webhook event
 */
export interface WebhookRequest extends Request {
  /** The verified and parsed webhook event */
  webhookEvent: ContioWebhookEvent;
  /** Verification result details */
  webhookVerification: WebhookVerificationResult;
  /** Raw payload as string (for logging/debugging) */
  webhookRawPayload: string;
}

/**
 * Configuration options for webhook middleware
 */
export interface WebhookMiddlewareOptions {
  /** Webhook secret for signature verification */
  secret: string;
  /** Header name for signature (default: 'x-contio-signature') */
  signatureHeader?: string;
  /**
   * Custom error handler for verification failures
   * If not provided, returns 401 with JSON error
   */
  onError?: (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
  /**
   * Skip verification (for development only - NOT recommended for production)
   * @default false
   */
  skipVerification?: boolean;
}

/**
 * Create Express middleware for webhook verification
 *
 * This middleware:
 * 1. Extracts the signature from the request header
 * 2. Verifies the signature using HMAC-SHA256
 * 3. Parses the JSON payload
 * 4. Attaches the parsed event to req.webhookEvent
 *
 * The middleware expects the raw body to be available. Use with:
 * - express.raw({ type: 'application/json' }) for the webhook route
 * - Or ensure req.body is the raw string/Buffer before this middleware
 *
 * @param options - Middleware configuration options
 * @returns Express middleware function
 */
export function createWebhookMiddleware(
  options: WebhookMiddlewareOptions
): RequestHandler {
  const {
    secret,
    signatureHeader = 'x-contio-signature',
    onError,
    skipVerification = false,
  } = options;

  if (!secret && !skipVerification) {
    throw new Error('Webhook secret is required unless skipVerification is true');
  }

  const verifier = skipVerification ? null : new WebhookVerifier(secret);

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Get the raw payload
      let payload: string;
      if (Buffer.isBuffer(req.body)) {
        payload = req.body.toString('utf8');
      } else if (typeof req.body === 'string') {
        payload = req.body;
      } else if (typeof req.body === 'object') {
        // Body was parsed as JSON - re-stringify (less ideal but works)
        payload = JSON.stringify(req.body);
      } else {
        throw new Error('Unable to get request body for webhook verification');
      }

      // Attach raw payload for debugging
      (req as WebhookRequest).webhookRawPayload = payload;

      if (skipVerification) {
        // Development mode - skip verification
        const event = JSON.parse(payload) as ContioWebhookEvent;
        (req as WebhookRequest).webhookEvent = event;
        (req as WebhookRequest).webhookVerification = { isValid: true };
        next();
        return;
      }

      // Get signature from header
      const signature = req.headers[signatureHeader.toLowerCase()] as string;

      if (!signature) {
        throw new Error(`Missing ${signatureHeader} header`);
      }

      // Verify and parse (verifier is guaranteed to exist when skipVerification is false)
      const event = (verifier as WebhookVerifier).parseWebhook(payload, signature);

      if (!event) {
        throw new Error('Failed to parse webhook payload');
      }

      // Attach to request
      (req as WebhookRequest).webhookEvent = event;
      (req as WebhookRequest).webhookVerification = { isValid: true };

      next();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      // Attach failed verification info
      (req as WebhookRequest).webhookVerification = {
        isValid: false,
        error: err.message,
      };

      if (onError) {
        onError(err, req, res, next);
      } else {
        // Default error response
        res.status(401).json({
          error: 'Webhook verification failed',
          message: err.message,
        });
      }
    }
  };
}

/**
 * Type guard to check if request has a verified webhook event
 */
export function hasWebhookEvent(req: Request): req is WebhookRequest {
  return 'webhookEvent' in req && (req as WebhookRequest).webhookVerification?.isValid === true;
}
