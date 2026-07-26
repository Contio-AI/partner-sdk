/**
 * IdP Configuration domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  PartnerIdPConfig,
  CreateIdPConfigRequest,
  UpdateIdPConfigRequest,
  IdpDomainVerification,
} from '../../models';

export async function createIdPConfig(
  http: HttpTransport,
  data: CreateIdPConfigRequest,
): Promise<PartnerIdPConfig> {
  return http.post<PartnerIdPConfig>('/idp', data);
}

export async function getIdPConfig(
  http: HttpTransport,
): Promise<PartnerIdPConfig> {
  return http.get<PartnerIdPConfig>('/idp');
}

export async function updateIdPConfig(
  http: HttpTransport,
  data: UpdateIdPConfigRequest,
): Promise<PartnerIdPConfig> {
  return http.put<PartnerIdPConfig>('/idp', data);
}

export async function deleteIdPConfig(
  http: HttpTransport,
): Promise<void> {
  await http.delete('/idp');
}

// ─── IdP Domain Verification ───────────────────────────────────────────────

export async function getIdpDomainVerification(
  http: HttpTransport,
  domain: string,
): Promise<IdpDomainVerification> {
  return http.get<IdpDomainVerification>(`/idp/domains/${domain}`);
}

export async function initiateIdpDomainVerification(
  http: HttpTransport,
  domain: string,
): Promise<IdpDomainVerification> {
  return http.post<IdpDomainVerification>(`/idp/domains/${domain}/verify`);
}

export async function checkIdpDomainVerification(
  http: HttpTransport,
  domain: string,
): Promise<IdpDomainVerification> {
  return http.post<IdpDomainVerification>(`/idp/domains/${domain}/check`);
}

