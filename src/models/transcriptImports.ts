/**
 * Transcript import type definitions for the Contio Partner API.
 *
 * The consolidated transcript import pipeline accepts a single multipart
 * upload containing either a text transcript or an audio recording and
 * attaches the result to a Contio meeting. The API selects the pipeline
 * from the uploaded file's extension:
 *
 * - Text files (`.txt`, `.md`, `.srt`, `.vtt`, `.pdf`) are parsed
 *   synchronously and return `200` with a {@link TextTranscriptImportResponse}.
 * - Audio files (`.mp3`, `.m4a`, `.mp4`, `.wav`, `.aac`, `.ogg`, `.oga`,
 *   `.opus`, `.flac`, `.webm`, `.amr`, `.aiff`, `.wma`) are transcribed
 *   asynchronously and return `202` with an {@link AudioTranscriptImportStatus}
 *   job to poll.
 */

/**
 * Audio transcript import job states.
 *
 * `completed` and `failed` are terminal states; all others are in-progress.
 */
export type AudioTranscriptImportState =
  | 'pending'
  | 'acquiring'
  | 'validating'
  | 'transcribing'
  | 'attaching'
  | 'completed'
  | 'failed';

/**
 * Result of a synchronous text transcript import (`200 OK`).
 */
export interface TextTranscriptImportResponse {
  /** Discriminator for the import pipeline that ran. Always `'text'`. */
  kind: 'text';
  /** Meeting the transcript was attached to (created for unbound imports). */
  meeting_id: string;
  /** Reference-material ID of the stored transcript. */
  transcript_id: string;
  /** Number of parsed transcript segments. */
  segments_count: number;
  /** Transcript duration in seconds. */
  duration_seconds: number;
  /** Meeting start time derived from the transcript (RFC 3339). */
  started_at: string;
  /** Meeting end time derived from the transcript (RFC 3339). */
  ended_at: string;
}

/**
 * Status of an asynchronous audio transcript import job (`202 Accepted` on
 * submission, `200 OK` from the status endpoint).
 */
export interface AudioTranscriptImportStatus {
  /** Discriminator for the import pipeline that ran. Always `'audio'`. */
  kind: 'audio';
  /** Audio import job ID; pass to `getAudioTranscriptImport` to poll. */
  job_id: string;
  /** Current job state. `completed` and `failed` are terminal. */
  state: AudioTranscriptImportState;
  /** Meeting the transcript was attached to. Populated once `completed`. */
  meeting_id?: string;
  /** Reference-material ID of the stored transcript. Populated once `completed`. */
  transcript_id?: string;
  /**
   * Failure code when `state` is `failed` (e.g. `unsupported_format`,
   * `video_no_audio`, `too_large`, `too_long`, `timeout`). The set of codes
   * is non-exhaustive — treat unknown values as a generic failure.
   */
  failure_code?: string;
  /** Job creation time (RFC 3339). */
  created_at: string;
  /** Last job update time (RFC 3339). */
  updated_at: string;
  /** Terminal transition time (RFC 3339), once `completed` or `failed`. */
  completed_at?: string;
}

/**
 * Response from a transcript import request. Branch on `kind`:
 * `'text'` for a synchronous text import, `'audio'` for an accepted
 * asynchronous audio import job.
 */
export type TranscriptImportResult = TextTranscriptImportResponse | AudioTranscriptImportStatus;

/**
 * Request payload for `POST /v1/partner/user/transcript-imports`.
 */
export interface ImportTranscriptRequest {
  /**
   * Raw file contents to upload. The `filename` extension selects the
   * pipeline — text (`.txt`, `.md`, `.srt`, `.vtt`, `.pdf`) or audio.
   */
  file: Blob;
  /** Filename including extension (e.g. `call.vtt`, `call.m4a`). */
  filename: string;
  /**
   * Existing meeting ID to bind the import to. When omitted a meeting is
   * created from the metadata below.
   */
  meeting_id?: string;
  /** Meeting title for unbound imports. */
  title?: string;
  /** Meeting start time in RFC 3339, for unbound imports. */
  starts_at?: string;
  /** Meeting duration in seconds (non-negative), for unbound imports. */
  duration_seconds?: number;
  /** Participant names or emails for unbound imports. */
  participants?: string[];
  /** Calendar event ID to bind the created meeting to (audio, unbound). */
  calendar_event_id?: string;
}

/**
 * Request payload for `POST /v1/partner/user/meetings/{id}/transcript/import`.
 */
export interface ImportMeetingTranscriptRequest {
  /**
   * Raw file contents to upload. The `filename` extension selects the
   * pipeline — text (`.txt`, `.md`, `.srt`, `.vtt`, `.pdf`) or audio.
   */
  file: Blob;
  /** Filename including extension (e.g. `call.vtt`, `call.m4a`). */
  filename: string;
}

/**
 * Options for `waitForAudioTranscriptImport`.
 */
export interface WaitForAudioTranscriptImportOptions {
  /**
   * Delay between status polls in milliseconds. Transcription time scales
   * with recording length; 5–15 seconds is recommended.
   * @default 10000
   */
  intervalMs?: number;
  /**
   * Overall polling budget in milliseconds. When elapsed before the job
   * reaches a terminal state the wait rejects — the job is not cancelled
   * and may still complete server-side.
   * @default 1200000 (20 minutes)
   */
  timeoutMs?: number;
}
