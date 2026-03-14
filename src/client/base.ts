/**
 * Base HTTP client with common functionality for Contio Partner API
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import https from 'https';
import { ErrorResponse } from '../models/auth';

/**
 * SDK version for User-Agent header.
 * This is updated during the release process.
 */
export const SDK_VERSION = '1.4.5';

export interface ClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  /**
   * Default timezone for all requests. Can be an IANA identifier (e.g., 'America/New_York')
   * or a timezone abbreviation (e.g., 'EST', 'PST').
   * If not set, the API returns times in UTC.
   */
  defaultTimezone?: string;
}

/**
 * Options that can be passed to individual API requests
 */
export interface RequestOptions {
  /**
   * Override the default timezone for this request. Can be an IANA identifier
   * (e.g., 'America/New_York') or a timezone abbreviation (e.g., 'EST', 'PST').
   */
  timezone?: string;
}

/**
 * Header name for client timezone
 */
export const TIMEZONE_HEADER = 'X-Client-Timezone';

export class ContioAPIError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly response?: ErrorResponse;
  /** Unique request ID returned by the API, useful for debugging and support */
  public readonly requestId?: string;
  /** Value of the Retry-After response header, if present (for 429 responses) */
  public readonly retryAfter?: string;

  constructor(message: string, code: string, statusCode?: number, response?: ErrorResponse, retryAfter?: string) {
    super(message);
    this.name = 'ContioAPIError';
    this.code = code;
    this.statusCode = statusCode;
    this.response = response;
    this.requestId = response?.request_id;
    this.retryAfter = retryAfter;
  }
}

export abstract class BaseClient {
  protected axiosInstance: AxiosInstance;
  protected config: ClientConfig;

  constructor(config: ClientConfig = {}) {
    this.config = {
      baseURL: 'https://api.contio.ai',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    };

    // Configure axios with SSL handling for local development
    const axiosConfig: { baseURL: string | undefined; timeout: number | undefined; headers: Record<string, string>; httpsAgent?: https.Agent } = {
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `@contio/partner-sdk/${SDK_VERSION}`,
      },
    };

    // In development, allow self-signed certificates
    // Check if we're using a local development domain
    const isLocalDev = this.config.baseURL?.includes('.lan.contio.ai') ||
                       this.config.baseURL?.includes('localhost') ||
                       this.config.baseURL?.includes('local.');

    if (isLocalDev) {
      axiosConfig.httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });
    }

    // Add default timezone header if configured
    if (this.config.defaultTimezone) {
      axiosConfig.headers[TIMEZONE_HEADER] = this.config.defaultTimezone;
    }

    this.axiosInstance = axios.create(axiosConfig);

    // Request interceptor for authentication (supports async for token refresh)
    this.axiosInstance.interceptors.request.use(
      async (config) => this.addAuthHeaders(config),
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Abstract method to add authentication headers.
   * Can be async to support token refresh before requests.
   */
  protected abstract addAuthHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

  /**
   * Build axios config with optional per-request timezone override
   */
  protected buildRequestConfig(options?: RequestOptions, baseConfig?: AxiosRequestConfig): AxiosRequestConfig {
    const config: AxiosRequestConfig = { ...baseConfig };

    if (options?.timezone) {
      config.headers = {
        ...config.headers,
        [TIMEZONE_HEADER]: options.timezone,
      };
    }

    return config;
  }

  /**
   * Make a GET request
   */
  protected async get<T>(path: string, params?: object, options?: RequestOptions): Promise<T> {
    const config = this.buildRequestConfig(options, { params });
    const response = await this.retryRequest(() =>
      this.axiosInstance.get<T>(path, config)
    );
    return response.data;
  }

  /**
   * Make a POST request
   */
  protected async post<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const config = this.buildRequestConfig(options);
    const response = await this.retryRequest(() =>
      this.axiosInstance.post<T>(path, data, config)
    );
    return response.data;
  }

  /**
   * Make a PUT request
   */
  protected async put<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const config = this.buildRequestConfig(options);
    const response = await this.retryRequest(() =>
      this.axiosInstance.put<T>(path, data, config)
    );
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  protected async patch<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const config = this.buildRequestConfig(options);
    const response = await this.retryRequest(() =>
      this.axiosInstance.patch<T>(path, data, config)
    );
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  protected async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const config = this.buildRequestConfig(options);
    const response = await this.retryRequest(() =>
      this.axiosInstance.delete<T>(path, config)
    );
    return response.data;
  }

  /**
   * Make a POST request with multipart/form-data.
   *
   * Overrides the default `application/json` content type so that axios
   * sets the correct `multipart/form-data` boundary automatically.
   *
   * @param path  - Request path relative to the client's base URL
   * @param formData - A `FormData` instance containing the fields and files to upload
   * @param options  - Optional per-request options (e.g. timezone override)
   * @returns Parsed response body
   */
  protected async postForm<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    const config = this.buildRequestConfig(options, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const response = await this.retryRequest(() =>
      this.axiosInstance.post<T>(path, formData, config)
    );
    return response.data;
  }

  /**
   * Make a GET request that returns the full `AxiosResponse`, including
   * headers and raw data.
   *
   * Use this for endpoints that return binary content (e.g. file downloads)
   * where the caller needs access to response headers such as
   * `Content-Disposition` or `Content-Type`.
   *
   * @param path    - Request path relative to the client's base URL
   * @param params  - Optional query parameters
   * @param options - Optional per-request options (e.g. timezone override)
   * @param responseType - Axios response type (default: `'arraybuffer'`)
   * @returns The full axios response
   */
  protected async getRaw(
    path: string,
    params?: object,
    options?: RequestOptions,
    responseType: 'arraybuffer' | 'blob' | 'stream' = 'arraybuffer',
  ): Promise<AxiosResponse> {
    const config = this.buildRequestConfig(options, { params, responseType });
    return this.retryRequest(() =>
      this.axiosInstance.get(path, config)
    );
  }

  /**
   * Retry logic for failed requests with rate limit support.
   * Retries on 5xx errors and 429 (rate limit) with exponential backoff.
   */
  private async retryRequest<T>(
    request: () => Promise<AxiosResponse<T>>
  ): Promise<AxiosResponse<T>> {
    const maxRetries = this.config.retries ?? 3;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await request();
      } catch (error) {
        // The response interceptor converts AxiosError → ContioAPIError,
        // so we check ContioAPIError properties for status-based retry decisions.
        const statusCode = error instanceof ContioAPIError ? error.statusCode : undefined;

        if (statusCode) {
          // Handle rate limiting (429) - retry with Retry-After header or exponential backoff
          if (statusCode === 429) {
            if (i === maxRetries) {
              throw error;
            }
            const retryAfter = this.parseRetryAfter((error as ContioAPIError).retryAfter);
            await this.delay(retryAfter ?? ((this.config.retryDelay ?? 1000) * Math.pow(2, i)));
            continue;
          }

          // Don't retry on other client errors (4xx except 429)
          if (statusCode >= 400 && statusCode < 500) {
            throw error;
          }
        }

        // Don't retry if this was the last attempt
        if (i === maxRetries) {
          throw error;
        }

        // Wait before retrying (5xx errors, or errors without a status code)
        await this.delay(((this.config.retryDelay ?? 1000)) * Math.pow(2, i));
      }
    }

    // TypeScript requires a return/throw after the loop, but all paths above
    // either return (success) or throw (max retries exhausted). This is a
    // safeguard that should never execute.
    throw new ContioAPIError('Max retries exhausted', 'retry_exhausted');
  }

  /**
   * Parse Retry-After header value.
   * @returns Delay in milliseconds, or undefined if header is missing/invalid
   */
  private parseRetryAfter(header: string | undefined): number | undefined {
    if (!header) return undefined;

    // Try parsing as seconds (integer)
    const seconds = parseInt(header, 10);
    if (!isNaN(seconds)) {
      return seconds * 1000;
    }

    // Try parsing as HTTP date
    const date = Date.parse(header);
    if (!isNaN(date)) {
      return Math.max(0, date - Date.now());
    }

    return undefined;
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;
      const message = errorData.error || errorData.message || 'An error occurred';
      const code = errorData.code || 'unknown_error';

      const retryAfter = error.response.headers?.['retry-after'] as string | undefined;

      throw new ContioAPIError(
        message,
        code,
        error.response.status,
        errorData,
        retryAfter
      );
    } else if (error.request) {
      throw new ContioAPIError(
        'No response received from server',
        'network_error'
      );
    } else {
      throw new ContioAPIError(
        error.message || 'An unknown error occurred',
        'request_error'
      );
    }
  }
}
