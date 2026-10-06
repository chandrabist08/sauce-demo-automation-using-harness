import { test as base, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../api/client';
import { AuthApi } from '../api/auth.api';
import { UsersApi } from '../api/users.api';
import { LoginPage } from '../pages/auth/login.page';
import { DashboardPage } from '../pages/dashboard/dashboard.page';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

type ApiFixtures = {
  apiClient: ApiClient;
  authApi: AuthApi;
  usersApi: UsersApi;
};

export type AllFixtures = PageFixtures & ApiFixtures;

export const test = base.extend<AllFixtures>({
  apiClient: async ({ request }: { request: APIRequestContext }, use: (client: ApiClient) => Promise<void>) => {
    const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:3001';
    const client = new ApiClient(request, baseUrl);
    await use(client);
  },

  authApi: async ({ apiClient }: { apiClient: ApiClient }, use: (api: AuthApi) => Promise<void>) => {
    await use(new AuthApi(apiClient));
  },

  usersApi: async ({ apiClient }: { apiClient: ApiClient }, use: (api: UsersApi) => Promise<void>) => {
    await use(new UsersApi(apiClient));
  },

  loginPage: async ({ page }: { page: import('@playwright/test').Page }, use: (p: LoginPage) => Promise<void>) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }: { page: import('@playwright/test').Page }, use: (p: DashboardPage) => Promise<void>) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
