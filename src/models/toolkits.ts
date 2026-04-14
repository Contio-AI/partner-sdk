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
  is_active?: boolean;
  /**
   * @deprecated Use the toolkit versioning API instead.
   * Create a new draft version (POST /v1/partner/admin/toolkits/{id}/versions),
   * update the draft (PATCH /v1/partner/admin/toolkits/{id}/versions/{versionId}),
   * then publish it (POST /v1/partner/admin/toolkits/{id}/versions/{versionId}/publish).
   * Passing this field to UpdateToolkit will return a 409 Conflict error.
   */
  version?: string;
  /**
   * @deprecated Use the toolkit versioning API instead.
   * Create a new draft version (POST /v1/partner/admin/toolkits/{id}/versions),
   * update the draft (PATCH /v1/partner/admin/toolkits/{id}/versions/{versionId}),
   * then publish it (POST /v1/partner/admin/toolkits/{id}/versions/{versionId}/publish).
   * Passing this field to UpdateToolkit will return a 409 Conflict error.
   */
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
// Toolkit Versioning Types (Admin API)
// ─────────────────────────────────────────────────────────────────────────────

/** Status values for a toolkit version following the versioning lifecycle. */
export type ToolkitVersionStatus = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';

/**
 * Represents a single version of a toolkit.
 *
 * The versioning lifecycle is: DRAFT → PUBLISHED → DEPRECATED.
 * Use the versioning API to create, update, publish, or discard versions.
 */
export interface ToolkitVersion {
  id: string;
  toolkit_id: string;
  version_number: number;
  version_label: string;
  status: ToolkitVersionStatus;
  manifest: ToolkitManifest;
  changelog?: string;
  created_by?: string;
  published_at?: string;
  deprecated_at?: string;
  created_at: string;
  updated_at: string;
}

/** Request body for creating a new draft toolkit version. */
export interface CreateToolkitVersionRequest {
  /** Human-readable label for this version (e.g. "2.0.0"). */
  version_label: string;
  /** The toolkit manifest for this version. */
  manifest: ToolkitManifest;
  /** Optional changelog describing what changed in this version. */
  changelog?: string;
}

/** Request body for updating a draft toolkit version. All fields are optional. */
export interface UpdateToolkitVersionRequest {
  /** Updated human-readable label for this version. */
  version_label?: string;
  /** Updated toolkit manifest for this version. */
  manifest?: ToolkitManifest;
  /** Updated changelog for this version. */
  changelog?: string;
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

