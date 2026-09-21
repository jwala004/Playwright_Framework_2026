// import { test, expect } from '@playwright/test';
import { test, expect } from '../fixtures/testFixture'
import { config } from '../config/env.config'

test.describe('Login functionality', () => {
        test.beforeEach(async ({ landingPage }) => {
                await landingPage.navigateToLandingPage()
                await landingPage.navigateToLoginPopUp()
        })

        // test("TC_001 - Verify login fails with invalid Email", async ({ loginPage }) => {
        //         await loginPage.submitLogin(loginInputData.invalidLoginDetails[0].emailAddress, loginInputData.invalidLoginDetails[0].password)
        //         expect(await loginPage.getWarnigMessage()).toBe(loginExpectedData.warningMessage)
        // })

        test("TC_002 - Verify login success with valid Email", async ({ loginPage, page }) => {
                await loginPage.login(config.username, config.password)
                await expect(page.getByRole('heading', { name: 'Our Top Courses' })).toBeVisible()
                // await expect(page).toHaveURL(/route=account\/account/)
        })

        // test("TC_003 - Verify user can logout successfully from My Account", async ({ loginPage, page }) => {
        //         await loginPage.submitLogin(loginInputData.validLoginDetails[0].emailAddress, loginInputData.validLoginDetails[0].password)
        //         await loginPage.logoutFromAccount()
        //         await expect(page).toHaveURL(/route=account\/logout/);
        //         expect(await loginPage.getLogoutSuccessMessage()).toBe(loginExpectedData.logoutSuccessMessage)
        // })
})

test.describe('Login functionality 2', () => {
        test.beforeEach(async ({ landingPage }) => {
                await landingPage.navigateToLandingPage()
                await landingPage.navigateToLoginPopUp()
        })

        // test("TC_001 - Verify login fails with invalid Email", async ({ loginPage }) => {
        //         await loginPage.submitLogin(loginInputData.invalidLoginDetails[0].emailAddress, loginInputData.invalidLoginDetails[0].password)
        //         expect(await loginPage.getWarnigMessage()).toBe(loginExpectedData.warningMessage)
        // })

        test("TC_002 - Verify login success with valid Email", async ({ loginPage, page }) => {
                await loginPage.login(config.username, config.password)
                await expect(page.getByRole('heading', { name: 'Our Top Courses' })).toBeVisible()
                // await expect(page).toHaveURL(/route=account\/account/)
        })

        // test("TC_003 - Verify user can logout successfully from My Account", async ({ loginPage, page }) => {
        //         await loginPage.submitLogin(loginInputData.validLoginDetails[0].emailAddress, loginInputData.validLoginDetails[0].password)
        //         await loginPage.logoutFromAccount()
        //         await expect(page).toHaveURL(/route=account\/logout/);
        //         expect(await loginPage.getLogoutSuccessMessage()).toBe(loginExpectedData.logoutSuccessMessage)
        // })
})

// test('Login 1', async ({ page }) => {
//   await page.goto('/');

//   console.log(`Environment: ${config.environment}`);
//   console.log(`Base URL: ${config.baseUrl}`);

//   await page.getByRole('button', { name: 'Login' }).click();

//   await page.getByPlaceholder('Email or phone number').fill(config.username);

//   console.log(`Username: ${config.username}`);

//   await page.getByPlaceholder('Enter password').fill(config.password);
//   console.log(`Password: ${config.password}`);

//   await page.getByRole('button', { name: 'Log In' }).nth(1).click();

//   // await expect(page.getByTestId('status')).toHaveText('Our Top Courses');

//   // await expect(page.locator('h2:text("Our Top Courses")')).toHaveText('Our Top Courses');

//   await expect(page.getByRole('heading', { name: 'Our Top Courses' })).toBeVisible();

//   // await page.pause();
// });

// test('Login 2', async ({ page }) => {
//   await page.goto('/');

//   console.log(`Environment: ${config.environment}`);
//   console.log(`Base URL: ${config.baseUrl}`);

//   await page.getByRole('button', { name: 'Login' }).click();

//   await page.getByPlaceholder('Email or phone number').fill(config.username);

//   console.log(`Username: ${config.username}`);

//   await page.getByPlaceholder('Enter password').fill(config.password);
//   console.log(`Password: ${config.password}`);

//   await page.getByRole('button', { name: 'Log In' }).nth(1).click();

//   // await expect(page.getByTestId('status')).toHaveText('Our Top Courses');

//   // await expect(page.locator('h2:text("Our Top Courses")')).toHaveText('Our Top Courses');

//   await expect(page.getByRole('heading', { name: 'Our Top Courses' })).toBeVisible();

//   // await page.pause();
// });


