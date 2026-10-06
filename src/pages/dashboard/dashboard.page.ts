import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class DashboardPage extends BasePage {
  private readonly pageHeading = this.getByTestId('dashboard-heading');
  private readonly userMenu = this.getByTestId('user-menu');

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.waitForPageLoad();
  }

  async assertLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }

  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }
}
