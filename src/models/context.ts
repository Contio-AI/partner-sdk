/**
 * Meeting context document type definitions for the Contio Partner API.
 *
 * Context documents provide supplementary material for meetings — agendas,
 * reference data, background notes, etc. — that the AI agent uses to enrich
 * meeting intelligence.
 *
 * @remarks
 * The source format determines how the document is processed server-side.
 * Future API versions may expand the set of accepted formats to include
 * binary attachments and transcript imports (see ADR-0042).
 *
 * @see {@link https://docs.contio.ai/partner-api | Partner API documentation}
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enums / union types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Accepted source formats for context document uploads.
 *
 * Each value corresponds to the text-based serialisation of the uploaded file.
 * The server validates file contents against the declared format.
 *
 * | Format   | Typical use-case                          |
 * |----------|-------------------------------------------|
 * | `json`   | Structured data, API payloads             |
 * | `csv`    | Tabular data exports                      |
 * | `tsv`    | Tab-separated tabular data                |
 * | `xml`    | Configuration files, data interchange     |
 * | `html`   | Web page content, rich-text exports       |
 * | `yaml`   | Configuration, structured notes           |
 * | `md`     | Markdown documents, meeting agendas       |
 * | `txt`    | Plain text notes, transcripts             |
 */
export type ContextSourceFormat =
  | 'json'
  | 'csv'
  | 'tsv'
  | 'xml'
  | 'html'
  | 'yaml'
  | 'md'
  | 'txt';

// ─────────────────────────────────────────────────────────────────────────────
// Resource types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A partner-scoped meeting context document.
 *
 * Context documents are scoped to the partner application that created them —
 * each partner can only see and manage documents it has uploaded.
 */
export interface MeetingContextDocument {
  /** Unique identifier for the context record */
  id: string;
  /** Identifier for the underlying document in the storage layer */
  document_id: string;
  /** Meeting this context document is associated with */
  meeting_id: string;
  /** Workspace that owns the meeting */
  workspace_id: string;
  /** Partner application that uploaded the document */
  partner_app_id: string;
  /** Display name of the partner platform */
  platform_name: string;
  /** Human-readable document title */
  title?: string;
  /**
   * Logical context type supplied by the partner at upload time.
   *
   * This is a free-form string that partners use to categorise documents
   * (e.g. `"agenda"`, `"crm_record"`, `"project_brief"`).
   */
  context_type?: string;
  /** Source format declared at upload time */
  source_format: ContextSourceFormat;
  /** ID of the user who uploaded the document */
  created_by_user_id: string;
  /** ISO 8601 timestamp of creation */
  created_at: string;
  /** ISO 8601 timestamp of last update */
  updated_at: string;
  /** ISO 8601 timestamp of soft-deletion, if applicable */
  deleted_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// List / pagination
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pagination parameters for listing meeting context documents.
 */
export interface MeetingContextListParams {
  /** Maximum number of documents to return (default: 25, max: 100) */
  limit?: number;
  /** Number of documents to skip for pagination (default: 0) */
  offset?: number;
}

/**
 * Paginated list of meeting context documents.
 */
export interface MeetingContextListResponse {
  /** Context documents for the current page */
  items: MeetingContextDocument[];
  /** Total number of documents matching the query */
  total: number;
  /** Limit that was applied */
  limit: number;
  /** Offset that was applied */
  offset: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parameters for uploading a meeting context document.
 *
 * The `file` field accepts any `Blob`-compatible value — in Node.js ≥ 22 this
 * includes `Buffer`, `File`, and `Blob` instances. The SDK converts the
 * request into a `multipart/form-data` upload automatically.
 *
 * @example
 * ```typescript
 * import { readFile } from 'node:fs/promises';
 *
 * const buffer = await readFile('./agenda.md');
 * const doc = await user.uploadMeetingContextDocument('meeting-id', {
 *   file: new Blob([buffer]),
 *   source_format: 'md',
 *   title: 'Sprint planning agenda',
 *   context_type: 'agenda',
 * });
 * ```
 */
export interface UploadMeetingContextRequest {
  /** Document file contents */
  file: Blob;
  /**
   * Source format of the file.
   *
   * Must match the actual content — the server validates the file against
   * this declaration.
   */
  source_format: ContextSourceFormat;
  /** Human-readable document title (defaults to the filename if omitted) */
  title?: string;
  /**
   * Logical context type — a free-form partner-defined category.
   *
   * @example `"agenda"`, `"crm_record"`, `"project_brief"`
   */
  context_type?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Download
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Response returned when downloading a context document's content.
 *
 * The `data` field contains the raw file bytes as an `ArrayBuffer`.
 * Metadata fields are extracted from the HTTP response headers so
 * consumers do not need to parse them manually.
 *
 * @example
 * ```typescript
 * const content = await user.downloadMeetingContextDocumentContent(
 *   'meeting-id',
 *   'document-id',
 * );
 * await writeFile('output.md', Buffer.from(content.data));
 * console.log(`Downloaded ${content.filename} (${content.size} bytes)`);
 * ```
 */
export interface MeetingContextContentResponse {
  /** Raw file bytes */
  data: ArrayBuffer;
  /**
   * Filename from the `Content-Disposition` header, if the server provided one.
   */
  filename?: string;
  /**
   * MIME type from the `Content-Type` header.
   *
   * @example `"text/markdown"`, `"application/json"`
   */
  contentType?: string;
  /** Content length in bytes, when reported by the server */
  size?: number;
}

