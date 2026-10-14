import { expect, type Page } from '@playwright/test';
import { NAVIGATION_SELECTORS } from '../../../configs/ui/shared/navigation.ui.js';

export interface CheckoutHelpers {
  fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<void>;
  continueToReview(): Promise<void>;
  cancelCheckout(): Promise<void>;
  finishCheckout(): Promise<void>;
  getPriceBreakdown(): Promise<{ itemTotal: number; tax: number; total: number }>;
  getOrderItemNames(): Promise<string[]>;
  isOrderComplete(): Promise<string>;
}

export function createCheckoutHelpers(page: Page): CheckoutHelpers {
  return {
    async fillShippingInfo(firstName, lastName, postalCode) {
      await page.locator(NAVIGATION_SELECTORS.checkout.firstNameInput).fill(firstName);
      await page.locator(NAVIGATION_SELECTORS.checkout.lastNameInput).fill(lastName);
      await page.locator(NAVIGATION_SELECTORS.checkout.postalCodeInput).fill(postalCode);
    },

    async continueToReview() {
      await page.locator(NAVIGATION_SELECTORS.checkout.continueButton).click();
      await page.waitForURL('**/checkout-step-two.html');
      await expect(page.locator(NAVIGATION_SELECTORS.checkout.finishButton)).toBeVisible();
    },

    async cancelCheckout() {
      await page.locator(NAVIGATION_SELECTORS.checkout.cancelButton).click();
    },

    async finishCheckout() {
      await page.locator(NAVIGATION_SELECTORS.checkout.finishButton).click();
      await page.waitForURL('**/checkout-complete.html');
      await expect(page.locator(NAVIGATION_SELECTORS.checkout.completeHeader)).toBeVisible();
    },

    async getPriceBreakdown() {
      const parse = async (selector: string) => {
        const text = await page.locator(selector).textContent() ?? '';
        return parseFloat(text.replace(/[^0-9.]/g, ''));
      };
      const itemTotal = await parse(NAVIGATION_SELECTORS.checkout.itemTotal);
      const tax = await parse(NAVIGATION_SELECTORS.checkout.tax);
      const total = await parse(NAVIGATION_SELECTORS.checkout.total);
      return { itemTotal, tax, total };
    },

    async getOrderItemNames() {
      return page.locator(NAVIGATION_SELECTORS.checkout.itemName).allTextContents();
    },

    async isOrderComplete() {
      const header = page.locator(NAVIGATION_SELECTORS.checkout.completeHeader);
      await expect(header).toBeVisible();
      return header.textContent().then((t) => t ?? '');
    },
  };
}
