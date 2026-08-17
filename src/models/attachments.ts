/**
 * Meeting attachment type definitions for the Contio Partner API.
 *
 * Attachments are raw file uploads stored against a meeting. They are not
 * normalized or PII-scrubbed; use the Context endpoints for material the
 * Contio AI agent should read.
 */

export type MeetingAttachmentAccessLevel = 'just_me' | 'meeting' | 'workspace';
export type MeetingAttachmentKind = 'file' | 'link';

export interface MeetingAttachment {
  id: string;
  meeting_id: string;
  workspace_id: string;
  file_name?: string;
  mime_type?: string;
  size_bytes?: number;
  kind?: MeetingAttachmentKind;
  access_level?: MeetingAttachmentAccessLevel;
  external_content_url?: string;
  created_by_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingAttachmentRequest {
  /** Raw file contents to upload. */
  file: Blob;
  /** Who may see the attachment. Defaults to `just_me`. */
  access_level?: MeetingAttachmentAccessLevel;
  /** Attachment kind. Only `file` is currently creatable. */
  kind?: 'file';
}

export interface MeetingAttachmentListParams {
  limit?: number;
  offset?: number;
}

export interface MeetingAttachmentListResponse {
  items: MeetingAttachment[];
  total: number;
  limit: number;
  offset: number;
}

export interface DownloadMeetingAttachmentResponse {
  /** Raw file bytes. */
  data: ArrayBuffer;
  /** Original filename, if provided by the server. */
  filename?: string;
  /** MIME type, if provided by the server. */
  contentType?: string;
  /** Content length in bytes, when reported by the server. */
  size?: number;
}
