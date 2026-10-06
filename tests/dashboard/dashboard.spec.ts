import { test } from '../../src/fixtures/index';
import { setFeature, setStory, step } from '../../src/utils/allure-helpers';

test.describe('Dashboard', () => {
  test('@smoke Dashboard loads after login', async ({ dashboardPage }) => {
    await setFeature('Dashboard');
    await setStory('Initial load');

    await step('Navigate to dashboard', () => dashboardPage.goto());
    await step('Assert dashboard is loaded', () => dashboardPage.assertLoaded());
  });
});
