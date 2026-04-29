/**
 * Deep linking utilities for the Contio Partner SDK
 *
 * Build URLs that open specific pages in the Contio app via the `/open/{path}`
 * launcher route. The launcher attempts to hand off to the desktop app; if
 * the app isn't installed a branded fallback card offers "Open in App" and
 * "Continue in Browser" CTAs.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Common settings page sections */
export type SettingsSection = 'calendars' | 'users' | 'billing' | (string & {});

/** Options for building a chat deep link */
export interface ChatDeepLinkOptions {
  /** Pre-fill the AI chat input with this message (not submitted automatically) */
  message?: string;
}

/** Options for {@link buildAppDeepLink} */
export interface AppDeepLinkOptions {
  /**
   * App path to deep-link to (e.g. `/settings/calendars`, `/meetings/abc-123`).
   * Leading slash is optional — it will be normalised.
   */
  path?: string;
  /** Query parameters forwarded to both the desktop deep link and browser fallback */
  queryParams?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalise an app path:
 *  - Ensure it starts with exactly one `/`
 *  - Collapse leading slashes to prevent protocol-relative redirects
 */
function normalisePath(raw: string): string {
  return '/' + raw.replace(/^\/+/, '');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const DEFAULT_BASE_URL = 'https://app.contio.ai';

/**
 * Build a `/open/{path}` deep-link URL for any page in the Contio app.
 *
 * @param options - Path and optional query parameters
 * @param baseURL - Override the default `https://app.contio.ai` base
 * @returns Fully-qualified URL (e.g. `https://app.contio.ai/open/settings/calendars`)
 *
 * @example
 * ```typescript
 * buildAppDeepLink({ path: '/settings/calendars' });
 * // https://app.contio.ai/open/settings/calendars
 *
 * buildAppDeepLink({ path: '/templates', queryParams: { tab: 'vertical' } });
 * // https://app.contio.ai/open/templates?tab=vertical
 *
 * buildAppDeepLink({ path: '/meetings/abc-123' });
 * // https://app.contio.ai/open/meetings/abc-123
 * ```
 */
export function buildAppDeepLink(
  options: AppDeepLinkOptions = {},
  baseURL?: string,
): string {
  const base = baseURL || DEFAULT_BASE_URL;
  const path = normalisePath(options.path || '/');

  // /open + normalised path  (normalisePath always starts with `/`)
  const url = new URL(`/open${path}`, base);

  if (options.queryParams) {
    for (const [key, value] of Object.entries(options.queryParams)) {
      if (value !== '') url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

/**
 * Build a deep-link URL to a settings page.
 *
 * @param section - Settings section (e.g. `'calendars'`, `'users'`, `'billing'`)
 * @param baseURL - Override the default base URL
 *
 * @example
 * ```typescript
 * buildSettingsLink('calendars');
 * // https://app.contio.ai/open/settings/calendars
 * ```
 */
export function buildSettingsLink(section: SettingsSection, baseURL?: string): string {
  return buildAppDeepLink({ path: `/settings/${section}` }, baseURL);
}

/**
 * Build a deep-link URL that opens a fresh AI chat sidebar, optionally
 * pre-filling the input with a message (the message is **not** submitted
 * automatically — the user can review before sending).
 *
 * @param options - Optional chat configuration
 * @param baseURL - Override the default base URL
 *
 * @example
 * ```typescript
 * buildChatLink();
 * // https://app.contio.ai/open/?chat=new
 *
 * buildChatLink({ message: 'Summarize my meetings this week' });
 * // https://app.contio.ai/open/?chat=new&chatMessage=Summarize+my+meetings+this+week
 * ```
 */
export function buildChatLink(options?: ChatDeepLinkOptions, baseURL?: string): string {
  const queryParams: Record<string, string> = { chat: 'new' };
  if (options?.message) {
    queryParams.chatMessage = options.message;
  }
  return buildAppDeepLink({ path: '/', queryParams }, baseURL);
}
