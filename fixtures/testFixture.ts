// tests/fixtures/testFixtures.ts

import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';


type CustomFixtures = {
    loginPage: LoginPage;
    landingPage: LandingPage;
};

export const test = base.extend<CustomFixtures>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    landingPage: async ({ page }, use) => {
        await use(new LandingPage(page));
    }

});

export { expect };