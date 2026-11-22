import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import {LogoutPage} from '../pages/LogoutPage'

// Define the shape of your data
type UserData = {
    username: string;
    password: string;
};

type CustomFixtures = {
    loginPage: LoginPage;
    landingPage: LandingPage;
    logoutPage: LogoutPage;
    userData: UserData;
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

    userData: async ({}, use) => {
    const data: UserData = {
      username: 'newuser27thsept@gmail.com',
      password: '123456',
    };

    // Pass the single dataset to the test
    await use(data);
    },



});

export { expect };