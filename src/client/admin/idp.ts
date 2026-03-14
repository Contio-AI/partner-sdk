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

