/**
 * Meeting attachment domain delegate.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import { parseFilenameFromContentDisposition } from './context';
import {
  MeetingAttachment,
  MeetingAttachmentListParams,
  MeetingAttachmentListResponse,
  CreateMeetingAttachmentRequest,
  DownloadMeetingAttachmentResponse,
} from '../../models';

export async function getMeetingAttachments(
  http: HttpTransport,
  meetingId: string,
  params?: MeetingAttachmentListParams,
  options?: RequestOptions,
): Promise<MeetingAttachmentListResponse> {
  return http.get<MeetingAttachmentListResponse>(`/meetings/${meetingId}/attachments`, params, options);
}

export async function getAllMeetingAttachments(
  http: HttpTransport,
  meetingId: string,
  options?: RequestOptions,
): Promise<MeetingAttachment[]> {
  const allItems: MeetingAttachment[] = [];
  const pageSize = 100;
  let offset = 0;
  let total = 0;

  do {
    const response = await getMeetingAttachments(http, meetingId, { limit: pageSize, offset }, options);
    allItems.push(...response.items);
    total = response.total;
    offset += pageSize;
  } while (offset < total);

  return allItems;
}

export async function uploadMeetingAttachment(
  http: HttpTransport,
  meetingId: string,
  data: CreateMeetingAttachmentRequest,
  options?: RequestOptions,
): Promise<MeetingAttachment> {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('kind', data.kind ?? 'file');
  if (data.access_level != null) {
    formData.append('access_level', data.access_level);
  }

  return http.postForm<MeetingAttachment>(`/meetings/${meetingId}/attachments`, formData, options);
}

export async function getMeetingAttachment(
  http: HttpTransport,
  meetingId: string,
  attachmentId: string,
  options?: RequestOptions,
): Promise<MeetingAttachment> {
  return http.get<MeetingAttachment>(
    `/meetings/${meetingId}/attachments/${attachmentId}`,
    undefined,
    options,
  );
}

export async function deleteMeetingAttachment(
  http: HttpTransport,
  meetingId: string,
  attachmentId: string,
  options?: RequestOptions,
): Promise<void> {
  await http.delete(`/meetings/${meetingId}/attachments/${attachmentId}`, options);
}

export async function downloadMeetingAttachment(
  http: HttpTransport,
  meetingId: string,
  attachmentId: string,
  options?: RequestOptions,
): Promise<DownloadMeetingAttachmentResponse> {
  const response = await http.getRaw(
    `/meetings/${meetingId}/attachments/${attachmentId}/download`,
    undefined,
    options,
  );

  const contentDisposition = response.headers?.['content-disposition'] as string | undefined;
  const filename = contentDisposition ? parseFilenameFromContentDisposition(contentDisposition) : undefined;

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
