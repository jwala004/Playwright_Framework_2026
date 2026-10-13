import {test, expect } from '../fixtures/testFixture'
// import users from '../test-data/logindata.json'
import { readJson } from '../data/test-data-readers/json-reader';

test.use({ storageState: { cookies: [], origins: [] } });

interface User {
    username: string;
    password: string;
}

const users = readJson<User[]>('data/test-data/login-data.json');

for (const user of users) {

    test(`Parametrised Login Test => Reading test data from json file ${user.username}`, async ({ page, landingPage, loginPage }) => {
    
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    // login into the application
    await loginPage.login(user.username, String(user.password))
    console.log(`Logging in with user: ${user.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
  
    });
}