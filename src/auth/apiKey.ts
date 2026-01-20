/**
 * API Key authentication implementation for Contio Partner API
 */

import { ApiKeyConfig } from '../models/auth';

export interface ApiKeyClientConfig extends ApiKeyConfig {
  clientId?: string;
}

export class ApiKeyClient {
  private config: ApiKeyClientConfig;

  constructor(config: ApiKeyClientConfig) {
    this.config = {
      apiKeyHeader: 'X-API-Key',
      ...config,
    };
  }

  /**
   * Get the API key
   */
  getApiKey(): string {
    return this.config.apiKey;
  }

  /**
   * Get the header name for the API key
   */
  getHeaderName(): string {
    return this.config.apiKeyHeader || 'X-API-Key';
  }

  /**
   * Get headers object for API requests
   */
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      [this.getHeaderName()]: this.getApiKey(),
    };

    // Add client ID header if provided
    if (this.config.clientId) {
      headers['X-Client-ID'] = this.config.clientId;
    }

    return headers;
  }

  /**
   * Update the API key
   */
  updateApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }
}
