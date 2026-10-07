import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class __PageName__Page extends BasePage {
  // Add private readonly locators here using this.getByTestId('...')

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/__route__');
    await this.waitForPageLoad();
  }

  // Add public action methods here
}
