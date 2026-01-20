/**
 * Authentication-related type definitions for the Contio Partner API
 */

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  scope?: string[];
}

export interface ApiKeyConfig {
  apiKey: string;
  apiKeyHeader?: string; // Default: 'X-API-Key'
}

export interface UserProfile {
  id: string;
  display_name: string;
  email?: string;
  created_at: string;
}

export interface ErrorResponse {
  code: string;
  error?: string;
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: Date;
  scope?: string[];
}
