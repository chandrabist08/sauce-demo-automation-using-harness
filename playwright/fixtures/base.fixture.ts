import { test as base, expect } from '@playwright/test';
import {
  createNavigationHelpers,
  type NavigationHelpers,
} from '../support/helpers/common/navigation.helpers.js';
import { createUiHelpers, type UiHelpers } from '../support/helpers/common/ui.helpers.js';
import { createApiHelpers, type ApiHelpers } from '../support/helpers/common/api.helpers.js';
import { createHarHelpers, type HarHelpers } from '../support/helpers/common/har.helpers.js';
import { FRAMEWORK_EVIDENCE } from '../configs/app/framework-evidence.js';
import * as fs from 'fs';
import * as path from 'path';

type HarnessFixtures = {
  nav: NavigationHelpers;
  ui: UiHelpers;
  api: ApiHelpers;
  har: HarHelpers;
};

export const test = base.extend<HarnessFixtures>({
  nav: async ({ page }, use) => {
    await use(createNavigationHelpers(page));
  },

  ui: async ({ page }, use) => {
    await use(createUiHelpers(page));
  },

  api: async ({ page, request }, use) => {
    await use(createApiHelpers(page, request));
  },

  har: async ({ page, context }, use) => {
    await use(createHarHelpers(page, context));
  },
});

// Evidence auto-fixture — attaches failure-evidence.json on test failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    const errors = testInfo.errors.map((e) => e.message ?? String(e));
    const evidence = {
      test: testInfo.title,
      url: page.url(),
      errors,
      timestamp: new Date().toISOString(),
    };
    const evidencePath = FRAMEWORK_EVIDENCE.failureEvidence;
    const dir = path.dirname(evidencePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
    await testInfo.attach('failure-evidence', {
      path: evidencePath,
      contentType: 'application/json',
    });
  }
});

export { expect };
