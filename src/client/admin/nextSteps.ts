/**
 * Next Steps domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  NextStep,
  NextStepListParams,
  NextStepListResponse,
  CreateNextStepRequest,
  UpdateNextStepRequest,
  NextStepActionButton,
  NextStepActionButtonListParams,
  NextStepActionButtonListResponse,
  AddNextStepActionButtonRequest,
  UpdateNextStepActionButtonRequest,
} from '../../models';

// ─────────────────────────────────────────────────────────────────────────────
// Next Step CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function createNextStep(
  http: HttpTransport,
  data: CreateNextStepRequest,
): Promise<NextStep> {
  return http.post<NextStep>('/next-steps', data);
}

export async function getNextSteps(
  http: HttpTransport,
  params?: NextStepListParams,
): Promise<NextStepListResponse> {
  return http.get<NextStepListResponse>('/next-steps', params);
}

export async function getNextStep(
  http: HttpTransport,
  nextStepId: string,
): Promise<NextStep> {
  return http.get<NextStep>(`/next-steps/${nextStepId}`);
}

export async function updateNextStep(
  http: HttpTransport,
  nextStepId: string,
  data: UpdateNextStepRequest,
): Promise<NextStep> {
  return http.put<NextStep>(`/next-steps/${nextStepId}`, data);
}

export async function deleteNextStep(
  http: HttpTransport,
  nextStepId: string,
): Promise<void> {
  await http.delete(`/next-steps/${nextStepId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Next Step Action Buttons
// ─────────────────────────────────────────────────────────────────────────────

export async function getNextStepActionButtons(
  http: HttpTransport,
  nextStepId: string,
  params?: NextStepActionButtonListParams,
): Promise<NextStepActionButtonListResponse> {
  return http.get<NextStepActionButtonListResponse>(
    `/next-steps/${nextStepId}/action-buttons`,
    params,
  );
}

export async function addNextStepActionButton(
  http: HttpTransport,
  nextStepId: string,
  data: AddNextStepActionButtonRequest,
): Promise<NextStepActionButton> {
  return http.post<NextStepActionButton>(
    `/next-steps/${nextStepId}/action-buttons`,
    data,
  );
}

export async function updateNextStepActionButton(
  http: HttpTransport,
  nextStepId: string,
  actionButtonId: string,
  data: UpdateNextStepActionButtonRequest,
): Promise<NextStepActionButton> {
  return http.put<NextStepActionButton>(
    `/next-steps/${nextStepId}/action-buttons/${actionButtonId}`,
    data,
  );
}

export async function removeNextStepActionButton(
  http: HttpTransport,
  nextStepId: string,
  actionButtonId: string,
): Promise<void> {
  await http.delete(`/next-steps/${nextStepId}/action-buttons/${actionButtonId}`);
}

