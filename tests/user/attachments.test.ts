/**
 * Tests for Meeting Attachment endpoints.
 */

import {
  MeetingAttachment,
  MeetingAttachmentListResponse,
  CreateMeetingAttachmentRequest,
  DownloadMeetingAttachmentResponse,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Meeting Attachments', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockAttachment: MeetingAttachment = {
    id: 'attachment-1',
    meeting_id: 'meeting-123',
    workspace_id: 'workspace-1',
    file_name: 'budget-q3.xlsx',
    mime_type: 'application/vnd.ms-excel',
    size_bytes: 20481,
    kind: 'file',
    access_level: 'meeting',
    created_by_user_id: 'user-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };

  describe('getMeetingAttachments', () => {
    const mockResponse: MeetingAttachmentListResponse = {
      items: [mockAttachment],
      total: 1,
      limit: 25,
      offset: 0,
    };

    it('should list attachments for a meeting', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-123/attachments').reply((config) => {
        expect(config.params.limit).toBe(50);
        expect(config.params.offset).toBe(10);
        return [200, mockResponse];
      });

      const response = await ctx.userClient.getMeetingAttachments('meeting-123', { limit: 50, offset: 10 });

      expect(response.items).toHaveLength(1);
      expect(response.items[0].id).toBe('attachment-1');
      expect(response.total).toBe(1);
    });
  });

  describe('getAllMeetingAttachments', () => {
    it('should fetch all attachments across pages', async () => {
      ctx.mockAxios
        .onGet('/meetings/meeting-123/attachments')
        .replyOnce(200, {
          items: [{ id: 'attachment-1' }],
          total: 150,
          limit: 100,
          offset: 0,
        })
        .onGet('/meetings/meeting-123/attachments')
        .replyOnce(200, {
          items: [{ id: 'attachment-2' }],
          total: 150,
          limit: 100,
          offset: 100,
        });

      const items = await ctx.userClient.getAllMeetingAttachments('meeting-123');

      expect(items).toHaveLength(2);
      expect(items[0].id).toBe('attachment-1');
      expect(items[1].id).toBe('attachment-2');
    });
  });

  describe('uploadMeetingAttachment', () => {
    const createRequest: CreateMeetingAttachmentRequest = {
      file: new Blob(['file contents'], { type: 'text/plain' }),
      access_level: 'meeting',
      kind: 'file',
    };

    it('should upload a file attachment', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-123/attachments').reply((config) => {
        expect(config.headers['Content-Type']).toBe('multipart/form-data');
        expect(config.data).toBeInstanceOf(FormData);
        return [201, mockAttachment];
      });

      const attachment = await ctx.userClient.uploadMeetingAttachment('meeting-123', createRequest);

      expect(attachment.id).toBe('attachment-1');
    });
  });

  describe('getMeetingAttachment', () => {
    it('should get a specific attachment', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-123/attachments/attachment-1').reply(200, mockAttachment);

      const attachment = await ctx.userClient.getMeetingAttachment('meeting-123', 'attachment-1');

      expect(attachment.id).toBe('attachment-1');
      expect(attachment.file_name).toBe('budget-q3.xlsx');
    });
  });

  describe('deleteMeetingAttachment', () => {
    it('should delete an attachment', async () => {
      ctx.mockAxios.onDelete('/meetings/meeting-123/attachments/attachment-1').reply(204);

      await ctx.userClient.deleteMeetingAttachment('meeting-123', 'attachment-1');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/meetings/meeting-123/attachments/attachment-1');
    });
  });

  describe('downloadMeetingAttachment', () => {
    it('should download attachment content with metadata', async () => {
      const fileContent = new TextEncoder().encode('hello');
      ctx.mockAxios.onGet('/meetings/meeting-123/attachments/attachment-1/download').reply(200, fileContent.buffer, {
        'content-type': 'text/plain',
        'content-disposition': 'attachment; filename="notes.txt"',
        'content-length': '5',
      });

      const result = await ctx.userClient.downloadMeetingAttachment('meeting-123', 'attachment-1');

      expect(result.data).toBeDefined();
      expect(result.contentType).toBe('text/plain');
      expect(result.filename).toBe('notes.txt');
      expect(result.size).toBe(5);
    });

    it('should handle missing optional headers', async () => {
      const fileContent = new TextEncoder().encode('data');
      ctx.mockAxios.onGet('/meetings/meeting-123/attachments/attachment-1/download').reply(200, fileContent.buffer, {
        'content-type': 'application/octet-stream',
      });

      const result = await ctx.userClient.downloadMeetingAttachment('meeting-123', 'attachment-1');

      expect(result.data).toBeDefined();
      expect(result.filename).toBeUndefined();
      expect(result.contentType).toBe('application/octet-stream');
      expect(result.size).toBeUndefined();
    });
  });
});
