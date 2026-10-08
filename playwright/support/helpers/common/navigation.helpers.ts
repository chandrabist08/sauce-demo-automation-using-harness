import type { Page } from '@playwright/test';
import { ROUTES } from '../../../configs/app/routes.js';

export interface NavigationHelpers {
  goTo(route: string): Promise<void>;
  goToUrl(url: string): Promise<void>;
  waitForNavigation(): Promise<void>;
  getCurrentPath(): string;
}

export function createNavigationHelpers(page: Page): NavigationHelpers {
  return {
    async goTo(route: string) {
      await page.goto(ROUTES[route] ?? route);
    },

    async goToUrl(url) {
      await page.goto(url);
    },

    async waitForNavigation() {
      await page.waitForLoadState('networkidle');
    },

    getCurrentPath() {
      try {
        return new URL(page.url()).pathname;
      } catch {
        return page.url();
      }
    },
  };
}
