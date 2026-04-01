/**
 * Next Step-related type definitions for the Contio Partner API
 *
 * Next Steps define actions that can be taken after a meeting,
 * with optional AI prompts and associated action buttons.
 */

import { ContentFormat, DeliveryMechanism, NextStepType } from './toolkits';

// ─────────────────────────────────────────────────────────────────────────────
// Core Next Step Types
// ─────────────────────────────────────────────────────────────────────────────

export interface NextStep {
  id: string;
  name: string;
  description?: string;
  type?: NextStepType;
  ai_prompt?: string;
  color?: string;
  icon_name?: string;
  created_at: string;
  updated_at: string;
}

export interface NextStepActionButton {
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
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Request Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateNextStepRequest {
  name: string;
  description?: string;
  type?: NextStepType;
  ai_prompt?: string;
  color?: string;
  icon_name?: string;
}

export interface UpdateNextStepRequest {
  name?: string;
  description?: string;
  type?: NextStepType;
  ai_prompt?: string;
  color?: string;
  icon_name?: string;
}

export interface AddNextStepActionButtonRequest {
  action_button_id: string;
  is_default?: boolean;
}

export interface UpdateNextStepActionButtonRequest {
  is_default?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// List Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface NextStepListParams {
  limit?: number;
  offset?: number;
}

export interface NextStepListResponse {
  items: NextStep[];
  total: number;
  limit: number;
  offset: number;
}

export interface NextStepActionButtonListParams {
  limit?: number;
  offset?: number;
}

export interface NextStepActionButtonListResponse {
  items: NextStepActionButton[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// User-facing Next Step Types (for meeting context)
// ─────────────────────────────────────────────────────────────────────────────

/** Next step associated with a meeting */
export interface MeetingNextStep {
  id: string;
  name: string;
  description?: string;
  type?: NextStepType;
  autopilot: boolean;
  action_buttons?: MeetingActionButton[];
}

/** Action button associated with a meeting next step */
export interface MeetingActionButton {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
}

export interface MeetingNextStepListParams {
  limit?: number;
  offset?: number;
}

export interface MeetingNextStepListResponse {
  items: MeetingNextStep[];
  total: number;
  limit: number;
  offset: number;
}

export interface MeetingActionButtonListParams {
  limit?: number;
  offset?: number;
}

export interface MeetingActionButtonListResponse {
  items: MeetingActionButton[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Execution & Trigger Types
// ─────────────────────────────────────────────────────────────────────────────

/** Request to execute a next step in a meeting */
export interface ExecuteNextStepRequest {
  /** Optional parameters for the next step execution */
  parameters?: Record<string, unknown>;
}

/** Response from executing a next step */
export interface ExecuteNextStepResponse {
  result_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

/** Request to trigger an action button */
export interface TriggerActionButtonRequest {
  /** Optional parameters for the action button */
  parameters?: Record<string, unknown>;
}

/** Response from triggering an action button */
export interface TriggerActionButtonResponse {
  result_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  /** Redirect URL if applicable */
  redirect_url?: string;
}

/** Next step execution result */
export interface NextStepResult {
  id: string;
  next_step_id: string;
  meeting_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  content?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}
