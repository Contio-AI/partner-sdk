/**
 * Action Button-related type definitions for the Contio Partner API
 *
 * Action Buttons define delivery mechanisms for next step outputs,
 * supporting various formats like webhooks, redirects, clipboard, email, etc.
 */

import { ContentFormat, DeliveryMechanism } from './toolkits';

// ─────────────────────────────────────────────────────────────────────────────
// Core Action Button Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionButton {
  id: string;
  name: string;
  description?: string;
  content_format: ContentFormat;
  delivery_mechanism: DeliveryMechanism;
  icon_url?: string;
  webhook_url?: string;
  redirect_url_template?: string;
  email_subject_template?: string;
  file_format?: string;
  integration_id?: string;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Request Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateActionButtonRequest {
  name: string;
  description?: string;
  content_format: ContentFormat;
  delivery_mechanism: DeliveryMechanism;
  icon_url?: string;
  webhook_url?: string;
  redirect_url_template?: string;
  email_subject_template?: string;
  file_format?: string;
  integration_id?: string;
}

export interface UpdateActionButtonRequest {
  name?: string;
  description?: string;
  content_format?: ContentFormat;
  delivery_mechanism?: DeliveryMechanism;
  icon_url?: string;
  webhook_url?: string;
  redirect_url_template?: string;
  email_subject_template?: string;
  file_format?: string;
  integration_id?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// List Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionButtonListParams {
  limit?: number;
  offset?: number;
}

export interface ActionButtonListResponse {
  items: ActionButton[];
  total: number;
  limit: number;
  offset: number;
}

