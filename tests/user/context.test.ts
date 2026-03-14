/**
 * Tests for Meeting Context Document endpoints.
 */

import {
  MeetingContextDocument,
  MeetingContextListResponse,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Context Documents', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  const mockContextDocument: MeetingContextDocument = {
    id: 'ctx-123',
    document_id: 'doc-456',
    meeting_id: 'meeting-789',
    workspace_id: 'ws-001',
    partner_app_id: 'app-002',
    platform_name: 'Test Platform',
    title: 'Sprint Planning Agenda',
    context_type: 'agenda',
    source_format: 'md',
    created_by_user_id: 'user-100',
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-03-01T10:00:00Z',
  };

  const mockContextListResponse: MeetingContextListResponse = {
    items: [
      mockContextDocument,
      {
        id: 'ctx-124',
        document_id: 'doc-457',
        meeting_id: 'meeting-789',
        workspace_id: 'ws-001',
        partner_app_id: 'app-002',
        platform_name: 'Test Platform',
        title: 'CRM Export',
        context_type: 'crm_record',
        source_format: 'json',
        created_by_user_id: 'user-100',
        created_at: '2025-03-01T11:00:00Z',
        updated_at: '2025-03-01T11:00:00Z',
      },
    ],
    total: 2,
    limit: 25,
    offset: 0,
  };

  describe('getMeetingContextDocuments', () => {
    it('should get a paginated list of context documents', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-789/context').reply(200, mockContextListResponse);

      const response = await ctx.userClient.getMeetingContextDocuments('meeting-789');

      expect(response.items).toHaveLength(2);
      expect(response.items[0].title).toBe('Sprint Planning Agenda');
      expect(response.items[1].source_format).toBe('json');
      expect(response.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-789/context').reply((config) => {
        expect(config.params.limit).toBe(10);
        expect(config.params.offset).toBe(20);
        return [200, mockContextListResponse];
      });

      await ctx.userClient.getMeetingContextDocuments('meeting-789', { limit: 10, offset: 20 });
    });
  });

  describe('getAllMeetingContextDocuments', () => {
    it('should fetch all pages of context documents', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-789/context').replyOnce(200, {
        items: [mockContextDocument],
        total: 150,
        limit: 100,
        offset: 0,
      });
      ctx.mockAxios.onGet('/meetings/meeting-789/context').replyOnce(200, {
        items: [{ ...mockContextDocument, id: 'ctx-200', title: 'Page 2 Doc' }],
        total: 150,
        limit: 100,
        offset: 100,
      });

      const docs = await ctx.userClient.getAllMeetingContextDocuments('meeting-789');

      expect(docs).toHaveLength(2);
      expect(docs[0].id).toBe('ctx-123');
      expect(docs[1].id).toBe('ctx-200');
      expect(ctx.mockAxios.history.get).toHaveLength(2);
    });

    it('should handle empty result', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-789/context').reply(200, {
        items: [],
        total: 0,
        limit: 100,
        offset: 0,
      });

      const docs = await ctx.userClient.getAllMeetingContextDocuments('meeting-789');

      expect(docs).toHaveLength(0);
    });
  });

  describe('getMeetingContextDocument', () => {
    it('should get a specific context document by ID', async () => {
      ctx.mockAxios.onGet('/meetings/meeting-789/context/ctx-123').reply(200, mockContextDocument);

      const doc = await ctx.userClient.getMeetingContextDocument('meeting-789', 'ctx-123');

      expect(doc.id).toBe('ctx-123');
      expect(doc.title).toBe('Sprint Planning Agenda');
      expect(doc.source_format).toBe('md');
      expect(doc.context_type).toBe('agenda');
    });
  });

  describe('uploadMeetingContextDocument', () => {
    it('should upload a context document via multipart form data', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-789/context').reply((config) => {
        expect(config.data).toBeInstanceOf(FormData);
        return [201, mockContextDocument];
      });

      const doc = await ctx.userClient.uploadMeetingContextDocument('meeting-789', {
        file: new Blob(['# Sprint Agenda\n- Item 1'], { type: 'text/markdown' }),
        source_format: 'md',
        title: 'Sprint Planning Agenda',
        context_type: 'agenda',
      });

      expect(doc.id).toBe('ctx-123');
      expect(doc.title).toBe('Sprint Planning Agenda');
    });

    it('should set content-type to multipart/form-data', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-789/context').reply((config) => {
        expect(config.headers?.['Content-Type']).toBe('multipart/form-data');
        return [201, mockContextDocument];
      });

      await ctx.userClient.uploadMeetingContextDocument('meeting-789', {
        file: new Blob(['test']),
        source_format: 'txt',
      });
    });

    it('should omit optional fields when not provided', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-789/context').reply((config) => {
        const formData = config.data as FormData;
        expect(formData.has('file')).toBe(true);
        expect(formData.has('source_format')).toBe(true);
        expect(formData.has('title')).toBe(false);
        expect(formData.has('context_type')).toBe(false);
        return [201, mockContextDocument];
      });

      await ctx.userClient.uploadMeetingContextDocument('meeting-789', {
        file: new Blob(['data']),
        source_format: 'csv',
      });
    });

    it('should include optional fields when provided', async () => {
      ctx.mockAxios.onPost('/meetings/meeting-789/context').reply((config) => {
        const formData = config.data as FormData;
        expect(formData.get('title')).toBe('My Document');
        expect(formData.get('context_type')).toBe('project_brief');
        expect(formData.get('source_format')).toBe('json');
        return [201, mockContextDocument];
      });

      await ctx.userClient.uploadMeetingContextDocument('meeting-789', {
        file: new Blob(['{}'], { type: 'application/json' }),
        source_format: 'json',
        title: 'My Document',
        context_type: 'project_brief',
      });
    });
  });

  describe('deleteMeetingContextDocument', () => {
    it('should delete a context document', async () => {
      ctx.mockAxios.onDelete('/meetings/meeting-789/context/ctx-123').reply(204);

      await ctx.userClient.deleteMeetingContextDocument('meeting-789', 'ctx-123');

      expect(ctx.mockAxios.history.delete).toHaveLength(1);
      expect(ctx.mockAxios.history.delete[0].url).toBe('/meetings/meeting-789/context/ctx-123');
    });
  });

  describe('downloadMeetingContextDocumentContent', () => {
    it('should download document content as ArrayBuffer', async () => {
      const fileContent = new TextEncoder().encode('# Sprint Agenda');
      ctx.mockAxios.onGet('/meetings/meeting-789/context/ctx-123/content').reply(200, fileContent.buffer, {
        'content-type': 'text/markdown',
        'content-disposition': 'attachment; filename="agenda.md"',
        'content-length': '16',
      });

      const result = await ctx.userClient.downloadMeetingContextDocumentContent('meeting-789', 'ctx-123');

      expect(result.data).toBeDefined();
      expect(result.contentType).toBe('text/markdown');
      expect(result.filename).toBe('agenda.md');
      expect(result.size).toBe(16);
    });

    it('should handle missing Content-Disposition header', async () => {
      const fileContent = new TextEncoder().encode('{}');
      ctx.mockAxios.onGet('/meetings/meeting-789/context/ctx-123/content').reply(200, fileContent.buffer, {
        'content-type': 'application/json',
      });

      const result = await ctx.userClient.downloadMeetingContextDocumentContent('meeting-789', 'ctx-123');

      expect(result.data).toBeDefined();
      expect(result.filename).toBeUndefined();
      expect(result.contentType).toBe('application/json');
      expect(result.size).toBeUndefined();
    });

    it('should parse RFC 5987 extended filename', async () => {
      const fileContent = new TextEncoder().encode('data');
      ctx.mockAxios.onGet('/meetings/meeting-789/context/ctx-123/content').reply(200, fileContent.buffer, {
        'content-type': 'text/plain',
        'content-disposition': "attachment; filename*=UTF-8''meeting%20notes%20%282025%29.txt",
        'content-length': '4',
      });

      const result = await ctx.userClient.downloadMeetingContextDocumentContent('meeting-789', 'ctx-123');

      expect(result.filename).toBe('meeting notes (2025).txt');
    });

    it('should handle filename without quotes', async () => {
      const fileContent = new TextEncoder().encode('data');
      ctx.mockAxios.onGet('/meetings/meeting-789/context/ctx-123/content').reply(200, fileContent.buffer, {
        'content-type': 'text/plain',
        'content-disposition': 'attachment; filename=simple.txt',
      });

      const result = await ctx.userClient.downloadMeetingContextDocumentContent('meeting-789', 'ctx-123');

      expect(result.filename).toBe('simple.txt');
    });

    it('should handle non-numeric content-length gracefully', async () => {
      const fileContent = new TextEncoder().encode('data');
      ctx.mockAxios.onGet('/meetings/meeting-789/context/ctx-123/content').reply(200, fileContent.buffer, {
        'content-type': 'text/plain',
        'content-length': 'invalid',
      });

      const result = await ctx.userClient.downloadMeetingContextDocumentContent('meeting-789', 'ctx-123');

      expect(result.size).toBeUndefined();
    });
  });
});
