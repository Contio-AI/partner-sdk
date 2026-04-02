/**
 * Templates domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  Template,
  TemplateListParams,
  TemplateListResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateNextStep,
  TemplateNextStepListParams,
  TemplateNextStepListResponse,
  AddTemplateNextStepRequest,
  UpdateTemplateNextStepRequest,
} from '../../models';

// ─────────────────────────────────────────────────────────────────────────────
// Template CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function createTemplate(
  http: HttpTransport,
  data: CreateTemplateRequest,
): Promise<Template> {
  return http.post<Template>('/templates', data);
}

export async function getTemplates(
  http: HttpTransport,
  params?: TemplateListParams,
): Promise<TemplateListResponse> {
  return http.get<TemplateListResponse>('/templates', params);
}

export async function getTemplate(
  http: HttpTransport,
  templateId: string,
): Promise<Template> {
  return http.get<Template>(`/templates/${templateId}`);
}

export async function updateTemplate(
  http: HttpTransport,
  templateId: string,
  data: UpdateTemplateRequest,
): Promise<Template> {
  return http.put<Template>(`/templates/${templateId}`, data);
}

export async function deleteTemplate(
  http: HttpTransport,
  templateId: string,
): Promise<void> {
  await http.delete(`/templates/${templateId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Template Next Steps
// ─────────────────────────────────────────────────────────────────────────────

export async function getTemplateNextSteps(
  http: HttpTransport,
  templateId: string,
  params?: TemplateNextStepListParams,
): Promise<TemplateNextStepListResponse> {
  return http.get<TemplateNextStepListResponse>(
    `/templates/${templateId}/next-steps`,
    params,
  );
}

export async function addTemplateNextStep(
  http: HttpTransport,
  templateId: string,
  data: AddTemplateNextStepRequest,
): Promise<TemplateNextStep> {
  return http.post<TemplateNextStep>(
    `/templates/${templateId}/next-steps`,
    data,
  );
}

export async function updateTemplateNextStep(
  http: HttpTransport,
  templateId: string,
  nextStepId: string,
  data: UpdateTemplateNextStepRequest,
): Promise<TemplateNextStep> {
  return http.put<TemplateNextStep>(
    `/templates/${templateId}/next-steps/${nextStepId}`,
    data,
  );
}

export async function removeTemplateNextStep(
  http: HttpTransport,
  templateId: string,
  nextStepId: string,
): Promise<void> {
  await http.delete(`/templates/${templateId}/next-steps/${nextStepId}`);
}

