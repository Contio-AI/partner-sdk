/**
 * Workflow run domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  CreateWorkflowRunRequest,
  WorkflowRun,
  WorkflowRunListParams,
  WorkflowRunListResponse,
} from '../../models';

export async function listWorkflowRuns(
  http: HttpTransport,
  params?: WorkflowRunListParams,
  options?: RequestOptions,
): Promise<WorkflowRunListResponse> {
  return http.get<WorkflowRunListResponse>('/workflow-runs', params, options);
}

export async function createWorkflowRun(
  http: HttpTransport,
  data: CreateWorkflowRunRequest,
  options?: RequestOptions,
): Promise<WorkflowRun> {
  return http.post<WorkflowRun>('/workflow-runs', data, options);
}

export async function getWorkflowRun(
  http: HttpTransport,
  workflowRunId: string,
  options?: RequestOptions,
): Promise<WorkflowRun> {
  return http.get<WorkflowRun>(`/workflow-runs/${workflowRunId}`, undefined, options);
}
