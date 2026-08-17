/**
 * Backlog item domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  BacklogItem,
  BacklogItemListParams,
  BacklogItemListResponse,
  BacklogItemHistoryListParams,
  CreateBacklogItemRequest,
  UpdateBacklogItemRequest,
  AssignBacklogItemRequest,
  AssignBacklogItemResponse,
} from '../../models';

export async function getBacklogItems(
  http: HttpTransport,
  params?: BacklogItemListParams,
  options?: RequestOptions,
): Promise<BacklogItemListResponse> {
  return http.get<BacklogItemListResponse>('/backlog-items', params, options);
}

export async function getAllBacklogItems(
  http: HttpTransport,
  params?: Omit<BacklogItemListParams, 'limit' | 'offset'>,
  options?: RequestOptions,
): Promise<BacklogItem[]> {
  const allItems: BacklogItem[] = [];
  const pageSize = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await getBacklogItems(http, { ...params, limit: pageSize, offset }, options);
    allItems.push(...response.items);
    total = response.total;
    offset += pageSize;
  } while (offset < total);

  return allItems;
}

export async function createBacklogItem(
  http: HttpTransport,
  data: CreateBacklogItemRequest,
  options?: RequestOptions,
): Promise<BacklogItem> {
  return http.post<BacklogItem>('/backlog-items', data, options);
}

export async function getBacklogItem(
  http: HttpTransport,
  backlogItemId: string,
  options?: RequestOptions,
): Promise<BacklogItem> {
  return http.get<BacklogItem>(`/backlog-items/${backlogItemId}`, undefined, options);
}

export async function updateBacklogItem(
  http: HttpTransport,
  backlogItemId: string,
  data: UpdateBacklogItemRequest,
  options?: RequestOptions,
): Promise<BacklogItem> {
  return http.put<BacklogItem>(`/backlog-items/${backlogItemId}`, data, options);
}

export async function deleteBacklogItem(
  http: HttpTransport,
  backlogItemId: string,
  options?: RequestOptions,
): Promise<void> {
  await http.delete(`/backlog-items/${backlogItemId}`, options);
}

export async function assignBacklogItem(
  http: HttpTransport,
  backlogItemId: string,
  data: AssignBacklogItemRequest,
  options?: RequestOptions,
): Promise<AssignBacklogItemResponse> {
  return http.post<AssignBacklogItemResponse>(`/backlog-items/${backlogItemId}/assign`, data, options);
}

export async function getBacklogItemHistory(
  http: HttpTransport,
  params?: BacklogItemHistoryListParams,
  options?: RequestOptions,
): Promise<BacklogItemListResponse> {
  return http.get<BacklogItemListResponse>('/backlog-items/history', params, options);
}

export async function getAllBacklogItemHistory(
  http: HttpTransport,
  params?: Omit<BacklogItemHistoryListParams, 'limit' | 'offset'>,
  options?: RequestOptions,
): Promise<BacklogItem[]> {
  const allItems: BacklogItem[] = [];
  const pageSize = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await getBacklogItemHistory(http, { ...params, limit: pageSize, offset }, options);
    allItems.push(...response.items);
    total = response.total;
    offset += pageSize;
  } while (offset < total);

  return allItems;
}
