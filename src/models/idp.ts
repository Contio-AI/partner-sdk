/**
 * IdP (Identity Provider) configuration type definitions for the Contio Partner API
 */

/**
 * IdP configuration for a partner app
 * Represents the OIDC identity provider settings
 */
export interface PartnerIdPConfig {
  id: string;
  partner_app_id: string;
  /** Display name for this IdP configuration */
  name: string;
  /** IdP type (always "oidc") */
  type: 'oidc';
  /** OIDC discovery endpoint URL */
  discovery_url: string;
  /**
   * OAuth Client ID from your Identity Provider (e.g., Okta, Azure AD).
   * Note: The client_secret is never returned in responses.
   */
  idp_client_id: string;
  /** OIDC scopes requested during authentication */
  scopes: string[];
  /** Maps Contio user fields to IdP claim names */
  claim_mappings: Record<string, string>;
  /** Domain validation mode */
  mode: 'strict' | 'partner_managed';
  /** Email domains allowed for SSO */
  allowed_email_domains: string[] | null;
  /** Whether this IdP configuration is active */
  is_active: boolean;
  /** Discovered OIDC issuer */
  issuer: string | null;
  /** Discovered OIDC authorization endpoint */
  authorization_endpoint: string | null;
  /** Discovered OIDC token endpoint */
  token_endpoint: string | null;
  /** Discovered OIDC userinfo endpoint */
  userinfo_endpoint: string | null;
  /** Discovered OIDC JWKS URI */
  jwks_uri: string | null;
  /** When the OIDC discovery document was last fetched */
  discovery_last_fetched_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Request to create an IdP configuration.
 *
 * IMPORTANT: The idp_client_id and idp_client_secret are the OIDC credentials from your
 * Identity Provider (e.g., Okta, Azure AD, Auth0), NOT your Contio Partner OAuth credentials.
 */
export interface CreateIdPConfigRequest {
  /** Display name for this IdP configuration */
  name: string;
  /** OIDC discovery endpoint URL from your Identity Provider (should end with /.well-known/openid-configuration) */
  discovery_url: string;
  /**
   * OAuth Client ID from your Identity Provider's OIDC application.
   * This is NOT your Contio Partner client_id.
   */
  idp_client_id: string;
  /**
   * OAuth Client Secret from your Identity Provider's OIDC application.
   * This is NOT your Contio Partner client_secret. Stored encrypted at rest.
   */
  idp_client_secret: string;
  /** OIDC scopes to request during authentication. Defaults to ["openid", "email", "profile"] */
  scopes?: string[];
  /** Maps Contio user fields to IdP claim names. Defaults to {"email": "email", "name": "name"} */
  claim_mappings?: Record<string, string>;
  /** Domain validation mode: "strict" requires allowed_email_domains, "partner_managed" trusts your IdP */
  mode: 'strict' | 'partner_managed';
  /** Email domains allowed for SSO (required for strict mode) */
  allowed_email_domains?: string[];
}

/**
 * Request to update an IdP configuration.
 *
 * IMPORTANT: The idp_client_id and idp_client_secret are the OIDC credentials from your
 * Identity Provider (e.g., Okta, Azure AD, Auth0), NOT your Contio Partner OAuth credentials.
 */
export interface UpdateIdPConfigRequest {
  /** Display name for this IdP configuration */
  name?: string;
  /** OIDC discovery endpoint URL from your Identity Provider */
  discovery_url?: string;
  /**
   * OAuth Client ID from your Identity Provider's OIDC application.
   * This is NOT your Contio Partner client_id.
   */
  idp_client_id?: string;
  /**
   * OAuth Client Secret from your Identity Provider's OIDC application.
   * This is NOT your Contio Partner client_secret. Stored encrypted at rest.
   */
  idp_client_secret?: string;
  /** OIDC scopes to request during authentication */
  scopes?: string[];
  /** Maps Contio user fields to IdP claim names */
  claim_mappings?: Record<string, string>;
  /** Domain validation mode: "strict" or "partner_managed" */
  mode?: 'strict' | 'partner_managed';
  /** Email domains allowed for SSO (required for strict mode) */
  allowed_email_domains?: string[];
  /** Enable or disable this IdP configuration */
  is_active?: boolean;
}

/**
 * SSO target platform
 * - 'web': Redirect to Contio web app (default)
 * - 'desktop': Open Contio desktop app at root
 * - 'backlog': Deep link to backlog view in desktop
 * - 'meeting:{id}': Deep link to specific meeting in desktop (use buildMeetingTarget helper)
 */
export type SSOTarget = 'web' | 'desktop' | 'backlog' | `meeting:${string}`;

/**
 * Helper to create a meeting target string
 * @param meetingId - The UUID of the meeting to open
 * @returns A properly formatted meeting target string
 *
 * @example
 * ```typescript
 * const target = buildMeetingTarget('550e8400-e29b-41d4-a716-446655440000');
 * // Returns: 'meeting:550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
export function buildMeetingTarget(meetingId: string): SSOTarget {
  return `meeting:${meetingId}`;
}

/**
 * Options for building SSO entry URL
 */
export interface SSOEntryUrlOptions {
  /** Partner app slug (e.g., 'acme-corp') */
  slug: string;
  /** Target platform after authentication */
  target?: SSOTarget;
  /** Pre-fill the user's email address (passed to IdP if supported) */
  loginHint?: string;
  /** If true, skip the landing page UI and immediately initiate SSO */
  auto?: boolean;
}
