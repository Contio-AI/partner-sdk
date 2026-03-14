/**
 * User Profile domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import { UserProfile } from '../../models';

export async function getUserProfile(
  http: HttpTransport,
  options?: RequestOptions,
): Promise<UserProfile> {
  return http.get<UserProfile>('/profile', undefined, options);
}

