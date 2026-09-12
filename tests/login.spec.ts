import { test, expect } from '@playwright/test';
import { config } from '../config/env.config';

test('Login', async ({ page }) => {

    await page.goto('/');

    console.log(`Environment: ${config.environment}`);
    console.log(`Base URL: ${config.baseUrl}`);  

    await page.getByRole('button', { name: 'Login' })
        .click();

    await page.getByPlaceholder("Email or phone number")
        .fill(config.username);

        console.log(`Username: ${config.username}`);  


    await page.getByPlaceholder("Enter password")
        .fill(config.password);
        console.log(`Password: ${config.password}`);  


    await page.getByRole('button', { name: 'Log In' }).nth(1)
        .click();


    // await expect(page.getByTestId('status')).toHaveText('Our Top Courses');

    // await expect(page.locator('h2:text("Our Top Courses")')).toHaveText('Our Top Courses');

    await expect(
        page.getByRole('heading', { name: 'Our Top Courses' })
    ).toBeVisible();

    await page.pause();

});