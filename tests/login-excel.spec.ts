import {test, expect } from '../fixtures/testFixture'
import { readExcelData } from '../data/test-data-readers/excel-reader'

test.use({ storageState: { cookies: [], origins: [] } })

interface LoginTestData {
    username: string;
    password: string;
}

const logindata = readExcelData<LoginTestData>('data/test-data/login-data.xlsx','LoginData');

for (const userslogindata of logindata) {

test(`Validate login from Excel ${userslogindata.username}`, async ({page, loginPage, landingPage}) => {
    await page.goto('/')

    // open login pop-up
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    console.log(logindata);

    expect(logindata.length).toBeGreaterThan(0);
    expect(logindata[0].username).toBeTruthy();

    // login into the application
    await loginPage.login(userslogindata.username, String(userslogindata.password))
    console.log(`Logging in with user: ${userslogindata.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
});

}

test('Read test data from Excel', async ({page, loginPage}) => {
    await page.goto('/')
    const data = readExcelData<LoginTestData>('data/test-data/login-data.xlsx','LoginData');

    console.log(data);

    expect(data.length).toBeGreaterThan(0);
    expect(data[0].username).toBeTruthy();
});