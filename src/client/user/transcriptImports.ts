/**
 * Transcript import domain delegate — consolidated text + audio pipeline.
 *
 * All functions accept an {@link HttpTransport} as first argument so they
 * can be invoked by the {@link PartnerUserClient} facade without exposing
 * BaseClient internals.
 *
 * @module
 * @internal
 */

import { HttpTransport } from '../_http';
import { RequestOptions } from '../base';
import {
  AudioTranscriptImportStatus,
  ImportMeetingTranscriptRequest,
  ImportTranscriptRequest,
  TranscriptImportResult,
  WaitForAudioTranscriptImportOptions,
} from '../../models';

const DEFAULT_POLL_INTERVAL_MS = 10_000;
const DEFAULT_POLL_TIMEOUT_MS = 20 * 60_000;

export async function importTranscript(
  http: HttpTransport,
  data: ImportTranscriptRequest,
  options?: RequestOptions,
): Promise<TranscriptImportResult> {
  const formData = new FormData();
  formData.append('file', data.file, data.filename);
  if (data.meeting_id != null) {
    formData.append('meeting_id', data.meeting_id);
  }
  if (data.title != null) {
    formData.append('title', data.title);
  }
  if (data.starts_at != null) {
    formData.append('starts_at', data.starts_at);
  }
  if (data.duration_seconds != null) {
    formData.append('duration_seconds', String(data.duration_seconds));
  }
  for (const participant of data.participants ?? []) {
    formData.append('participants', participant);
  }
  if (data.calendar_event_id != null) {
    formData.append('calendar_event_id', data.calendar_event_id);
  }

  return http.postForm<TranscriptImportResult>('/transcript-imports', formData, options);
}

export async function importMeetingTranscript(
  http: HttpTransport,
  meetingId: string,
  data: ImportMeetingTranscriptRequest,
  options?: RequestOptions,
): Promise<TranscriptImportResult> {
  const formData = new FormData();
  formData.append('file', data.file, data.filename);

  return http.postForm<TranscriptImportResult>(`/meetings/${meetingId}/transcript/import`, formData, options);
}

export async function getAudioTranscriptImport(
  http: HttpTransport,
  jobId: string,
  options?: RequestOptions,
): Promise<AudioTranscriptImportStatus> {
  return http.get<AudioTranscriptImportStatus>(`/transcript-imports/audio/jobs/${jobId}`, undefined, options);
}

export async function waitForAudioTranscriptImport(
  http: HttpTransport,
  jobId: string,
  waitOptions?: WaitForAudioTranscriptImportOptions,
  options?: RequestOptions,
): Promise<AudioTranscriptImportStatus> {
  const intervalMs = waitOptions?.intervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const timeoutMs = waitOptions?.timeoutMs ?? DEFAULT_POLL_TIMEOUT_MS;
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const job = await getAudioTranscriptImport(http, jobId, options);
    if (job.state === 'completed' || job.state === 'failed') {
      return job;
    }
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      throw new Error(
        `Audio transcript import ${jobId} did not reach a terminal state within ${timeoutMs}ms ` +
          `(last state: ${job.state}). The job is not cancelled and may still complete server-side.`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, Math.min(intervalMs, remaining)));
  }
}
