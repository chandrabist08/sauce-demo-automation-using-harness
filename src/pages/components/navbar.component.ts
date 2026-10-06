import { Page, Locator } from '@playwright/test';

export class NavbarComponent {
  private readonly nav: Locator;
  private readonly logoLink: Locator;
  private readonly userMenuButton: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.nav = page.getByTestId('navbar');
    this.logoLink = page.getByTestId('navbar-logo');
    this.userMenuButton = page.getByTestId('navbar-user-menu');
    this.logoutButton = page.getByTestId('navbar-logout');
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }
}
