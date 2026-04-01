/**
 * Action Buttons domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  ActionButton,
  ActionButtonListParams,
  ActionButtonListResponse,
  CreateActionButtonRequest,
  UpdateActionButtonRequest,
} from '../../models';

export async function createActionButton(
  http: HttpTransport,
  data: CreateActionButtonRequest,
): Promise<ActionButton> {
  return http.post<ActionButton>('/action-buttons', data);
}

export async function getActionButtons(
  http: HttpTransport,
  params?: ActionButtonListParams,
): Promise<ActionButtonListResponse> {
  return http.get<ActionButtonListResponse>('/action-buttons', params);
}

export async function getActionButton(
  http: HttpTransport,
  actionButtonId: string,
): Promise<ActionButton> {
  return http.get<ActionButton>(`/action-buttons/${actionButtonId}`);
}

export async function updateActionButton(
  http: HttpTransport,
  actionButtonId: string,
  data: UpdateActionButtonRequest,
): Promise<ActionButton> {
  return http.put<ActionButton>(`/action-buttons/${actionButtonId}`, data);
}

export async function deleteActionButton(
  http: HttpTransport,
  actionButtonId: string,
): Promise<void> {
  await http.delete(`/action-buttons/${actionButtonId}`);
}

