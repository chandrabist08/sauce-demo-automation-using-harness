import { test as base, expect } from '@playwright/test';
import type { Page, APIRequestContext, BrowserContext } from '@playwright/test';
import {
  createNavigationHelpers,
  type NavigationHelpers,
} from '../support/helpers/common/navigation.helpers.js';
import { createUiHelpers, type UiHelpers } from '../support/helpers/common/ui.helpers.js';
import { createApiHelpers, type ApiHelpers } from '../support/helpers/common/api.helpers.js';
import { createHarHelpers, type HarHelpers } from '../support/helpers/common/har.helpers.js';
import { createInventoryHelpers, type InventoryHelpers } from '../support/helpers/domain/inventory.helpers.js';

type HarnessFixtures = {
  nav: NavigationHelpers;
  ui: UiHelpers;
  api: ApiHelpers;
  har: HarHelpers;
  inventory: InventoryHelpers;
  evidence: void;
};

export const test = base.extend<HarnessFixtures>({
  evidence: [
    async ({ page }, use, testInfo) => {
      const consoleMessages: string[] = [];
      const pageErrors: string[] = [];
      const failedRequests: string[] = [];

      page.on('console', (msg) => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
      page.on('pageerror', (err) => pageErrors.push(err.message));
      page.on('requestfailed', (req) => {
        failedRequests.push(
          `${req.method()} ${req.url()} :: ${req.failure()?.errorText ?? 'failed'}`,
        );
      });

      await use();

      if (testInfo.status === testInfo.expectedStatus) return;

      await testInfo.attach('failure-evidence.json', {
        body: Buffer.from(
          JSON.stringify(
            {
              title: testInfo.title,
              file: testInfo.file,
              project: testInfo.project.name,
              status: testInfo.status,
              expectedStatus: testInfo.expectedStatus,
              url: page.url(),
              consoleMessages,
              pageErrors,
              failedRequests,
            },
            null,
            2,
          ),
          'utf8',
        ),
        contentType: 'application/json',
      });
    },
    { auto: true },
  ],

  nav: async ({ page }: { page: Page }, use: (h: NavigationHelpers) => Promise<void>) => {
    await use(createNavigationHelpers(page));
  },

  ui: async ({ page }: { page: Page }, use: (h: UiHelpers) => Promise<void>) => {
    await use(createUiHelpers(page));
  },

  api: async (
    { page, request }: { page: Page; request: APIRequestContext },
    use: (h: ApiHelpers) => Promise<void>,
  ) => {
    await use(createApiHelpers(page, request));
  },

  har: async (
    { page, context }: { page: Page; context: BrowserContext },
    use: (h: HarHelpers) => Promise<void>,
  ) => {
    await use(createHarHelpers(page, context));
  },

  inventory: async ({ page }: { page: Page }, use: (h: InventoryHelpers) => Promise<void>) => {
    await use(createInventoryHelpers(page));
  },
});

export { expect };
