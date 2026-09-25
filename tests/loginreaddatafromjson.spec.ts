import {test, expect } from '../fixtures/testFixture'
import users from '../test-data/logindata.json'

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login functionality validation from JSON data', () => {

    test.beforeEach(async ({landingPage}) => {
        await landingPage.navigateToLandingPage()
        await landingPage.navigateToLoginPopUp()
    })
    
    for (const user of users) {

    test(`Parametrised Login Test => Reading test data from json file ${user.username}`, async ({ page, loginPage }) => {
        await loginPage.login(user.username, user.password)
        console.log(`Logging in with user: ${user.username}`)
        
        await expect(page.getByRole('heading', {name:'Our Top Courses'})).toBeVisible()
    });

    }

    // test.afterEach()
})

    // for (const user of users) {

    // test('Parametrised Login Test => Reading test data from json file', async ({ page, loginPage }) => {
    //     await loginPage.login(user.username, user.password)
        
    //     await expect(page.getByRole('heading', {name:'Our Top Courses'})).toBeVisible()
    // });

    // }
