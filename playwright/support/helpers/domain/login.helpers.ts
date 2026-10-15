import type { Page } from '@playwright/test';
import { NAVIGATION_SELECTORS } from '../../../configs/ui/shared/navigation.ui.js';

export interface LoginHelpers {
  loginAs(username: string, pass: string): Promise<void>;
  getErrorMessage(): Promise<string>;
}

export function createLoginHelpers(page: Page): LoginHelpers {
  return {
    async loginAs(username, pass) {
      await page.locator(NAVIGATION_SELECTORS.login.usernameInput).fill(username);
      await page.locator(NAVIGATION_SELECTORS.login.passwordInput).fill(pass);
      await page.locator(NAVIGATION_SELECTORS.login.loginButton).click();
    },

    async getErrorMessage() {
      const el = page.locator(NAVIGATION_SELECTORS.login.errorMessage);
      return (await el.textContent()) ?? '';
    },
  };
}
