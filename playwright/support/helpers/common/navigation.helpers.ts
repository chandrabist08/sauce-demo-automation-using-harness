import type { Page } from '@playwright/test';
import { ROUTES } from '../../../configs/app/routes.js';

export interface NavigationHelpers {
  goTo(route: keyof typeof ROUTES): Promise<void>;
  goToUrl(url: string): Promise<void>;
  waitForNavigation(): Promise<void>;
  getCurrentPath(): string;
}

export function createNavigationHelpers(page: Page): NavigationHelpers {
  return {
    async goTo(route) {
      await page.goto(ROUTES[route] as string);
    },

    async goToUrl(url) {
      await page.goto(url);
    },

    async waitForNavigation() {
      await page.waitForLoadState('networkidle');
    },

    getCurrentPath() {
      return new URL(page.url()).pathname;
    },
  };
}
