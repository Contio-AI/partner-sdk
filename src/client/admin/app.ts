/**
 * Partner App domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  PartnerApp,
  UpdatePartnerAppRequest,
  UpdatePartnerAppStatusRequest,
} from '../../models';

export async function getApp(http: HttpTransport): Promise<PartnerApp> {
  return http.get<PartnerApp>('/app');
}

export async function updateApp(
  http: HttpTransport,
  data: UpdatePartnerAppRequest,
): Promise<PartnerApp> {
  return http.put<PartnerApp>('/app', data);
}

export async function updateAppStatus(
  http: HttpTransport,
  data: UpdatePartnerAppStatusRequest,
): Promise<PartnerApp> {
  return http.put<PartnerApp>('/app/status', data);
}

