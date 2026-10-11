import {test, expect, Locator} from '@playwright/test'


test('Alerts and Toasts handling @alerts', async({page}) =>{
    await page.goto('/')
    
    await page.getByRole('button', {name : 'Alerts & Windows'}).click()
    // await page.getByRole('link', { name: 'Alerts & Toasts' }).click() // this will simply not work here
    await page.getByRole('complementary').getByRole('link', { name: 'Alerts & Toasts' }).click()

    const alertText : string  = (await page.getByRole('heading', {name: 'Alerts'}).textContent())!
    console.log("alertText: " + alertText)

    const alertparagraphText : string = (await page.getByText('An alert is a pop-up dialog box used to display a message or warning to the user.').textContent())!
    console.log("paragraphText: " + alertparagraphText)

    await expect(page.getByRole('heading', {name: 'Alerts'})).toHaveText('Alerts')

    await expect(page.getByText('An alert is a pop-up dialog box used to display a message or warning to the user.'))
    .toHaveText('An alert is a pop-up dialog box used to display a message or warning to the user.')

    // Validate ' Show Alert' button to be visible
    await expect(page.getByRole('button', {name: ' Show Alert'})).toBeVisible()

    await page.getByRole('button', {name: ' Show Alert'}).click()

    const alertMessageTextInPopUp = await page.getByRole('heading', {name: 'Alert Message'}).textContent()
    console.log('alertMessageTextInPopUp: ' + alertMessageTextInPopUp)
    await expect(page.getByRole('heading', {name: 'Alert Message'})).toHaveText('Alert Message')
    await page.getByRole('button', {name: 'OK'}).click()
    
    // Once pop-up is dismissed then, Validate ' Show Alert' button again to be visible
    await expect(page.getByRole('button', {name: ' Show Alert'})).toBeVisible()



    // await page.pause()
})