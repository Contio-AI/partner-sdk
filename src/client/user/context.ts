/**
 * Context documents domain delegate.
 *
 * @module
 * @internal
 */

import { AxiosResponse } from 'axios';
import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  MeetingContextDocument,
  MeetingContextListParams,
  MeetingContextListResponse,
  UploadMeetingContextRequest,
  MeetingContextContentResponse,
} from '../../models';

export async function getMeetingContextDocuments(
  http: HttpTransport,
  meetingId: string,
  params?: MeetingContextListParams,
  options?: RequestOptions,
): Promise<MeetingContextListResponse> {
  return http.get<MeetingContextListResponse>(`/meetings/${meetingId}/context`, params, options);
}

export async function getAllMeetingContextDocuments(
  http: HttpTransport,
  meetingId: string,
  options?: RequestOptions,
): Promise<MeetingContextDocument[]> {
  const allItems: MeetingContextDocument[] = [];
  const pageSize = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await getMeetingContextDocuments(
      http,
      meetingId,
      { limit: pageSize, offset },
      options,
    );
    allItems.push(...response.items);
    total = response.total;
    offset += pageSize;
  } while (offset < total);

  return allItems;
}

export async function getMeetingContextDocument(
  http: HttpTransport,
  meetingId: string,
  documentId: string,
  options?: RequestOptions,
): Promise<MeetingContextDocument> {
  return http.get<MeetingContextDocument>(
    `/meetings/${meetingId}/context/${documentId}`,
    undefined,
    options,
  );
}

export async function uploadMeetingContextDocument(
  http: HttpTransport,
  meetingId: string,
  data: UploadMeetingContextRequest,
  options?: RequestOptions,
): Promise<MeetingContextDocument> {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('source_format', data.source_format);
  if (data.title != null) {
    formData.append('title', data.title);
  }
  if (data.context_type != null) {
    formData.append('context_type', data.context_type);
  }
  return http.postForm<MeetingContextDocument>(
    `/meetings/${meetingId}/context`,
    formData,
    options,
  );
}

export async function deleteMeetingContextDocument(
  http: HttpTransport,
  meetingId: string,
  documentId: string,
  options?: RequestOptions,
): Promise<void> {
  await http.delete(`/meetings/${meetingId}/context/${documentId}`, options);
}

export async function downloadMeetingContextDocumentContent(
  http: HttpTransport,
  meetingId: string,
  documentId: string,
  options?: RequestOptions,
): Promise<MeetingContextContentResponse> {
  const response = await http.getRaw(
    `/meetings/${meetingId}/context/${documentId}/content`,
    undefined,
    options,
  );

  const contentDisposition = response.headers?.['content-disposition'] as string | undefined;
  const filename = contentDisposition
    ? parseFilenameFromContentDisposition(contentDisposition)
    : undefined;

  const contentType = response.headers?.['content-type'] as string | undefined;
  const contentLength = response.headers?.['content-length'];
  const size = contentLength ? parseInt(String(contentLength), 10) : undefined;

  return {
    data: response.data as ArrayBuffer,
    filename,
    contentType,
    size: size && !isNaN(size) ? size : undefined,
  };
}

/**
 * Parse a filename from a `Content-Disposition` header value.
 *
 * Supports both the simple `filename="..."` form and the RFC 5987
 * `filename*=UTF-8''...` extended form.
 *
 * @internal
 */
export function parseFilenameFromContentDisposition(header: string): string | undefined {
  // Try RFC 5987 extended notation first: filename*=UTF-8''encoded-name
  const extMatch = header.match(/filename\*\s*=\s*[Uu][Tt][Ff]-8''(.+?)(?:;|$)/);
  if (extMatch?.[1]) {
    return decodeURIComponent(extMatch[1]);
  }

  // Fall back to simple form: filename="name" or filename=name
  const simpleMatch = header.match(/filename\s*=\s*"?([^";]+)"?/);
  return simpleMatch?.[1]?.trim();
}

