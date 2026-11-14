import {test, expect} from '@playwright/test'

test('sapient interview', async({page}) =>{

    await page.goto('https://www.saucedemo.com/')

    await page.getByPlaceholder('Username').fill('standard_user')

    await page.getByPlaceholder('Password').fill('secret_sauce')

    await page.getByRole('button', {name : 'Login'}).click()
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
    // await expect(page).toHaveTitle(/Products/)

    await page.locator('#add-to-cart-sauce-labs-backpack').click()
    await page.locator('#add-to-cart-sauce-labs-bike-light').click()

    await page.locator("//div[@id='shopping_cart_container']//a").click()

    
    await page.pause()


})

// Navigate to: https://www.saucedemo.com/

// Login using:
// Username: standard_user
// Password: secret_sauce
// Verify successful login by checking that the inventory page is loaded.

// Add the following items to the cart:
// “Sauce Labs Backpack”
// “Sauce Labs Bike Light”

// Navigate to the cart and verify both items are present.
// Swag Labs
// Sauce Labs Swag Labs app