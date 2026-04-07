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
  ToolkitVersion,
  CreateToolkitVersionRequest,
  UpdateToolkitVersionRequest,
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

// ─── Toolkit Versioning ───────────────────────────────────────────────────────

export async function listToolkitVersions(
  http: HttpTransport,
  toolkitId: string,
): Promise<ToolkitVersion[]> {
  return http.get<ToolkitVersion[]>(`/toolkits/${toolkitId}/versions`);
}

export async function createToolkitVersion(
  http: HttpTransport,
  toolkitId: string,
  data: CreateToolkitVersionRequest,
): Promise<ToolkitVersion> {
  return http.post<ToolkitVersion>(`/toolkits/${toolkitId}/versions`, data);
}

export async function getToolkitVersion(
  http: HttpTransport,
  toolkitId: string,
  versionId: string,
): Promise<ToolkitVersion> {
  return http.get<ToolkitVersion>(`/toolkits/${toolkitId}/versions/${versionId}`);
}

export async function updateToolkitVersion(
  http: HttpTransport,
  toolkitId: string,
  versionId: string,
  data: UpdateToolkitVersionRequest,
): Promise<ToolkitVersion> {
  return http.patch<ToolkitVersion>(`/toolkits/${toolkitId}/versions/${versionId}`, data);
}

export async function publishToolkitVersion(
  http: HttpTransport,
  toolkitId: string,
  versionId: string,
): Promise<void> {
  await http.post(`/toolkits/${toolkitId}/versions/${versionId}/publish`, {});
}

export async function republishToolkitVersion(
  http: HttpTransport,
  toolkitId: string,
  versionId: string,
): Promise<void> {
  await http.post(`/toolkits/${toolkitId}/versions/${versionId}/republish`, {});
}

export async function discardToolkitVersion(
  http: HttpTransport,
  toolkitId: string,
  versionId: string,
): Promise<void> {
  await http.delete(`/toolkits/${toolkitId}/versions/${versionId}`);
}

