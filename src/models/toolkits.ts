/**
 * Toolkit-related type definitions for the Contio Partner API
 *
 * Toolkits are collections of related entities (templates, next steps, action buttons)
 * that can be installed and uninstalled as a unit.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Core Toolkit Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Toolkit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  version: string;
  is_active: boolean;
  ownership_type: string;
  partner_app_id: string;
  manifest: ToolkitManifest;
  created_at: string;
  updated_at: string;
}

export interface ToolkitManifest {
  templates?: ManifestTemplate[];
  next_steps?: ManifestNextStep[];
  action_buttons?: ManifestActionButton[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Manifest Component Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ManifestTemplate {
  id?: string;
  spec?: ManifestTemplateSpec;
  next_steps?: TemplateNextStepRelation[];
}

export interface ManifestTemplateSpec {
  $id?: string;
  name: string;
  description?: string;
  backing_meeting_id?: string;
}

export interface TemplateNextStepRelation {
  next_step: ManifestRef;
  autopilot?: boolean;
  default_action_button?: ManifestRef;
}

export interface ManifestNextStep {
  id?: string;
  spec?: ManifestNextStepSpec;
  action_buttons?: NextStepActionButtonRelation[];
  default_action_button?: ManifestRef;
}

export interface ManifestNextStepSpec {
  $id?: string;
  name: string;
  description?: string;
  ai_prompt?: string;
  color?: string;
  icon_name?: string;
  type?: NextStepType;
}

export interface NextStepActionButtonRelation {
  action_button: ManifestRef;
}

export interface ManifestActionButton {
  id?: string;
  spec?: ManifestActionButtonSpec;
}

export interface ManifestActionButtonSpec {
  $id?: string;
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

export interface ManifestRef {
  $ref?: string;
  $id?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

export type ContentFormat = 'rich_text' | 'markdown' | 'plain_text' | 'html';

export type DeliveryMechanism =
  | 'clipboard'
  | 'email'
  | 'os_email_client'
  | 'file_download'
  | 'integration'
  | 'webhook'
  | 'redirect';

export type NextStepType = 'AI' | 'STANDARD';

// ─────────────────────────────────────────────────────────────────────────────
// Request/Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateToolkitRequest {
  name: string;
  slug: string;
  description?: string;
  version: string;
  manifest: ToolkitManifest;
}

export interface UpdateToolkitRequest {
  name?: string;
  description?: string;
  version?: string;
  is_active?: boolean;
  manifest?: ToolkitManifest;
}

export interface ToolkitListParams {
  limit?: number;
  offset?: number;
}

export interface ToolkitListResponse {
  items: Toolkit[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Installation Types (User API)
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolkitInstallation {
  id: string;
  toolkit_id: string;
  workspace_id: string;
  installed_at: string;
  installed_by_user_id: string;
}

export interface ToolkitWithInstallation {
  toolkit: Toolkit;
  installation?: ToolkitInstallation;
}

export interface ToolkitWithInstallationListResponse {
  items: ToolkitWithInstallation[];
  total: number;
  limit: number;
  offset: number;
}

