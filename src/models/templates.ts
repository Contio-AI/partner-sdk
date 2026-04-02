/**
 * Template-related type definitions for the Contio Partner API
 *
 * Templates define reusable meeting structures with associated next steps.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Core Template Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description?: string;
  backing_meeting_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateNextStep {
  id: string;
  name: string;
  description?: string;
  type?: string;
  ai_prompt?: string;
  color?: string;
  icon_name?: string;
  autopilot: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Request Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  backing_meeting_id?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
}

export interface AddTemplateNextStepRequest {
  next_step_id: string;
  autopilot?: boolean;
}

export interface UpdateTemplateNextStepRequest {
  autopilot?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// List Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateListParams {
  limit?: number;
  offset?: number;
}

export interface TemplateListResponse {
  items: Template[];
  total: number;
  limit: number;
  offset: number;
}

export interface TemplateNextStepListParams {
  limit?: number;
  offset?: number;
}

export interface TemplateNextStepListResponse {
  items: TemplateNextStep[];
  total: number;
  limit: number;
  offset: number;
}

