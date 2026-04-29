/**
 * Unit tests for deep-link helper utilities
 */

import {
  buildAppDeepLink,
  buildSettingsLink,
  buildChatLink,
} from '../src/deepLinks';
import type { AppDeepLinkOptions, ChatDeepLinkOptions } from '../src/deepLinks';

describe('buildAppDeepLink', () => {
  describe('with path only', () => {
    it('should build URL for a settings page', () => {
      const url = buildAppDeepLink({ path: '/settings/calendars' });

      expect(url).toBe('https://app.contio.ai/open/settings/calendars');
    });

    it('should build URL for a nested path', () => {
      const url = buildAppDeepLink({ path: '/meetings/abc-123' });

      expect(url).toBe('https://app.contio.ai/open/meetings/abc-123');
    });

    it('should handle path without leading slash', () => {
      const url = buildAppDeepLink({ path: 'settings/users' });

      expect(url).toBe('https://app.contio.ai/open/settings/users');
    });

    it('should default to root when no path provided', () => {
      const url = buildAppDeepLink();

      expect(url).toBe('https://app.contio.ai/open/');
    });

    it('should default to root when empty options provided', () => {
      const url = buildAppDeepLink({});

      expect(url).toBe('https://app.contio.ai/open/');
    });
  });

  describe('with query parameters', () => {
    it('should include query parameters', () => {
      const url = buildAppDeepLink({
        path: '/templates',
        queryParams: { tab: 'vertical' },
      });

      expect(url).toBe('https://app.contio.ai/open/templates?tab=vertical');
    });

    it('should encode special characters in query values', () => {
      const url = buildAppDeepLink({
        path: '/',
        queryParams: { message: 'hello world' },
      });

      expect(url).toContain('message=hello+world');
    });

    it('should omit empty-string query values', () => {
      const url = buildAppDeepLink({
        path: '/settings',
        queryParams: { tab: 'billing', empty: '' },
      });

      expect(url).toContain('tab=billing');
      expect(url).not.toContain('empty');
    });

    it('should handle multiple query parameters', () => {
      const url = buildAppDeepLink({
        path: '/',
        queryParams: { chat: 'new', chatMessage: 'Hi there' },
      });

      expect(url).toContain('chat=new');
      expect(url).toContain('chatMessage=Hi+there');
    });
  });

  describe('path normalisation', () => {
    it('should collapse double slashes to prevent open redirects', () => {
      const url = buildAppDeepLink({ path: '//evil.com' });

      expect(url).toBe('https://app.contio.ai/open/evil.com');
      expect(url).not.toContain('//evil.com');
    });

    it('should collapse triple slashes', () => {
      const url = buildAppDeepLink({ path: '///evil.com' });

      expect(url).toBe('https://app.contio.ai/open/evil.com');
    });

    it('should handle empty path', () => {
      const url = buildAppDeepLink({ path: '' });

      expect(url).toBe('https://app.contio.ai/open/');
    });

    it('should handle slash-only path', () => {
      const url = buildAppDeepLink({ path: '/' });

      expect(url).toBe('https://app.contio.ai/open/');
    });
  });

  describe('with custom baseURL', () => {
    it('should use custom baseURL', () => {
      const url = buildAppDeepLink(
        { path: '/settings/calendars' },
        'https://staging.contio.ai',
      );

      expect(url).toBe('https://staging.contio.ai/open/settings/calendars');
    });

    it('should handle baseURL with trailing slash', () => {
      const url = buildAppDeepLink(
        { path: '/settings/users' },
        'https://staging.contio.ai/',
      );

      expect(url).toBe('https://staging.contio.ai/open/settings/users');
    });

    it('should use custom baseURL with query params', () => {
      const url = buildAppDeepLink(
        { path: '/', queryParams: { chat: 'new' } },
        'https://dev.contio.ai',
      );

      expect(url).toBe('https://dev.contio.ai/open/?chat=new');
    });
  });

  describe('default baseURL', () => {
    it('should use https://app.contio.ai as default', () => {
      const url = buildAppDeepLink({ path: '/test' });

      expect(url.startsWith('https://app.contio.ai/')).toBe(true);
    });
  });

  describe('type safety', () => {
    it('should accept valid AppDeepLinkOptions', () => {
      const options: AppDeepLinkOptions = {
        path: '/settings/calendars',
        queryParams: { tab: 'google' },
      };

      const url = buildAppDeepLink(options);
      expect(url).toContain('/open/settings/calendars');
      expect(url).toContain('tab=google');
    });
  });
});

describe('buildSettingsLink', () => {
  it('should build link for calendars section', () => {
    const url = buildSettingsLink('calendars');

    expect(url).toBe('https://app.contio.ai/open/settings/calendars');
  });

  it('should build link for users section', () => {
    const url = buildSettingsLink('users');

    expect(url).toBe('https://app.contio.ai/open/settings/users');
  });

  it('should build link for billing section', () => {
    const url = buildSettingsLink('billing');

    expect(url).toBe('https://app.contio.ai/open/settings/billing');
  });

  it('should accept arbitrary section strings', () => {
    const url = buildSettingsLink('integrations');

    expect(url).toBe('https://app.contio.ai/open/settings/integrations');
  });

  it('should use custom baseURL', () => {
    const url = buildSettingsLink('calendars', 'https://staging.contio.ai');

    expect(url).toBe('https://staging.contio.ai/open/settings/calendars');
  });
});

describe('buildChatLink', () => {
  it('should build chat link without message', () => {
    const url = buildChatLink();

    expect(url).toBe('https://app.contio.ai/open/?chat=new');
  });

  it('should build chat link with empty options', () => {
    const url = buildChatLink({});

    expect(url).toBe('https://app.contio.ai/open/?chat=new');
  });

  it('should include chatMessage when message provided', () => {
    const url = buildChatLink({ message: 'Summarize my meetings' });

    expect(url).toContain('chat=new');
    expect(url).toContain('chatMessage=Summarize+my+meetings');
  });

  it('should encode special characters in message', () => {
    const url = buildChatLink({ message: 'What happened in Q1 & Q2?' });

    expect(url).toContain('chat=new');
    expect(url).toContain('chatMessage=');
    // Should be URL-encoded
    expect(url).not.toContain('&Q2');
  });

  it('should use custom baseURL', () => {
    const url = buildChatLink(undefined, 'https://dev.contio.ai');

    expect(url).toBe('https://dev.contio.ai/open/?chat=new');
  });

  it('should use custom baseURL with message', () => {
    const url = buildChatLink(
      { message: 'Hello' },
      'https://staging.contio.ai',
    );

    expect(url).toContain('https://staging.contio.ai/open/');
    expect(url).toContain('chat=new');
    expect(url).toContain('chatMessage=Hello');
  });

  describe('type safety', () => {
    it('should accept valid ChatDeepLinkOptions', () => {
      const options: ChatDeepLinkOptions = { message: 'test' };
      const url = buildChatLink(options);

      expect(url).toContain('chatMessage=test');
    });
  });
});
