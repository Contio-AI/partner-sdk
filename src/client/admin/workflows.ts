/**
 * Workflow template management domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  WorkflowTemplate,
  WorkflowTemplateListParams,
  WorkflowTemplateListResponse,
} from '../../models';

export async function listWorkflowTemplates(
  http: HttpTransport,
  params?: WorkflowTemplateListParams,
): Promise<WorkflowTemplateListResponse> {
  return http.get<WorkflowTemplateListResponse>('/workflow-templates', params);
}

export async function getWorkflowTemplate(
  http: HttpTransport,
  workflowTemplateId: string,
): Promise<WorkflowTemplate> {
  return http.get<WorkflowTemplate>(`/workflow-templates/${workflowTemplateId}`);
}
