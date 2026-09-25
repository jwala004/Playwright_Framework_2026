import { test, expect } from '../fixtures/testFixture'
import { config } from '../config/env.config';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login - Logout functionality test", () => {

    test.beforeEach(async ({ landingPage }) => {
        await landingPage.navigateToLandingPage()
        await landingPage.navigateToLoginPopUp()
    }),

    test("Verify login success with valid Email", async ({ loginPage, page }) => {
    await loginPage.login(config.username, config.password)
    await expect(page.locator('span.bg-gradient-to-br', { hasText: 'J' })).toBeVisible()
    });

    test.afterEach(async({logoutPage}) => {
    await logoutPage.logout()
    })

})

test('Login - Logout : All in a single test-case', async({page, landingPage, loginPage, logoutPage}) =>{
    // launch the application
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    // verify login
    await loginPage.login(config.username, config.password)
    await expect(page.locator('span.bg-gradient-to-br', { hasText: 'J' })).toBeVisible()

    // logout from the application
    await logoutPage.logout()
})
