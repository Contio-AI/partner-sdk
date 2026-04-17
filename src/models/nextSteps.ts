/**
 * Next Step-related type definitions for the Contio Partner API
 *
 * User-facing types for meeting next steps, action buttons, execution, and results.
 * Admin CRUD for next steps and action buttons has been removed — these entities
 * are now managed exclusively through the Toolkit manifest lifecycle.
 */

import { NextStepType } from './toolkits';

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
