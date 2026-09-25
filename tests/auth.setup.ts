import { test as setup, expect } from '../fixtures/testFixture'
import path from 'path';
import { config } from '../config/env.config';

// const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate user', async ({ page, loginPage, landingPage }) => {

    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()
    await loginPage.login(config.username, config.password)

    // 1. Wait for post-login UI element
    await expect(page.locator('h2:text("Our Top Courses")')).toHaveText('Our Top Courses');

    // 2. CRITICAL FIX: Wait for background auth requests to finish and tokens/cookies to settle
    await page.waitForLoadState('networkidle'); // not necessary in most cases, but can help ensure all network activity is complete

    // Alternative option if tokens are stored in localStorage:
    // await page.waitForFunction(() => localStorage.getItem('authToken') !== null);

    // 3. Save storage state AFTER network/storage is settled
    await page.context().storageState({ path: './playwright/.auth/user.json' });
});