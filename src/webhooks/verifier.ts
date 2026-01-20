/**
 * Webhook signature verification utilities for Contio Partner API
 */

import * as crypto from 'crypto';
import { WebhookVerificationResult, ContioWebhookEvent } from './types';

export class WebhookVerifier {
  private readonly secret: string;

  constructor(secret: string) {
    if (!secret) {
      throw new Error('Webhook secret is required');
    }
    this.secret = secret;
  }

  /**
   * Verify webhook signature using HMAC-SHA256
   * @param payload Raw request body (string or Buffer)
   * @param signature Signature from X-Contio-Signature header
   * @returns Verification result
   */
  verifySignature(payload: string | Buffer, signature: string): WebhookVerificationResult {
    try {
      if (!signature) {
        return { isValid: false, error: 'Missing signature' };
      }

      // Parse signature header (format: "sha256=<hex_signature>")
      const signatureParts = signature.split('=');
      if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
        return { isValid: false, error: 'Invalid signature format (expected "sha256=<hex>")' };
      }
      const cleanSignature = signatureParts[1];

      // Generate expected signature
      const hmac = crypto.createHmac('sha256', this.secret);
      if (typeof payload === 'string') {
        hmac.update(payload, 'utf8');
      } else {
        hmac.update(payload);
      }
      const expectedSignature = hmac.digest('hex');

      // Convert to buffers for timing-safe comparison
      const signatureBuffer = Buffer.from(cleanSignature, 'hex');
      const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');

      // Check buffer lengths match before comparison to prevent timing attacks
      if (signatureBuffer.length !== expectedSignatureBuffer.length) {
        return { isValid: false, error: 'Signature length mismatch' };
      }

      // Timing-safe comparison
      const isValid = crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer);

      if (!isValid) {
        return { isValid: false, error: 'Signature mismatch' };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Signature verification failed'
      };
    }
  }

  /**
   * Parse and verify webhook payload
   * @param payload Raw request body
   * @param signature Signature from X-Contio-Signature header
   * @returns Parsed webhook event or null if invalid
   */
  parseWebhook(payload: string | Buffer, signature: string): ContioWebhookEvent | null {
    // Verify signature first
    const verification = this.verifySignature(payload, signature);
    if (!verification.isValid) {
      throw new Error(`Webhook verification failed: ${verification.error}`);
    }

    try {
      // Parse JSON payload
      const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
      const event = JSON.parse(payloadString) as ContioWebhookEvent;

      // Basic validation
      if (!event.event_type || !event.event_id || !event.timestamp || !event.partner_app_id) {
        throw new Error('Invalid webhook payload: missing required fields');
      }

      return event;
    } catch (error) {
      throw new Error(`Failed to parse webhook payload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Convenience function for signature verification
 * @param payload Raw request body
 * @param signature Signature from X-Contio-Signature header
 * @param secret Webhook secret
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  const verifier = new WebhookVerifier(secret);
  return verifier.verifySignature(payload, signature).isValid;
}

/**
 * Parse webhook with signature verification
 * @param payload Raw request body
 * @param signature Signature from X-Contio-Signature header
 * @param secret Webhook secret
 * @returns Parsed webhook event
 * @throws Error if verification fails or payload is invalid
 */
export function parseWebhook(
  payload: string | Buffer,
  signature: string,
  secret: string
): ContioWebhookEvent {
  const verifier = new WebhookVerifier(secret);
  const event = verifier.parseWebhook(payload, signature);
  if (!event) {
    throw new Error('Failed to parse webhook');
  }
  return event;
}
