import type { Page } from '@playwright/test';
import { NAVIGATION_SELECTORS } from '../../../configs/ui/shared/navigation.ui.js';

export interface ProductHelpers {
  openProductAt(index: number): Promise<void>;
  getName(): Promise<string>;
  getPrice(): Promise<number>;
  addToCart(): Promise<void>;
  goBack(): Promise<void>;
}

export function createProductHelpers(page: Page): ProductHelpers {
  return {
    async openProductAt(index) {
      await page.locator(NAVIGATION_SELECTORS.inventory.itemName).nth(index).click();
      await page.waitForURL('**/inventory-item.html**');
    },

    async getName() {
      return (await page.locator(NAVIGATION_SELECTORS.product.name).textContent()) ?? '';
    },

    async getPrice() {
      const text = (await page.locator(NAVIGATION_SELECTORS.product.price).textContent()) ?? '';
      return parseFloat(text.replace('$', ''));
    },

    async addToCart() {
      await page.locator(NAVIGATION_SELECTORS.product.addToCartButton).click();
    },

    async goBack() {
      await page.locator(NAVIGATION_SELECTORS.product.backButton).click();
      await page.waitForURL('**/inventory.html');
    },
  };
}
