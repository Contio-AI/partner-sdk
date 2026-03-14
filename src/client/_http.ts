/**
 * Internal HTTP transport interface for domain delegate modules.
 *
 * Provides a seam between domain-specific SDK logic and the BaseClient's
 * protected HTTP helpers so that each domain module can be developed and
 * tested independently of the class hierarchy.
 *
 * @internal — not part of the public SDK surface.
 */

import { AxiosResponse } from 'axios';
import { RequestOptions } from './base';

/**
 * Minimal HTTP transport consumed by domain delegate modules.
 *
 * The concrete implementation is created inside each client's constructor
 * by binding the inherited `BaseClient` protected methods.
 *
 * @internal
 */
export interface HttpTransport {
  get<T>(path: string, params?: object, options?: RequestOptions): Promise<T>;
  post<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
  postForm<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T>;
  getRaw(
    path: string,
    params?: object,
    options?: RequestOptions,
    responseType?: 'arraybuffer' | 'blob' | 'stream',
  ): Promise<AxiosResponse>;
}

