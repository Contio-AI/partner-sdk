/**
 * User Connections domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  UserConnection,
  UserConnectionListParams,
  UserConnectionListResponse,
} from '../../models';

export async function getUserConnections(
  http: HttpTransport,
  params?: UserConnectionListParams,
): Promise<UserConnectionListResponse> {
  return http.get<UserConnectionListResponse>('/connections', params);
}

export async function getUserConnection(
  http: HttpTransport,
  connectionId: string,
): Promise<UserConnection> {
  return http.get<UserConnection>(`/connections/${connectionId}`);
}

export async function revokeUserConnection(
  http: HttpTransport,
  connectionId: string,
): Promise<void> {
  await http.delete(`/connections/${connectionId}`);
}

