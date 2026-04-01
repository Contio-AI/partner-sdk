/**
 * User Templates domain delegate.
 *
 * User-facing template operations (read-only for user context).
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';

// ─────────────────────────────────────────────────────────────────────────────
// User Meeting Template Types (different from admin templates)
// ─────────────────────────────────────────────────────────────────────────────

export interface UserMeetingTemplate {
  id: string;
  name: string;
  description?: string;
  backing_meeting_id?: string;
  next_steps?: UserTemplateNextStep[];
  created_at: string;
  updated_at: string;
}

export interface UserTemplateNextStep {
  id: string;
  name: string;
  description?: string;
  type?: string;
  autopilot: boolean;
  action_buttons?: UserTemplateActionButton[];
}

export interface UserTemplateActionButton {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
}

export interface UserMeetingTemplateListParams {
  limit?: number;
  offset?: number;
}

export interface UserMeetingTemplateListResponse {
  items: UserMeetingTemplate[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get meeting templates available to the user.
 *
 * Returns templates that the user can use to create meetings,
 * including next steps and action buttons.
 */
export async function getMeetingTemplates(
  http: HttpTransport,
  params?: UserMeetingTemplateListParams,
  options?: RequestOptions,
): Promise<UserMeetingTemplateListResponse> {
  return http.get<UserMeetingTemplateListResponse>('/meeting-templates', params, options);
}

/**
 * Get a specific meeting template.
 */
export async function getMeetingTemplate(
  http: HttpTransport,
  templateId: string,
  options?: RequestOptions,
): Promise<UserMeetingTemplate> {
  return http.get<UserMeetingTemplate>(`/meeting-templates/${templateId}`, undefined, options);
}

