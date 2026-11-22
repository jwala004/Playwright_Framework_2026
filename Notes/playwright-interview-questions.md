# . What are the key features of Playwright that make it a powerful automation tool?
Playwright provides;
- cross-browser compatibility
- automatic waiting
- robust locators and 
- built-in support for mobile emulation and accessibility testing.
- It also offers features like tracing, screenshots, and PDF generation.

# Playwright Advantages over Selenium.
1. Pick locator tool
2. Code generation tool (Playwright Test Generator)
3. Fixtures
4. Locators of Playwright are very advanced
5. Playwright installation and setup is very easy (Easy Setup and Configuration)
6. Parallel testing feature
7. Screenshot feature (Taking screenshot is very easy, it's configuration is very easy)
8. Codegen tool
9. Playwright Inspector (Debugging tool)
10. Trace Viewer
11. Built-in Reporters: List, Dot, Line, JSON, JUnit, HTML and Allure reports
12. Reuse of Authentication state (Save and Reuse Authentication State | Skip Login)
13. Cross-Browser Support - Chromium browsers (Chrome, Edge), Webkit (Safari), and Firefox
14. Multi-Language Support - JavaScript / TypeScript, Python, Java
15. Playwright has its own test runner
16. Playwright is lightning fast, it is as much fast that sometimes you need to slow down the execution or pause the test to validate.
17. Handle New Page | New Tab | Child Window is very easy
18. Playwright execution from command is very dynamic and flexible
19. implementing retries feature for failed test-cases are very easy
20. playwright.config.ts file is one of the best features of playwright
21. UI Mode in Playwright
22. Reading test data from external sources(json, csv, excel, etc)
23. Upload files (Upload Single File/Multiple Files)
24. Visual Testing in Playwright | Visually Compare Screenshot
25. CI/CD support
26. Parameterization (Parameterize Tests)
27. MCP support
28. Modern and elegant

# . Explain the concept of tracing in Playwright and its benefits.
Tracing in Playwright records the actions performed during test execution, providing a step-by-step visualization of the test run. It helps in debugging, identifying issues, and understanding the flow of the tests.


# . How do you handle file uploads and downloads in Playwright?
For file uploads, I use the setInputFiles() method. 

await page.getByText('Upload file').setInputFiles('test-data/logindata.json')

await page.getByText('Upload file')
    .setInputFiles([
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
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', {name: 'Download Sample File'}).click()]);

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


# What is the purpose of the Playwright Inspector and how do you use it?
The Playwright Inspector is a debugging tool that allows you to inspect the DOM, perform actions, and generate code snippets. It helps in understanding the structure of the page and debugging issues by providing a visual representation of the elements.


#  Explain the different types of locators available in Playwright.
# -> this one needs improvement
Playwright supports various locator types, including text, CSS, XPath, id, and data-testid. I can combine these locators using logical operators like and, or, and not to create more specific and robust locators.


# How do you handle iframes and nested frames in Playwright?
- 1st way;
frameLocator() (Lazy & Auto-Waiting)

// Playwright's frameLocator() automatically waits for the iframe to load AND the input to be ready

const frameLocator = page.frameLocator('#myFrame'); // or page.frameLocator('iframe[name="myFrame"]')

await frameLocator.locator('#username').fill('admin');
await frameLocator.locator('#password').fill('password');

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
toBeEnabled()
toBeDisabled()

These assertions help in verifying the expected behavior of the application.


# How do you generate reports in Playwright?
I have integrated allure report in my framework. 
first, I will add the allure dependecy
then, I will do the configuration changes in playwright.config.ts file like 
reporter: [['allure-playwright', { resultsDir: "allure-results" }]]
then, if needed i will make configuration changes in 'package.json' scripts to clear the previously generated report
then, Run the test-cases
then, Generte the report -> npm run allure:generate

# . Explain the concept of context and page in Playwright.
In Playwright, a context represents a browser context, which can have multiple pages. Each page represents a tab or window in the browser. I can create multiple contexts and pages to simulate different user scenarios and perform parallel testing.


# 15. What is the purpose of the waitForSelector() method?
The waitForSelector() method waits for an element to appear in the DOM before proceeding. It helps us to handle dynamic content loading:

await page.waitForSelector('div#content');

// Explicitly wait for the dynamic question container to appear
const questionElement = await page.waitForSelector('.security-question-row', { state: 'visible', timeout: 5000 });

-> Using waitForSelector() we can implement explicit wait.


# What is the difference between page.click() and element.click()?
locator('#loginButton').click() – Recommended approach
- Uses lazy evaluation: the element is resolved when the action is performed.
- Automatically waits for actionability conditions.
- Handles dynamic DOM changes more reliably through re-resolution and retrying.

await page.locator('#loginButton').click()

ElementHandle.click() – Immediate element reference
- page.$() finds the element immediately and returns an ElementHandle.
- The handle refers to a particular DOM element.
- If the page re-renders and that element gets detached, the handle can become stale, causing failures.

await (await page.$('#loginButton'))?.click();

page.click() – Selector-based approach
- Accepts a selector and locates the element when the action is performed.
- Performs actionability checks and auto-waiting.

await page.click('#loginButton')


# 19. How do you handle dialog (alerts and confirmations) in Playwright?
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
- Methpd 1:
Configure 'workers' count in the 'playwright.config.ts' file;

workers : 2 
and set fullyParallel : true

- Methpd 2:
You can run tests in parallel by using the --workers flag when executing tests or
by configuring the workers property in the Playwright configuration file.

npx playwright test --workers=4 // 4 parallel workers

/*
1. What workers Does
workers controls capacity - it defines the maximum number of parallel worker processes Playwright is allowed to spawn at the same time (e.g., workers: 4).

2. What fullyParallel Does
fullyParallel controls granularity — it determines what runs in parallel:

fullyParallel: false (Default): Playwright runs different test files in parallel across your workers, but tests within the same file run sequentially one after another.

fullyParallel: true: Playwright runs tests within the same file in parallel across your workers, alongside running multiple files concurrently.

Why This Matters
If you have 1 test file containing 10 tests, and you set workers: 4 but leave fullyParallel as its default (false), all 10 tests will still execute sequentially on a single worker because they belong to the same file. Only by setting fullyParallel: true (or splitting those 10 tests into separate files) will Playwright distribute them across your 4 workers.
*/

# 24. What is the purpose of the page.evaluate() method?
• The page.evaluate() method allows you to execute JavaScript code in the context
of the page. It can be used to interact with the DOM or retrieve information:

const title = await page.evaluate(() => document.title);


# 25. How do you handle timeouts in Playwright?
You can set timeouts globally in the configuration file or for specific actions using the timeout option:

await page.goto('https://example.com', { timeout: 5000 });


# 26. Explain the use of the waitForEvent() method.
The waitForEvent() method allows you to wait for a specific event to occur on the page, such as a download or navigation or multi tab or page handling:


# 27. How do you assert that an element is visible in Playwright?
Use the toBeVisible() assertion to check if an element is visible:

await expect(page.locator('div#message')).toBeVisible();


# 28. What is the purpose of the page.goto() method?
The page.goto() method is used to navigate to a specified URL and wait for the page to load completely.


# 29. How do you handle multiple tabs in Playwright?
You can handle multiple tabs by listening for the page.on('page') event and managing the new page instance:

const [newPage] = await Promise.all([page.waitForEvent('page'), page.click('a#openNewTab')]);


# 30. How do you clear cookies in Playwright?
Use the context.clearCookies() method to clear all cookies in the browser

await context.clearCookies();


# 31. What is the significance of the context object in Playwright?
The context object represents a browser context that can have its own cookies, local storage, and session storage. It allows for isolated testing scenarios.


# 32. How do you handle mouse actions like drag and drop in Playwright?
Use the dragAndDrop() method to perform drag-and-drop actions:

await page.locator('div#source').dragAndDrop('div#target');


# . How do you handle popups in Playwright?

test('Handle popup window', async ({ page }) => {
    // 1. Wait for popup event and trigger the action simultaneously
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.locator('#open-popup-button').click()]);

    // 2. Wait for popup page to load
    await popup.waitForLoadState('domcontentloaded');

    // 4. Interact with elements inside the popup
    await popup.getByLabel('Username').fill('myUsername');
    await popup.getByLabel('Password').fill('myPassword');
});

# . How do you take a full-page screenshot in Playwright?
• Use the screenshot() method with the fullPage option:

await page.screenshot({ path: 'fullpage.png', fullPage: true });


# How do you take screenshots of specific element in Playwright?
await page.locator('.user-profile-card').screenshot({ path: 'screenshots/user-card.png' });


# . What is the use of the page.waitForTimeout() method?
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

await page.waitForSelector('div#content', { timeout: 10000 })


# 41. How do you run Playwright tests in headless mode?
- 1st way:
 use: {
        baseURL: config.baseUrl,
        // Force headless mode in CI environments
        headless: process.env.CI ? true : false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        /* 
        trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    }

- 2nd way:
You can run Playwright tests in headless mode by setting the headless option
to true in the browser launch configuration:

const browser = await playwright.chromium.launch({ headless: true });

- Playwright runs tests in headless mode by default.


# 42. What is the purpose of the page.evaluate() method?
• The page.evaluate() method allows you to execute JavaScript code in the context
of the page and retrieve the result:

const title = await page.evaluate(() => document.title);


# 43. How do you handle asynchronous operations in Playwright?
Use async/await syntax to handle asynchronous operations, ensuring that your code waits for promises to resolve before proceeding.


# 44. What is the purpose of the context.tracing.start() method?
The context.tracing.start() method begins recording a trace of the actions performed during test execution, which can be useful for debugging and analysis.

# . How do you stop tracing in Playwright?
Use the context.tracing.stop() method to stop recording the trace and save it to a file:

await context.tracing.stop({ path: 'trace.zip' });

# . How do you handle JavaScript errors in Playwright?
Use the page.on('console') event to listen for console messages, including errors:

page.on('console', msg => console.log(msg.text()));


# . What is the significance of the page.on('response') event?
The page.on('response') event allows you to listen for network responses and perform actions based on the response data:

page.on('response', response => {
console.log(`Response: ${response.url()} - ${response.status()}`);
});

# . How do you set up Playwright for a new project?
npm init playwright@latest

# . What is the purpose of the waitForNavigation() method?
The waitForNavigation() method waitsfor the page to navigate to a new URL, which is useful after actions that trigger navigation:

await Promise.all([page.click('a#link'), page.waitForNavigation()]);

# . How do you ensure your tests are maintainable and scalable?
I follow best practices such as;
- Use the Page Object Model (POM)
- modularizing code
- implementing reusable functions and 
- regularly refactoring tests to keep them clean and maintainable.


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
- DOM attached
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
- Auto-retrying assertions: Repeatedly checks conditions until they pass or time out occurs.

# Handling Mouse actions 

  // Hover over an element (e.g., to reveal a tooltip or dropdown menu)
  await page.locator('#menu-button').hover();

  // Standard Single Click
  await page.locator('#submit-btn').click();

  // Right-Click (Context Click) to open a context menu
  await page.locator('#context-target').click({ button: 'right' });
  
  await page.getByRole('link', { name: 'Dashboard' }).click({ button: 'right' });

  // Using a standard locator or CSS selector
  await page.locator('a[href="/dashboard"]').click({ button: 'right' });

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

# How do you handle dynamic elements in playwright?
# A web element is changing dynamically every time the page loads. How will you locate it reliably?
My approach:
1. Identify stable attributes: Look for attributes such as name, placeholder, role, aria-label, or data-testid.
2. Use text-based locators: If the element has consistent visible text, use getByText() or getByRole().
3. Use partial attribute matching: If part of an attribute remains consistent, use CSS *= or XPath.
4. Use parent-child relationships: Locate the element relative to a stable parent element.
5. Use regular expressions: If the dynamic value follows a predictable pattern, use regex-based matching.
6. Collaborate with developers: If no reliable attribute exists, request a stable automation attribute such as data-testid.

I prefer accessibility-based locators such as getByRole() and getByLabel(), or stable attributes like data-testid. And these locators also provide auto waiting feature.

Basic Playwright examples
- Scenario 1: Dynamic ID

Suppose the ID changes on every page load:
<button id="submit_12345">Submit</button>

Use stable visible text:
await page.getByRole('button', { name: 'Submit' }).click();

- Scenario 2: Partially dynamic attribute
<button id="submit_12345">Submit</button>

Use partial matching:
await page.locator('[id^="submit_"]').click();

- Scenario 3: Using a stable parent
await page.locator('.login-form')
    .getByRole('button', { name: 'Submit' })
    .click();

# How do you optimize playwright test execution?  



# What is the use of package-lock.json?
package-lock.json is a file automatically generated by npm that records the exact versions of dependencies installed in your Node.js project.

Its main purpose is to ensure consistent and reproducible dependency installation across different machines and environments.


# trace - question on it?

# Given 5 open browser tabs/pages, write the playwright code to identify and switch control to the 3rd page.
await page.locator('abc1').click()
await page.locator('abc2').click()
await page.locator('abc3').click()
await page.locator('abc4').click()
await page.locator('abc5').click()
// 1. Get an array of all open pages in the browser context
const allPages = context.pages();

// 2. Target the 3rd page using 0-based indexing (index 2 = 3rd page)
const thirdPage = allPages[2];

// 3. Optional: Bring the tab to the front (focus it in the browser UI)
await thirdPage.bringToFront();

// 4. Perform interactions on the 3rd page
await thirdPage.waitForLoadState('domcontentloaded');
await thirdPage.locator('#element-on-third-tab').click();

# this and super keyword
this: Refers to the current object instance. It is commonly used to distinguish instance variables from local parameters (e.g., this.name = name).

super: Refers to the parent class object. While it calls parent constructors, it is also used to access parent methods and overridden variables.

# Declaration:
1. 
let nameVal: string = 'Jwala'
let description: string = `${nameVal} is the best`


---------------------------------------------------------------------------------------------------------------------------------------------------------------
# BrowserContext:
A BrowserContext is an isolated browser profile. Each context has its own:
- Cookies
- Local Storage
- Session Storage
- Permissions
- Cache

This is useful when testing scenarios like:
- Admin ↔ User
- Buyer ↔ Seller
- Chat between two users
- Multi-user document collaboration (Google Docs, Office 365)

Interview Tip ⭐

A lot of candidates confuse Browser, BrowserContext, and Page.
Browser
│
├── Context 1 (User A)
│     ├── Page 1
│     └── Page 2
│
├── Context 2 (User B)
│     ├── Page 1
│
└── Context 3 (Admin)
		├── Page 1

Browser → One browser process (Chromium/Firefox/WebKit).
BrowserContext → An isolated browser profile (like an Incognito window).
Page → A tab within a context.

# => TypeScript/JavaScript is Single-Threaded.

---------------------------------------------------------------------------------------------------------------------------------------------------------------
# What is a Promise?
- TypeScript/JavaScript is Single-Threaded.

In JavaScript/TypeScript, 
- A Promise represents the eventual result of an asynchronous operation.
- A Promise is an object that represents the eventual completion of an asynchronous operation.
It can be in pending, fulfilled, or rejected state. In Playwright, many APIs 
such as goto(), click(), fill(), and textContent() return Promises, which we generally handle using await inside asynchronous test functions.

Simply:
Promise = "I don't have the result right now, but I will give you the result later."

Think of ordering food:
	You order food
		 ↓
	Restaurant says: "Your food will be ready"
		 ↓
	You wait
		 ↓
	Food is ready

The Promise is essentially that commitment that the result will be available later.

Promise has 3 states:

A Promise can be in one of three states:
                      Promise
                         │
        ┌────────────────┼───────────────┐
        ▼     	  		 ▼      	     ▼
     Pending          Fulfilled 	 Rejected
						 │
					  Success

1. Pending
Operation is still running.
"Please wait..."

2. Fulfilled
Operation completed successfully.
"Here is your data."

3. Rejected
Operation failed.
"Something went wrong."

async
  ↓
allows us to use await
  ↓
await
  ↓
waits for Promise to settle or complete
  ↓
gives us the actual result

- A Promise is an object that represents the eventual completion of an asynchronous operation.
It can be in pending, fulfilled, or rejected state. In Playwright, many APIs 
such as goto(), click(), fill(), and textContent() return Promises, which we generally handle using await inside asynchronous test functions.

The one-liner to remember:
Promise = future value; await = wait for that future value.

# Asynchronous:
Asynchronous means non-blocking.
It means a task can start, and the program can move on to do other things without waiting for that task to finish. When the task is done, it notifies the program.

Because JavaScript is single-threaded, using async/await allows the main thread to send commands to the browser and handle other tasks without freezing the entire 
application while waiting for the browser to respond.
---------------------------------------------------------------------------------------------------------------------------------------------------------------
# Why Playwright is More Stable ?
Playwright automatically waits for:
- DOM attachment
- Visibility
- Stability
- Enabled state
- Receiving events
before performing an action.

This eliminates many explicit waits that Selenium users had to write.

Production Example:
import { test, expect } from '@playwright/test';

test('Open Playwright website', async ({ page }) => {
  await page.goto('https://playwright.dev');

  await expect(page).toHaveTitle(/Playwright/);
});

Even in this simple example, Playwright:
- launches a browser (managed by the test runner)
- creates a browser context
- creates a page
- navigates
- waits for the page to load appropriately
- performs an assertion with automatic retries
- closes everything after the test

The test runner abstracts these lifecycle steps so you can focus on the test logic.
---------------------------------------------------------------------------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------------------------------------------------------------------------
# Top Playwright CLI Commands You Must Know!
Playwright CLI (Command-Line Interface) is a powerful command-line tool provided by the Playwright framework to facilitate various tasks related to test automation. It serves as an interface to create, debug, and manage Playwright projects efficiently.

- Playwright Installation
npm init playwright@latest

- Update Playwright
npm install -D @playwright/test@latest

- Run all the Tests
npx playwright test (here in test folder our test-cases are located)

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

Key points:
1. page.waitForResponse() listens for the matching API response.
2. Promise.all() ensures the response listener is registered before clicking Submit.
3. response.url() identifies the API endpoint.
4. response.request().method() verifies the HTTP method.
5. response.status() validates the HTTP status code.
6. expect().toBeVisible() automatically retries until the success message appears or the assertion times out.
Interview takeaway: This approach validates both API-level behaviour (HTTP 200) and UI-level behaviour (success message) in a single test.

-----------------------------------------------------------------------------------------------------------------------------------
# i have not defined timeout in my playwright.config.ts or anywhere, then how playwright is assuming or taking a default waiting time for any action or for retrying

Even when you leave playwright.config.ts entirely empty or omit timeout settings, Playwright relies on a set of sensible default values hardcoded directly into its core engine.

Playwright breaks down its built-in defaults into specific categories:

1. The Core Default Timeouts
Test Timeout (30,000 ms / 30 seconds):
The maximum time allowed for a single test block to run from start to finish. If a test takes longer than 30 seconds, Playwright automatically fails it with a timeout error.

Expect Timeout (5,000 ms / 5 seconds):
The time web-first assertions (like await expect(locator).toBeVisible()) will continuously retry before failing. Even if an element takes 3 seconds to appear, the assertion will poll and pass within this 5-second window.

Action Timeout (0 / Disabled by default):
Individual actions like .click() or .fill() do not have their own isolated timeout by default. Instead, they are bounded by the overall Test Timeout (30 seconds).

Navigation Timeout (0 / Disabled by default):
Methods like page.goto() also default to 0, meaning they rely on the main test timeout rather than a separate threshold.

2. How Playwright Handles "Retrying" Under the Hood
When you perform an action (like await page.locator('button').click()), Playwright doesn't just check the DOM once and fail if the element isn't ready. Instead, it enters an auto-waiting loop:

Continuous Polling: Playwright repeatedly checks actionability criteria (is it attached? is it visible? is it stable? is it enabled?).

Dynamic Retrying: It keeps trying every few milliseconds.

The Boundary: This retry loop will continue running seamlessly until either the element becomes ready and the action succeeds, or the global Test Timeout (30 seconds) is exhausted.

This is why tests rarely flake out of nowhere — Playwright builds the retry and waiting logic directly into every locator interaction without requiring you to manually configure sleep statements or explicit waits.

# how to set global or default timeout
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 1. Global timeout for an entire single test (default is 30000ms / 30s)
  timeout: 45 * 1000, 

  // 2. Global timeout for all web-first assertions (default is 5000ms / 5s)
  expect: {
    timeout: 10 * 1000,
  },

  use: {
    // 3. Global timeout for individual actions like click(), fill(), selectOption()
    actionTimeout: 15 * 1000,

    // 4. Global timeout for navigation methods like page.goto()
    navigationTimeout: 30 * 1000,
  },
});
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
# How do you handle dynamic loading spinners, AJAX calls, and elements that appear asynchronously?
- I handle dynamic loading and asynchronous behaviour using Playwright's built-in auto-waiting and web-first assertions. For loading spinners, I wait until they become hidden.
await expect(page.locator('.loading-spinner')).toBeHidden() 

For AJAX calls, I use page.waitForResponse() to wait for specific API responses. For asynchronously appearing elements, I use assertions like toBeVisible() and toBeEnabled(), which automatically retry until the expected condition is satisfied. I avoid hard-coded waits like waitForTimeout() because they increase execution time and can make tests flaky.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
Introduce yourself and summarize your test automation experience
Here is a simplified, interview-ready answer based on your experience.

1. Professional experience
- I am a Quality Engineering and Test Automation professional with 7+ years of experience.
- Currently working as a Senior Test Engineer at GlobalLogic India.
2. Automation expertise
- My primary expertise is Playwright with TypeScript.
- I also have strong experience with Selenium WebDriver, Java, TestNG, and Cucumber.
- Experienced in developing automation frameworks from scratch and enhancing existing frameworks.
3. API testing
- Hands-on experience with REST Assured and Postman.
- Worked on API automation, authentication, API chaining, request/response validation, and integration testing.
4. Framework development
- Experience implementing Page Object Model, reusable utilities, custom fixtures, data-driven testing, and cross-browser testing.
- Worked with JSON, CSV, and Excel-based test data management.
5. CI/CD and reporting
- Experience integrating automated tests into CI/CD pipelines using GitHub Actions and Jenkins.
- Familiar with Maven, Git, Docker, and Allure reporting.
6. AI-assisted testing
- Production experience with AI-assisted test design, test automation, LLM response evaluation, and RAG testing.
- Familiar with GitHub Copilot, Claude Code, and MCP.
7. Project experience

- Contributed to enterprise applications such as Entrust IID and Hitachi AI MPS, including validation of AI-powered workflows.

8. Additional strengths
- Strong understanding of Agile methodologies, defect management, and end-to-end testing.
- Mentored junior QA engineers and interns.
- Recognized with five Best Performer awards.

Strong closing statement
"My overall focus has been on building reliable, scalable, and maintainable automation solutions, improving test coverage, and integrating automation into CI/CD pipelines to accelerate software delivery while maintaining product quality."

-----------------------------------------------------------------------------------------------------------------------------------
# What architectural features make playwright faster and more reliable than selenium?
Key architectural advantages: 
1. Direct browser communication
- Playwright communicates with browser engines through browser-specific automation protocols.
- It avoids the traditional WebDriver HTTP request-response model used by Selenium.
- This reduces communication overhead in many automation scenarios.

2. Built-in auto-waiting
- Automatically waits for elements to become actionable before performing operations.
- Checks visibility, stability, enabled state, and whether the element receives events.
- Reduces flaky tests and unnecessary explicit waits.

3. Browser Contexts
- Supports multiple isolated browser contexts within a single browser instance.
- Each context has independent cookies, cache, local storage, and session state.
- Enables faster and more efficient parallel test execution without launching a separate browser for every test.

4. Locator architecture
- Uses lazy evaluation to locate elements when actions are performed.
- Automatically re-resolves elements if the DOM changes.
- Provides better reliability for dynamic applications compared with holding stale element references.

5. Built-in network interception
- Provides native APIs to intercept, mock, modify, and monitor network requests and responses.
- Reduces dependency on external tools for API mocking and network-level testing.

6. Event-driven architecture
- Supports event listeners for popups, downloads, dialogs, requests, and responses.
- Makes handling asynchronous browser events more straightforward.

7. Built-in parallel execution support
- Supports parallel execution through Playwright workers and isolated browser contexts.
- Reduces test execution time when tests are designed independently.

2. Playwright vs Selenium – Quick comparison
Feature	                Playwright	                        Selenium
Communication	        Browser-specific protocols	            W3C WebDriver
Auto-waiting	        Built-in	                            Explicit waits generally needed
Element handling	    Locator-based, lazy evaluation	        WebElement references
Browser isolation	    Browser contexts	                    Separate sessions
Network interception	Built-in	                            Additional capabilities/tools may be needed
Parallel execution	    Built-in workers	                    Test framework/Grid-based
Browser support	        Chromium, Firefox, WebKit	            Chrome, Firefox, Edge, Safari, etc.

- Senior SDET interview tip
Don't claim that Playwright is always faster than Selenium. Actual performance depends on the application, test design, browser, infrastructure, and parallelization strategy.

Also, Selenium 4 has introduced improvements such as Selenium Manager and WebDriver BiDi support, so the comparison should be based on the actual capabilities being discussed rather than suggesting Selenium is outdated.
-----------------------------------------------------------------------------------------------------------------------------------
# Locator Priority (Memorize This)
1. getByRole()      ⭐⭐⭐⭐⭐
2. getByLabel()
3. getByPlaceholder()
4. getByText()
5. getByAltText()
6. getByTitle()
7. getByTestId()
8. CSS Locator
9. XPath
-----------------------------------------------------------------------------------------------------------------------------------
# Why does Playwright recommend getByRole() over CSS selectors?
getByRole() uses semantic roles and accessible names from the browser's accessibility tree, aligning tests with user interactions instead of implementation details. This makes tests more maintainable and also helps validate application accessibility.
-----------------------------------------------------------------------------------------------------------------------------------
# Dropdown handling
await page.locator('#dropdown').selectOption('in') // Selecting by value attribute
await page.locator("#country").selectOption({ label: "India" }) // Selecting by label (By visible text)
await page.locator("#country").selectOption({ index: 2 }) // Selecting by Index
-----------------------------------------------------------------------------------------------------------------------------------
# replace all matching values
const str : string = 'abc@123$def'

console.log(str.replace(/[^a-z]/g, '')) // "abcdef" (Matches all characters NOT in the range from a to z)
----------------------------------------------------------------------------------------------------------------------------------
# interface :
An interface is a template that objects are forced to match:

- Java: Interfaces are part of the language and exist at runtime.
- TypeScript: Interfaces are used for compile-time type checking and are removed during compilation to JavaScript.
- JavaScript: Does not natively support interfaces.

interface User {
  name: string;
  age: number;
  email: string;
}

const user1: User = { age: 31, email: "abc@gmail.com" }; // error
const user2: User = { name: "John", email: "abc@gmail.com" };

output:
error TS2741: Property 'age' is missing in type
'{ name: string; email: string; }' but required in type 'User'.

- The error arrives before anything runs. That is the whole value: the interface forces the shape, so consumers can rely on it.

Methods in an interface:
An interface can declare a method. It declares only the signature, never the body, so whoever adopts the interface has to supply the implementation.


interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
}

class Cal implements Calculator {

    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }
}

// Creating an object using the interface as its type
const cb11: Calculator = new Cal();

// Calling methods
console.log(cb11.add(10, 5));       // 15
console.log(cb11.subtract(10, 5));  // 5


# difference between abstraction and interface (JavaScript/Typescript)
- Abstraction is an OOP concept, whereas an interface is a TypeScript feature that can be used to achieve abstraction.

1. Abstraction
- Abstraction is an OOP principle that hides internal implementation details and exposes only essential functionality.
- It focuses on what an object does rather than how it does it.
- In TypeScript, abstraction can be achieved using interfaces and abstract classes.
- In JavaScript, we can achieve abstraction using classes, private fields, closures and modules.

2. Interface
- An interface is a TypeScript construct used to define a contract or blueprint for classes and objects.
- It specifies what properties and methods an implementing class must provide.
- It does not provide method implementation; the implementing class provides the actual implementation.
- Interfaces support abstraction by separating the contract from its implementation.
- Interfaces are removed during TypeScript compilation and do not exist at JavaScript runtime.

-----------------------------------------------------------------------------------------------------------------------------------
#  Lazy locators meaning in playwright
Lazy locators in Playwright mean that creating a locator by page.locator(...) or page.getByRole(...) does not immediately search the DOM or throw an error if the element isn't on the page yet. Instead, it simply defines a lightweight recipe/instruction for how to find the element later.

Playwright only queries the live DOM at the exact moment an action (like .click(), .fill()) or assertion (like expect(locator).toBeVisible()) is executed—and it re-evaluates the locator fresh on every single interaction
-----------------------------------------------------------------------------------------------------------------------------------
# web table - price column -  price is in dollar, we have to get the prices greater than 500$, and put in descending order, return it in double.
async function getHighValuePrices(page: Page): Promise<number[]> {
    const priceElements = await page.locator('table tbody tr td:nth-child(3)').allTextContents();
    const result: number[] = [];

    for (const text of priceElements) {
        // Remove the '$' symbol using substring (e.g., "$600" -> "600")
        const cleanText = text.trim().substring(1);
        const price = parseFloat(cleanText);

        // Filter for values greater than 500 and push to array
        if (!isNaN(price) && price > 500) {
            result.push(price);
        }
    }

    // Sort in descending order
    return result.sort((a, b) => b - a);
}

- same above code shorted;
async function getHighValuePrices(page: Page): Promise<number[]> {
    // 1. Extract raw text from the price column (assuming it's the 3rd column)
    const priceElements = await page.locator('table tbody tr td:nth-child(3)').allTextContents();

    // 2. Clean strings, parse to numbers, filter (> 500), and sort (descending)
    return priceElements
        .map(text => parseFloat(text.replace(/[^0-9.-]+/g, ''))) // Remove '$', commas, etc.
        .filter(price => !isNaN(price) && price > 500)          // Filter prices > 500
        .sort((a, b) => b - a);                                  // Sort in descending order
}
-----------------------------------------------------------------------------------------------------------------------------------
# how have you implemented or how you are using oops concept in your framework?
- Encapsulation : POM classes with private locators and public business methods.
- Abstraction	: Hide low-level Playwright operations behind reusable methods (BasePage and reusable methods that hide Playwright implementation details.)
- Inheritance	: Page classes extending BasePage (Share common functionality through BasePage)
- Polymorphism  : 
- Fixtures :      Dependency Injection and Composition (Custom fixtures for dependency injection and object lifecycle management)

example;
test('Login test', async ({ loginPage }) => {
    await loginPage.login(username, password);
});

What to explain:
- Locators are declared private, restricting direct access from outside the class.
- The login() method provides controlled access to the login functionality.

- Abstraction : BasePage

import { Page, Locator } from '@playwright/test';

export class BasePage {
    constructor(protected readonly page: Page) {}

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async clickElement(locator: Locator): Promise<void> {
        await locator.click();
    }

    async fillElement(
        locator: Locator,
        value: string
    ): Promise<void> {
        await locator.fill(value);
    }
}

What to explain:
- The BasePage provides reusable browser interaction methods.
- Individual page classes and test cases don't need to repeatedly implement the underlying interaction logic.
- It hides implementation details behind reusable methods.
-----------------------------------------------------------------------------------------------------------------------------------
fullyParallel : true
workers : 4

answer: 4 workers will run in parallel even when only one file is pending with multiple test-cases, or there is only file with multiple test-cases, 4 workers will run in parallel.

fullyParallel : false
workers : 4

answer: 4 workers will run in parallel, but when a single file will be pending with multiple test-cases, then test-cases will run sequentially.
-----------------------------------------------------------------------------------------------------------------------------------
# Explain your framework architecture:

=> .github ---|
              |___ agents [planner, generator, healer]
              |
              |____ workflows [playwright.yml, copilot-setup-steps.yml]
              |
              |____ 

=> .vscode (mcp.json)

=> basepage (BasePage.ts - abstract BasePage class) 

=> pages

=> tests

=> fixtures - [pagefixtures, testdatafixtures]

=> env-files
- .env.dev
- .env.prod


=> playwright -> auth (user.json) - save and reuse authentication state


=> downloads


=> resources [files for asserting, files for uploading, empty files, large files]


           ______ contracts (login-data-schema.ts)
          |
=> data---|______ (factories - TestDataFactory.ts)
          |
          |______ (test-data [login-data.csv, login-data.json, login-data.xlsx])
          |
          |______ (test-data-readers [csv-reader.ts, excel-reader.ts, json-reader.ts])

            ______ constants (paths-constants.ts, test-data-constants)
           |
=> utils---|______ api 
           |
           |______ observability 
           |
           |______ 

=> config (env.config.ts)

=> allure-results

=> html-reports

=> api

=> Global setup

-----------------------------------------------------------------------------------------------------------------------------------
Remember:
- Sharding provides parallelism across independent machines.
- Workers provide parallelism within each machine.
-----------------------------------------------------------------------------------------------------------------------------------
# Logger library for Playwright and NodeJs project
1. Pino (very fast and provides excellent performace)
2. Winston (good , supports customized logging)
-----------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------

