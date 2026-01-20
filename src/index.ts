/**
 * Contio Partner SDK
 *
 * Official SDK for integrating with the Contio MeetingOS Partner API
 */

// Import classes first
import { OAuthClient } from './auth/oauth';
import { ApiKeyClient } from './auth/apiKey';
import { PartnerUserClient } from './client/user';
import { PartnerAdminClient } from './client/admin';

// Export authentication clients
export { OAuthClient } from './auth/oauth';
export { ApiKeyClient } from './auth/apiKey';

// Export API clients
export { PartnerUserClient } from './client/user';
export { PartnerAdminClient } from './client/admin';
export { BaseClient, ClientConfig, ContioAPIError, RequestOptions, TIMEZONE_HEADER } from './client/base';

// Export all models
export * from './models';

// Export webhook utilities
export * from './webhooks';

// Export SSO utilities
export * from './sso';

// Main SDK class for convenience
export class ContioPartnerSDK {
  public readonly oauth: OAuthClient;
  public readonly apiKey: ApiKeyClient;
  public readonly user: PartnerUserClient;
  public readonly admin: PartnerAdminClient;

  constructor(config: {
    oauth?: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
    };
    apiKey?: string;
    clientId?: string;
    baseURL?: string;
    timeout?: number;
  }) {
    if (!config.oauth && !config.apiKey) {
      throw new Error('Either OAuth or API Key configuration must be provided');
    }

    // Initialize OAuth client if config provided
    if (config.oauth) {
      this.oauth = new OAuthClient(config.oauth);
      this.user = new PartnerUserClient(this.oauth, {
        baseURL: config.baseURL,
        timeout: config.timeout,
      });
    } else {
      this.oauth = null as any;
      this.user = null as any;
    }

    // Initialize API Key client if config provided
    if (config.apiKey) {
      this.apiKey = new ApiKeyClient({
        apiKey: config.apiKey,
        clientId: config.clientId || config.oauth?.clientId
      });
      this.admin = new PartnerAdminClient(this.apiKey, {
        baseURL: config.baseURL,
        timeout: config.timeout,
      });
    } else {
      this.apiKey = null as any;
      this.admin = null as any;
    }
  }

  /**
   * Create an SDK instance for OAuth user operations
   */
  static forUser(config: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    baseURL?: string;
    timeout?: number;
  }): { oauth: OAuthClient; user: PartnerUserClient } {
    const oauth = new OAuthClient(config);
    const user = new PartnerUserClient(oauth, {
      baseURL: config.baseURL,
      timeout: config.timeout,
    });
    return { oauth, user };
  }

  /**
   * Create an SDK instance for API key admin operations
   */
  static forAdmin(config: {
    apiKey: string;
    clientId?: string;
    baseURL?: string;
    timeout?: number;
  }): { apiKey: ApiKeyClient; admin: PartnerAdminClient } {
    const apiKey = new ApiKeyClient({
      apiKey: config.apiKey,
      clientId: config.clientId
    });
    const admin = new PartnerAdminClient(apiKey, {
      baseURL: config.baseURL,
      timeout: config.timeout,
    });
    return { apiKey, admin };
  }
}

// Default export
export default ContioPartnerSDK;
