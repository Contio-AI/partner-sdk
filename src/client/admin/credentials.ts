/**
 * Credential Management domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  CredentialStatusResponse,
  CredentialRotationRequest,
  CredentialRotationResponse,
  CredentialRollbackRequest,
  CredentialAuditHistoryParams,
  CredentialAuditHistoryResponse,
} from '../../models';

export async function getCredentialStatus(
  http: HttpTransport,
): Promise<CredentialStatusResponse> {
  return http.get<CredentialStatusResponse>('/credentials');
}

export async function rotateAPIKey(
  http: HttpTransport,
  request: CredentialRotationRequest,
): Promise<CredentialRotationResponse> {
  return http.post<CredentialRotationResponse>('/credentials/api-key/rotate', request);
}

export async function rotateWebhookSecret(
  http: HttpTransport,
  request: CredentialRotationRequest,
): Promise<CredentialRotationResponse> {
  return http.post<CredentialRotationResponse>('/credentials/webhook-secret/rotate', request);
}

export async function rotateClientSecret(
  http: HttpTransport,
  request: CredentialRotationRequest,
): Promise<CredentialRotationResponse> {
  return http.post<CredentialRotationResponse>('/credentials/client-secret/rotate', request);
}

export async function rollbackCredential(
  http: HttpTransport,
  credentialType: 'api-key' | 'client-secret',
  request: CredentialRollbackRequest,
): Promise<void> {
  await http.post(`/credentials/${credentialType}/rollback`, request);
}

export async function getCredentialHistory(
  http: HttpTransport,
  params?: CredentialAuditHistoryParams,
): Promise<CredentialAuditHistoryResponse> {
  return http.get<CredentialAuditHistoryResponse>('/credentials/history', params);
}

