/**
 * Workflows domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  Workflow,
  WorkflowListParams,
  WorkflowListResponse,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
} from '../../models';

export async function createWorkflow(
  http: HttpTransport,
  data: CreateWorkflowRequest,
): Promise<Workflow> {
  return http.post<Workflow>('/workflows', data);
}

export async function getWorkflows(
  http: HttpTransport,
  params?: WorkflowListParams,
): Promise<WorkflowListResponse> {
  return http.get<WorkflowListResponse>('/workflows', params);
}

export async function getWorkflow(
  http: HttpTransport,
  workflowId: string,
): Promise<Workflow> {
  return http.get<Workflow>(`/workflows/${workflowId}`);
}

export async function updateWorkflow(
  http: HttpTransport,
  workflowId: string,
  data: UpdateWorkflowRequest,
): Promise<Workflow> {
  return http.put<Workflow>(`/workflows/${workflowId}`, data);
}

export async function deleteWorkflow(
  http: HttpTransport,
  workflowId: string,
): Promise<void> {
  await http.delete(`/workflows/${workflowId}`);
}

