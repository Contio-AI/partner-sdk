/**
 * Authentication utilities for Contio Partner API
 *
 * This module provides OAuth 2.0 and API key authentication.
 *
 * @example
 * ```typescript
 * import { OAuthClient } from '@contio/partner-sdk/auth';
 *
 * const oauth = new OAuthClient({
 *   clientId: process.env.CONTIO_CLIENT_ID!,
 *   clientSecret: process.env.CONTIO_CLIENT_SECRET!,
 *   redirectUri: 'https://your-app.com/callback',
 * });
 *
 * const authUrl = oauth.getAuthorizationUrl(state);
 * ```
 */

export { OAuthClient } from './oauth';
export { ApiKeyClient } from './apiKey';
