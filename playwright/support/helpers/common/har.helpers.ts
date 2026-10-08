import type { Page, BrowserContext } from '@playwright/test';
import { HAR_PATHS } from '../../../configs/app/har-paths.js';

export interface HarHelpers {
  startRecording(path: keyof typeof HAR_PATHS): Promise<void>;
  stopRecording(): Promise<void>;
  routeFromHar(path: keyof typeof HAR_PATHS): Promise<void>;
}

export function createHarHelpers(page: Page, context: BrowserContext): HarHelpers {
  return {
    async startRecording(path) {
      await context.routeFromHAR(HAR_PATHS[path] as string, { update: true });
    },

    async stopRecording() {
      // HAR recording stops automatically when context closes
    },

    async routeFromHar(path) {
      await context.routeFromHAR(HAR_PATHS[path] as string, { update: false });
    },
  };
}
