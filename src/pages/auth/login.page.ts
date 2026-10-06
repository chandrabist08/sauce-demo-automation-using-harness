import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class LoginPage extends BasePage {
  private readonly emailInput = this.getByTestId('email-input');
  private readonly passwordInput = this.getByTestId('password-input');
  private readonly submitButton = this.getByTestId('login-submit');
  private readonly errorBanner = this.getByTestId('login-error');

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async assertLoginError(message: string): Promise<void> {
    await expect(this.errorBanner).toContainText(message);
  }
}
