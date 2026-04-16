/**
 * Automations domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  Automation,
  AutomationListParams,
  AutomationListResponse,
  CreateAutomationRequest,
  UpdateAutomationRequest,
} from '../../models';

export async function createAutomation(
  http: HttpTransport,
  data: CreateAutomationRequest,
): Promise<Automation> {
  return http.post<Automation>('/automations', data);
}

export async function getAutomations(
  http: HttpTransport,
  params?: AutomationListParams,
): Promise<AutomationListResponse> {
  return http.get<AutomationListResponse>('/automations', params);
}

export async function getAutomation(
  http: HttpTransport,
  automationId: string,
): Promise<Automation> {
  return http.get<Automation>(`/automations/${automationId}`);
}

export async function updateAutomation(
  http: HttpTransport,
  automationId: string,
  data: UpdateAutomationRequest,
): Promise<Automation> {
  return http.put<Automation>(`/automations/${automationId}`, data);
}

export async function deleteAutomation(
  http: HttpTransport,
  automationId: string,
): Promise<void> {
  await http.delete(`/automations/${automationId}`);
}

