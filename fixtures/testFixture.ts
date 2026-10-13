import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import {LogoutPage} from '../pages/LogoutPage'

import { TestDataFactory } from '../data/factories/TestDataFactory';


type CustomFixtures = {
    loginPage: LoginPage;
    landingPage: LandingPage;
    logoutPage: LogoutPage;

    testData: typeof TestDataFactory;
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
    },
    
    testData: async ({}, use) => {
        await use(TestDataFactory);
    },

});

export { expect };