/**
 * Unit tests for SSO helper utilities
 */

import { buildSSOEntryUrl, buildMeetingTarget } from '../src/sso';
import type { SSOEntryUrlOptions, SSOTarget } from '../src/models';

describe('buildSSOEntryUrl', () => {
  describe('with minimal options', () => {
    it('should build URL with only slug', () => {
      const url = buildSSOEntryUrl({ slug: 'acme-corp' });

      expect(url).toBe('https://app.contio.ai/p/acme-corp');
    });

    it('should handle slug with special characters', () => {
      const url = buildSSOEntryUrl({ slug: 'acme-corp-123' });

      expect(url).toBe('https://app.contio.ai/p/acme-corp-123');
    });
  });

  describe('with target parameter', () => {
    it('should include target=web in URL', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: 'web',
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?target=web');
    });

    it('should include target=desktop in URL', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: 'desktop',
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?target=desktop');
    });
  });

  describe('with loginHint parameter', () => {
    it('should include login_hint in URL', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        loginHint: 'user@example.com',
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?login_hint=user%40example.com');
    });

    it('should properly encode special characters in loginHint', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        loginHint: 'user+test@example.com',
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?login_hint=user%2Btest%40example.com');
    });
  });

  describe('with multiple parameters', () => {
    it('should include both target and loginHint', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: 'desktop',
        loginHint: 'user@example.com',
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?target=desktop&login_hint=user%40example.com');
    });

    it('should include target=web and loginHint', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: 'web',
        loginHint: 'admin@acme.com',
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?target=web&login_hint=admin%40acme.com');
    });
  });

  describe('with custom baseURL', () => {
    it('should use custom baseURL', () => {
      const url = buildSSOEntryUrl(
        { slug: 'acme-corp' },
        'https://staging.contio.ai'
      );

      expect(url).toBe('https://staging.contio.ai/p/acme-corp');
    });

    it('should use custom baseURL with target', () => {
      const url = buildSSOEntryUrl(
        { slug: 'acme-corp', target: 'desktop' },
        'https://staging.contio.ai'
      );

      expect(url).toBe('https://staging.contio.ai/p/acme-corp?target=desktop');
    });

    it('should use custom baseURL with all parameters', () => {
      const url = buildSSOEntryUrl(
        {
          slug: 'acme-corp',
          target: 'web',
          loginHint: 'user@example.com',
        },
        'https://localhost:3000'
      );

      expect(url).toBe('https://localhost:3000/p/acme-corp?target=web&login_hint=user%40example.com');
    });

    it('should handle baseURL with trailing slash', () => {
      const url = buildSSOEntryUrl(
        { slug: 'acme-corp' },
        'https://staging.contio.ai/'
      );

      expect(url).toBe('https://staging.contio.ai/p/acme-corp');
    });
  });

  describe('default baseURL', () => {
    it('should use https://app.contio.ai as default', () => {
      const url = buildSSOEntryUrl({ slug: 'test-partner' });

      expect(url.startsWith('https://app.contio.ai/')).toBe(true);
    });

    it('should not use api.contio.ai as default', () => {
      const url = buildSSOEntryUrl({ slug: 'test-partner' });

      expect(url.includes('api.contio.ai')).toBe(false);
    });
  });

  describe('type safety', () => {
    it('should accept valid SSOTarget values', () => {
      const webOptions: SSOEntryUrlOptions = {
        slug: 'test',
        target: 'web',
      };
      const desktopOptions: SSOEntryUrlOptions = {
        slug: 'test',
        target: 'desktop',
      };

      expect(buildSSOEntryUrl(webOptions)).toContain('target=web');
      expect(buildSSOEntryUrl(desktopOptions)).toContain('target=desktop');
    });

    it('should handle undefined optional parameters', () => {
      const options: SSOEntryUrlOptions = {
        slug: 'test',
        target: undefined,
        loginHint: undefined,
      };

      const url = buildSSOEntryUrl(options);

      expect(url).toBe('https://app.contio.ai/p/test');
      expect(url.includes('?')).toBe(false);
    });
  });

  describe('with auto parameter', () => {
    it('should include auto=true when auto is true', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        auto: true,
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?auto=true');
    });

    it('should not include auto when auto is false', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        auto: false,
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp');
      expect(url.includes('auto')).toBe(false);
    });

    it('should include auto with other parameters', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: 'desktop',
        loginHint: 'user@example.com',
        auto: true,
      });

      expect(url).toContain('target=desktop');
      expect(url).toContain('login_hint=user%40example.com');
      expect(url).toContain('auto=true');
    });
  });

  describe('with backlog target', () => {
    it('should include target=backlog in URL', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: 'backlog',
      });

      expect(url).toBe('https://app.contio.ai/p/acme-corp?target=backlog');
    });

    it('should work with auto and loginHint', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: 'backlog',
        auto: true,
        loginHint: 'user@example.com',
      });

      expect(url).toContain('target=backlog');
      expect(url).toContain('auto=true');
      expect(url).toContain('login_hint=user%40example.com');
    });
  });

  describe('with meeting target', () => {
    it('should include meeting:{id} target in URL', () => {
      const meetingId = '550e8400-e29b-41d4-a716-446655440000';
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: `meeting:${meetingId}`,
      });

      expect(url).toContain('target=meeting%3A550e8400-e29b-41d4-a716-446655440000');
    });

    it('should work with buildMeetingTarget helper', () => {
      const meetingId = '550e8400-e29b-41d4-a716-446655440000';
      const target = buildMeetingTarget(meetingId);

      expect(target).toBe(`meeting:${meetingId}`);

      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target,
      });

      expect(url).toContain('target=meeting%3A');
      expect(url).toContain(meetingId);
    });

    it('should work with auto and loginHint', () => {
      const url = buildSSOEntryUrl({
        slug: 'acme-corp',
        target: buildMeetingTarget('test-meeting-id'),
        auto: true,
        loginHint: 'user@example.com',
      });

      expect(url).toContain('target=meeting%3Atest-meeting-id');
      expect(url).toContain('auto=true');
      expect(url).toContain('login_hint=user%40example.com');
    });
  });
});

describe('buildMeetingTarget', () => {
  it('should create meeting target string', () => {
    const target = buildMeetingTarget('abc-123');
    expect(target).toBe('meeting:abc-123');
  });

  it('should work with UUID', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const target = buildMeetingTarget(uuid);
    expect(target).toBe(`meeting:${uuid}`);
  });

  it('should return SSOTarget type', () => {
    const target: SSOTarget = buildMeetingTarget('test-id');
    expect(typeof target).toBe('string');
    expect(target.startsWith('meeting:')).toBe(true);
  });
});
