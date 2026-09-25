import { Locator, Page } from '@playwright/test'
import { BasePage } from '../basepage/BasePage'

export class LandingPage extends BasePage {

    private readonly loginButtonOnHomePage: Locator

    constructor(page: Page) {
        super(page)
        this.loginButtonOnHomePage = page.getByRole('button', { name: 'Login' });
    }

    async navigateToLandingPage() {
        await this.goToUrl('/')
    }
    async getPageTitle() {
        await this.page.title()
    }

    async getCopyrightText() {
        // return this.getNormalizedText(this.footerCopyright)
    }

    async navigateToLoginPopUp() {
        await this.loginButtonOnHomePage.click();
    }

    // Expose the private locator safely
    get loginButton(): Locator {
        return this.loginButtonOnHomePage;
    }

    async navigateToRegisterPage() {
        // await this.myAccount.click();
        // await this.register.click();
    }
    async searchProduct(productName: string) {
        // await this.searchBox.fill(productName)
        // await this.searchBox.press('Enter')
    }

    async getSearchResultsText() {
        // return this.getNormalizedText(this.searchResultsBody)
    }
}
