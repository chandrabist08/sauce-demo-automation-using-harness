import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const authFile = 'storage/auth/user-admin.json';

setup('Authenticate admin user', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('email-input').fill(process.env.ADMIN_EMAIL ?? '');
  await page.getByTestId('password-input').fill(process.env.ADMIN_PASSWORD ?? '');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/dashboard/);

  const dir = path.dirname(authFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await page.context().storageState({ path: authFile });
});
