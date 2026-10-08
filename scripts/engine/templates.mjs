export function specTemplate({ requirementId, featureName, helperName }) {
  return `import { test, expect } from '../../fixtures/base.fixture.js';

// @requirement ${requirementId}
test.describe('${featureName}', () => {
  test('@smoke ${featureName} loads', async ({ nav, ui }) => {
    // TODO: implement
  });
});
`;
}

export function helperTemplate({ helperName }) {
  return `import type { Page } from '@playwright/test';

export interface ${helperName}Helpers {
  // TODO: define helper interface
}

export function create${helperName}Helpers(page: Page): ${helperName}Helpers {
  return {
    // TODO: implement
  };
}
`;
}
