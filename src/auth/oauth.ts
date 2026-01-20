/**
 * OAuth 2.0 authentication implementation for Contio Partner API
 */

import axios, { AxiosInstance } from 'axios';
import https from 'https';
import qs from 'qs';
import { OAuthConfig, OAuthTokenResponse, AuthTokens } from '../models/auth';

/**
 * Options for generating the authorization URL
 */
export interface AuthorizationUrlOptions {
  /** Pre-fill and lock the email field on the login page */
  loginHint?: string;
}

/**
 * OAuth 2.0 client for Contio Partner API authentication.
 *
 * Supports authorization code flow, client credentials, token refresh,
 * and token introspection. Tokens are opaque (not JWTs) for security.
 *
 * @example
 * ```typescript
 * const oauth = new OAuthClient({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   redirectUri: 'https://your-app.com/callback',
 *   scope: ['openid', 'profile', 'meetings:read', 'meetings:write']
 * });
 *
 * // Generate authorization URL
 * const authUrl = oauth.getAuthorizationUrl(crypto.randomUUID());
 *
 * // After callback, exchange code for tokens
 * const tokens = await oauth.exchangeCodeForToken(code);
 * ```
 */
export class OAuthClient {
  private config: OAuthConfig;
  private tokens?: AuthTokens;
  private axiosInstance: AxiosInstance;

  /**
   * Create a new OAuthClient instance.
   *
   * @param config - OAuth configuration
   * @param config.clientId - Your partner app's client ID
   * @param config.clientSecret - Your partner app's client secret
   * @param config.redirectUri - Registered redirect URI for callbacks
   * @param config.scope - OAuth scopes to request (default: openid profile meetings:read meetings:write)
   * @param config.authorizationUrl - Custom authorization endpoint (optional)
   * @param config.tokenUrl - Custom token endpoint (optional)
   */
  constructor(config: OAuthConfig) {
    this.config = {
      authorizationUrl: 'https://auth.contio.ai/oauth2/authorize',
      tokenUrl: 'https://auth.contio.ai/oauth2/token',
      ...config,
    };

    // Configure axios with SSL handling for local development
    const axiosConfig: {
      headers: Record<string, string>;
      httpsAgent?: https.Agent;
    } = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    // In development, allow self-signed certificates
    // Check if we're using a local development domain
    const isLocalDev = this.config.tokenUrl?.includes('.lan.contio.ai') ||
                       this.config.tokenUrl?.includes('localhost') ||
                       this.config.tokenUrl?.includes('local.');

    if (isLocalDev) {
      axiosConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });
    }

    this.axiosInstance = axios.create(axiosConfig);
  }


  /**
   * Generate the authorization URL for OAuth flow
   *
   * @param state - Optional CSRF protection state parameter
   * @param options - Optional additional parameters (e.g., loginHint to pre-fill email)
   * @returns The authorization URL to redirect users to
   *
   * @example
   * // Basic usage
   * const url = oauth.getAuthorizationUrl('random-state');
   *
   * // With login_hint to pre-fill and lock email
   * const url = oauth.getAuthorizationUrl('random-state', {
   *   loginHint: 'user@example.com'
   * });
   */
  getAuthorizationUrl(state?: string, options?: AuthorizationUrlOptions): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope?.join(' ') || 'openid profile meetings:read meetings:write',
      ...(state && { state }),
      ...(options?.loginHint && { login_hint: options.loginHint }),
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Exchange an authorization code for access and refresh tokens.
   *
   * Call this after the user is redirected back to your app with an authorization code.
   * The tokens are automatically stored in the client for subsequent API calls.
   *
   * @param code - The authorization code from the callback URL query parameter
   * @returns The token set including access token, refresh token, and expiration
   * @throws {Error} If the code is invalid, expired, or already used
   *
   * @example
   * ```typescript
   * // In your callback handler
   * const code = req.query.code as string;
   * const tokens = await oauth.exchangeCodeForToken(code);
   *
   * // Store tokens securely for later use
   * await storeTokens(userId, tokens);
   * ```
   */
  async exchangeCodeForToken(code: string): Promise<AuthTokens> {
    try {
      // Use Basic Auth for client authentication (client_secret_basic)
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.post<OAuthTokenResponse>(
        this.config.tokenUrl || 'https://auth.contio.ai/oauth2/token',
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUri,
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      this.tokens = this.parseTokenResponse(response.data);
      return this.tokens;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to exchange code for token: ${message}`);
    }
  }

  /**
   * Refresh the access token using a refresh token.
   *
   * Access tokens expire after 24 hours. Use this method to get a new access token
   * without requiring the user to re-authorize. Refresh tokens are valid for 30 days.
   *
   * @param refreshToken - Optional refresh token; uses stored token if not provided
   * @returns New token set with fresh access token
   * @throws {Error} If no refresh token is available or the token is invalid/expired
   *
   * @example
   * ```typescript
   * // Proactively refresh before expiration
   * if (oauth.isTokenExpired()) {
   *   const newTokens = await oauth.refreshAccessToken();
   *   await storeTokens(userId, newTokens);
   * }
   * ```
   */
  async refreshAccessToken(refreshToken?: string): Promise<AuthTokens> {
    const tokenToUse = refreshToken || this.tokens?.refreshToken;

    if (!tokenToUse) {
      throw new Error('No refresh token available');
    }

    try {
      // Use Basic Auth for client authentication (client_secret_basic)
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.post<OAuthTokenResponse>(
        this.config.tokenUrl || 'https://auth.contio.ai/oauth2/token',
        qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: tokenToUse,
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      this.tokens = this.parseTokenResponse(response.data);
      return this.tokens;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to refresh token: ${message}`);
    }
  }

  /**
   * Get an access token using client credentials grant.
   *
   * Use this for server-to-server authentication where no user context is needed.
   * This is typically used for admin operations or background jobs.
   *
   * @param scope - Optional scopes to request; uses configured scopes if not provided
   * @returns Token set (no refresh token for client credentials)
   * @throws {Error} If authentication fails
   *
   * @example
   * ```typescript
   * const tokens = await oauth.getClientCredentialsToken(['admin:read']);
   * ```
   */
  async getClientCredentialsToken(scope?: string[]): Promise<AuthTokens> {
    try {
      // Use Basic Auth for client authentication (client_secret_basic)
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.post<OAuthTokenResponse>(
        this.config.tokenUrl || 'https://auth.contio.ai/oauth2/token',
        qs.stringify({
          grant_type: 'client_credentials',
          scope: scope?.join(' ') || this.config.scope?.join(' '),
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      this.tokens = this.parseTokenResponse(response.data);
      return this.tokens;
    } catch (error) {
      throw new Error(`Failed to get client credentials token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Revoke an access or refresh token.
   *
   * Use this when a user disconnects your app or you need to invalidate tokens.
   * Revoked tokens cannot be used for API calls.
   *
   * @param token - The token to revoke
   * @param tokenType - Type of token: 'access_token' or 'refresh_token' (default: 'access_token')
   * @throws {Error} If revocation fails
   *
   * @example
   * ```typescript
   * // Revoke when user disconnects
   * await oauth.revokeToken(tokens.accessToken, 'access_token');
   * await oauth.revokeToken(tokens.refreshToken, 'refresh_token');
   * ```
   */
  async revokeToken(token: string, tokenType: 'access_token' | 'refresh_token' = 'access_token'): Promise<void> {
    try {
      // Use Basic Auth for client authentication (client_secret_basic)
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      await this.axiosInstance.post(
        `${this.config.tokenUrl?.replace('/token', '/revoke')}`,
        qs.stringify({
          token,
          token_type_hint: tokenType,
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
    } catch (error) {
      throw new Error(`Failed to revoke token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the current access token stored in the client.
   *
   * @returns The access token, or undefined if not authenticated
   */
  getAccessToken(): string | undefined {
    return this.tokens?.accessToken;
  }

  /**
   * Set tokens directly from storage.
   *
   * Use this to restore tokens from your secure storage when initializing
   * the client for a returning user.
   *
   * @param tokens - Previously stored token set
   *
   * @example
   * ```typescript
   * // Restore tokens from database
   * const storedTokens = await getStoredTokens(userId);
   * oauth.setTokens(storedTokens);
   *
   * // Now the client can make authenticated requests
   * const meetings = await user.getMeetings();
   * ```
   */
  setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
  }

  /**
   * Check if the current access token is expired.
   *
   * @returns true if the token is expired or expiration is unknown, false otherwise
   */
  isTokenExpired(): boolean {
    if (!this.tokens?.expiresAt) {
      return false;
    }
    return new Date() >= this.tokens.expiresAt;
  }

  /**
   * Initiate partner passwordless authentication.
   *
   * Starts the passwordless login flow by sending a verification code to the user's email.
   * Use this for embedded authentication flows within your app.
   *
   * @param email - User's email address
   * @param name - Optional user's name (used for new user provisioning)
   * @returns Session info for completing authentication
   * @throws {Error} If initiation fails
   */
  async initiatePartnerAuth(email: string, name?: string): Promise<{
    session: string;
    challengeName: string;
    challengeParams?: Record<string, string>;
    userProvisioned?: boolean;
  }> {
    try {
      // Use Basic Auth for client authentication
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.post(
        `${this.config.authorizationUrl?.replace('/oauth2/authorize', '/auth/initiate')}`,
        {
          client_id: this.config.clientId,
          email,
          ...(name && { name }),
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to initiate partner authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify partner passwordless authentication.
   *
   * Completes the passwordless login flow by verifying the code sent to the user's email.
   *
   * @param email - User's email address
   * @param code - Verification code from email
   * @param session - Session ID from initiatePartnerAuth
   * @returns Redirect URL to complete OAuth flow
   * @throws {Error} If verification fails or code is invalid
   */
  async verifyPartnerAuth(email: string, code: string, session: string): Promise<{
    redirectUrl?: string;
  }> {
    try {
      // Use Basic Auth for client authentication
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.post(
        `${this.config.authorizationUrl?.replace('/oauth2/authorize', '/auth/verify')}`,
        {
          client_id: this.config.clientId,
          email,
          code,
          session,
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to verify partner authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a user has already granted consent for the requested scopes.
   *
   * Use this to determine if you can skip the consent screen for returning users.
   *
   * @param email - User's email address
   * @returns Consent status and optional redirect URL
   * @throws {Error} If the check fails
   */
  async checkConsent(email: string): Promise<{
    hasConsent: boolean;
    requiresConsent: boolean;
    redirectUrl?: string;
  }> {
    try {
      // Use Basic Auth for client authentication
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.post(
        `${this.config.authorizationUrl?.replace('/oauth2/authorize', '/oauth2/check-consent')}`,
        {
          client_id: this.config.clientId,
          email,
          scope: this.config.scope?.join(' ') || 'openid profile meetings:read meetings:write',
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to check consent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get public partner app information.
   *
   * This endpoint does not require authentication and is safe to call from frontend code.
   * Use it to display partner branding on login screens.
   *
   * @returns Partner app public information (name, logo, etc.)
   * @throws {Error} If the partner app is not found
   */
  async getPartnerInfo(): Promise<{
    name: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
  }> {
    try {
      const response = await this.axiosInstance.get(
        `${this.config.authorizationUrl?.replace('/oauth2/authorize', `/v1/partner/info/${this.config.clientId}/public`)}`
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get partner info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the list of available OAuth scopes.
   *
   * @returns Array of available scope strings
   * @throws {Error} If the request fails
   */
  async getAvailableScopes(): Promise<string[]> {
    try {
      // Use Basic Auth for client authentication
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.get(
        `${this.config.authorizationUrl?.replace('/oauth2/authorize', '/oauth2/scopes')}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
          }
        }
      );

      return response.data.scopes || [];
    } catch (error) {
      throw new Error(`Failed to get available scopes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Introspect an access token to check its validity and metadata.
   *
   * Since Contio uses opaque tokens (not JWTs), you cannot decode them locally.
   * Use this method to check if a token is still valid and get its metadata.
   *
   * @param token - The access token to introspect
   * @returns Token metadata including active status, scopes, and expiration
   * @throws {Error} If introspection fails
   *
   * @example
   * ```typescript
   * const info = await oauth.introspectToken(accessToken);
   * if (!info.active) {
   *   // Token is expired or revoked, refresh it
   *   await oauth.refreshAccessToken();
   * }
   * console.log('Scopes:', info.scope);
   * console.log('Expires:', new Date(info.exp * 1000));
   * ```
   */
  async introspectToken(token: string): Promise<{
    active: boolean;
    scope?: string;
    clientId?: string;
    username?: string;
    exp?: number;
    iat?: number;
  }> {
    try {
      // Use Basic Auth for client authentication
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await this.axiosInstance.post(
        `${this.config.authorizationUrl?.replace('/oauth2/authorize', '/oauth2/introspect')}`,
        qs.stringify({ token }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to introspect token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user information using an access token.
   *
   * Returns OIDC standard claims about the authenticated user.
   * Requires the 'openid' and 'profile' scopes.
   *
   * @param accessToken - Optional access token; uses stored token if not provided
   * @returns User information including subject ID, email, name, and picture
   * @throws {Error} If no access token is available or the request fails
   *
   * @example
   * ```typescript
   * const userInfo = await oauth.getUserInfo();
   * console.log(`Hello, ${userInfo.name}!`);
   * console.log(`Email: ${userInfo.email}`);
   * ```
   */
  async getUserInfo(accessToken?: string): Promise<{
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  }> {
    const tokenToUse = accessToken || this.tokens?.accessToken;

    if (!tokenToUse) {
      throw new Error('No access token available');
    }

    try {
      // Use Bearer token authentication per RFC 6750
      const response = await this.axiosInstance.get(
        `${this.config.authorizationUrl?.replace('/oauth2/authorize', '/oauth2/userInfo')}`,
        {
          headers: {
            'Authorization': `Bearer ${tokenToUse}`,
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse OAuth token response into AuthTokens format.
   * @internal
   */
  private parseTokenResponse(response: OAuthTokenResponse): AuthTokens {
    const expiresAt = response.expires_in
      ? new Date(Date.now() + response.expires_in * 1000)
      : undefined;

    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      idToken: response.id_token,
      expiresAt,
      scope: response.scope?.split(' '),
    };
  }
}
