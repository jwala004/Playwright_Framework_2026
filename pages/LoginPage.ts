import { Locator, Page } from '@playwright/test';
import { BasePage } from '../basepage/BasePage';

export class LoginPage extends BasePage {
  private readonly inputEmailOrPhone: Locator;
  #inputPassword: Locator;
  private readonly loginButtonOnPopUp: Locator;

  constructor(page: Page) {
    super(page);
    this.inputEmailOrPhone = page.getByPlaceholder('Email or phone number');
    this.#inputPassword = page.getByPlaceholder('Enter password');
    this.loginButtonOnPopUp = page.getByRole('button', { name: 'Log In' }).nth(1);
  }

  async login(emailAddress: string, password: string) {
    await this.inputEmailOrPhone.click();
    await this.inputEmailOrPhone.clear();
    await this.inputEmailOrPhone.fill(emailAddress);

    await this.#inputPassword.click();
    await this.#inputPassword.clear();
    await this.#inputPassword.fill(password);
    await this.loginButtonOnPopUp.click();
  }
}
