/**
 * SSO (Single Sign-On) helper utilities for the Contio Partner SDK
 */

import { SSOEntryUrlOptions, SSOTarget, buildMeetingTarget } from './models';

// Re-export types for convenience
export { SSOTarget, SSOEntryUrlOptions, buildMeetingTarget };

/**
 * Build the SSO entry URL for a partner
 * Partners redirect users to this URL to initiate SSO
 *
 * @param options - SSO entry URL options including slug, target, loginHint, and auto
 * @param baseURL - Optional base URL (defaults to https://app.contio.ai)
 * @returns The complete SSO entry URL
 *
 * @example
 * ```typescript
 * // Basic usage - shows landing page, redirects to web
 * const url = buildSSOEntryUrl({ slug: 'acme-corp' });
 * // Returns: https://app.contio.ai/p/acme-corp
 *
 * // Auto-redirect to IdP (no landing page), open desktop app
 * const url = buildSSOEntryUrl({
 *   slug: 'acme-corp',
 *   target: 'desktop',
 *   loginHint: 'user@example.com',
 *   auto: true
 * });
 * // Returns: https://app.contio.ai/p/acme-corp?target=desktop&login_hint=...&auto=true
 *
 * // Deep link to a specific meeting
 * import { buildMeetingTarget } from '@contio/partner-sdk';
 * const url = buildSSOEntryUrl({
 *   slug: 'acme-corp',
 *   target: buildMeetingTarget('550e8400-e29b-41d4-a716-446655440000'),
 *   auto: true
 * });
 *
 * // Deep link to backlog view
 * const url = buildSSOEntryUrl({
 *   slug: 'acme-corp',
 *   target: 'backlog',
 *   auto: true
 * });
 * ```
 */
export function buildSSOEntryUrl(options: SSOEntryUrlOptions, baseURL?: string): string {
  const base = baseURL || 'https://app.contio.ai';
  const url = new URL(`/p/${options.slug}`, base);

  if (options.target) {
    url.searchParams.set('target', options.target);
  }
  if (options.loginHint) {
    url.searchParams.set('login_hint', options.loginHint);
  }
  if (options.auto) {
    url.searchParams.set('auto', 'true');
  }

  return url.toString();
}

/**
 * SSO initiation response from the API
 */
export interface SSOInitiateResponse {
  /** Authorization URL to redirect the user to */
  authorization_url: string;
  /** Session ID for tracking the SSO flow */
  session_id: string;
}

/**
 * SSO session status response
 */
export interface SSOSessionStatusResponse {
  /** Status of the SSO session: 'pending', 'completed', 'failed', 'expired' */
  status: string;
  /** User ID if authentication completed successfully */
  user_id?: string;
  /** Target platform that was requested */
  target?: string;
  /** Error message if authentication failed */
  error?: string;
}

/**
 * Partner SSO info response (public endpoint)
 */
export interface PartnerSSOInfoResponse {
  /** Partner slug */
  slug: string;
  /** Partner display name */
  name: string;
  /** Co-branded name (if configured) */
  co_brand_name?: string;
  /** Co-branded logo URL (if configured) */
  co_brand_logo_url?: string;
  /** Whether the partner has IdP configuration */
  has_idp_config: boolean;
  /** Whether the partner IdP is active */
  is_active: boolean;
}
