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
  CreateToolkitResponse,
  UpdateToolkitRequest,
  ToolkitVersion,
  CreateToolkitVersionRequest,
  CreateToolkitVersionResponse,
  UpdateToolkitVersionRequest,
  PublishToolkitVersionRequest,
  ToolkitInstallationListResponse,
  PartnerWorkspaceListResponse,
  ExportEntitiesRequest,
  ExportResponse,
} from '../../models';

export async function createToolkit(
  http: HttpTransport,
  data: CreateToolkitRequest,
): Promise<CreateToolkitResponse> {
  return http.post<CreateToolkitResponse>('/toolkits', data);
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
): Promise<CreateToolkitVersionResponse> {
  return http.post<CreateToolkitVersionResponse>(`/toolkits/${toolkitId}/versions`, data);
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
  data?: PublishToolkitVersionRequest,
): Promise<void> {
  await http.post(`/toolkits/${toolkitId}/versions/${versionId}/publish`, data ?? {});
}

// ─── Toolkit Distribution ────────────────────────────────────────────────────

export async function getToolkitInstallations(
  http: HttpTransport,
  toolkitId: string,
  params?: ToolkitListParams,
): Promise<ToolkitInstallationListResponse> {
  return http.get<ToolkitInstallationListResponse>(`/toolkits/${toolkitId}/installations`, params);
}

export async function getWorkspaces(
  http: HttpTransport,
  params?: ToolkitListParams,
): Promise<PartnerWorkspaceListResponse> {
  return http.get<PartnerWorkspaceListResponse>('/workspaces', params);
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

// ─── Toolkit Export ──────────────────────────────────────────────────────────

export async function exportEntities(
  http: HttpTransport,
  data: ExportEntitiesRequest,
): Promise<ExportResponse> {
  return http.post<ExportResponse>('/toolkits/export', data);
}

export async function exportToolkit(
  http: HttpTransport,
  toolkitId: string,
): Promise<ExportResponse> {
  return http.get<ExportResponse>(`/toolkits/${toolkitId}/export`);
}

