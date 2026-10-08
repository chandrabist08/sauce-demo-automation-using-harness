import type { Page, APIRequestContext } from '@playwright/test';
import { API_ENDPOINTS } from '../../../configs/app/routes.js';

export interface ApiHelpers {
  get<T>(endpoint: keyof typeof API_ENDPOINTS, params?: Record<string, string>): Promise<T>;
  post<T>(endpoint: keyof typeof API_ENDPOINTS, body: unknown): Promise<T>;
  put<T>(endpoint: keyof typeof API_ENDPOINTS, body: unknown): Promise<T>;
  delete(endpoint: keyof typeof API_ENDPOINTS): Promise<void>;
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

  return {
    async get<T>(endpoint, params?) {
      let path = API_ENDPOINTS[endpoint] as string;
      if (params) {
        const qs = new URLSearchParams(params).toString();
        path = `${path}?${qs}`;
      }
      return callApi<T>('GET', path);
    },

    async post<T>(endpoint, body) {
      return callApi<T>('POST', API_ENDPOINTS[endpoint] as string, body);
    },

    async put<T>(endpoint, body) {
      return callApi<T>('PUT', API_ENDPOINTS[endpoint] as string, body);
    },

    async delete(endpoint) {
      await callApi('DELETE', API_ENDPOINTS[endpoint] as string);
    },

    async waitForResponse(urlPattern) {
      await page.waitForResponse(urlPattern);
    },
  };
}
