import {test, expect} from '@playwright/test'

test('Multi-pages handling or New Pages/tabs handling', async({page, context}) =>{

    test.skip(true, 'Skip this test-case')

    // 1. Navigate to your base URL
    await page.goto('/');

    await page.getByRole('button', {name : 'Alerts & Windows'}).click()

    await page.getByRole('main').getByRole('link', {name:'Browser Windows'}).click()

    await expect(page.getByRole('heading', {name: 'Browser Windows'})).toHaveText('Browser Windows')

    // 2. Open the new tab by clicking the trigger element
    const [newPage] = await Promise.all([context.waitForEvent('page'), page.getByRole('button', {name : ' New Tab'}).click()])

    // 3. Wait for the new page to load and do your interactions there
    await newPage.waitForLoadState('domcontentloaded')

    // Do the interaction using 'newPage' here, for example;
    // await newPage.getByRole('textbox', { name: 'Enter Details' }).fill('Playwright Test');
    // await newPage.getByRole('button', { name: 'Save' }).click();

    await expect(newPage).toHaveURL('https://questaspire.com/')

    // 4. Close the new tab once you are done
    await newPage.close() // close the 'newPage' or 'tab'

    // 5. Switch back automatically by simply using the original 'page' variable
    // Playwright keeps the main page active in the background
    // await page.getByRole('button', {name : 'open'}).click()

    await page.pause()
})