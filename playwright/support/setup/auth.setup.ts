import { test as setup } from '@playwright/test';
import { ROUTES } from '../../configs/app/routes.js';
import { NAVIGATION_SELECTORS } from '../../configs/ui/shared/navigation.ui.js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: `playwright/environments/.env.qa`, override: true });

const authFile = process.env.AUTH_STATE_PATH ?? 'playwright/storage/auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto(ROUTES.login);

  await page.locator(NAVIGATION_SELECTORS.login.usernameInput).click({ clickCount: 3 });
  await page
    .locator(NAVIGATION_SELECTORS.login.usernameInput)
    .pressSequentially(process.env.USERNAME!, { delay: 50 });
  await page.locator(NAVIGATION_SELECTORS.login.passwordInput).click({ clickCount: 3 });
  await page
    .locator(NAVIGATION_SELECTORS.login.passwordInput)
    .pressSequentially(process.env.PASSWORD!, { delay: 50 });
  await page.locator(NAVIGATION_SELECTORS.login.loginButton).click();

  await page.waitForURL('**' + ROUTES.inventory);

  await page.context().storageState({ path: path.resolve(authFile) });
});
