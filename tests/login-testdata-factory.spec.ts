import { test, expect } from '../fixtures/testFixture';
import { TestDataFactory } from '../data/factories/TestDataFactory';
import { loginDataSchema } from '../data/contracts/login-data.schema';

test.use({ storageState: { cookies: [], origins: [] } })

// Load and validate data during test collection.
const loginTestDataFromJson = TestDataFactory.load('data/test-data/login-data.json', loginDataSchema);
const loginTestDataFromCsv = TestDataFactory.load('data/test-data/login-data.csv', loginDataSchema);
const loginTestDataFromExcel = TestDataFactory.load('data/test-data/login-data.xlsx', loginDataSchema, { sheetName: 'LoginData'});

// Generate one independent Playwright test per record.
for (const usersloginTestDataFromJson of loginTestDataFromJson) {
    
    test(`Login test : usersloginTestDataFromJson - ${usersloginTestDataFromJson.username} tag: ['@API', '@UAT']` , async ({page, loginPage, landingPage}) => {
    
    await page.goto('/');

    // Open login pop-up
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    // login into the application
    await loginPage.login(usersloginTestDataFromJson.username, String(usersloginTestDataFromJson.password))
    console.log(`Logging in with user: ${usersloginTestDataFromJson.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
    });
}

// Generate one independent Playwright test per record.
for (const usersloginTestDataFromCsv of loginTestDataFromCsv) {
    
    test(`Login test : usersloginTestDataFromCsv - ${usersloginTestDataFromCsv.username}`, async ({page, loginPage, landingPage,}) => {
    
    await page.goto('/');

    // Open login pop-up
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    // login into the application
    await loginPage.login(usersloginTestDataFromCsv.username, String(usersloginTestDataFromCsv.password))
    console.log(`Logging in with user: ${usersloginTestDataFromCsv.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
    });
}

// Generate one independent Playwright test per record.
for (const usersloginTestDataFromXLSX of loginTestDataFromExcel) {
    
    test(`Login test : usersloginTestDataFromXLSX - ${usersloginTestDataFromXLSX.username}`, async ({page, loginPage, landingPage,}) => {
    
    await page.goto('/');

    // Open login pop-up
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    // login into the application
    await loginPage.login(usersloginTestDataFromXLSX.username, String(usersloginTestDataFromXLSX.password))
    console.log(`Logging in with user: ${usersloginTestDataFromXLSX.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
    });
}