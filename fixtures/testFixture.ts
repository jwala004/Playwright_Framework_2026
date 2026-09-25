import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import {LogoutPage} from '../pages/LogoutPage'


type CustomFixtures = {
    loginPage: LoginPage;
    landingPage: LandingPage;
    logoutPage: LogoutPage;
};

export const test = base.extend<CustomFixtures>({

    landingPage: async ({ page }, use) => {
        await use(new LandingPage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    logoutPage: async ({page}, use) =>{
        await use(new LogoutPage(page));
    }


});

export { expect };