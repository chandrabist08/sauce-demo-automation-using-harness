import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private token?: string,
  ) {}

  setToken(token: string): void {
    this.token = token;
  }

  private get headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  async get<T>(path: string): Promise<T> {
    const response = await this.request.get(`${this.baseUrl}${path}`, {
      headers: this.headers,
    });
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await this.request.post(`${this.baseUrl}${path}`, {
      data: body,
      headers: this.headers,
    });
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await this.request.put(`${this.baseUrl}${path}`, {
      data: body,
      headers: this.headers,
    });
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async delete(path: string): Promise<void> {
    const response = await this.request.delete(`${this.baseUrl}${path}`, {
      headers: this.headers,
    });
    expect(response.ok()).toBeTruthy();
  }
}
