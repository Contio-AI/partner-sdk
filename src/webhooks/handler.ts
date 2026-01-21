/**
 * Typed webhook event handler with fluent API
 *
 * Provides type-safe event handlers for Contio webhook events.
 *
 * @example
 * ```typescript
 * import { WebhookHandler } from '@contio/partner-sdk/webhooks';
 *
 * const handler = new WebhookHandler(process.env.WEBHOOK_SECRET!)
 *   .on('meeting.created', async (event) => {
 *     // event is fully typed as MeetingCreatedWebhook
 *     console.log('New meeting:', event.data.meeting_id);
 *   })
 *   .on('action_item.completed', async (event) => {
 *     // event is fully typed as ActionItemCompletedWebhook
 *     await syncCompletedTask(event.data.action_item_id);
 *   });
 *
 * // In Express
 * app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
 *   await handler.handle(req.body, req.headers['x-contio-signature'] as string);
 *   res.status(200).json({ received: true });
 * });
 * ```
 */

import { WebhookVerifier } from './verifier';
import {
  ContioWebhookEvent,
  WorkflowAssignmentCreatedPayload,
  ActionItemUpdatedPayload,
  UserConnectionRevokedPayload,
  MeetingCompletedPayload,
  MeetingCreatedPayload,
  ActionItemCreatedPayload,
  ActionItemCompletedPayload,
  ParticipantAddedPayload,
  ParticipantRemovedPayload,
  WebhookEventType,
} from './types';

/**
 * Map of event types to their corresponding webhook payload types
 */
export interface WebhookEventMap {
  'workflow.assignment.created': WorkflowAssignmentCreatedPayload;
  'action_item.updated': ActionItemUpdatedPayload;
  'user.connection.revoked': UserConnectionRevokedPayload;
  'meeting.completed': MeetingCompletedPayload;
  'meeting.created': MeetingCreatedPayload;
  'action_item.created': ActionItemCreatedPayload;
  'action_item.completed': ActionItemCompletedPayload;
  'participant.added': ParticipantAddedPayload;
  'participant.removed': ParticipantRemovedPayload;
}

/**
 * Handler function type for a specific event
 */
export type TypedEventHandler<T extends keyof WebhookEventMap> = (
  event: WebhookEventMap[T]
) => Promise<void> | void;

/**
 * Typed webhook handler with fluent registration API.
 *
 * Provides type-safe `.on()` method for registering event handlers,
 * with full TypeScript inference for event payloads.
 */
export class WebhookEventHandler {
  private readonly verifier: WebhookVerifier;
  private readonly handlers = new Map<string, ((event: ContioWebhookEvent) => Promise<void> | void)[]>();
  private catchAllHandler?: (event: ContioWebhookEvent) => Promise<void> | void;

  /**
   * Create a new webhook event handler.
   *
   * @param secret - Your webhook secret from the Contio dashboard
   */
  constructor(secret: string) {
    this.verifier = new WebhookVerifier(secret);
  }

  /**
   * Register a handler for a specific event type.
   *
   * The handler receives a fully typed event object based on the event type.
   *
   * @param eventType - The event type to handle (e.g., 'meeting.created')
   * @param handler - Async or sync handler function
   * @returns this for chaining
   *
   * @example
   * ```typescript
   * handler.on('meeting.created', async (event) => {
   *   // TypeScript knows event.data has meeting_id, workspace_id, title, etc.
   *   console.log('Meeting created:', event.data.title);
   * });
   * ```
   */
  on<T extends keyof WebhookEventMap>(
    eventType: T,
    handler: TypedEventHandler<T>
  ): this {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler as (event: ContioWebhookEvent) => Promise<void> | void);
    this.handlers.set(eventType, handlers);
    return this;
  }

  /**
   * Register a catch-all handler for any event type.
   *
   * This is called for every event, regardless of whether a specific handler exists.
   * Useful for logging or metrics.
   *
   * @param handler - Handler function receiving any webhook event
   * @returns this for chaining
   */
  onAny(handler: (event: ContioWebhookEvent) => Promise<void> | void): this {
    this.catchAllHandler = handler;
    return this;
  }

  /**
   * Verify and handle a webhook payload.
   *
   * Verifies the signature, parses the payload, and dispatches to registered handlers.
   *
   * @param payload - Raw request body (string or Buffer)
   * @param signature - Signature from X-Contio-Signature header
   * @throws {Error} If signature verification fails or payload is invalid
   */
  async handle(payload: string | Buffer, signature: string): Promise<void> {
    const event = this.verifier.parseWebhook(payload, signature);
    if (!event) {
      throw new Error('Failed to parse webhook payload');
    }

    // Call catch-all handler first
    if (this.catchAllHandler) {
      await Promise.resolve(this.catchAllHandler(event));
    }

    // Call specific handlers
    const handlers = this.handlers.get(event.event_type);
    if (handlers) {
      for (const handler of handlers) {
        await Promise.resolve(handler(event));
      }
    }
  }

  /**
   * Check if a handler is registered for a specific event type.
   */
  hasHandler(eventType: WebhookEventType): boolean {
    return this.handlers.has(eventType) && (this.handlers.get(eventType)?.length ?? 0) > 0;
  }
}
