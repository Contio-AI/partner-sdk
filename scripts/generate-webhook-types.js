#!/usr/bin/env node
/**
 * Generate TypeScript types from AsyncAPI webhook spec
 *
 * Uses @asyncapi/modelina to generate TypeScript interfaces
 * from the AsyncAPI specification for webhook events.
 *
 * Usage: node scripts/generate-webhook-types.js
 */

const { TypeScriptGenerator } = require('@asyncapi/modelina');
const { Parser } = require('@asyncapi/parser');
const fs = require('fs');
const path = require('path');

const SPEC_PATH = path.join(__dirname, '..', 'specs', 'asyncapi', 'webhooks.yaml');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'generated', 'webhook-types.ts');

async function generate() {
  console.log('Reading AsyncAPI spec from:', SPEC_PATH);

  const parser = new Parser();
  const specContent = fs.readFileSync(SPEC_PATH, 'utf8');
  const { document, diagnostics } = await parser.parse(specContent);

  if (!document) {
    console.error('Failed to parse AsyncAPI document:');
    diagnostics.forEach((d) => console.error(`  ${d.message}`));
    process.exit(1);
  }

  console.log('Spec version:', document.info().version());

  const generator = new TypeScriptGenerator({
    modelType: 'interface',
    enumType: 'union',
    mapType: 'record',
    rawPropertyNames: true,
  });

  const models = await generator.generate(document);

  let output = `/**
 * Webhook event types generated from AsyncAPI spec
 *
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT
 *
 * Source: specs/asyncapi/webhooks.yaml
 * Spec version: ${document.info().version()}
 * Generated: ${new Date().toISOString()}
 *
 * Regenerate: npm run gen-webhook-types
 */

`;

  for (const model of models) {
    // Add export keyword to interfaces and type aliases
    let code = model.result;
    if (code.startsWith('interface ') || code.startsWith('type ')) {
      code = 'export ' + code;
    }
    // Replace any with unknown for stricter typing
    code = code.replace(/Record<string, any>/g, 'Record<string, unknown>');
    output += code + '\n\n';
  }

  const channels = document.channels();
  const channelNames = channels.all().map((c) => c.address());

  output += `/**
 * All webhook event type names
 */
export const WEBHOOK_EVENT_TYPES = [
${channelNames.map((name) => `  '${name}',`).join('\n')}
] as const;

export type WebhookEventType = typeof WEBHOOK_EVENT_TYPES[number];
`;

  fs.writeFileSync(OUTPUT_PATH, output);
  console.log('Generated', models.length, 'types to:', OUTPUT_PATH);
}

generate().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

