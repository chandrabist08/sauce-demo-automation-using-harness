import { test, expect } from '../../src/fixtures/index';
import { setFeature, setStory, step } from '../../src/utils/allure-helpers';

test.describe('Login', () => {
  test('@smoke User can log in with valid credentials', async ({ loginPage, dashboardPage }) => {
    await setFeature('Authentication');
    await setStory('Standard login');

    await step('Navigate to login page', () => loginPage.goto());
    await step('Submit valid credentials', () =>
      loginPage.login(process.env.ADMIN_EMAIL ?? '', process.env.ADMIN_PASSWORD ?? ''),
    );
    await step('Assert redirect to dashboard', () => dashboardPage.assertUrl(/\/dashboard/));
  });

  test('@regression Login fails with incorrect password', async ({ loginPage }) => {
    await setFeature('Authentication');
    await setStory('Failed login');

    await step('Navigate to login page', () => loginPage.goto());
    await step('Submit wrong credentials', () =>
      loginPage.login('user@example.com', 'wrongpassword'),
    );
    await step('Assert error message', () => loginPage.assertLoginError('Invalid credentials'));
  });
});
