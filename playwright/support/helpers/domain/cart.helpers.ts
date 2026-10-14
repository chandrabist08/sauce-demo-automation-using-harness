import { expect, type Page } from '@playwright/test';
import { NAVIGATION_SELECTORS } from '../../../configs/ui/shared/navigation.ui.js';

export interface CartHelpers {
  addItemAt(index: number): Promise<void>;
  getCartCount(): Promise<number>;
  getCartItemNames(): Promise<string[]>;
  removeItemAt(index: number): Promise<void>;
  goToCart(): Promise<void>;
}

export function createCartHelpers(page: Page): CartHelpers {
  return {
    async addItemAt(index) {
      await page.locator(NAVIGATION_SELECTORS.cart.addToCartButton).nth(index).click();
    },

    async getCartCount() {
      const badge = page.locator(NAVIGATION_SELECTORS.cart.badge);
      const isVisible = await badge.isVisible();
      if (!isVisible) return 0;
      const text = await badge.textContent();
      return parseInt(text ?? '0', 10);
    },

    async getCartItemNames() {
      return page.locator(NAVIGATION_SELECTORS.cart.itemName).allTextContents();
    },

    async removeItemAt(index) {
      await page.locator(NAVIGATION_SELECTORS.cart.removeButton).nth(index).click();
    },

    async goToCart() {
      await page.locator(NAVIGATION_SELECTORS.cart.link).click();
      await page.waitForURL('**/cart.html');
      // Wait for the cart view to finish rendering after the SPA route change
      await expect(page.locator(NAVIGATION_SELECTORS.cart.checkoutButton)).toBeVisible();
    },
  };
}
