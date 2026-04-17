#!/usr/bin/env node
/**
 * Sync webhook type exports with generated types
 *
 * This script reads the generated webhook-types.ts file and updates
 * the public types.ts file to export all Payload and Data interfaces,
 * and updates the ContioWebhookEvent union type.
 *
 * Usage: node scripts/sync-webhook-exports.js
 */

const fs = require('fs');
const path = require('path');

const GENERATED_PATH = path.join(__dirname, '..', 'src', 'generated', 'webhook-types.ts');
const TYPES_PATH = path.join(__dirname, '..', 'src', 'webhooks', 'types.ts');

function extractInterfaces(content) {
  const payloadTypes = [];
  const dataTypes = [];
  const sharedTypes = ['WebhookUserContext', 'ParticipantInfo'];

  // Extract all exported interfaces
  const interfaceRegex = /export interface (\w+)/g;
  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    const name = match[1];
    if (name.endsWith('Payload')) {
      payloadTypes.push(name);
    } else if (name.endsWith('Data') && !name.startsWith('Anonymous')) {
      dataTypes.push(name);
    }
  }

  return {
    payloadTypes: payloadTypes.sort(),
    dataTypes: dataTypes.sort(),
    sharedTypes,
  };
}

function extractEventTypes(content) {
  // Extract event types from WEBHOOK_EVENT_TYPES constant
  const eventTypesMatch = content.match(/export const WEBHOOK_EVENT_TYPES = \[([\s\S]*?)\] as const/);
  if (!eventTypesMatch) return [];

  const eventTypesContent = eventTypesMatch[1];
  const events = [];
  const eventRegex = /'([^']+)'/g;
  let match;
  while ((match = eventRegex.exec(eventTypesContent)) !== null) {
    events.push(match[1]);
  }
  return events.sort();
}

function generateTypesFile(payloadTypes, dataTypes, sharedTypes, eventTypes) {
  // Generate WEBHOOK_EVENTS constant from event types
  const webhookEventsEntries = eventTypes
    .map((event) => {
      const constName = event.toUpperCase().replace(/\./g, '_');
      return `  ${constName}: '${event}',`;
    })
    .join('\n');

  return `/**
 * Webhook event types and payload interfaces for Contio Partner API
 *
 * Types are generated from the AsyncAPI specification.
 * See: specs/asyncapi/webhooks.yaml
 *
 * Webhooks provide timely signals when partner-relevant activities occur.
 * Payloads are intentionally minimal - use the Partner User API to fetch
 * full details when needed.
 */

// Re-export all generated types from AsyncAPI spec
export type {
  // Payload types (full webhook envelope)
${payloadTypes.map((t) => `  ${t},`).join('\n')}
  // Data types (event-specific data)
${dataTypes.map((t) => `  ${t},`).join('\n')}
  // Shared types
${sharedTypes.map((t) => `  ${t},`).join('\n')}
  // Event type union
  WebhookEventType,
} from '../generated/webhook-types';

// Re-export value constants
export { WEBHOOK_EVENT_TYPES } from '../generated/webhook-types';

import type {
${payloadTypes.map((t) => `  ${t},`).join('\n')}
} from '../generated/webhook-types';

/**
 * Union type for all webhook events
 */
export type ContioWebhookEvent =
${payloadTypes.map((t) => `  | ${t}`).join('\n')};

/**
 * Webhook event type constants (object form for backward compatibility)
 * @deprecated Use WEBHOOK_EVENT_TYPES array instead
 */
export const WEBHOOK_EVENTS = {
${webhookEventsEntries}
} as const;

/**
 * Webhook verification result
 */
export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Webhook handler function type
 */
export type WebhookHandler<T extends ContioWebhookEvent = ContioWebhookEvent> = (
  event: T
) => Promise<void> | void;

// =============================================================================
// Deprecated type aliases for backward compatibility
// These will be removed in the next major version
// =============================================================================

/**
 * @deprecated Use AutomationAssignmentCreatedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.assignment.X
 */
export type AutomationAssignmentCreatedWebhook = AutomationAssignmentCreatedPayload;

/**
 * @deprecated Use ActionItemUpdatedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.action_item.X
 */
export type ActionItemUpdatedWebhook = ActionItemUpdatedPayload;

/**
 * @deprecated Use UserConnectionRevokedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.connection.X
 */
export type UserConnectionRevokedWebhook = UserConnectionRevokedPayload;

/**
 * @deprecated Use MeetingCompletedPayload instead.
 * Note: Data structure has changed - fields are now at data.X instead of data.meeting.X
 */
export type MeetingCompletedWebhook = MeetingCompletedPayload;

/**
 * @deprecated Use MeetingCreatedPayload instead.
 */
export type MeetingCreatedWebhook = MeetingCreatedPayload;

/**
 * @deprecated Use ActionItemCreatedPayload instead.
 */
export type ActionItemCreatedWebhook = ActionItemCreatedPayload;

/**
 * @deprecated Use ActionItemCompletedPayload instead.
 */
export type ActionItemCompletedWebhook = ActionItemCompletedPayload;
`;
}

function main() {
  console.log('Reading generated webhook types...');
  const generatedContent = fs.readFileSync(GENERATED_PATH, 'utf8');

  const { payloadTypes, dataTypes, sharedTypes } = extractInterfaces(generatedContent);
  const eventTypes = extractEventTypes(generatedContent);

  console.log(`Found ${payloadTypes.length} payload types`);
  console.log(`Found ${dataTypes.length} data types`);
  console.log(`Found ${eventTypes.length} event types`);

  console.log('Generating updated types.ts...');
  const newContent = generateTypesFile(payloadTypes, dataTypes, sharedTypes, eventTypes);

  fs.writeFileSync(TYPES_PATH, newContent);
  console.log('✅ Updated src/webhooks/types.ts');
}

main();

