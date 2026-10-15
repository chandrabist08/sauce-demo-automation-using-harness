import type { Page } from '@playwright/test';
import { NAVIGATION_SELECTORS } from '../../../configs/ui/shared/navigation.ui.js';

export interface MenuHelpers {
  goToAllItems(): Promise<void>;
  logout(): Promise<void>;
  resetAppState(): Promise<void>;
}

export function createMenuHelpers(page: Page): MenuHelpers {
  async function openMenu() {
    // The open/close triggers are <button> elements that wrap the data-test img — click by role
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator(NAVIGATION_SELECTORS.menu.logoutLink).waitFor({ state: 'visible' });
  }

  return {
    async goToAllItems() {
      await openMenu();
      await page.locator(NAVIGATION_SELECTORS.menu.allItemsLink).click();
      await page.waitForURL('**/inventory.html');
    },

    async logout() {
      await openMenu();
      await page.locator(NAVIGATION_SELECTORS.menu.logoutLink).click();
      await page.waitForURL('**/');
    },

    async resetAppState() {
      await openMenu();
      await page.locator(NAVIGATION_SELECTORS.menu.resetLink).click();
      await page.getByRole('button', { name: 'Close Menu' }).click();
    },
  };
}
