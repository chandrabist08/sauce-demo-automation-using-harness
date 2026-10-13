import type { Page } from '@playwright/test';
import { NAVIGATION_SELECTORS } from '../../../configs/ui/shared/navigation.ui.js';

export interface InventoryHelpers {
  sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void>;
  getItemNames(): Promise<string[]>;
  getItemPrices(): Promise<number[]>;
}

export function createInventoryHelpers(page: Page): InventoryHelpers {
  return {
    async sortBy(option) {
      await page.locator(NAVIGATION_SELECTORS.inventory.sortSelect).selectOption(option);
    },

    async getItemNames() {
      return page.locator(NAVIGATION_SELECTORS.inventory.itemName).allTextContents();
    },

    async getItemPrices() {
      const texts = await page.locator(NAVIGATION_SELECTORS.inventory.itemPrice).allTextContents();
      return texts.map(t => parseFloat(t.replace('$', '')));
    },
  };
}
