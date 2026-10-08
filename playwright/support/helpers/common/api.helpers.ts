import type { Page, APIRequestContext } from '@playwright/test';
import { API_ENDPOINTS } from '../../../configs/app/routes.js';

export interface ApiHelpers {
  get<T>(endpoint: string, params?: Record<string, string>): Promise<T>;
  post<T>(endpoint: string, body: unknown): Promise<T>;
  put<T>(endpoint: string, body: unknown): Promise<T>;
  delete(endpoint: string): Promise<void>;
  waitForResponse(urlPattern: string | RegExp): Promise<void>;
}

export function createApiHelpers(page: Page, request: APIRequestContext): ApiHelpers {
  const baseUrl = process.env.API_BASE_URL ?? '';

  async function callApi<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = process.env.API_TOKEN ?? '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await request.fetch(`${baseUrl}${path}`, {
      method,
      data: body,
      headers,
    });
    if (!response.ok()) {
      throw new Error(`API ${method} ${path} failed: ${response.status()}`);
    }
    return response.json() as Promise<T>;
  }

  function resolveEndpoint(endpoint: string): string {
    return API_ENDPOINTS[endpoint] ?? endpoint;
  }

  return {
    async get<T>(endpoint: string, params?: Record<string, string>) {
      let path = resolveEndpoint(endpoint);
      if (params) {
        const qs = new URLSearchParams(params).toString();
        path = `${path}?${qs}`;
      }
      return callApi<T>('GET', path);
    },

    async post<T>(endpoint: string, body: unknown) {
      return callApi<T>('POST', resolveEndpoint(endpoint), body);
    },

    async put<T>(endpoint: string, body: unknown) {
      return callApi<T>('PUT', resolveEndpoint(endpoint), body);
    },

    async delete(endpoint: string) {
      await callApi('DELETE', resolveEndpoint(endpoint));
    },

    async waitForResponse(urlPattern) {
      await page.waitForResponse(urlPattern);
    },
  };
}
