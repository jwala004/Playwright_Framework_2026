import {test, expect} from '@playwright/test'

test('Multi-pages handling or New Pages/tabs handling', async({page, context}) =>{

    // 1. Navigate to your base URL
    await page.goto('https://example.com/dashboard');

    // 2. Open the new tab by clicking the trigger element
    const [newPage] = await Promise.all([context.waitForEvent('page'), page.getByRole('button', {name : 'New tab'}).click()])

    // 3. Wait for the new page to load and do your interactions there
    newPage.waitForLoadState('domcontentloaded')
    // Do the interaction using 'newPage'
    // here, for example;
    await newPage.getByRole('textbox', { name: 'Enter Details' }).fill('Playwright Test');
    await newPage.getByRole('button', { name: 'Save' }).click();

    // 4. Close the new tab once you are done
    await newPage.close() // close the 'newPage' or 'tab'

    // 5. Switch back automatically by simply using the original 'page' variable
    // Playwright keeps the main page active in the background
    await page.getByRole('button', {name : 'open'}).click()
})