import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from '../basepage/BasePage'

export class LogoutPage extends BasePage {

    private readonly userProfileIcon: Locator;
    private readonly logoutLink: Locator;
    private readonly invalidErrorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.userProfileIcon = page.locator("button[id='radix-:r0:']")
        this.logoutLink = page.getByRole('menuitem', { name: 'Log out' })
        this.invalidErrorMessage = page.getByText('Invalid Email or Password')
    }

    async logout() {
        await this.userProfileIcon.click()
        await this.logoutLink.click()
    }

    async isinvalidErrorMessageDisplayed(): Promise<void> {
        await expect(this.invalidErrorMessage).toBeVisible();
    }

    // async getInvalidErrorMessage(): Promise<void> {
    //     console.log("Concole 1: " + await this.invalidErrorMessage.textContent())
    //     // console.log("Concole 2: " + await this.invalidErrorMessage.allTextContents())
    //     // console.log("Concole 3: " + await this.invalidErrorMessage.innerHTML())
    //     // console.log("Concole 4: " + await this.invalidErrorMessage.innerText())
    //     await expect(this.invalidErrorMessage.textContent()).toHaveText('Invalid Email or Password')
    // }

    // async getInvalidErrorMessage() {
    //     return await this.invalidErrorMessage.textContent();
    // }

    async expectErrorMessageToHaveText(expectedText: string) {
        await expect(this.invalidErrorMessage).toHaveText(expectedText);
    }

}

