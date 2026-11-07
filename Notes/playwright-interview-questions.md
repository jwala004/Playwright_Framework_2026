# . What are the key features of Playwright that make it a powerful automation tool?
Playwright provides;
- cross-browser compatibility
- automatic waiting
- robust locators and 
- built-in support for mobile emulation and accessibility testing.
- It also offers features like tracing, screenshots, and PDF generation.

# . Explain the concept of tracing in Playwright and its benefits.
• Tracing in Playwright records the actions performed during test execution, providing a step-by-step visualization of the test run. It helps in debugging, identifying issues, and understanding the flow of the tests.

# . How do you handle file uploads and downloads in Playwright?
For file uploads, I use the setInputFiles() method. 

await page.getByText('Drag & Drop file here').setInputFiles('test-data/logindata.json')

await page.getByText('Drag & Drop files here or Browse files').
    setInputFiles([
        'Notes/MCP.md',
        'Notes/TypescriptNotes_InDepth.md',
        'Notes/TypescriptNotes.md'
    ])

For downloads, I use the page.waitForEvent('download') method to handle the download.    
import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs/promises';

test('Download and validate sample text file', async ({ page }) => {

    // 1. Trigger and capture the download event
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', {name: 'Download Sample File'
        }).click()
    ]);

    // 2. Get the suggested filename
    const fileName = download.suggestedFilename();

    // 3. Define the download path
    const filePath = path.resolve('downloads', fileName);

    // 4. Create download directory if it doesn't exist
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // 5. Save the downloaded file
    await download.saveAs(filePath);

    // 6. Read downloaded file contents
    const content = await fs.readFile(filePath, 'utf-8');

    // 7. Validate file contents
    expect(content).toContain('Sample downloaded file');
    expect(content.length).toBeGreaterThan(0);
});


# . What is the purpose of the Playwright Inspector and how do you use it?
The Playwright Inspector is a debugging tool that allows you to inspect the DOM, perform actions, and generate code snippets. It helps in understanding the structure of the page and debugging issues by providing a visual representation of the elements.


#  Explain the different types of locators available in Playwright.
# -> this one needs improvement
Playwright supports various locator types, including text, CSS, XPath, id, and
data-testid. I can combine these locators using logical operators like and, or,
and not to create more specific and robust locators.


# How do you handle iframes and nested frames in Playwright?
- 1st way;
frameLocator() (Lazy & Auto-Waiting)

// Playwright's frameLocator() automatically waits for the iframe to load AND the input to be ready

const frame = page.frameLocator('#myFrame'); // or page.frameLocator('iframe[name="myFrame"]')

await frame.locator('#username').fill('admin');
await frame.locator('#password').fill('password');

- Handling nested iframes:
You can chain frameLocator() calls to access nested frames.

const nestedFrame = page
    .frameLocator('#parentFrame')
    .frameLocator('#childFrame');

await nestedFrame.locator('#username').fill('admin');

// In one line
await page.frameLocator('iframe[name="security-iframe"]').locator('#answer-input').fill('Max')

- 2nd way;
page.frame() (Immediate & Synchronous)


# . What are the different types of assertions available in Playwright?
Playwright provides a wide range of assertions, including 
toHaveText()
toHaveValue()
toHaveAttribute()
toHaveClass()
toBeChecked()

These assertions help in verifying the expected behavior of the application.


# How do you generate reports in Playwright?
I have integrated allure report in my framework. 
first, I will add the allure dependecy
then, I will do the configuration changes in playwright.config.ts file like ['allure-playwright', { resultsDir: "allure-results" }]
then, if needed i will make configuration changes in 'package.json' scripts to clear the previously generated report
then, Run the test-cases
then, Generte the report using command


# . Explain the concept of context and page in Playwright.
In Playwright, a context represents a browser context, which can have multiple pages. Each page represents a tab or window in the browser. I can create multiple contexts and pages to simulate different user scenarios and perform parallel testing.


# 15. What is the purpose of the waitForSelector() method?
The waitForSelector() method waits for an element to appear in the DOM before proceeding. It helps handle dynamic content loading:

await page.waitForSelector('div#content');

-> Using waitForSelector() we can implement explicit wait.


# 16. How do you take screenshots in Playwright?
You can take screenshots using the screenshot() method:

await page.screenshot({ path: 'screenshot.png' });

# How do you take screenshots of specific element in Playwright?
await page.locator('.user-profile-card').screenshot({ path: 'screenshots/user-card.png' });


# What is the difference between page.click() and element.click()?
locator.click() – Recommended approach
- Uses lazy evaluation: the element is resolved when the action is performed.
- Automatically waits for actionability conditions.
- Handles dynamic DOM changes more reliably through re-resolution and retrying.

await page.locator('#loginButton').click()

ElementHandle.click() – Immediate element reference
- page.$() finds the element immediately and returns an ElementHandle.
- The handle refers to a particular DOM element.
- If the page re-renders and that element gets detached, the handle can become stale, causing failures.

const button = await page.$('#loginButton')
await button?.click()

page.click() – Selector-based approach
- Accepts a selector and locates the element when the action is performed.
- Performs actionability checks and auto-waiting.

await page.click('#loginButton')


# 19. How do you handle alerts and confirmations in Playwright?
Use the page.on('dialog') event to handle alerts and confirmations:

page.on('dialog', async dialog => {
console.log(dialog.message());
await dialog.accept(); // or dialog.dismiss();
});

# . What is the purpose of the setViewportSize() method?
The setViewportSize() method is used to set the size of the browser viewport, which can be useful for responsive testing:

await page.setViewportSize({ width: 1280, height: 720 });

# How do you handle keyboard input in Playwright?
Use the keyboard object to simulate keyboard input:

await page.keyboard.type('Hello, World!');

#  How do you run tests in parallel using Playwright?
• You can run testsin parallel by using the --workers flag when executing tests or
by configuring the workers property in the Playwright configuration file.

# 24. What is the purpose of the page.evaluate() method?
• The page.evaluate() method allows you to execute JavaScript code in the context
of the page. It can be used to interact with the DOM or retrieve information:

const title = await page.evaluate(() => document.title);

# 25. How do you handle timeouts in Playwright?
You can set timeouts globally in the configuration file or for specific actions using the timeout option:

await page.goto('https://example.com', { timeout: 5000 });

# 26. Explain the use of the waitForEvent() method.
The waitForEvent() method allows you to wait for a specific event to occur on the page, such as a download or navigation:

const [response] = await Promise.all([page.waitForResponse('**/api/data'), page.click('button#loadData')]);


# 27. How do you assert that an element is visible in Playwright?
Use the toBeVisible() assertion to check if an element is visible:

await expect(page.locator('div#message')).toBeVisible();


# 28. What is the purpose of the page.goto() method?
The page.goto() method is used to navigate to a specified URL and wait for the page to load completely.


# 29. How do you handle multiple tabs in Playwright?
You can handle multiple tabs by listening for the page.on('popup') event and managing the new page instance:

const [newPage] = await Promise.all([page.waitForEvent('popup'), page.click('a#openNewTab')]);


# 30. How do you clear cookies in Playwright?
Use the context.clearCookies() method to clear all cookies in the browser
await context.clearCookies();


# 31. What is the significance of the context object in Playwright?
The context object represents a browser context that can have its own cookies,
local storage, and session storage. It allows for isolated testing scenarios.


# 32. How do you handle mouse actions like drag and drop in Playwright?
Use the dragAndDrop() method to perform drag-and-drop actions:
await page.locator('div#source').dragAndDrop('div#target');


# 33. What is the purpose of the setInputFiles() method?
The setInputFiles() method is used to set the files to be uploaded.
await page.getByText('Drag & Drop file').setInputFiles('test-data/logindata.json')


# 34. How do you handle popups in Playwright?

test('Handle popup window', async ({ page }) => {
    // 1. Wait for popup event and trigger the action simultaneously
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.locator('#open-popup-button').click()]);

    // 2. Wait for popup page to load
    await popup.waitForLoadState('domcontentloaded');

    // 4. Interact with elements inside the popup
    await popup.getByLabel('Username').fill('myUsername');
    await popup.getByLabel('Password').fill('myPassword');
});

# 35. How do you take a full-page screenshot in Playwright?
• Use the screenshot() method with the fullPage option:

await page.screenshot({ path: 'fullpage.png', fullPage: true });


# 36. What is the use of the page.waitForTimeout() method?
The page.waitForTimeout() method is used to pause the execution for a specified amount of time (in milliseconds):

await page.waitForTimeout(2000); // Wait for 2 seconds

// Explicitly wait for the dynamic question container to appear
const questionElement = await page.waitForSelector('.security-question-row', { state: 'visible', timeout: 5000 });


# 37. How do you assert that an element contains specific text in Playwright?
Use the toHaveText() assertion to check if an element containsthe expected text:

await expect(page.locator('h1')).toHaveText('Welcome');


# 38. What is the purpose of the setViewportSize() method?
The setViewportSize() method is used to set the size of the browser viewport, which is useful for testing responsive designs:

await page.setViewportSize({ width: 1280, height: 720 });


# 39. How do you navigate back and forward in Playwright?
- Use the page.goBack() and page.goForward() methods to navigate through the browser history:

await page.goBack();
await page.goForward();


# How do you handle slow-loading pages in Playwright?
Use explicit waits or the waitForSelector() method to wait for specific elements to appear before proceeding:

await page.waitForSelector('div#content', { timeout: 10000 });


# 41. How do you run Playwright tests in headless mode?
You can run Playwright tests in headless mode by setting the headless option
to true in the browser launch configuration:

const browser = await playwright.chromium.launch({ headless: true });


# 42. What is the purpose of the page.evaluate() method?
• The page.evaluate() method allows you to execute JavaScript code in the context
of the page and retrieve the result:

const title = await page.evaluate(() => document.title);


# 43. How do you handle asynchronous operations in Playwright?
Use async/await syntax to handle asynchronous operations, ensuring that your code waits for promises to resolve before proceeding.


# 44. What is the purpose of the context.tracing.start() method?
The context.tracing.start() method begins recording a trace of the actions performed during test execution, which can be useful for debugging and analysis.

45. How do you stop tracing in Playwright?
Use the context.tracing.stop() method to stop recording the trace and save it to a file:

await context.tracing.stop({ path: 'trace.zip' });

46. How do you handle JavaScript errors in Playwright?
Use the page.on('console') event to listen for console messages, including errors:

page.on('console', msg => console.log(msg.text()));


47. What is the significance of the page.on('response') event?
The page.on('response') event allows you to listen for network responses and perform actions based on the response data:

page.on('response', response => {
console.log(`Response: ${response.url()} - ${response.status()}`);
});

48. How do you set up Playwright for a new project?
npm init playwright@latest

49. What is the purpose of the waitForNavigation() method?
The waitForNavigation() method waitsfor the page to navigate to a new URL, which is useful after actions that trigger navigation:

await Promise.all([page.click('a#link'), page.waitForNavigation()]);

50. How do you ensure your tests are maintainable and scalable?
• I follow best practices such as using the Page Object Model (POM), modularizing
code, implementing reusable functions, and regularly refactoring tests to keep
them clean and maintainable.
These questions and answers provide a comprehensive overview for Playwright automation testers preparing for interviews.

# Handling Standard Alerts or Confirmations (Accept / Dismiss)
import { test, expect } from '@playwright/test';

test('handle alert dialog', async ({ page }) => {
  
  await page.goto('https://example.com/alerts');

  // 1. Listen for the dialog event before triggering it
  page.on('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    
    // Accept the dialog (clicks "OK" or "Yes")
    await dialog.accept(); // Alternatively, to dismiss: await dialog.dismiss();
  });

  // 2. Trigger the action that opens the alert
  await page.click('#alert-button');
});

# How does auto-waiting works in playwright? 
Playwright's auto-waiting automatically waits for an element to become ready before performing an action. This reduces flaky tests and eliminates the need for unnecessary hard-coded waits.

How it works:
Before performing an action like click(), Playwright checks the following conditions:
1. Visible – Element must be visible.
2. Stable – Element's position and size must remain unchanged for at least two consecutive animation frames.
3. Receives Events – Element must be able to receive pointer events (not blocked by another element).
4. Enabled – Element must be enabled.

If these conditions aren't met, Playwright keeps retrying until they pass or the timeout expires.
Basic example;

await page.getByRole('button', { name: 'Login' }).click();

Playwright automatically waits for the button to become actionable before clicking it.
Important distinction:
- Auto-waiting: Waits for actionability before performing actions.
- Auto-retrying assertions: Repeatedly checks conditions until they pass or time out.

# Handling Mouse actions 

  // Hover over an element (e.g., to reveal a tooltip or dropdown menu)
  await page.locator('#menu-button').hover();

  // Standard Single Click
  await page.locator('#submit-btn').click();

  // Right-Click (Context Click) to open a context menu
  await page.locator('#context-target').click({ button: 'right' });

  // Double-Click
  await page.locator('#double-click-box').dblclick();

  // High-Level Drag and Drop
  const sourceElement = page.locator('#draggable-box');
  const targetElement = page.locator('#drop-zone');
  await sourceElement.dragTo(targetElement);

  // Press the left mouse button down
  await page.mouse.down();
  
  // Drag to a new coordinate position
  await page.mouse.move(350, 250);
  
  // Release the mouse button
  await page.mouse.up();

# How do you optimize playwright test execution?  

# What is the use of package-lock.json?
package-lock.json is a file automatically generated by npm that records the exact versions of dependencies installed in your Node.js project.

Its main purpose is to ensure consistent and reproducible dependency installation across different machines and environments.


# trace - question on it?

# Top Playwright CLI Commands You Must Know!
Playwright CLI (Command-Line Interface) is a powerful command-line tool provided by the Playwright framework to facilitate various tasks related to test automation. It serves as an interface to create, debug, and manage Playwright projects efficiently.

- Playwright Installation
npm init playwright@latest

- Update Playwright
npm install -D @playwright/test@latest

- Run all the Tests
npx playwright test

- Run Specific Test file
npx playwright test tests/PlaywrightCLIPractice1.spec.ts
npx playwright test PlaywrightCLIPractice1.spec.ts

- Run Playwright Tests on Specific browser
npx playwright test --project=chromium

Run Test in Headed Mode
- npx playwright test --headed
- npx playwright test --headed --project=chromium

Enable Playwright Reporter | In Built Reporters | List, Line, Dot, HTML,Blob, Json, Junit, Github Reporters
- npx playwright test --reporter=html

Show Playwright Reporter | HTML Report with Screenshot, Videos, Retries and Trace
- npx playwright show-report

Run Test with Specific tags | Tags in Playwright | Tagging Tests
- npx playwright test --grep=@UAT

Skip Test Run with Specific tag 
- npx playwright test --grep-invert=@UAT

Debug Playwright Test | Advanced Playwright Debugging Techniques using Playwright Inspector
- npx playwright test --debug

Playwright Codegen | Codeless Automation | Playwright Test Generator | Record Test Script
- npx playwright codegen

Record Playwright Trace |  Trace Viewer in Playwright
- npx playwright test --trace=on

Run Last Failed Test/s - If any test fails its id get logged in .last-run.json file
- npx playwright test --last-failed

Git Last changed File - Playwright Tutorial | Push Code to Github | Clone Repository
| Raise PR /Pull Request in Github | How to Create,  Review, Merge Pull Request

- npx playwright test  --only-changed

Check Playwright version
- npx playwright --version

Or
- npx playwright -V

Playwright CLI help -
- npx playwright --help

Or
- npx playwright -h

-----------------------------------------------------------------------------------------------------------------------------------
# clicks on submit button to do login and checks for the API response and verifies that the response is 200, and check the success message is displayed.
import { test, expect } from '@playwright/test';

test('Verify login API response and success message', async ({ page }) => {

    // 1. Navigate to login page
    await page.goto('/login');

    // 2. Enter login credentials
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('password123');

    // 3. Wait for API response and click Submit simultaneously
    const [response] = await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/api/auth/login') &&
            response.request().method() === 'POST'
        ),
        page.getByRole('button', { name: 'Submit' }).click()
    ]);

    // 4. Verify API response status
    expect(response.status()).toBe(200);

    // 5. Verify success message
    await expect(page.getByText('Login successful'))
        .toBeVisible();

});

Key points
1. page.waitForResponse() listens for the matching API response.
2. Promise.all() ensures the response listener is registered before clicking Submit.
3. response.url() identifies the API endpoint.
4. response.request().method() verifies the HTTP method.
5. response.status() validates the HTTP status code.
6. expect().toBeVisible() automatically retries until the success message appears or the assertion times out.
Interview takeaway: This approach validates both API-level behaviour (HTTP 200) and UI-level behaviour (success message) in a single test.