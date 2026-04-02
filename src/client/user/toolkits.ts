/**
 * User Toolkits domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import {
  ToolkitListParams,
  ToolkitWithInstallation,
  ToolkitWithInstallationListResponse,
  ToolkitInstallation,
} from '../../models';
import { RequestOptions } from '../base';

/**
 * Get available toolkits with installation status.
 *
 * Returns toolkits that are active and available to the user,
 * along with installation status for the user's workspace.
 */
export async function getToolkits(
  http: HttpTransport,
  params?: ToolkitListParams,
  options?: RequestOptions,
): Promise<ToolkitWithInstallationListResponse> {
  return http.get<ToolkitWithInstallationListResponse>('/toolkits', params, options);
}

/**
 * Get a specific toolkit with installation status.
 */
export async function getToolkit(
  http: HttpTransport,
  toolkitId: string,
  options?: RequestOptions,
): Promise<ToolkitWithInstallation> {
  return http.get<ToolkitWithInstallation>(`/toolkits/${toolkitId}`, undefined, options);
}

/**
 * Install a toolkit in the user's workspace.
 *
 * Creates all toolkit entities (templates, next steps, action buttons)
 * in the user's workspace based on the toolkit manifest.
 */
export async function installToolkit(
  http: HttpTransport,
  toolkitId: string,
  options?: RequestOptions,
): Promise<ToolkitInstallation> {
  return http.post<ToolkitInstallation>(`/toolkits/${toolkitId}/install`, undefined, options);
}

/**
 * Uninstall a toolkit from the user's workspace.
 *
 * Removes all toolkit-created entities from the user's workspace.
 */
export async function uninstallToolkit(
  http: HttpTransport,
  toolkitId: string,
  options?: RequestOptions,
): Promise<void> {
  await http.delete(`/toolkits/${toolkitId}/uninstall`, options);
}

