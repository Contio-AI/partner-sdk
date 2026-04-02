/**
 * Toolkits domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  Toolkit,
  ToolkitListParams,
  ToolkitListResponse,
  CreateToolkitRequest,
  UpdateToolkitRequest,
} from '../../models';

export async function createToolkit(
  http: HttpTransport,
  data: CreateToolkitRequest,
): Promise<Toolkit> {
  return http.post<Toolkit>('/toolkits', data);
}

export async function getToolkits(
  http: HttpTransport,
  params?: ToolkitListParams,
): Promise<ToolkitListResponse> {
  return http.get<ToolkitListResponse>('/toolkits', params);
}

export async function getToolkit(
  http: HttpTransport,
  toolkitId: string,
): Promise<Toolkit> {
  return http.get<Toolkit>(`/toolkits/${toolkitId}`);
}

export async function updateToolkit(
  http: HttpTransport,
  toolkitId: string,
  data: UpdateToolkitRequest,
): Promise<Toolkit> {
  return http.put<Toolkit>(`/toolkits/${toolkitId}`, data);
}

export async function deleteToolkit(
  http: HttpTransport,
  toolkitId: string,
): Promise<void> {
  await http.delete(`/toolkits/${toolkitId}`);
}

