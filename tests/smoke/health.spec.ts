import { test, expect } from '../../src/fixtures/index';
import { setFeature, step } from '../../src/utils/allure-helpers';

test.describe('Health', () => {
  test('@smoke Application root responds', async ({ page }) => {
    await setFeature('Infrastructure');

    await step('Navigate to root', () => page.goto('/'));
    await step('Assert page loads', async () => {
      expect(page.url()).toContain(process.env.BASE_URL ?? 'localhost');
    });
  });
});
