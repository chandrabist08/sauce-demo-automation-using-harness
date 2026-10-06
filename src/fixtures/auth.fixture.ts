import { test as base } from './base.fixture';
import { ApiClient } from '../api/client';
import { AuthApi } from '../api/auth.api';
import { APIRequestContext } from '@playwright/test';

export const authenticatedTest = base.extend({
  apiClient: async ({ request }: { request: APIRequestContext }, use: (client: ApiClient) => Promise<void>) => {
    const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001';
    const client = new ApiClient(request, baseUrl);
    const auth = new AuthApi(client);
    const { token } = await auth.login(
      process.env.ADMIN_EMAIL ?? '',
      process.env.ADMIN_PASSWORD ?? '',
    );
    client.setToken(token);
    await use(client);
  },
});
