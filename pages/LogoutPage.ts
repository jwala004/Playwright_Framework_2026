import {Locator, Page} from '@playwright/test'
import {BasePage} from '../basepage/BasePage'

export class LogoutPage extends BasePage{

    private readonly userProfileIcon : Locator;
    private readonly logoutLink : Locator;

    constructor(page : Page){
        super(page);
        this.userProfileIcon = page.locator("button[id='radix-:r0:']")
        this.logoutLink = page.getByRole('menuitem', {name: 'Log out'})
    }

    async logout (){
        await this.userProfileIcon.click()
        await this.logoutLink.click()
    }

}

