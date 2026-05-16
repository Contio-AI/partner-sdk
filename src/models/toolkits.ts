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
  /** Whether new published versions are automatically propagated to connected workspaces. */
  auto_propagate: boolean;
  /** Whether the toolkit is automatically installed when a new workspace connects. */
  auto_install_on_new_workspaces: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Manifest ownership type determines provenance (who authored the toolkit).
 * This is distinct from governance, which is determined by the installation channel.
 *
 * - `SYSTEM`: Contio platform toolkit, authored and distributed by Contio
 * - `PARTNER`: Formal Contio partner under TOS agreement
 * - `PUBLIC`: Independent/community distribution, no formal Contio relationship (default)
 */
export type ManifestOwnershipType = 'SYSTEM' | 'PARTNER' | 'PUBLIC';

export interface ToolkitManifest {
  // --- Manifest header (metadata) ---

  /** Human-readable toolkit name. Required in standalone manifest files. */
  name?: string;
  /** Semantic version of the toolkit content (e.g. "1.0.0"). */
  version?: string;
  /** Manifest schema version this file conforms to (e.g. "1"). */
  schema_version?: string;
  /** Ownership type that determines import behaviour. Defaults to PUBLIC. */
  ownership_type?: ManifestOwnershipType;

  // --- Licensing ---

  /** SPDX license identifier or expression declaring usage terms. */
  license?: string;
  /** Optional URL to the full license text. Recommended for custom licenses. */
  license_url?: string;

  // --- AI Configuration ---

  /** System prompt for the toolkit-aware AI assistant. */
  toolkit_prompt?: string;
  /** Usage guidance shown to users explaining when/how to use the toolkit. */
  usage_guidance?: string;

  // --- Entity arrays ---

  templates?: ManifestTemplate[];
  next_steps?: ManifestNextStep[];
  action_buttons?: ManifestActionButton[];
  shortcuts?: ManifestShortcut[];
  workflows?: ManifestWorkflow[];
  canvas_templates?: ManifestCanvasTemplate[];
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
// Shortcut Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ManifestShortcut {
  /** Reference an existing shortcut by its database ID. */
  id?: string;
  /** Define a new shortcut to create during toolkit installation. */
  spec?: ManifestShortcutSpec;
}

/** UI surfaces where a shortcut can appear. */
export type ShortcutSurface =
  | 'HOME'
  | 'MEETING_PREPARE'
  | 'MEETING_RUN'
  | 'MEETING_REVIEW'
  | 'CANVAS';

export interface ShortcutSurfaceInput {
  /** The UI surface name. */
  surface: ShortcutSurface;
  /** Display position on this surface (1-10). */
  position?: number;
}

export interface ManifestShortcutSpec {
  /** Manifest-internal identifier for this shortcut. */
  $id?: string;
  /** Human-readable URL-safe identifier for this shortcut. */
  slug?: string;
  /** The display name of the shortcut. */
  name: string;
  /** Optional description of what this shortcut does. */
  description?: string;
  /** The AI prompt to execute when the shortcut is triggered. */
  prompt: string;
  /** Icon name from the icon set. */
  icon?: string;
  /** UI surfaces where this shortcut should appear. */
  surfaces?: ShortcutSurfaceInput[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ManifestWorkflow {
  /** Reference an existing workflow template by its database ID. */
  id?: string;
  /** Define a new workflow template to create during toolkit installation. */
  spec?: ManifestWorkflowSpec;
}

export interface ManifestWorkflowSpec {
  /** Manifest-internal identifier for this workflow. */
  $id?: string;
  /** Human-readable URL-safe identifier for this workflow. */
  slug?: string;
  /** The display name of the workflow template. */
  name: string;
  /** Optional description of what this workflow does. */
  description?: string;
  /** Raw JSON workflow spec conforming to the workflow DAG schema. */
  spec: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Template Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ManifestCanvasTemplate {
  /** Reference an existing canvas template by its database ID. */
  id?: string;
  /** Define a new canvas template to create during toolkit installation. */
  spec?: ManifestCanvasTemplateSpec;
}

export interface ManifestCanvasTemplateSpec {
  /** Manifest-internal identifier for this canvas template. */
  $id?: string;
  /** Human-readable URL-safe identifier for this canvas template. */
  slug?: string;
  /** The display name of the canvas template. */
  name: string;
  /** Optional description of what this canvas template provides. */
  description?: string;
  /** TipTap-compatible JSON document structure. */
  content?: Record<string, unknown>;
  /** Canvas type: MANUAL (user-created) or AI (agent-generated). */
  canvas_type?: 'MANUAL' | 'AI';
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
  /** If true, validates the manifest without creating the toolkit. */
  dry_run?: boolean;
}

export interface UpdateToolkitRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  /** Whether new published versions are automatically propagated to connected workspaces. */
  auto_propagate?: boolean;
  /** Whether the toolkit is automatically installed when a new workspace connects. */
  auto_install_on_new_workspaces?: boolean;
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
  /** If true, validates the manifest without creating the version. */
  dry_run?: boolean;
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

// ─────────────────────────────────────────────────────────────────────────────
// Export Types (Admin API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Request body for the assembly-mode export endpoint (`POST /toolkits/export`).
 * At least one entity ID array must be non-empty.
 */
export interface ExportEntitiesRequest {
  /** Template IDs to include (auto-discovers linked next steps and action buttons). */
  template_ids?: string[];
  /** Next step IDs to include (auto-discovers linked action buttons). */
  next_step_ids?: string[];
  /** Standalone action button IDs to include. */
  action_button_ids?: string[];
  /** Shortcut IDs to include. */
  shortcut_ids?: string[];
  /** Workflow template IDs to include. */
  workflow_ids?: string[];
  /** Canvas template IDs to include. */
  canvas_template_ids?: string[];
  /** Optional name for the exported manifest metadata. */
  name?: string;
  /** Optional description for the exported manifest metadata. */
  description?: string;
}

/** Metadata envelope in an export response. */
export interface ExportMetadata {
  name: string;
  slug?: string;
  description?: string;
  version?: string;
  /** SPDX license identifier from the toolkit. */
  license?: string;
  /** URL to full license text. */
  license_url?: string;
}

/** Entity count summary in an export response. */
export interface ExportSummary {
  templates: number;
  next_steps: number;
  action_buttons: number;
  shortcuts: number;
  workflows: number;
  canvas_templates: number;
}

/** A warning produced during export (e.g. missing references). */
export interface ExportWarning {
  entity_type: string;
  entity_name: string;
  code: string;
  message: string;
}

/** Response from both assembly-mode and toolkit-mode export endpoints. */
export interface ExportResponse {
  metadata?: ExportMetadata;
  manifest: ToolkitManifest;
  summary: ExportSummary;
  warnings?: ExportWarning[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Toolkit Distribution Types (Admin API — v1.7.0)
// ─────────────────────────────────────────────────────────────────────────────

/** Propagation mode when publishing a toolkit version. */
export type PropagationMode = 'none' | 'normal' | 'force';

/** Request body for publishing a toolkit version with optional propagation. */
export interface PublishToolkitVersionRequest {
  /** How to propagate this version to connected workspaces.
   *  - `none` — Skip propagation (default).
   *  - `normal` — Propagate to active installations, respecting opt-outs.
   *  - `force` — Propagate to all installations, ignoring opt-outs.
   */
  propagation?: PropagationMode;
}

/** Status of a toolkit installation in a workspace. */
export type ToolkitInstallationStatus = 'active' | 'opted_out';

/** A single workspace's installation of a toolkit. */
export interface ToolkitInstallationItem {
  workspace_id: string;
  workspace_name: string;
  status: ToolkitInstallationStatus;
  version_label?: string;
  installed_at?: string;
  uninstalled_at?: string;
}

/** Aggregate installation counts across all partner workspaces. */
export interface ToolkitInstallationSummary {
  active: number;
  opted_out: number;
  never_installed: number;
}

/** Response from GET /toolkits/{id}/installations. */
export interface ToolkitInstallationListResponse {
  items: ToolkitInstallationItem[];
  summary: ToolkitInstallationSummary;
  total_connected_workspaces: number;
  limit: number;
  offset: number;
}

/** A workspace connected to the partner. */
export interface PartnerWorkspace {
  workspace_id: string;
  workspace_name: string;
  provisioned_at: string;
  user_count: number;
}

/** Response from GET /workspaces. */
export interface PartnerWorkspaceListResponse {
  items: PartnerWorkspace[];
  total: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dry-Run / Validation Response Types (v1.7.0)
// ─────────────────────────────────────────────────────────────────────────────

/** A single validation error or warning from manifest analysis. */
export interface ManifestValidationError {
  path: string;
  code: string;
  message: string;
}

/** Result of manifest structural validation and portability analysis. */
export interface ValidationResult {
  valid: boolean;
  errors?: ManifestValidationError[];
  warnings?: ManifestValidationError[];
}

/** Describes a name collision between a manifest entity and an existing entity. */
export interface ConflictInfo {
  entity_type: string;
  entity_name: string;
  conflict_type: string;
  existing_entity_id: string;
  resolution: string;
  message: string;
}

/** Counts of each entity type in a manifest. */
export interface ManifestSummary {
  templates: number;
  next_steps: number;
  action_buttons: number;
  shortcuts: number;
}

/** Enriched response envelope for toolkit creation (includes dry-run metadata). */
export interface CreateToolkitResponse {
  toolkit?: Toolkit;
  validation?: ValidationResult;
  conflicts?: ConflictInfo[];
  summary?: ManifestSummary;
}

/** Enriched response envelope for version creation (includes dry-run metadata). */
export interface CreateToolkitVersionResponse {
  version?: ToolkitVersion;
  validation?: ValidationResult;
  conflicts?: ConflictInfo[];
  summary?: ManifestSummary;
}

