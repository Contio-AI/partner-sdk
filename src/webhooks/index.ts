/**
 * Webhook utilities for Contio Partner API
 *
 * This module provides utilities for handling webhook events from the Contio Partner API,
 * including signature verification, payload parsing, and TypeScript types.
 *
 * @example
 * ```typescript
 * import { verifyWebhookSignature, parseWebhook, WEBHOOK_EVENTS } from '@contio/partner-sdk/webhooks';
 *
 * // Express.js webhook handler
 * app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
 *   const signature = req.headers['x-contio-signature'] as string;
 *   const payload = req.body;
 *
 *   try {
 *     const event = parseWebhook(payload, signature, process.env.WEBHOOK_SECRET!);
 *
 *     switch (event.event_type) {
 *       case WEBHOOK_EVENTS.WORKFLOW_ASSIGNMENT_CREATED:
 *         await handleWorkflowAssignment(event);
 *         break;
 *       case WEBHOOK_EVENTS.ACTION_ITEM_UPDATED:
 *         await handleActionItemUpdate(event);
 *         break;
 *     }
 *
 *     res.status(200).json({ received: true });
 *   } catch (error) {
 *     console.error('Webhook processing failed:', error);
 *     res.status(401).json({ error: 'Invalid webhook' });
 *   }
 * });
 * ```
 */

// Export all types
export * from './types';

// Export verification utilities
export { WebhookVerifier, verifyWebhookSignature, parseWebhook } from './verifier';

// Export typed event handler
export { WebhookEventHandler, type WebhookEventMap, type TypedEventHandler } from './handler';

// Export Express middleware
export {
  createWebhookMiddleware,
  hasWebhookEvent,
  type WebhookRequest,
  type WebhookMiddlewareOptions,
} from './express';

// Re-export commonly used constants
export { WEBHOOK_EVENTS } from './types';
