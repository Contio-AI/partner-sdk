/**
 * Workflow and workflow run type definitions for the Contio Partner API
 *
 * Workflow templates are reusable DAGs that can be triggered against meetings,
 * canvases, and other objects. Workflow runs track the execution of a template.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Template Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkflowTemplateSummary {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  /** Raw JSON workflow spec conforming to the workflow DAG schema. */
  spec: Record<string, unknown>;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTemplateListResponse {
  items: WorkflowTemplateSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface WorkflowTemplateListParams {
  limit?: number;
  offset?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow Run Types
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowRunStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'frozen';

export type WorkflowRunOriginatingType = 'meeting' | 'canvas';

export type WorkflowRunTriggerType = 'manual' | 'autopilot';

export interface WorkflowRun {
  id: string;
  workflow_template_id: string;
  originating_id: string;
  originating_type: WorkflowRunOriginatingType;
  status: WorkflowRunStatus;
  trigger_type?: WorkflowRunTriggerType;
  triggered_by?: string;
  owner_user_id?: string;
  workspace_id: string;
  name?: string;
  context_json?: Record<string, unknown>;
  current_step_ids?: string[];
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface CreateWorkflowRunRequest {
  /** ID of the workflow template to execute. */
  workflow_template_id: string;
  /** ID of the originating object that triggered the run. */
  originating_id: string;
  /** Kind of object that triggered the run. */
  originating_type: WorkflowRunOriginatingType;
}

export interface WorkflowRunListResponse {
  items: WorkflowRun[];
  total: number;
  limit: number;
  offset: number;
}

export interface WorkflowRunListParams {
  limit?: number;
  offset?: number;
  /** Filter by run status. */
  status?: WorkflowRunStatus;
  /** Filter by the originating workflow template ID. */
  workflow_template_id?: string;
  /** Filter by the originating object type. */
  originating_type?: WorkflowRunOriginatingType;
}

// ─────────────────────────────────────────────────────────────────────────────
// Transcript Export Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportMeetingTranscriptParams {
  /** Output format for the exported transcript. */
  format?: 'srt';
}
