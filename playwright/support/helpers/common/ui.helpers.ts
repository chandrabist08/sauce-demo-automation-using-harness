import type { Page, Locator } from '@playwright/test';
import { FEEDBACK_SELECTORS } from '../../../configs/ui/shared/feedback.ui.js';

export interface UiHelpers {
  waitForToast(message?: string): Promise<void>;
  dismissToast(): Promise<void>;
  waitForLoader(): Promise<void>;
  getByTestId(testId: string): Locator;
}

export function createUiHelpers(page: Page): UiHelpers {
  return {
    async waitForToast(message?) {
      const selector = Object.values(FEEDBACK_SELECTORS)[0] as string | undefined;
      if (!selector) return;
      const toast = page.locator(selector);
      await toast.waitFor({ state: 'visible' });
      if (message) await toast.filter({ hasText: message }).waitFor({ state: 'visible' });
    },

    async dismissToast() {
      const selector = Object.values(FEEDBACK_SELECTORS)[0] as string | undefined;
      if (!selector) return;
      const close = page.locator(selector).getByTestId('toast-close');
      if (await close.isVisible()) await close.click();
    },

    async waitForLoader() {
      const loader = page.getByTestId('loading-spinner');
      await loader.waitFor({ state: 'hidden' }).catch(() => {});
    },

    getByTestId(testId) {
      return page.getByTestId(testId);
    },
  };
}
