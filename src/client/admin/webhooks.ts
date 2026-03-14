/**
 * Webhook deliveries and webhook management domain delegate.
 *
 * Combines webhook delivery endpoints (list, get, retry) with webhook
 * management endpoints (status, filter) since they are closely related.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  PartnerApp,
  WebhookDelivery,
  WebhookDeliveryListParams,
  WebhookDeliveryListResponse,
  UpdateWebhookStatusRequest,
  SetWebhookFilterRequest,
} from '../../models';

// ── Webhook Deliveries ──────────────────────────────────────────────────────

export async function getWebhookDeliveries(
  http: HttpTransport,
  params?: WebhookDeliveryListParams,
): Promise<WebhookDeliveryListResponse> {
  return http.get<WebhookDeliveryListResponse>('/webhook-deliveries', params);
}

export async function getWebhookDelivery(
  http: HttpTransport,
  deliveryId: string,
): Promise<WebhookDelivery> {
  return http.get<WebhookDelivery>(`/webhook-deliveries/${deliveryId}`);
}

export async function retryWebhookDelivery(
  http: HttpTransport,
  deliveryId: string,
): Promise<{ message: string; retry_scheduled: boolean }> {
  return http.post(`/webhook-deliveries/${deliveryId}/retry`);
}

// ── Webhook Management ──────────────────────────────────────────────────────

export async function updateWebhookStatus(
  http: HttpTransport,
  data: UpdateWebhookStatusRequest,
): Promise<PartnerApp> {
  return http.put<PartnerApp>('/app/webhook-status', data);
}

export async function setWebhookFilter(
  http: HttpTransport,
  data: SetWebhookFilterRequest,
): Promise<PartnerApp> {
  return http.put<PartnerApp>('/app/webhook-filter', data);
}

export async function removeWebhookFilter(
  http: HttpTransport,
): Promise<PartnerApp> {
  return http.delete<PartnerApp>('/app/webhook-filter');
}

