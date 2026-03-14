/**
 * Action Items domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  ActionItem,
  ActionItemListParams,
  ActionItemListResponse,
  CreateActionItemRequest,
  UpdateActionItemRequest,
} from '../../models';

export async function getActionItems(
  http: HttpTransport,
  params?: ActionItemListParams,
  options?: RequestOptions,
): Promise<ActionItemListResponse> {
  return http.get<ActionItemListResponse>('/action-items', params, options);
}

export async function getAllActionItems(
  http: HttpTransport,
  params?: Omit<ActionItemListParams, 'limit' | 'offset'>,
  options?: RequestOptions,
): Promise<ActionItem[]> {
  const allItems: ActionItem[] = [];
  const pageSize = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await getActionItems(http, { ...params, limit: pageSize, offset }, options);
    allItems.push(...response.items);
    total = response.total;
    offset += pageSize;
  } while (offset < total);

  return allItems;
}

export async function getActionItem(
  http: HttpTransport,
  actionItemId: string,
  options?: RequestOptions,
): Promise<ActionItem> {
  return http.get<ActionItem>(`/action-items/${actionItemId}`, undefined, options);
}

export async function createActionItem(
  http: HttpTransport,
  data: CreateActionItemRequest,
  options?: RequestOptions,
): Promise<ActionItem> {
  return http.post<ActionItem>('/action-items', data, options);
}

export async function updateActionItem(
  http: HttpTransport,
  actionItemId: string,
  data: UpdateActionItemRequest,
  options?: RequestOptions,
): Promise<ActionItem> {
  return http.put<ActionItem>(`/action-items/${actionItemId}`, data, options);
}

export async function deleteActionItem(
  http: HttpTransport,
  actionItemId: string,
  options?: RequestOptions,
): Promise<void> {
  await http.delete(`/action-items/${actionItemId}`, options);
}

