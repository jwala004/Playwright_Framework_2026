// tests/fixtures/testFixtures.ts

import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
// import { ForgetPasswordPage } from '../pages/ForgetPasswordPage';
// import { RegisterPage } from '../pages/RegisterPage';
// import { LandingPage } from '../pages/LandingPage';
// import { AccountSuccessPage } from '../pages/AccountSuccessPage';

type CustomFixtures = {
    loginPage: LoginPage;
    landingPage: LandingPage;
    // forgetPasswordPage: ForgetPasswordPage;
    // registerPage: RegisterPage;
    // accountSuccessPage: AccountSuccessPage;
};

export const test = base.extend<CustomFixtures>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    landingPage: async ({ page }, use) => {
        await use(new LandingPage(page));
    },

    // forgetPasswordPage: async ({ page }, use) => {
    //     await use(new ForgetPasswordPage(page));
    // },

    // registerPage: async ({ page }, use) => {
    //     await use(new RegisterPage(page));
    // },

    // accountSuccessPage: async ({ page }, use) => {
    //     await use(new AccountSuccessPage(page));
    // },
});

export { expect };