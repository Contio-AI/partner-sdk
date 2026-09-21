/**
 * Tests for Transcript Import endpoints (consolidated text + audio pipeline).
 */

import {
  TextTranscriptImportResponse,
  AudioTranscriptImportStatus,
  ImportTranscriptRequest,
  ImportMeetingTranscriptRequest,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Transcript Imports', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockTextResponse: TextTranscriptImportResponse = {
    kind: 'text',
    meeting_id: 'meeting-123',
    transcript_id: 'transcript-1',
    segments_count: 142,
    duration_seconds: 1860,
    started_at: '2026-09-16T14:00:00Z',
    ended_at: '2026-09-16T14:31:00Z',
  };

  const mockAudioAccepted: AudioTranscriptImportStatus = {
    kind: 'audio',
    job_id: 'job-1',
    state: 'pending',
    created_at: '2026-09-16T14:32:10Z',
    updated_at: '2026-09-16T14:32:10Z',
  };

  const mockAudioCompleted: AudioTranscriptImportStatus = {
    kind: 'audio',
    job_id: 'job-1',
    state: 'completed',
    meeting_id: 'meeting-123',
    transcript_id: 'transcript-1',
    created_at: '2026-09-16T14:32:10Z',
    updated_at: '2026-09-16T14:41:52Z',
    completed_at: '2026-09-16T14:41:52Z',
  };

  describe('importMeetingTranscript', () => {
    const request: ImportMeetingTranscriptRequest = {
      file: new Blob(['WEBVTT contents'], { type: 'text/vtt' }),
      filename: 'call.vtt',
    };

    it('should import a text transcript into a meeting', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-123/transcript/import').reply((config) => {
        expect(config.headers['Content-Type']).toBe('multipart/form-data');
        expect(config.data).toBeInstanceOf(FormData);
        const form = config.data as FormData;
        const file = form.get('file') as File;
        expect(file.name).toBe('call.vtt');
        return [200, mockTextResponse];
      });

      const result = await ctx.userClient.importMeetingTranscript('meeting-123', request);

      expect(result.kind).toBe('text');
      if (result.kind === 'text') {
        expect(result.transcript_id).toBe('transcript-1');
        expect(result.segments_count).toBe(142);
      }
    });

    it('should return an audio job for audio uploads', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-123/transcript/import').reply(202, mockAudioAccepted);

      const result = await ctx.userClient.importMeetingTranscript('meeting-123', {
        file: new Blob(['audio bytes'], { type: 'audio/mp4' }),
        filename: 'call.m4a',
      });

      expect(result.kind).toBe('audio');
      if (result.kind === 'audio') {
        expect(result.job_id).toBe('job-1');
        expect(result.state).toBe('pending');
      }
    });
  });

  describe('importTranscript', () => {
    it('should upload an unbound text import with meeting metadata', async () => {
      ctx.mockAxios.onPost('/transcript-imports').reply((config) => {
        const form = config.data as FormData;
        expect(form.get('title')).toBe('Q3 pipeline review');
        expect(form.get('starts_at')).toBe('2026-09-16T14:00:00Z');
        expect(form.get('duration_seconds')).toBe('1860');
        expect(form.getAll('participants')).toEqual(['alice@example.com', 'bob@example.com']);
        expect(form.get('meeting_id')).toBeNull();
        const file = form.get('file') as File;
        expect(file.name).toBe('call.vtt');
        return [200, mockTextResponse];
      });

      const request: ImportTranscriptRequest = {
        file: new Blob(['transcript'], { type: 'text/vtt' }),
        filename: 'call.vtt',
        title: 'Q3 pipeline review',
        starts_at: '2026-09-16T14:00:00Z',
        duration_seconds: 1860,
        participants: ['alice@example.com', 'bob@example.com'],
      };

      const result = await ctx.userClient.importTranscript(request);

      expect(result.kind).toBe('text');
      expect(result.meeting_id).toBe('meeting-123');
    });

    it('should send meeting_id for bound imports', async () => {
      ctx.mockAxios.onPost('/transcript-imports').reply((config) => {
        const form = config.data as FormData;
        expect(form.get('meeting_id')).toBe('meeting-123');
        return [200, mockTextResponse];
      });

      const result = await ctx.userClient.importTranscript({
        file: new Blob(['transcript'], { type: 'text/plain' }),
        filename: 'call.txt',
        meeting_id: 'meeting-123',
      });

      expect(result.kind).toBe('text');
    });

    it('should send calendar_event_id for unbound audio imports', async () => {
      ctx.mockAxios.onPost('/transcript-imports').reply((config) => {
        const form = config.data as FormData;
        expect(form.get('calendar_event_id')).toBe('cal-event-1');
        return [202, mockAudioAccepted];
      });

      const result = await ctx.userClient.importTranscript({
        file: new Blob(['audio'], { type: 'audio/mp4' }),
        filename: 'call.m4a',
        calendar_event_id: 'cal-event-1',
      });

      expect(result.kind).toBe('audio');
      if (result.kind === 'audio') {
        expect(result.job_id).toBe('job-1');
      }
    });
  });

  describe('getAudioTranscriptImport', () => {
    it('should get an audio import job status', async () => {
      ctx.mockAxios.onGet('/transcript-imports/audio/jobs/job-1').reply(200, mockAudioCompleted);

      const job = await ctx.userClient.getAudioTranscriptImport('job-1');

      expect(job.job_id).toBe('job-1');
      expect(job.state).toBe('completed');
      expect(job.meeting_id).toBe('meeting-123');
      expect(job.transcript_id).toBe('transcript-1');
    });

    it('should surface failure_code on failed jobs', async () => {
      const failed: AudioTranscriptImportStatus = {
        ...mockAudioCompleted,
        state: 'failed',
        meeting_id: undefined,
        transcript_id: undefined,
        failure_code: 'video_no_audio',
      };
      ctx.mockAxios.onGet('/transcript-imports/audio/jobs/job-1').reply(200, failed);

      const job = await ctx.userClient.getAudioTranscriptImport('job-1');

      expect(job.state).toBe('failed');
      expect(job.failure_code).toBe('video_no_audio');
    });
  });

  describe('waitForAudioTranscriptImport', () => {
    it('should poll until the job completes', async () => {
      ctx.mockAxios
        .onGet('/transcript-imports/audio/jobs/job-1')
        .replyOnce(200, { ...mockAudioAccepted, state: 'transcribing' })
        .onGet('/transcript-imports/audio/jobs/job-1')
        .replyOnce(200, mockAudioCompleted);

      const job = await ctx.userClient.waitForAudioTranscriptImport('job-1', { intervalMs: 1, timeoutMs: 5000 });

      expect(job.state).toBe('completed');
      expect(ctx.mockAxios.history.get).toHaveLength(2);
    });

    it('should resolve on failed terminal state', async () => {
      ctx.mockAxios.onGet('/transcript-imports/audio/jobs/job-1').reply(200, {
        ...mockAudioCompleted,
        state: 'failed',
        failure_code: 'transcription_failed',
      });

      const job = await ctx.userClient.waitForAudioTranscriptImport('job-1', { intervalMs: 1, timeoutMs: 5000 });

      expect(job.state).toBe('failed');
      expect(job.failure_code).toBe('transcription_failed');
    });

    it('should reject with a non-API error when the timeout elapses', async () => {
      ctx.mockAxios.onGet('/transcript-imports/audio/jobs/job-1').reply(200, mockAudioAccepted);

      await expect(
        ctx.userClient.waitForAudioTranscriptImport('job-1', { intervalMs: 1, timeoutMs: 5 }),
      ).rejects.toThrow(/did not reach a terminal state/);
    });

    it('should propagate API errors from status polls', async () => {
      ctx.mockAxios.onGet('/transcript-imports/audio/jobs/job-1').reply(404, {
        error: 'Audio import not found',
        code: 'not_found',
      });

      await expect(
        ctx.userClient.waitForAudioTranscriptImport('job-1', { intervalMs: 1, timeoutMs: 5000 }),
      ).rejects.toMatchObject({ name: 'ContioAPIError', statusCode: 404 });
    });
  });
});
