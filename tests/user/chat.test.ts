/**
 * Tests for Chat Session API endpoints.
 *
 * Covers all four facade methods on PartnerUserClient:
 *   - createChatSession  (POST /sessions)       — requires chat:write
 *   - getChatSessions    (GET  /sessions)        — requires chat:read
 *   - getChatSession     (GET  /sessions/:id)    — requires chat:read
 *   - sendChatMessage    (PUT  /sessions/:id)    — requires chat:write
 */

import {
  ChatSession,
  ChatSessionListResponse,
  ChatTurn,
  SendChatMessageResponse,
} from '../../src/models';
import { createUserTestContext, UserTestContext } from './setup';

describe('PartnerUserClient › Chat Sessions', () => {
  let ctx: UserTestContext;

  beforeEach(() => {
    ctx = createUserTestContext();
  });

  afterEach(() => {
    ctx.mockAxios.reset();
  });

  // ── Shared fixtures (RAW API responses) ──────────────────────────────────────
  // These mirror what the Partner API actually returns (transport layer).
  // The SDK mapping functions transform these into clean domain models.

  /** Raw turn as returned by the API */
  interface RawTurn {
    id: string;
    session_id: string;
    sequence_number?: number | null;
    role: string;
    content: string;
    status: string;
    error?: { code: string; message: string } | null;
    agent_metadata?: {
      tool_calls?: Array<{ name: string; status: string }>;
      referenced_documents?: string[];
      model?: string;
      token_usage?: { prompt_tokens: number; completion_tokens: number };
    } | null;
    created_at: string;
    completed_at?: string | null;
  }

  const rawUserTurn: RawTurn = {
    id: 'turn-001',
    session_id: 'session-abc',
    sequence_number: 1,
    role: 'user',
    content: 'Summarize the key decisions from this meeting.',
    status: 'queued',
    created_at: '2026-03-20T10:00:00Z',
    completed_at: null,
  };

  const rawAgentTurn: RawTurn = {
    id: 'turn-002',
    session_id: 'session-abc',
    sequence_number: 2,
    role: 'agent',
    content: 'The key decisions were: 1. Launch Q2. 2. Hire frontend engineer.',
    status: 'completed',
    agent_metadata: {
      tool_calls: [{ name: 'search_meeting_notes', status: 'success' }],
      referenced_documents: ['doc-1'],
      model: 'gpt-4o',
      token_usage: { prompt_tokens: 512, completion_tokens: 128 },
    },
    created_at: '2026-03-20T10:00:05Z',
    completed_at: '2026-03-20T10:00:10Z',
  };

  /** Raw POST /sessions response */
  const rawCreateSessionResponse = {
    id: 'session-abc',
    meeting_id: 'meeting-123',
    status: 'active',
    metadata: { partner_ref: 'crm-case-4821' },
    created_at: '2026-03-20T10:00:00Z',
    initial_turn: rawUserTurn,
  };

  /** Raw GET /sessions/:id response */
  const rawGetSessionResponse = {
    session: {
      id: 'session-abc',
      meeting_id: 'meeting-123',
      status: 'active',
      title: null,
      turn_count: 2,
      metadata: { partner_ref: 'crm-case-4821' },
      created_at: '2026-03-20T10:00:00Z',
      updated_at: '2026-03-20T10:00:00Z',
    },
    turns: [rawUserTurn, rawAgentTurn],
    turn_pagination: { total: 2, offset: 0, limit: 50, has_more: false },
  };

  // Domain model fixtures (for tests that don't go through HTTP layer)
  const mockUserTurn: ChatTurn = {
    id: 'turn-001',
    session_id: 'session-abc',
    sequence_number: 1,
    role: 'user',
    content: 'Summarize the key decisions from this meeting.',
    status: 'queued',
    created_at: '2026-03-20T10:00:00Z',
    completed_at: null,
  };

  const mockAgentTurn: ChatTurn = {
    id: 'turn-002',
    session_id: 'session-abc',
    sequence_number: 2,
    role: 'agent',
    content: 'The key decisions were: 1. Launch Q2. 2. Hire frontend engineer.',
    status: 'completed',
    agent_metadata: {
      tool_calls: [{ name: 'search_meeting_notes', status: 'success' }],
      referenced_documents: ['doc-1'],
      model: 'gpt-4o',
      token_usage: { prompt_tokens: 512, completion_tokens: 128 },
    },
    created_at: '2026-03-20T10:00:05Z',
    completed_at: '2026-03-20T10:00:10Z',
  };

  // Keep these for list/send tests that don't use mapping
  const mockSession: ChatSession = {
    id: 'session-abc',
    meeting_id: 'meeting-123',
    status: 'active',
    turn_count: 1,
    metadata: { partner_ref: 'crm-case-4821' },
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-20T10:00:00Z',
    current_turn: mockUserTurn,
  };

  // ── createChatSession ────────────────────────────────────────────────────────

  describe('createChatSession', () => {
    it('should POST /sessions and return the new session with current_turn', async () => {
      // Mock returns raw API response; SDK maps it to domain model
      ctx.mockAxios.onPost('/sessions').reply(201, rawCreateSessionResponse);

      const session = await ctx.userClient.createChatSession({
        meeting_id: 'meeting-123',
        message: 'Summarize the key decisions from this meeting.',
        metadata: { partner_ref: 'crm-case-4821' },
      });

      expect(session.id).toBe('session-abc');
      expect(session.meeting_id).toBe('meeting-123');
      expect(session.status).toBe('active');
      expect(session.current_turn).toBeDefined();
      expect(session.current_turn!.role).toBe('user');
      expect(session.current_turn!.status).toBe('queued');
    });

    it('should send the correct request body', async () => {
      ctx.mockAxios.onPost('/sessions').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.meeting_id).toBe('meeting-123');
        expect(body.message).toBe('Hello');
        expect(body.context_document_ids).toEqual(['doc-1', 'doc-2']);
        return [201, rawCreateSessionResponse];
      });

      await ctx.userClient.createChatSession({
        meeting_id: 'meeting-123',
        message: 'Hello',
        context_document_ids: ['doc-1', 'doc-2'],
      });
    });

    it('should work without optional fields', async () => {
      ctx.mockAxios.onPost('/sessions').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.context_document_ids).toBeUndefined();
        expect(body.metadata).toBeUndefined();
        return [201, { ...rawCreateSessionResponse, metadata: undefined }];
      });

      const session = await ctx.userClient.createChatSession({
        meeting_id: 'meeting-123',
        message: 'Hello',
      });

      expect(session.id).toBe('session-abc');
    });
  });

  // ── getChatSessions ──────────────────────────────────────────────────────────

  describe('getChatSessions', () => {
    const mockList: ChatSessionListResponse = {
      items: [mockSession, { ...mockSession, id: 'session-def', status: 'closed' }],
      total: 2,
      limit: 25,
      offset: 0,
    };

    it('should GET /sessions and return a paginated list', async () => {
      ctx.mockAxios.onGet('/sessions').reply(200, mockList);

      const response = await ctx.userClient.getChatSessions();

      expect(response.items).toHaveLength(2);
      expect(response.total).toBe(2);
      expect(response.items[0].id).toBe('session-abc');
      expect(response.items[1].status).toBe('closed');
    });

    it('should pass meeting_id and status filter as query params', async () => {
      ctx.mockAxios.onGet('/sessions').reply((config) => {
        expect(config.params.meeting_id).toBe('meeting-123');
        expect(config.params.status).toBe('active');
        return [200, mockList];
      });

      await ctx.userClient.getChatSessions({ meeting_id: 'meeting-123', status: 'active' });
    });

    it('should support pagination parameters', async () => {
      ctx.mockAxios.onGet('/sessions').reply((config) => {
        expect(config.params.limit).toBe(10);
        expect(config.params.offset).toBe(20);
        return [200, { ...mockList, items: [], total: 0 }];
      });

      await ctx.userClient.getChatSessions({ limit: 10, offset: 20 });
    });

    it('should return an empty list when no sessions exist', async () => {
      ctx.mockAxios.onGet('/sessions').reply(200, { items: [], total: 0, limit: 25, offset: 0 });

      const response = await ctx.userClient.getChatSessions();

      expect(response.items).toHaveLength(0);
      expect(response.total).toBe(0);
    });
  });

  // ── getChatSession ───────────────────────────────────────────────────────────

  describe('getChatSession', () => {
    it('should GET /sessions/:id and return session with turns', async () => {
      // Mock returns raw API response with { session, turns, turn_pagination }
      ctx.mockAxios.onGet('/sessions/session-abc').reply(200, rawGetSessionResponse);

      const session = await ctx.userClient.getChatSession('session-abc');

      expect(session.id).toBe('session-abc');
      expect(session.turns).toBeDefined();
      expect(session.turns!.items).toHaveLength(2);
    });

    it('should pass include=all_turns as query param', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc').reply((config) => {
        expect(config.params.include).toBe('all_turns');
        return [200, rawGetSessionResponse];
      });

      await ctx.userClient.getChatSession('session-abc', { include: 'all_turns' });
    });

    it('should pass include=undelivered as query param', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc').reply((config) => {
        expect(config.params.include).toBe('undelivered');
        return [200, rawGetSessionResponse];
      });

      await ctx.userClient.getChatSession('session-abc', { include: 'undelivered' });
    });

    it('should support turn_limit and turn_offset pagination', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc').reply((config) => {
        expect(config.params.turn_limit).toBe(5);
        expect(config.params.turn_offset).toBe(10);
        return [200, rawGetSessionResponse];
      });

      await ctx.userClient.getChatSession('session-abc', { turn_limit: 5, turn_offset: 10 });
    });

    it('should expose agent_metadata on agent turns', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc').reply(200, rawGetSessionResponse);

      const session = await ctx.userClient.getChatSession('session-abc');
      const agentTurn = session.turns!.items[1];

      expect(agentTurn.role).toBe('agent');
      expect(agentTurn.agent_metadata!.model).toBe('gpt-4o');
      expect(agentTurn.agent_metadata!.tool_calls[0].name).toBe('search_meeting_notes');
      expect(agentTurn.agent_metadata!.token_usage.completion_tokens).toBe(128);
    });

    it('should handle a session with expired status', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc').reply(200, {
        ...rawGetSessionResponse,
        session: { ...rawGetSessionResponse.session, status: 'expired' },
      });

      const session = await ctx.userClient.getChatSession('session-abc');

      expect(session.status).toBe('expired');
    });
  });

  // ── sendChatMessage ──────────────────────────────────────────────────────────

  describe('sendChatMessage', () => {
    const mockSendResponse: SendChatMessageResponse = {
      turn: {
        id: 'turn-003',
        session_id: 'session-abc',
        sequence_number: 3,
        role: 'user',
        content: 'Create action items for each open question.',
        status: 'queued',
        created_at: '2026-03-20T10:05:00Z',
        completed_at: null,
      },
      position: 1,
      queued_turns: 1,
    };

    it('should PUT /sessions/:id and return the queued turn with queue position', async () => {
      ctx.mockAxios.onPut('/sessions/session-abc').reply(202, mockSendResponse);

      const result = await ctx.userClient.sendChatMessage('session-abc', {
        message: 'Create action items for each open question.',
      });

      expect(result.turn.id).toBe('turn-003');
      expect(result.turn.role).toBe('user');
      expect(result.turn.status).toBe('queued');
      expect(result.position).toBe(1);
      expect(result.queued_turns).toBe(1);
    });

    it('should send the message text in the request body', async () => {
      ctx.mockAxios.onPut('/sessions/session-abc').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.message).toBe('What were the action items?');
        return [202, mockSendResponse];
      });

      await ctx.userClient.sendChatMessage('session-abc', {
        message: 'What were the action items?',
      });
    });

    it('should use the correct session ID in the URL', async () => {
      ctx.mockAxios.onPut('/sessions/session-xyz').reply(202, mockSendResponse);

      await ctx.userClient.sendChatMessage('session-xyz', { message: 'Hello' });

      expect(ctx.mockAxios.history.put).toHaveLength(1);
      expect(ctx.mockAxios.history.put[0].url).toBe('/sessions/session-xyz');
    });

    it('should report queue position when multiple turns are waiting', async () => {
      ctx.mockAxios.onPut('/sessions/session-abc').reply(202, {
        ...mockSendResponse,
        position: 3,
        queued_turns: 3,
      });

      const result = await ctx.userClient.sendChatMessage('session-abc', { message: 'Third in queue' });

      expect(result.position).toBe(3);
      expect(result.queued_turns).toBe(3);
    });
  });

  // ── getChatTurn ─────────────────────────────────────────────────────────────

  describe('getChatTurn', () => {
    it('should GET /sessions/:sessionId/turns/:turnId and return the turn', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc/turns/turn-001').reply(200, { turn: mockUserTurn });

      const turn = await ctx.userClient.getChatTurn('session-abc', 'turn-001');

      expect(turn.id).toBe('turn-001');
      expect(turn.session_id).toBe('session-abc');
      expect(turn.role).toBe('user');
      expect(turn.content).toBe('Summarize the key decisions from this meeting.');
      expect(turn.status).toBe('queued');
    });

    it('should use the correct URL with session and turn IDs', async () => {
      ctx.mockAxios.onGet('/sessions/session-xyz/turns/turn-999').reply(200, { turn: mockUserTurn });

      await ctx.userClient.getChatTurn('session-xyz', 'turn-999');

      expect(ctx.mockAxios.history.get).toHaveLength(1);
      expect(ctx.mockAxios.history.get[0].url).toBe('/sessions/session-xyz/turns/turn-999');
    });

    it('should return an agent turn with metadata', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc/turns/turn-002').reply(200, { turn: mockAgentTurn });

      const turn = await ctx.userClient.getChatTurn('session-abc', 'turn-002');

      expect(turn.role).toBe('agent');
      expect(turn.status).toBe('completed');
      expect(turn.agent_metadata).toBeDefined();
      expect(turn.agent_metadata!.model).toBe('gpt-4o');
      expect(turn.agent_metadata!.tool_calls[0].name).toBe('search_meeting_notes');
      expect(turn.agent_metadata!.token_usage.prompt_tokens).toBe(512);
      expect(turn.agent_metadata!.token_usage.completion_tokens).toBe(128);
    });

    it('should return a turn with completed_at timestamp', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc/turns/turn-002').reply(200, { turn: mockAgentTurn });

      const turn = await ctx.userClient.getChatTurn('session-abc', 'turn-002');

      expect(turn.created_at).toBe('2026-03-20T10:00:05Z');
      expect(turn.completed_at).toBe('2026-03-20T10:00:10Z');
    });

    it('should return a turn with null completed_at when still processing', async () => {
      ctx.mockAxios.onGet('/sessions/session-abc/turns/turn-001').reply(200, { turn: mockUserTurn });

      const turn = await ctx.userClient.getChatTurn('session-abc', 'turn-001');

      expect(turn.completed_at).toBeNull();
    });
  });
});

