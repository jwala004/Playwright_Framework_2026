// import { test, expect } from '@playwright/test';
// import { config } from '../config/env.config';

// test('Login', async ({ page }) => {

//     await page.goto('/');

//     console.log(`Environment: ${config.environment}`);
//     console.log(`Base URL: ${config.baseUrl}`);  

//     await page.locator("#login2").click();

//     await page.locator("#loginusername")
//         .fill(config.username);

//         console.log(`Username: ${config.username}`);  

//     await page.locator("#loginpassword")
//         .fill(config.password);
//         console.log(`Password: ${config.password}`);  

//     await page.getByRole('button', { name: 'Log in' })
//         .click();

//     // await expect(page.getByTestId('status')).toHaveText('Our Top Courses');

//     // await expect(page.locator('h2:text("Our Top Courses")')).toHaveText('Our Top Courses');

//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").textContent());  
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").innerText());  
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").innerHTML());  
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").allTextContents());
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser"));
//     console.log('Username on dashboard : ' + await page.locator("#nameofuser").getByText(`Welcome ${config.username}`).textContent());

//     // console.log('Expect result : ' + await expect(page.locator("#nameofuser")).toHaveText(`Welcome ${config.username}`));  
//     // console.log('Expect result : ' + await expect(page.locator("#nameofuser")).toHaveText(`Welcome ${config.username}`));
//     // .textContent()).toHaveText(`Welcome ${config.username}`));  

//     // await expect(page.locator("#nameofuser").innerHTML().toHaveText(`Welcome ${config.username}`));

//     const textContent = await page.locator("#nameofuser").textContent();
//     console.log('Header text ==> ', textContent);

//     const userLocator = page.locator("#nameofuser");

//     // 1. Extract and log the actual text
//     const actualText = await userLocator.textContent();
//     console.log('Header text found:', actualText);


//     await page.mouse
//     // ().hover(userLocator);




//     // 2. Perform the web-first assertion
//     console.log('Performing assertion to check if header text matches expected value...' + await expect(userLocator).toHaveText(`Welcome ${config.username}`));
//     await expect(userLocator).toHaveText(`Welcome ${config.username}`);
// });

// test('Login2', async ({ page }) => {

//     await page.goto('/');

//     console.log(`Environment: ${config.environment}`);
//     console.log(`Base URL: ${config.baseUrl}`);  

//     await page.locator("#login2").click();

//     await page.locator("#loginusername")
//         .fill(config.username);

//         console.log(`Username: ${config.username}`);  

//     await page.locator("#loginpassword")
//         .fill(config.password);
//         console.log(`Password: ${config.password}`);  

//     await page.getByRole('button', { name: 'Log in' })
//         .click();

//     // await expect(page.getByTestId('status')).toHaveText('Our Top Courses');

//     // await expect(page.locator('h2:text("Our Top Courses")')).toHaveText('Our Top Courses');

//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").textContent());  
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").innerText());  
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").innerHTML());  
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser").allTextContents());
//     // console.log('Username on dashboard : ' + await page.locator("#nameofuser"));
//     console.log('Username on dashboard : ' + await page.locator("#nameofuser").getByText(`Welcome ${config.username}`).textContent());

//     // console.log('Expect result : ' + await expect(page.locator("#nameofuser")).toHaveText(`Welcome ${config.username}`));  
//     // console.log('Expect result : ' + await expect(page.locator("#nameofuser")).toHaveText(`Welcome ${config.username}`));
//     // .textContent()).toHaveText(`Welcome ${config.username}`));  

//     // await expect(page.locator("#nameofuser").innerHTML().toHaveText(`Welcome ${config.username}`));

//     const textContent = await page.locator("#nameofuser").textContent();
//     console.log('Header text ==> ', textContent);

//     const userLocator = page.locator("#nameofuser");

//     // 1. Extract and log the actual text
//     const actualText = await userLocator.textContent();
//     console.log('Header text found:', actualText);


//     await page.mouse
//     // ().hover(userLocator);




//     // 2. Perform the web-first assertion
//     console.log('Performing assertion to check if header text matches expected value...' + await expect(userLocator).toHaveText(`Welcome ${config.username}`));
//     await expect(userLocator).toHaveText(`Welcome ttt ${config.username}`);
// });