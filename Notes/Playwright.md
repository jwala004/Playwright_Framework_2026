1. Command to run the test-case:
npx playwright test 


==> configure ESLint/Prettier to enforce your preferred style automatically.

Framework principles:
1. Use of locators
2. Any kind of assertion on verification should be done only in the test class itself. [Not in the Page class]
3. All locators should be declared in the Page class, and it should be initialized in the constructor itself.
4. Folder structure:
test folder:
Within test folder;
"Tests" folder - where all the test-cases will be present
"resources" folder - all the image files, or any kind of text or word document
"utils" folder - will contain "BaseTest" or "Main Fixture" of the application
"page" folder - will contain all the page classes
"testdata" folder - will contain all the "json" files or "csv files" or "test-data" files
"testdata factory"
"contract" - schema validation files
"testsuite" folder - (Optional), can contain all the test-cases classified under describe() for "Regression" or "Smoke" testing
"reports" folder - 


5. Use of Tagging concept with each test method:
so that we can run the test-cases on the basis of test tags, for example, @Regression or @Sanity

6. Details to provide over each test-method, in document comment:
a. Test- case description, what test-case does
b. User story number, link
c. Test-case id, testrail, or Jira zephyr link
d. Author name

7. Use enum to declare and validate success message and failure message.

8. 


Framework Discussions:


Good points about Framework:
1. Typescript over Javascript
Advantages of using Typescript over Javascript:
a.
b.
c.

2. Fixtures
- FIxtures over hooks

3. Test Tagging

4. Storage state

5.

Question 1
Why is Playwright generally less flaky than Selenium?
Ideal Answer:
Playwright automatically performs actionability checks before interacting with elements. It waits for elements to be attached, visible, stable, enabled, and able to receive events. Its locator 
model is lazy and resolves elements at action time, which handles dynamic DOM updates more effectively. Combined with direct browser communication and built-in auto-waiting, this 
significantly reduces synchronization issues.

Question 2
What is the difference between a Browser, BrowserContext, and Page? Why does Playwright use this hierarchy?
Ideal Answer:
A Browser is the running browser process. A BrowserContext is an isolated browser session with independent cookies, storage, cache, and permissions. A Page represents an i
ndividual browser tab within a context. This hierarchy enables multiple isolated users to be simulated efficiently within a single browser process, improving performance and 
making parallel execution more scalable than launching separate browsers for every test.

Question 3
Why doesn't Playwright require a separate browser driver like ChromeDriver?
Playwright does not require a separate browser driver because it communicates directly with the browser engine using its own automation protocol instead of relying on an 
external driver like ChromeDriver or GeckoDriver. This removes an extra communication layer, resulting in lower latency, better synchronization, fewer compatibility issues, and 
more reliable test execution.

1. VS Code Playwright Extension
It is an IDE productivity tool that provides features such as:
- Test Explorer
- Record & Playback
- Locator Picker
- Trace Viewer integration
- Debugging support
- Running individual tests

Why did you choose TypeScript over JavaScript?

Technically, Playwright is written in TypeScript, not JavaScript.
Why?
Because automation frameworks become large software projects, not just collections of test scripts.
Imagine an enterprise framework, with 5000+ Test Cases, 200+ Page Objects, 100+ Utility Classes

Without static typing, maintaining such a codebase becomes difficult.
TypeScript catches many errors before the code even runs.

JavaScript
page.click(); // You won't know there's a typo until runtime.

TypeScript
page.click(); // Your IDE immediately highlights an error: Property 'clik' does not exist on type 'Page'. The compiler prevents the mistake from reaching execution.

TypeScript Compilation Process

This is one of my favorite interview questions.

Many candidates say: "TypeScript is compiled into JavaScript."
That's true—but incomplete.
Here's what actually happens.
		
		test.spec.ts
			↓
		TypeScript Compiler (tsc)
			↓
		JavaScript (.js)
			↓
		Node.js Runtime
			↓
		Playwright Library
			↓
		Browser

Key Points:
Node.js cannot execute .ts files directly.
TypeScript must first be transpiled into JavaScript.
In Playwright projects, the test runner handles this for you behind the scenes

tsconfig.json controls how TypeScript compiles your project.

Avoid 'any' keyword whenever possible; strong typing improves reliability, readability, and IDE support.

The any type disables TypeScript's type checking, allowing invalid values and method calls to pass compilation.

=> We'll also explore the lifecycle of a test (test(), fixtures like page, hooks, execution flow, and how the runner orchestrates everything).

Production Example:
import { test, expect } from '@playwright/test';

test('Playwright homepage', async ({ page }) => {
  await page.goto('https://playwright.dev');

  await expect(page).toHaveTitle(/Playwright/);

  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
});

Notice we never:
- Launch a browser manually
- Close the browser
- Create a context
- Create a page

The Test Runner manages the lifecycle through fixtures.

The biggest mistake is that both operations return Promises, but they're never awaited.
page.goto(...);      // Promise
page.click(...);     // Promise

=> if any operation or action is returning promises, then it must be used alongside of await.

Playwright automatically performs actionability checks:
=> Attached to DOM
=> Visible
=> Stable
=> Enabled
=> Receiving pointer events

await page.goto(...); // means Wait until the page is loaded.
That's not completely true.
It actually means:
Wait until the Promise returned by goto() resolves according to Playwright's navigation criteria.

Topic 5 – playwright.config.ts Deep Dive

This is one of the most important files in any Playwright framework. We'll cover:

How the Test Runner reads and applies configuration.
Every important option (use, projects, workers, retries, reporter, timeout, testDir, etc.).
Configuration precedence (global vs. project vs. test level).
How large organizations structure configurations for multiple environments (QA, UAT, Staging, Production).
Common interview questions around configuration design.

What Happens When You Run
npx playwright test

Internally, the sequence is roughly:

		Read playwright.config.ts
				↓
		Validate configuration
				↓
		Discover tests
				↓
		Create projects
				↓
		Create workers
				↓
		Apply "use" options
				↓
		Start execution

So before a single test executes, Playwright has already read and processed the configuration.

playwright.config.ts files:
1. testDir: './tests' // This tells Playwright where to discover tests.

2. timeout // This is the maximum duration for one test.
Example:
test('Login', async ({ page }) => {

});
The entire test must complete within 30 seconds.
That includes:
=> goto()
=> click()
=> assertions
=> API calls
=> everything

3. retries
retries: 2
If a test fails:
	Run
	↓
	Fail
	↓
	Retry 1
	↓
	Retry 2
	↓
Final Result

4. workers
workers: 4
This controls parallel execution.
Each worker typically launches its own browser/context as needed.

5. reporter
reporter: 'html' // Responsible for generating reports.
Examples:
HTML
JSON
JUnit
List
Line
Dot
Allure (plugin)

6. use
This is one of the most important sections.
Think of it as: Default browser behavior.

use: {
    viewport: {
        width: 1920,
        height:1080
    } // Every page uses this viewport unless overridden.
	headless: true //  No browser UI
	screenshot: 'only-on-failure' // 
	video: 'retain-on-failure' // Records the execution only when the test fails.
	trace: 'retain-on-failure' // This is Playwright's superpower.
}

trace: A trace contains:
Network
Console
DOM snapshots
Actions
Timing
Screenshots
Think of it as a flight recorder for your test.

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000, // Numeric separators (30_000) improve readability.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://automationpractice.learninglab.cloud',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
});

The most specific configuration overrides the more general one.
		Test
		↓
		Project
		↓
		Global

Interviewer asks:
What does timeout mean?
It is the maximum execution time for the test, unless overridden.

Why do retries exist?
To mitigate temporary environmental instability while collecting evidence. Flaky tests should still be investigated and fixed rather than hidden behind retries.
Each worker typically launches its own browser/context as needed.

playwright.config.ts file:
It defines:
- How tests are discovered.
- How browsers are launched.
- How failures are diagnosed.
- How parallelism is managed.
- How different environments behave.
- How CI differs from local execution.

playwright.config.ts is the central configuration file that controls test discovery, execution, browser behavior, reporting, and diagnostics.

playwright-framework/

├── configs/
│   ├── playwright.base.ts
│   ├── playwright.local.ts
│   ├── playwright.ci.ts
│   ├── playwright.qa.ts
│   ├── playwright.staging.ts
│   └── projects.ts
│
├── tests/
├── pages/
├── fixtures/
├── utils/
└── playwright.config.ts

Example:
import config from './configs/playwright.base';
export default config;

The actual logic lives elsewhere.

Each file has one responsibility.
This is simply the Single Responsibility Principle (SRP) applied to configuration.

Environment Separation
Instead of writing:

if (environment == QA) {
...
}

if (environment == PROD) {
...
}

if (environment == UAT) {
...
}

everywhere...

I'd rather have:

QA Config
↓
Staging Config
↓
Production Config

Much cleaner.

A strong answer:
As the number of environments and execution modes grows, conditional logic becomes difficult to understand and maintain. Modular configurations isolate concerns, reduce cognitive
load, improve testability, and minimize the risk of unintended side effects when changes are made.

Day 2:
We'll cover:
=> How the Locator API works internally.
=> Why Locator is superior to ElementHandle.
=> Lazy evaluation.
=> Re-querying the DOM.
=> Strict mode.
=> Actionability checks.
=> Locator chaining.
=> Built-in locator strategies (getByRole, getByLabel, getByText, getByTestId, CSS, XPath).
=> Best practices used by Microsoft and other engineering teams.

A Locator is a query object.
it is a reusable query that knows how to find an element.

Production Example:
import { test, expect } from '@playwright/test';

test('Login',  async ({ page }) => {
    await page.goto('/login');
    const username = page.getByLabel('Username');
    const password = page.getByLabel('Password');

    const login = page.getByRole('button', { name: 'Login' });

    await username.fill('admin');
    await password.fill('admin123');
    await login.click();

    await expect(page).toHaveURL(/dashboard/);
});

In the above example; 
Notice something subtle.
We created all three locators at the beginning, but none of them queried the DOM until we used them.

Locator vs ElementHandle:
This is an interview favorite.

const handle = await page.$('#login'); // This returns an ElementHandle.

If the DOM changes:

ElementHandle
↓
Can Become Invalid

Interview Focus
Question 1
Why are Playwright Locators generally preferred over ElementHandles?
Ideal Answer:
Locators are lazy and re-evaluate the DOM on every action or assertion, making them resilient to dynamic UI changes and reducing stale element issues. ElementHandles represent 
a specific DOM node at a point in time and can become invalid if the page re-renders.

Question 2
What does it mean when we say that Playwright Locators are "lazy"?
Ideal Answer:
A Locator does not immediately search for or store a DOM element. Instead, it stores the strategy for locating the element. When an action or assertion is executed, Playwright 
performs a fresh lookup, ensuring interactions occur with the current state of the DOM.


Question:
const loginButton = page.getByRole('button', { name: 'Login' });
// The application re-renders the page after an API call.
await loginButton.click();
Why does this usually still work in Playwright, while a similar pattern often causes StaleElementReferenceException in Selenium?
When the locator is created, Playwright does not locate or store the DOM element. Instead, it stores the locator strategy (selector/query).
Answer:
When an action such as click(), fill(), or an assertion is executed, Playwright performs a fresh DOM lookup using the stored locator strategy. Before executing the action, it also 
performs actionability checks (visibility, stability, enabled state, and ability to receive events). Since the element is looked up at action time rather than being cached, Playwright 
automatically interacts with the latest version of the DOM, making it resilient to re-renders and dynamic UI updates.

**Playwright performs a fresh DOM lookup using the stored locator strategy.**
==> Locators are only definitions of how to find an element. They don't query the DOM until you perform an action (click(), fill(), etc.) or an assertion (expect(locator)...)

==> Playwright Locators are lazy/live references. They don't wait merely when created. Automatic waiting happens when a Locator is used for an action, and automatic retrying 
happens with web-first assertions.

Playwright's Philosophy

Playwright asks a completely different question.
Instead of asking:
"How do I find this element?"
It asks:
"How would a user find this element?"
That single philosophy changes everything.

Imagine a blind user using a screen reader.

They don't know:
#btn123
.login-btn
//div[3]/button[2]
They hear:
"Login button"
Exactly what Playwright's recommended locators use.

Locator Priority (Memorize This)
1. getByRole()      ⭐⭐⭐⭐⭐
2. getByLabel()
3. getByPlaceholder()
4. getByText()
5. getByAltText()
6. getByTitle()
7. getByTestId()
8. CSS Locator
9. XPath

1. getByRole() ⭐⭐⭐⭐⭐
This is Playwright's favorite locator.

Example:
<button>Login</button>

Locator:
await page.getByRole('button', {name: 'Login'}).click();

Why Role?
Because every accessible HTML element has a semantic meaning.

Examples:
<button>
↓
Role = button
<input>
↓
Role = textbox
<a>
↓
Role = link
<select>
↓
Role = combobox

Playwright uses the Accessibility Tree, not just the DOM.

Under the Hood;
Browser actually maintains two trees.
1. DOM Tree AND
2. Accessibility Tree

Example:
DOM
↓
button
↓
Accessibility Tree
↓
Role = button
↓
Name = Login

getByRole() queries this semantic information.

Why is this Amazing?
Suppose frontend changes:

<button class="btn btn-primary">
↓
<button class="login-button">
↓
<button id="login123">

Your locator still works. Because the user still sees
Login button
This is resilience.

Why does Playwright recommend getByRole()?
getByRole() locates elements using the browser's accessibility tree and semantic roles rather than implementation details such as CSS classes or IDs. This makes tests 
more resilient to UI refactoring and simultaneously encourages accessible web applications.

2. getByLabel()
Example
<label>Email</label>
<input>

Locator
await page
.getByLabel("Email")
.fill("admin@test.com");

3. getByPlaceholder()

Example
<input placeholder="Enter Email">

Locator
page.getByPlaceholder("Enter Email");

4. getByText()

Example
<button>Continue</button>

Locator
page.getByText("Continue");

Good.

But...
Imagine this page.

Continue

Continue

Continue

Now what?
Which one?
We'll discuss strict mode in the next topic, and you'll see exactly how Playwright handles this situation.

5. getByTestId()

This is one of the most misunderstood locator strategies.

Example
<button data-testid="login-btn">

Locator
page.getByTestId("login-btn");

6. CSS Locators

Example

page.locator(".login-btn");

Nothing wrong.

But CSS classes often change during redesigns.

7. XPath

Example
page.locator("//button[text()='Login']");

XPath isn't "bad."
It's simply more tightly coupled to the document structure.

Interview Focus
Question 1
Why does Playwright recommend getByRole() over CSS selectors?
Ideal Answer:
getByRole() uses semantic roles and accessible names from the browser's accessibility tree, aligning tests with user interactions instead of implementation details. This makes 
tests more maintainable and also helps validate application accessibility.

Question 2
If your application has no accessible labels or roles, what would you do?
Ideal Answer:
My first choice would be to collaborate with the development team to improve accessibility or add stable data-testid attributes. If that's not immediately possible, I would use 
the most stable available selector while documenting the technical debt. The goal is to improve the application's testability rather than relying on brittle selectors indefinitely.

====> Architects think in decision trees.

1.  What locator would you use **today**? - getByRole()  
A better answer:

2.  What would you ask the frontend team to change for the **long-term**? - I would request frontend team to add stable `data-testid`  
A better answer:
We don't want automation coupled to styling or DOM structure. data-testid provides a stable contract between the application and the automation framework. It allows 
UI refactoring without unnecessarily breaking tests.

3.  Would you block automation until `data-testid` is added, or proceed with a temporary solution? Why? 
I am repeating your points as previously mentioned, I would use the most stable available selector while documenting the technical debt. The goal is to improve the 
application's testability rather than relying on brittle selectors indefinitely.  

A Senior SDET Rule
I want you to remember this for the rest of your career.
Every locator is a contract between your automation framework and the application.

The stronger the contract, the fewer maintenance issues you'll have.
That's why we prefer

User Intent
↓
Accessibility
↓
Test IDs
↓
Implementation Details

- how Strict Mode works internally,
- why Playwright intentionally throws errors when multiple elements match,
- how locator chaining is implemented,
- how filtering works,
- and why these design choices improve test reliability.

Topic 3: Strict Mode (The Hidden Guardian Against Flaky Tests)
If there is one Playwright feature that silently prevents hundreds of bugs, it is Strict Mode.
Most people discover it only when they see this error:

Error:
strict mode violation:
locator resolved to 2 elements

and their immediate reaction is:
"How do I disable it?"
❌ Wrong question.
The right question is:
"Why did the Playwright team intentionally design it this way?"

The Concept
Let's begin with an example.
Suppose your page has:
<button>Save</button>

<button>Save</button>

Now you write
await page.getByRole('button', {
    name: 'Save'
}).click();

What should happen?
Many automation tools simply click the first button.

Playwright says:
❌ Absolutely not.

Instead it throws
strict mode violation

Locator resolved to 2 elements
Why?
Because Playwright believes
Ambiguity is a bug.
That sentence is worth remembering.

Let's Think Like Microsoft's Engineers

Imagine they had designed it like Selenium.
driver.findElement(By.xpath("//button[text()='Save']")).click();

What happens?
If two buttons exist,
Selenium simply returns
First Match
No warning.
No error.

No indication that your locator was ambiguous.
Imagine this page.
Save

Save

Delete
----------------------
Today

the first Save button is correct.
Tomorrow
Frontend changes
----------------------
Delete

Save

Save
----------------------
Now Selenium clicks the wrong button.

Your automation still passes.
The application becomes corrupted.
The bug reaches production.

Microsoft asked:
Wouldn't it be better to fail immediately?
Answer: Yes

Hence Strict Mode.
Under the Hood
Suppose you write
await page.getByRole('button', {
    name:'Save'
}).click();

Internally
Playwright roughly performs:

Search DOM
↓
Matches Found?
↓
0
↓
Element Not Found Error
----------------

1
↓
Proceed
----------------

2+
↓
Strict Mode Violation

Notice
Playwright expects exactly one element.

Not zero.
Not many.
Exactly one.

Why is This Powerful?
Imagine your locator accidentally matches

Submit
Submit Order
Submit Payment

Without Strict Mode
automation may click
whatever appears first.

With Strict Mode
Playwright says
Your locator is poorly designed.

Fix it.
Real Project Example

Suppose your application has
<button>Edit</button>
<button>Edit</button>
<button>Edit</button>

One edits
Customer
One edits
Order
One edits

Invoice
If you write

page.getByText("Edit")
Playwright refuses.
Because...
Which Edit?
Exactly.

Think Like an Architect
Strict Mode is not punishing you.
It is forcing you
to write
deterministic automation.
That word—
Deterministic
—is one interviewers love.
A deterministic test behaves the same way every time because it targets exactly the intended element.

How to Resolve It
Option 1
Be more specific.

Example
page.getByRole('button', {
    name:'Save Changes'
});

Perfect.

Option 2
Use Locator Chaining.
We'll cover this next.

Example
page
.getByRole('dialog')

.getByRole('button', {
    name:'Save'
});

Now
only one Save button exists
inside the dialog.
Beautiful.

Option 3
Use Filters.
We'll study
filter()
next.

Option 4
Use .nth()
Example
page
.getByRole('button')
.nth(1)
Works.

But...
Would I recommend it?
Almost never.

Why I Dislike .nth()
Suppose today

0 Login
1 Save
2 Delete

Tomorrow

0 Export
1 Login
2 Save
3 Delete

Your locator silently starts clicking

Login.
That's dangerous.
.nth() couples your test to the position of an element rather than its meaning.
Use it only when the position itself is part of the requirement.

Interview Gold ⭐
Interviewer:
Why does Playwright throw Strict Mode violations instead of clicking the first matching element?
Weak answer:
Because multiple elements were found.

That's obvious.
Senior answer:
Playwright enforces Strict Mode to ensure locators uniquely identify a single target. Failing fast on ambiguous locators prevents non-deterministic behavior and 
reduces flaky tests. This encourages engineers to create resilient, intention-revealing locators rather than relying on DOM order.

Notice I used
Fail Fast

Another important engineering principle.
Fail Fast Principle
This principle exists everywhere in software engineering.

Wrong Configuration
↓
Stop Immediately
--------------------

Wrong Locator
↓
Stop Immediately
--------------------

Wrong API Contract
↓
Stop Immediately
The earlier a problem is detected, the cheaper it is to fix.

Strict Mode follows exactly this philosophy.
Production Example

Suppose we have:
<div class="profile">
  <button>Edit</button>
</div>

<div class="settings">
  <button>Edit</button>
</div>

❌ Poor

await page.getByRole('button', {
    name: 'Edit'
}).click();

Throws Strict Mode.

✅ Better

await page
  .locator('.profile')
  .getByRole('button', { name: 'Edit' })
  .click();
Or even better, if possible, use a semantic container instead of a CSS class:

await page
  .getByRole('region', { name: 'Profile' })
  .getByRole('button', { name: 'Edit' })
  .click();

Now the locator clearly expresses intent.

Senior Perspective
I actually like seeing Strict Mode errors.

Why?
Because Playwright discovered
my weak locator
before my customer did.
That's incredibly valuable.

Notes Summary:
Strict Mode requires action locators to resolve to exactly one element; ambiguous matches fail immediately.
The purpose is to encourage deterministic, maintainable tests and prevent accidental interactions caused by DOM changes.
Prefer making locators more specific through semantics, hierarchy, or filters rather than relying on positional methods like .nth().

Interview Focus
Question 1
Why is Strict Mode enabled by default in Playwright?
Ideal Answer
Strict Mode follows the fail-fast principle. Instead of silently interacting with the first matching element, Playwright throws an error when a locator is ambiguous. This helps 
engineers discover weak locators early, resulting in more deterministic and less flaky automation.

Question 2
Is using .nth() a good way to fix Strict Mode violations?
Ideal Answer
.nth() should be used sparingly. While it can disambiguate multiple matching elements, it couples the test to the element's position in the DOM, which is often unstable. 
It's generally better to refine the locator using roles, accessible names, container scoping, or filters so that it uniquely identifies the intended element.

🏗️ Framework Application
One of my non-negotiable code review rules is:
No .nth() unless you can justify it.
If I see:
page.getByRole('button').nth(3)

my first question in a code review is:
Why is the fourth button the correct one?
Usually, there's a better locator.

🎯 Senior SDET Challenge

Imagine this HTML:

<div data-testid="customer-card">
    <h2>John Doe</h2>
    <button>Edit</button>
</div>

<div data-testid="customer-card">
    <h2>Jane Smith</h2>
    <button>Edit</button>
</div>

You need to click Edit for Jane Smith.

Many engineers write:

page.getByRole('button', { name: 'Edit' }).nth(1)

It works today.

Question:
As a framework architect:

Why is this a poor solution?
Answer: Because when the page structure changes, the test cases will start failing. .nth() couples our test to the position of an element rather than its meaning.
It also reduces the readability of the test because nth(1) doesn't communicate why the second element is the correct one.

How would you write a locator that expresses the business intent ("Edit Jane Smith") rather than relying on position?
best solution:
await page
  .getByTestId('customer-card')
  .filter({ hasText: 'Jane Smith' })
  .getByRole('button', { name: 'Edit' })
  .click();
 
or css => page.locator('[data-testid="customer-card"]') 
 
===> Locator Chaining & filter() (Advanced Locator Composition) (Thinking in Relationships, Not Selectors) <===
This is where you'll learn to build locators that read almost like English:

page
  .getByTestId('customer-card')
  .filter({ hasText: 'Jane Smith' })
  .getByRole('button', { name: 'Edit' })
  .click(); 

This is where I see a clear difference between Automation Engineers and Automation Architects.
A junior engineer asks:
"How do I locate this button?"
A senior engineer asks:
"What business object does this button belong to?"
That single change in thinking completely changes how you write locators. 

The Problem
Let's start with a realistic example.

Imagine you're automating an e-commerce application.

<div class="product-card">
    <h3>iPhone 16</h3>
    <p>₹79,999</p>
    <button>Add to Cart</button>
</div>

<div class="product-card">
    <h3>Samsung S26</h3>
    <p>₹69,999</p>
    <button>Add to Cart</button>
</div>

<div class="product-card">
    <h3>Pixel 11</h3>
    <p>₹74,999</p>
    <button>Add to Cart</button>
</div>

Question:
Click "Add to Cart" for Pixel 11.

Selenium Thinking
Most Selenium engineers (including myself years ago) immediately think:

List<WebElement> cards = driver.findElements(By.className("product-card"));
for(WebElement card : cards){
    if(card.getText().contains("Pixel 11")){
        card.findElement(By.tagName("button")).click();
        break;
    }
}

Does it work?
✅ Yes.
Is it elegant?
❌ Not really.
You're manually writing traversal logic.

Playwright Thinking
The same problem becomes:

await page
    .locator('.product-card')
    .filter({ hasText: 'Pixel 11' })
    .getByRole('button', { name: 'Add to Cart' })
    .click();

Read it like English:

	Find all product cards
		↓
	Keep only the one containing Pixel 11
		↓
	Inside that card
		↓
	Find the Add to Cart button
		↓
	Click it

That's beautiful.
This is Called Locator Composition
Notice something.
We didn't write
one locator.
We composed several small locators together.

	Product Card
	↓
	Filter
	↓
	Button
	↓
	Click

Each step reduces the search space.
Under the Hood

Let's see what Playwright is actually doing.
Step 1
page.locator('.product-card')
Internally
Find all product cards
↓

Card 1

Card 2

Card 3

Step 2
.filter({ hasText: 'Pixel 11' })

Now
Card 1
Contains Pixel?
No
Discard
-------------
Card 2
Contains Pixel?
No
Discard
-------------
Card 3
Contains Pixel?
Yes
Keep

Step 3
.getByRole('button')

Now Playwright searches
only inside
Card 3.
Not the entire page.


Why is this Powerful?
Imagine later your application grows.
	Home Page
	↓
	200 Buttons
	↓
	40 Cards
	↓
	20 Forms
	↓
	Navigation
	↓
	Footer

Without chaining,
Playwright searches
the entire DOM.

With chaining,
Playwright searches
inside one card.
That improves:
- Reliability
- Readability
- Performance

Compare With Selenium
Let's compare the mental models.

Selenium:
	driver.findElements(...)
	↓
	for loop
	↓
	if condition
	↓
	findElement()
	↓
	click()

You write the traversal.

Playwright:
	locator()
	↓
	filter()
	↓
	locator()
	↓
	click()

Playwright handles the traversal.
This is a much more declarative style.

***"filter() Deep Dive"***
There are several ways to filter.

1. hasText

Example;
.filter({
    hasText: 'Pixel 11'
})

Meaning
Keep only locators
whose descendants contain
Pixel 11

2. has
This one is incredibly powerful.
Suppose
<div class="product">
    <h2>MacBook</h2>
    <button>Buy</button>
</div>

You can write;
page
.locator('.product')
.filter({
    has: page.getByRole('heading', {
        name: 'MacBook'
    })
});

Notice something.
We're filtering
using another locator.
Not text.
This is incredibly useful in complex UIs.

***"Locator Chaining"***
Imagine

<section>
<form>
<button>
Login
</button>
</form>
</section>

You could write;
page
.locator('section')
.locator('form')
.getByRole('button', {
    name:'Login'
})

Each locator narrows
the search scope.

Why Not Use Long CSS?
Instead of

page
.locator('.product-card')
.filter(...)
.getByRole(...)

You could write
.product-card button

Why don't we?
Because

.product-card button
expresses structure.

Whereas
.filter({ hasText:"Pixel 11" })

expresses business meaning.
That's much easier to maintain.

Interview Question:

Suppose I ask
Why use chaining instead of one large XPath?

Weak answer
Easier to read.

Senior answer
Locator chaining composes smaller, focused locators into a deterministic search path. Each step narrows the DOM scope, improving readability, maintainability, and 
reducing ambiguity. It also mirrors the business hierarchy of the UI rather than relying on a fragile structural selector.

Notice
Business hierarchy.
Not DOM hierarchy.
Huge difference.

***"Framework Design"***
This influences our Page Objects.
Instead of
readonly buyButton = page.getByRole('button');

we'll write methods like:
async addProductToCart(productName: string) {
    await this.page
        .getByTestId('product-card')
        .filter({
            hasText: productName
        })
        .getByRole('button', {
            name: 'Add to Cart'
        })
        .click();
}

Now our test becomes
await productsPage.addProductToCart("Pixel 11");

This is exactly how enterprise frameworks are designed.

Notes Summary:
=> Locator chaining progressively narrows the search scope, making locators more deterministic and readable.
=> filter() allows you to express business intent (such as "the product card containing Pixel 11") instead of relying on DOM position or fragile selectors.
=> Prefer composing multiple simple locators over writing one long CSS or XPath selector.

Interview Focus:
Question 1:
Why is locator chaining preferred over a single complex XPath?
Ideal Answer:
Locator chaining builds a search path using small, composable locators. Each step reduces the search scope, improves readability, aligns with the business structure of the page, and 
is generally easier to maintain than a monolithic XPath.

Question 2:
What is the difference between hasText and has in filter()?
Ideal Answer:
hasText filters elements based on descendant text content, making it useful when text uniquely identifies a container. has filters using another locator, allowing more precise 
matching based on the presence of specific child elements, regardless of surrounding text.

🎯 Senior SDET Challenge:
Consider this HTML:

<table>
  <tr>
    <td>Alice</td>
    <td>Admin</td>
    <td><button>Edit</button></td>
  </tr>

  <tr>
    <td>Bob</td>
    <td>User</td>
    <td><button>Edit</button></td>
  </tr>

  <tr>
    <td>Charlie</td>
    <td>Manager</td>
    <td><button>Edit</button></td>
  </tr>
</table>

You need to click Edit for Bob.

await page.locator('tr')                   // 1. Find all table rows
  .filter({ hasText: 'Bob' })              // 2. Filter down to only the row containing 'Bob'
  .getByRole('button', { name: 'Edit' })   // 3. Find the 'Edit' button inside that specific row
  .click();                                // 4. Click it

==> Playwright Locators are actually very close to functional programming pipelines.

*** A Principle I Want You to Remember ***
Don't search for buttons. Search for business objects, then search inside them.

Day 2 – Topic: Assertions (expect) Deep Dive
The backbone of reliable automation.
This is not just about writing assertions.

It's about writing reliable, maintainable, and non-flaky validations.

Concept:
Think about the purpose of an automation test.

Arrange
   ↓
Act
   ↓
Assert

Without assertions...
await loginButton.click();

Did login succeed? We don't know.

Without verification, automation is just a sequence of UI interactions.
Assertions convert interactions into validation.

Playwright's Biggest Improvement

In Selenium we usually wrote:
Assert.assertEquals(driver.getTitle(), "Dashboard");
or
Assert.assertTrue(element.isDisplayed());

These are instant checks.
If the UI hasn't updated yet...
❌ Test fails.
Playwright changed this philosophy.

Instead of saying:
Check now.
It says:
Verify that this eventually becomes true within the timeout.
This is called Web-First Assertions.

Types of Assertions:
You'll use three categories most often.
1. Locator Assertions ⭐⭐⭐⭐⭐

These are the most important.

Examples:
await expect(loginButton).toBeVisible();
await expect(username).toHaveValue("Jwala");
await expect(errorMessage).toContainText("Invalid");
await expect(saveButton).toBeEnabled();
await expect(checkBox).toBeChecked();

These retry automatically.

2. Page Assertions

Examples:
await expect(page).toHaveTitle("Dashboard");
await expect(page).toHaveURL(/dashboard/);

Very common after login and navigation.

3. Generic Assertions

Example:
expect(totalPrice).toBe(250);
expect(users.length).toBe(5);
expect(response.status()).toBe(200);

These do not retry because they are ordinary JavaScript values.


Framework Application:
In our framework, we'll follow these principles.
Page Objects
Contain:
=> Locators
=> Business actions

Example:
class LoginPage {
    readonly loginButton =
        this.page.getByRole('button', { name: 'Login' });
    async login(user: string, pass: string) {
        // actions only
    }
}

Assertions belong in:
Test Layer

Example:
await loginPage.login(username, password);
await expect(homePage.userName)
.toHaveText("Jwala Kumar");

Why?
Because Page Objects should describe how to interact.
Tests should describe what is expected.
This separation keeps the framework flexible and reusable.

Interview Preparation:
Question 1:
Why is expect(locator).toHaveText() preferred over asserting textContent()?
Ideal Answer:
toHaveText() is a web-first assertion. It repeatedly resolves the locator and retries until the expected text appears or the timeout expires. textContent() returns the current 
value immediately, converting the locator into a string and disabling Playwright's retry capability.

Question 2:
Why shouldn't assertions generally be placed inside Page Objects?
Ideal Answer:
Page Objects should encapsulate interactions with the application, while test cases should express business expectations. Keeping assertions in the test layer improves 
reusability, flexibility, and separation of concerns. It allows the same Page Object methods to be reused in different test scenarios with different expected outcomes.

📌 Notes Summary:
=> Prefer web-first assertions (toHaveText, toBeVisible, toHaveValue, etc.) over extracting values and asserting them manually.
=> Assertions should generally live in the test layer, while Page Objects focus on actions and locators.
=> Avoid converting a Locator into a primitive (string, boolean, etc.) before asserting, as doing so bypasses Playwright's built-in retry mechanism.

🎯 Senior SDET Challenge (Production Scenario):
Imagine you're automating a shopping application.
When the user clicks Place Order:

A loading spinner appears.
The backend takes 4 seconds.
The application navigates to an order confirmation page.

The page displays:
Order #54821 placed successfully.

Your task:
1. Rewrite this using Playwright best practices.
2. Explain why your version is more reliable.
3. Where would this assertion live in our framework—inside the Page Object or in the test? Why?

A junior engineer writes:
await placeOrderButton.click();
await page.waitForTimeout(5000);
expect(await confirmationMessage.textContent())
    .toContain("placed successfully");

await placeOrderButton.click();
await expect(confirmationMessage).toContainText("placed successfully");

1. Rewrite this using Playwright best practices.
await placeOrderButton.click();
await expect(confirmationMessage).toContainText("placed successfully");

==> A slight better verion;
await placeOrderButton.click();
await expect(page).toHaveURL(/order-confirmation/);
await expect(confirmationMessage)
    .toContainText("placed successfully");

2. Explain why your version is more reliable.
The reason behind my version is more reliable is that it uses the inbuilt auto-waiting capabilities of PLAYWRIGHT. And it is not forcing the Application to wait for 
a certain time perios. It is also more dynamic. It is also reducing the unnecessary cluttering and making the code more readable.
==> A slight better verion;
Remember:
Auto-waiting is a broad Playwright capability.
Web-first assertions are specifically the retry behavior of expect(locator).

==> "The assertion uses Playwright's web-first assertion engine, which repeatedly resolves the locator until the expected text appears or the timeout expires. This removes 
hard-coded waits, reduces flakiness, improves execution speed, and makes the test resilient to varying backend response times."

3. Where would this assertion live in our framework—inside the Page Object or in the test? Why?
This assertion must live in our test layer.
Test cases should express business expectations not interactions with the application.Keeping assertions in the test layer improves 
reusability, flexibility, and separation of concerns. It allows the same Page Object methods to be reused in different test scenarios with different expected outcomes.

Handling Dropdowns in Playwright:
Part 1 — Native HTML <select>
We'll cover:
- selectOption()
- Selecting by value
- Selecting by label
- Selecting by index
- Multi-select dropdowns
- Getting selected values
Best practices

Part 2 — Modern UI Dropdowns (Most Important):
React, Angular, Material UI, PrimeNG, Ant Design...
These are not <select> elements.

We'll learn how to automate:
- Searchable dropdowns
- Dynamic dropdowns
- Auto-suggestion lists
- Virtual scrolling dropdowns
- Lazy-loaded options

This is what you'll encounter in most enterprise projects.

Part 3 — Enterprise Scenarios
We'll cover:
- Country → State → City cascading dropdowns
- API-driven dropdowns
- Flaky dropdown handling
- Loading indicators
- Common interview questions
- Production mistakes

Let's Start with Part 1
Native HTML <select> Dropdowns
1️. Concept

First, let's understand what a native dropdown actually is.
Consider this HTML:

<select id="country">
    <option value="in">India</option>
    <option value="us">USA</option>
    <option value="uk">United Kingdom</option>
</select>

This is a real HTML <select> element.

Playwright :
await page.locator("#country").selectOption("in");

Selecting by Value ⭐⭐⭐⭐⭐ (Most Common)
HTML:
<option value="in">India</option>

Playwright:
await page.locator("#country").selectOption("in");

Selecting by Label:
HTML:
<option value="in">India</option>
await page.locator("#country").selectOption({ label: "India" });

Selecting by Index:
await page.locator("#country").selectOption({ index: 2 });

⚠️ Use only if there's no stable alternative.
Indexes are brittle because the option order can change.

Selecting Multiple Options
HTML:
<select multiple>

Playwright:
await page.locator("#skills").selectOption(["java", "ts", "playwright"]);

Verify Selected Option:
Instead of reading the selected value manually:
await expect(page.locator("#country")).toHaveValue("in");

Or if the UI displays the selected text elsewhere:

await expect(selectedCountryLabel).toHaveText("India");

3. Internal Working (Superficial)
When you call:
await page.locator("#country").selectOption("in");

Playwright roughly performs:
Resolve Locator
      ↓
Is it a <select> element?
      ↓
Locate matching <option>
      ↓
Update selected value
      ↓
Dispatch browser events (input/change)
      ↓
Return



🎯 Interview Preparation
Question 1:
What is the preferred way to automate a native HTML <select> dropdown in Playwright? Why?
Ideal Answer

Use locator.selectOption() because it is specifically designed for HTML <select> elements. It interacts with the control through the browser's native behavior, dispatches 
the correct events, and is more reliable than simulating user clicks.

Question 2:
Would you select by value, label, or index?
Ideal Answer:
Value is my first choice because it's typically stable and unaffected by UI text changes or localization.
Label is acceptable when the visible text is stable and meaningful.
Index should be a last resort because it depends on option order, which can change over time.

🧠 Senior SDET Challenge

Consider this HTML:

<select id="country">
    <option value="IN">India</option>
    <option value="US">United States</option>
    <option value="UK">United Kingdom</option>
</select>

The product team announces that the application will soon support 10 languages.

Examples:

India → भारत (Hindi)
India → Inde (French)
India → Indien (German)
Questions
1. Which selection strategy would you choose: value, label, or index?
Ans: I would choose value.
2. Why?
 Ans: Because value is typically stable and unaffected by UI text changes or localization.
This one extra line can also be added;
"The value attribute is usually part of the application's data model, whereas the visible label belongs to the presentation layer and is more likely to change due to 
localization or UI updates."
3. What verification strategy would you use to ensure the correct option was selected without making your tests fragile across multiple languages?
Ans: 
await expect(page.locator("#country"))
    .toHaveValue("in");

*** This Is an Important Testing Principle ***
There are two levels of assertions.

Level 1 — UI State:
await expect(country)
    .toHaveValue("IN");

You're verifying the widget itself.

Level 2 — Business Behavior:
await expect(currency)
    .toHaveText("₹");

You're verifying what selecting the country actually does.

Day 2 – Topic: Custom Dropdowns (React, Angular, Material UI, etc.)
Let's assume the DOM looks like this:
<button aria-label="Country">
    Select Country
</button>

<ul role="listbox">
    <li role="option">India</li>
    <li role="option">USA</li>
    <li role="option">UK</li>
</ul>

Step 1 — Open the Dropdown
await page
    .getByRole('button', { name: 'Country' })
    .click();
Step 2 — Select the Option
await page
    .getByRole('option', { name: 'India' })
    .click();

That's it.
Two independent actions.

🎯 Interview Preparation
Question 1:
How do you determine whether to use selectOption() or a sequence of clicks?
Ideal Answer:
I first inspect the DOM. If the control is a native HTML <select>, I use selectOption(). If it's built with custom HTML elements such as div, button, ul, or ARIA roles like combobox 
and listbox, I interact with it the way a user would—open the dropdown and then select the desired option.

Question 2:
Why is selectOption() not suitable for most React or Angular dropdowns?
Ideal Answer:
selectOption() is specifically designed for HTML <select> elements. Most modern UI frameworks implement dropdowns using custom components that do not contain 
a <select>, so the correct approach is to interact with the trigger and the options using standard Playwright actions and appropriate locators.

🧠 Senior SDET Challenge
You're automating a React application.
The UI shows:
Department

▼ Select Department
After clicking, the application sends an API request.
Only after the API responds (about 2 seconds later) are these options rendered:
Engineering
Finance
Human Resources

Your task:
1. How would you automate this using Playwright?
I would follow 2 step approach to do this, first click on department, then select the department name. like below;
await page
    .getByRole('button', { name: 'Department' })
    .click();

await page
    .getByRole('option', { name: 'Engineering' })
    .click();
	
2. Would you add an explicit wait for 2 seconds? Why or why not?
You wrote:
Explicit wait is not needed. Playwright's internal wait mechanism and retry mechanisms will handle it.
Instead of saying:
"Playwright's internal wait mechanism"
I'd say:
"The second click() operates on a Locator. Since Locators are lazy and action methods are auto-waiting, Playwright will repeatedly resolve the option and wait until it becomes 
actionable or the timeout expires."

Notice how precise that sounds.
You're explaining why it works instead of just saying that it works.

3. Which locator strategy would you choose for the options, and why?
My ans:
getByRole() locates elements using the browser's accessibility tree and semantic roles rather than implementation details such as CSS classes or IDs. This makes tests
more resilient to UI refactoring and simultaneously encourages accessible web applications.
Gpt:
"getByRole() is my preferred locator because it identifies elements based on their semantic role and accessible name instead of implementation details like CSS classes or DOM 
structure. This makes tests more resilient to UI refactoring while also promoting accessible applications."

This is a very common enterprise pattern, especially in applications where dropdown contents are loaded on demand rather than being present in the initial page markup.

Day 2 – Searchable / Auto-Suggestion Dropdowns:
Playwright:

await page
    .getByRole('combobox', { name: 'Department' })
    .fill('Eng'); // filter values

await page
    .getByRole('option', { name: 'Engineering' })
    .click(); // now Select value Here

5️. Interview Preparation
Question 1:
How would you automate an auto-suggestion dropdown in Playwright?
Ideal Answer:
Treat it as two interactions: fill the input to trigger the search, then select the desired option using a semantic locator such as getByRole('option'). Rely on Playwright's 
auto-waiting instead of hard-coded delays.

Question 2:
Why wouldn't you use ArrowDown + Enter?
Ideal Answer:
Keyboard navigation depends on the ordering of suggestions, which can change as data changes or ranking algorithms evolve. Selecting the desired option by name makes 
the test deterministic and expresses the business intent more clearly.

==> Don't automate the UI component. Automate the user's intention. <==


No Results
Your task:
1. How would you automate selecting John Smith?
Ans:
await page
    .getByRole('combobox')
    .fill('John'); // filter value
await page
    .getByRole('option', { name: 'John Smith' })
    .click(); // now Select value Here
	
2. How would your test handle the "No Results" scenario?
Ans:
const johnOption = page.getByRole('option', { name: 'John Smith' });
const noResultsMessage = page.getByRole('option', { name: 'No results' });

// 1. Filter the combobox
await page
    .getByRole('combobox')
    .fill('John'); 
	
const isJohnVisible = await johnOption
  .waitFor({ state: 'visible', timeout: 3000 })
  .then(() => true)
  .catch(() => false);

if (isJohnVisible) {
  await johnOption.click();
} else {
  await expect(noResultsMessage).toBeVisible();
}

GPT solution:
await page.getByRole('combobox').fill('John');

await expect(
    page.getByRole('listbox')
).toBeVisible();

const johnOption = page.getByRole('option', {
    name: 'John Smith'
});

if (await johnOption.isVisible()) {
    await johnOption.click();
} else {
    await expect(
        page.getByText('No Results')
    ).toBeVisible();
}
Why?
Because I'm synchronizing on something that should always happen first: the suggestion list appearing.
Only after that do I branch based on the content.
That removes a race condition.

3. Would you use ArrowDown + Enter or click the specific option? Explain your reasoning.
Ans:
No I wouldn't use ArrowDown + Enter option. I would prefer to use click the specific option.
Keyboard navigation depends on the ordering of suggestions, which can change as data changes or ranking algorithms evolve. Selecting the desired option by name makes 
the test deterministic and expresses the business intent more clearly.

Here's How I Think:
This is the framework I use mentally.

Level 1:
Can Playwright already handle this automatically?
If yes...
Don't write extra code.

Level 2:
If Playwright cannot...
Can I synchronize with the UI?

Examples:
- Spinner disappears.
- Toast appears.
- Table loads.
- Modal opens.
Prefer these because they're user-visible.

Level 3:
If there is no useful UI signal...
Can I synchronize with the network?

Examples:
- Wait for a specific API response.
- Verify request payloads.
- Mock responses.

Level 4:
If none of the above are possible...
Use a timeout only as a last resort, and even then question whether there's a better design or testability improvement available.

This Is the Decision Tree I Use:
Need synchronization?
        │
        ▼
Can Playwright auto-wait?
        │
      Yes
        │
        ▼
Use Playwright only
        │
      No
        ▼
Meaningful UI state available?
        │
      Yes
        │
        ▼
Wait for UI state
        │
      No
        ▼
Need network validation?
        │
      Yes
        │
        ▼
waitForResponse()
        │
      No
        ▼
Hard wait (last resort)

==>
I don't just want you to know that click() exists or that waitForResponse() exists. I want you to be able to explain:
Why one solution is better than another.
When to choose each one.
What trade-offs you're accepting.

Because that's exactly what senior interviewers probe for. They'll often ask, "Could you solve this another way? Why didn't you choose it?" If you can answer with this kind 
of structured reasoning, you'll stand out far more than someone who only knows the APIs.

Dynamic Lists & Tables:

You'll learn how to automate scenarios like:
=> Find a user in a table and click Edit.
=> Find an order by ID and open it.
=> Delete a specific product.
=> Select a checkbox in the correct row.
=> Handle tables with pagination.
=> Work with dynamically loaded data.

This topic combines everything we've learned so far:
=> Locators
=> Chaining
=> filter()
=> Assertions
=> Lazy locators
=> Actionability

It's where all those concepts start working together in realistic enterprise scenarios.

1. Concept

Let's start with a simple employee table.

----------------------------------------------------------
| Name          | Department     | Status   | Action      |
----------------------------------------------------------
| John Smith    | Engineering    | Active   | Edit Delete |
| Jane Doe      | HR             | Active   | Edit Delete |
| Bob Wilson    | Finance        | Inactive | Edit Delete |
----------------------------------------------------------

Suppose the requirement is:
Edit John Smith	

Suppose the HTML is conceptually:
<tr>
    <td>John Smith</td>
    <td>Engineering</td>

    <td>
        <button>Edit</button>
    </td>
</tr>

Playwright Solution:
await page
    .locator('tr')
    .filter({
        hasText: 'John Smith'
    })
    .getByRole('button', { name: 'Edit' })
    .click();

Interview Preparation:
Question 1:
Why is filter({ hasText: 'John Smith' }) preferred over .nth() for dynamic tables?
Ideal Answer:
filter({ hasText: 'John Smith' }) identifies the row using business data, making the locator resilient to sorting, pagination, and row insertion. 
.nth() depends on position, which frequently changes and leads to brittle tests.

Question 2:
How would you automate clicking the Edit button for a specific employee in a dynamic table?
Ideal Answer:
I would first locate all rows, filter the row using unique business data such as the employee's name or ID, and then locate the Edit button within that row. 
This approach mirrors how users identify records and results in more maintainable and reliable automation.

🧠 Senior SDET Challenge
Let's make this realistic.

You have this table:
--------------------------------------------------------------------------
| Employee        | Department     | Status    		| Action
--------------------------------------------------------------------------
| John Smith      | Engineering     | Active     		| Edit
| John Smith      | HR             		  | Inactive 	    | Edit
| Jane Doe         | Finance       	  | Active     		| Edit
--------------------------------------------------------------------------

Notice something?
There are two employees named John Smith.

The business requirement is:
Click Edit for John Smith who belongs to Engineering.

Questions
1. Is filter({ hasText: 'John Smith' }) alone sufficient? Why or why not?
Ans:
No, filter({ hasText: 'John Smith' }) alone is not sufficient. 
why, because Playwright expects exactly one element. Playwright enforces Strict Mode to ensure locators uniquely identify a single target. Failing fast on ambiguous locators 
prevents non-deterministic behavior and reduces flaky tests. This encourages engineers to create resilient, intention-revealing locators rather than relying on DOM order.
why not, because It will throw error as;
Error:
strict mode violation:
locator resolved to 2 elements

One Tiny Improvement
You wrote:
Playwright expects exactly one element.

More precisely:
Action methods like .click(), .fill(), .check(), etc., require the locator to resolve to exactly one element.

This distinction matters.

2. How would you build a locator that uniquely identifies the correct row?
Ans:
await page
  .locator('tr')
  .filter({ hasText: 'John Smith' })  // Step 1: Keep rows containing "John Smith"
  .filter({ hasText: 'Engineering' }) // Step 2: From those rows, keep only ones ALSO containing "Engineering"
  .getByRole('button', { name: 'Edit' })
  .click();

Alternative:-
Sometimes you may want a more precise condition.
For example:
page.locator('tr').filter({
    has: page.getByRole('cell', {
        name: 'Engineering'
    })
});

Or:
page.locator('tr').filter({
    has: page.getByText(/^Engineering$/)
});
These approaches are more precise when needed.  
  
3. If tomorrow another column (Location) is added to the table, would your locator still work? Explain your reasoning.
Ans: yes it will work.
Because the Locator that i have written it identifies the row using business data, making the locator resilient to sorting, pagination, and row insertion.

Enterprise Rule:
When available, prefer identifiers in this order:
1.Unique business ID (Employee ID, Order ID, Transaction ID) - [A stable employee ID is much less likely to change.]
2.Unique business attributes (Email, Username)
3.Combination of business attributes (Name + Department)
4.Position (.nth()) — last resort

That's a useful rule of thumb in almost every application.
🌟 Interview Tip

If an interviewer asks:
"How do you identify the correct row in a dynamic table?"

A strong answer is:
"I prefer a unique business identifier such as an Employee ID or Order ID. If that's not available, I use a combination of stable business attributes that uniquely identify the row. 
I avoid relying on row positions because sorting, filtering, and pagination can change them."

📈 Your Progress
At the start of our course, you would likely have answered:
"I'd use .nth()."

Now you're naturally thinking in terms of:
=> Strict Mode
=> Business identity
=> Locator composition
=> Maintainability
=> Stability

That's a significant shift.

==> Playwright cannot interact with elements that do not exist in the DOM.
This sounds obvious.

But it explains almost every automation problem involving:
- Pagination
- Infinite Scroll
- Virtual Scrolling
- Lazy Loading

Interview Preparation
Question 1:
Why can't Playwright find an element on Page 4 while you're still on Page 1?
Ideal Answer:
Because Playwright interacts only with elements that exist in the current DOM. Pagination typically replaces the DOM with a new set of rows, so records on other pages are 
not available until the corresponding page is loaded.

Question 2:
Would you store the table rows before navigating through pages?
Ideal Answer:
No. The DOM changes after pagination, making previously captured element references stale. Instead, I would use Locators, which are resolved against the current DOM 
whenever an action or query is performed.

🧠 Senior SDET Challenge

Let's make this realistic.

You're testing an HR application.

The table has 500 employees.

There are 50 pages.

Each page displays 10 rows.

The employee IDs are unique.

The product owner asks you to automate:

Open EMP478 and click "Edit".

Questions:
1. Would you search page-by-page or try to build one locator that searches all pages? Why?
Ans: I will  try to build one locator that searches all pages. Because it could enhance test-execution time.

❌ This is the one answer I disagree with.
And this is actually a very common misconception.
So what is the correct answer?
Option 1 (Good)
Paginate.

Option 2 (Better)
Use the application's search feature.

2. The "Next" button becomes disabled on the last page. How would you use that to make your algorithm safe?
Ans: When the "Next" button becomes disabled on the last page, I will Immediately stop or terminate the execution.

3. Suppose the application also has a search box above the table that filters employees by ID. Would you still paginate through 50 pages? Or 
would you choose a different strategy? Explain your reasoning.
Ans: If a search box is available Which allows the filtering of employees by ID then I will prefer to use it over paginating through the 50 pages.

Day 2 – Checkboxes & Radio Buttons
For both Checkboxes & Radio Buttons;
check() - to check or selecting the checkbox or radio Button
uncheck() - to uncheck the checkbox or radio Button

Day 3 (Advanced UI)
Frames (iFrames) ⭐⭐⭐⭐⭐
An <iframe> creates another document with its own DOM tree.

Playwright provides:
frameLocator()

Example:
await page
  .frameLocator('iframe[title="Payment"]')
  .getByLabel('Card Number')
  .fill('4111111111111111');

Read it aloud:
Find the Payment iframe → inside that frame → find the Card Number field → fill it.
That's beautifully intention-revealing.

Why frameLocator() Instead of frame()?
frameLocator() behaves like a Locator.

That means:
=> Lazy evaluation
=> Auto-waiting
=> Auto-retrying
=> Better synchronization

It follows the same design philosophy as the Locator API.

🎯 Today's Challenge
A login page contains this HTML structure:

Main Page
└── iframe (title="Authentication")
      ├── Username
      ├── Password
      └── Login Button

Without looking at documentation, try to write the Playwright code that:
1. Enters the username.
2. Enters the password.
3. Clicks the Login button.

await page // Wrong Code.
.frameLocator('iframe[title="Authentication"]') 
.getByLabel('Username').fill('abcd') // fill() return Promise<void>, so chaing cann't be done. Wrong Code.
.getByLabel('Password').fill('abcd')
.getByLabel('Login Button').click() ;

const authFrame = page.frameLocator('iframe[title="Authentication"]');

Enterprise style code:
const authFrame = page.frameLocator('iframe[title="Authentication"]'); // store the frameLocator

//now;
await authFrame.getByLabel('Username').fill(username);
await authFrame.getByLabel('Password').fill(password);
await authFrame.getByRole('button', { name: 'Login' }).click(); 

Interview Tip ⭐⭐⭐⭐⭐
Here's a question I've actually seen interviewers ask.

Why does Playwright have frameLocator() when it already has frame()?
A strong answer is:
frameLocator() follows Playwright's Locator model. It provides lazy evaluation and integrates naturally with auto-waiting and locator composition. It's generally the preferred 
API for interacting with iframe content because it offers the same reliability and developer experience as standard Locators.

Notice that we're not saying: "Because the documentation says so."
We're explaining the design philosophy.

🧠 Senior SDET Thought Exercise

Now I want to challenge your understanding.

Suppose a payment page has three iframes.

Main Page

├── Card Number Frame
├── Expiry Frame
└── CVV Frame

Each field lives in a different iframe.

This is exactly how Stripe Elements works.

Question:
Without worrying about the exact syntax, how would you structure your code?

Would you:
1. Create one frameLocator variable per iframe?
Ans: no
2. Repeatedly call page.frameLocator(...) for every action?
Ans: not a good choice. it's kind of create too much of redudant code in the Application.
3. Design a reusable helper/Page Object around the payment component?
Ans: Best option to do, it will enhance the code reusability and Readability.

I'm not looking for syntax. I'm looking for your framework design thinking. This is the kind of discussion that often comes up in senior SDET interviews.

Let's Design It
Suppose Stripe gives us this UI.

Checkout Page
---------------------
Billing Address
Shipping Address
---------------------
Payment
    Card Number Frame
    Expiry Frame
    CVV Frame
---------------------
Pay Now
---------------------
Payment Component:
import { Page, FrameLocator } from '@playwright/test';
export class PaymentComponent {
    private readonly cardFrame: FrameLocator;
    private readonly expiryFrame: FrameLocator;
    private readonly cvvFrame: FrameLocator;

    constructor(page: Page) {
        this.cardFrame = page.frameLocator('iframe[title="Card Number"]');
        this.expiryFrame = page.frameLocator('iframe[title="Expiry Date"]');
        this.cvvFrame = page.frameLocator('iframe[title="CVV"]');
    }

    async enterCardNumber(cardNumber: string) {
        await this.cardFrame.getByPlaceholder('1234 1234 1234 1234').fill(cardNumber);
    }

    async enterExpiry(expiry: string) {
        await this.expiryFrame.getByPlaceholder('MM / YY').fill(expiry);
    }

    async enterCVV(cvv: string) {
        await this.cvvFrame.getByPlaceholder('CVV').fill(cvv);
    }

    async enterPaymentDetails( card: string, expiry: string,cvv: string) {
        await this.enterCardNumber(card);
        await this.enterExpiry(expiry);
        await this.enterCVV(cvv);
    }

}

Checkout Page
Now your Checkout Page becomes very clean.
import { Page } from '@playwright/test';
import { PaymentComponent } from '../components/PaymentComponent';

export class CheckoutPage {
    readonly payment: PaymentComponent;

    constructor(page: Page) {
        this.payment = new PaymentComponent(page);
    }
}

Test, Look how beautiful this reads.
await checkoutPage.payment.enterPaymentDetails('4111111111111111', '12/28', '123');

That is low coupling.
That is high cohesion.
That is enterprise design.

==> File Upload / File handling ⭐⭐⭐⭐⭐
When a human clicks Choose File, the operating system opens a native file picker:
Windows File Explorer

Here's the key point:
Playwright does not automate the operating system's file picker.

Why?
Because the OS dialog is outside the browser.
Playwright automates the browser, not Windows Explorer, Finder (macOS), or Linux file dialogs.
So instead of trying to click around the OS window, Playwright directly sets the file on the underlying <input type="file">.

This makes uploads:
=> Faster
=> Deterministic
=> Cross-platform
=> CI-friendly

Suppose the HTML is:
<input type="file" id="resume">

Playwright:
await page.locator('#resume').setInputFiles('test-data/resume.pdf');

That's it.
- No OS dialog.
- No Robot class.
- No AutoIt.
- No Sikuli.
- ust one API.

Multiple Files:
await page
    .locator('#documents')
    .setInputFiles([
        'files/a.pdf',
        'files/b.pdf',
        'files/c.pdf'
    ]);

Clear the Selection:
await page
    .locator('#documents')
    .setInputFiles([]);

This removes any previously selected files.

Date Pickers (Calendars) ⭐⭐⭐⭐⭐

Type 1 — Native HTML Date Input ⭐⭐⭐⭐⭐

HTML:
<input type="date">

This is the easiest.

Playwright:
await page
    .locator('input[type="date"]')
    .fill('2026-08-15');

Notice the format:
YYYY-MM-DD
No calendar popup needed.

Type 3 — Fully Custom Calendar ⭐⭐⭐

Some companies build everything themselves.

Sometimes:
Months are dropdowns.
Sometimes arrows.
Sometimes infinite scroll.
Sometimes virtualization.

No standard.

I'd create a reusable component.
export class DatePickerComponent {

    constructor(
        private readonly root: Locator
    ) {}

    async selectDay(day: number) {
        await this.root.click();
        await this.root.getByRole('gridcell', {name: day.toString()}).click();
    }
}

🌐 Multiple Tabs / New Windows:

And there's one Playwright concept here that is particularly important:
A new tab/window is represented by a new Page object within the same BrowserContext.

Correct Playwright Pattern ⭐⭐⭐⭐⭐
Use:
const newPagePromise = context.waitForEvent('page'); // observe waitForEvent(), 
await page.getByRole('link', {name: 'View Report'}).click();

const reportPage = await newPagePromise;

Then:
await expect(reportPage.getByRole('heading', {name: 'Report'})).toBeVisible();

==> Even Better: Promise.all()

You will frequently see this pattern:
const [reportPage] = await Promise.all([context.waitForEvent('page'),

page.getByRole('link', {name: 'View Report'}).click()]);

This is concise and correctly synchronizes the event with the action.

Think of it as:
								┌── wait for new page
								│
  Promise.all()	──┤
								│
								└── click link 
		
Real-World Example — OAuth (Login with Google)		
const [authPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', {name: 'Login with Google'}).click()
]);

await authPage.getByLabel('Email').fill(email);

Important Distinction: New Tab vs Popup
page.waitForEvent('popup') // Playwright provides another event for popup

==> For our first pass, remember the practical rule:
If you're dealing with a new Page created in the BrowserContext, context.waitForEvent('page') is the general mechanism. If the current page specifically opens a 
popup, page.waitForEvent('popup') is the more specific API.

🎯 Interview Focus
Question 1:
Why should you register waitForEvent('page') before clicking the element that opens a new tab?
Ideal Answer:
Because the new page can be created immediately after the click. Registering the event listener before the action prevents a race condition where the page event could occur 
before Playwright starts waiting for it.

Question 2:
What's the difference between a BrowserContext and a Page?
Ideal Answer:
A BrowserContext represents an isolated browser session containing its own cookies, storage, permissions, and pages. A Page represents an individual tab or window within that 
context. Opening a new tab generally creates another Page within the same BrowserContext rather than creating a new context.

🧠 Your Challenge

Consider this scenario:
Application
     ↓
Click "Download Report"
     ↓
New Tab opens
     ↓
Report page loads

Write the Playwright code that:
1. Clicks Download Report.
Ans:
const [reportPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', {name: 'Download Report'}).click()
]);
2. Captures the newly opened page.
Ans: 
const newPagePromise = context.waitForEvent('page'); // observe waitForEvent(), 
await page.getByRole('link', {name: 'View Report'}).click();
const reportPage = await newPagePromise; // The actual capture happens here
3. Waits until the report page has reached the appropriate state.
Ans:
const newPagePromise = context.waitForEvent('page'); // observe waitForEvent(), 
await page.getByRole('link', {name: 'View Report'}).click();
const reportPage = await newPagePromise;

await expect(reportPage.getByRole('heading', { name: 'Sales Report' })).toBeVisible();

4. Verifies that the heading "Sales Report" is visible.
Ans:
const [reportPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', {name: 'Download Report'}).click()
]);

await expect(reportPage.getByRole('heading', {name: 'Sales Report'})).toBeVisible();

⭐ Final Production Version
I'd write:
const [reportPage] = await Promise.all([context.waitForEvent('page')]),

page.getByRole('button', {name: 'Download Report'}).click()]);

await expect(reportPage.getByRole('heading', {name: 'Sales Report'})).toBeVisible();

This is concise, synchronized, and expresses the business intent clearly.

🌍 Browser vs BrowserContext vs Page ⭐⭐⭐⭐⭐
If you understand this topic well, you'll understand why Playwright is architected the way it is.
1. The Concept
Let's say you launch Chrome.

Chrome

Inside Chrome, you open two Incognito windows.

Chrome
│
├── Incognito Window 1
│
└── Incognito Window 2

Inside the first Incognito window, you open three tabs.
Chrome
│
├── Incognito Window 1
│   ├── Tab 1
│   ├── Tab 2
│   └── Tab 3
│
└── Incognito Window 2
    └── Tab 1
	
Playwright models this almost perfectly.

Browser
│
├── BrowserContext
│   ├── Page
│   ├── Page
│   └── Page
│
└── BrowserContext
    └── Page

So the mapping is:
| Real Browser    		 | Playwright     		|
| ---------------------		 | -------------------- 	|
| Chrome             		 | Browser      	 		|
| Incognito Window | BrowserContext 	|
| Tab             				 | Page         				|

This analogy is incredibly important.

2. What Does Each One Do?
Browser
The Browser represents the actual browser process.

const browser = await chromium.launch();

Normally:
=> One browser process
=> Multiple BrowserContexts

Think:
Chrome.exe

BrowserContext ⭐⭐⭐⭐⭐

This is where the magic happens.
A BrowserContext is an isolated browser session.

Each context has its own:
=> Cookies
=> Local Storage
=> Session Storage
=> Permissions
=> Authentication State

Page:
A Page is simply: A browser tab.
const page = await context.newPage();

Pages inside the same BrowserContext share:
=> Cookies
=> Local Storage
=> Authentication
Exactly like tabs in the same browser window.

3. Why Did Microsoft Design It This Way?
Imagine Selenium.
Many Selenium frameworks do this:
	Launch Chrome
		↓
	Run Test
		↓
	Close Chrome
		↓
	Launch Chrome Again
	
- Expensive.
- Slow.
- Now imagine Playwright.
	Launch Browser Once
		↓
	Context A
		↓
	Test
		↓
	Destroy Context
		↓
	Context B
		↓
	Next Test

Creating a BrowserContext is much cheaper than launching a new browser process.
This is one of the reasons Playwright scales so well.

4. Enterprise Example
Imagine you're testing a chat application.

You need:
Alice
Bob

Chatting simultaneously.
Would you do:
Browser A
Alice

Browser B
Bob

No.

Instead:
	Browser
	│
	├── Context (Alice)
	│
	└── Context (Bob)

Each context has its own login session. Perfect.

Playwright Code:
const browser = await chromium.launch();

const aliceContext = await browser.newContext();
const bobContext = await browser.newContext();

const alicePage = await aliceContext.newPage();
const bobPage = await bobContext.newPage();

Selenium Comparison

In Selenium, people often think in terms of:
	Driver
	 ↓
	Browser

Playwright introduces a richer model:
	Browser
	 ↓
	BrowserContext
	 ↓
	Page

This additional layer gives you efficient session isolation without repeatedly launching browser processes.

🎯 Interview Questions
Question 1:
Why would you use multiple BrowserContexts instead of multiple Pages?
Ideal Answer:
Because Pages within the same BrowserContext share cookies, storage, and authentication state. If I need isolated users or independent sessions, I use separate BrowserContexts.

Question 2:
Can two Pages in the same BrowserContext represent two different logged-in users? Why or why not?
Ideal Answer:
No. Pages in the same BrowserContext share the same session data. Logging in as a second user would affect the shared authentication state. Separate BrowserContexts are 
required for independent user sessions.

🧠 Senior SDET Challenge

Imagine you're automating an approval workflow:

Employee
    │
    ├── Submits Leave Request
    │
    ▼
Manager
    │
    ├── Approves Request
    │
    ▼
Employee
    │
    └── Verifies Status = Approved
Your Task

Without worrying about every API call, explain how you would structure this test.

Specifically:
1. How many BrowserContexts would you create?
Ans: I would create 2. One for Employee and another for manager.
2. How many Pages would you create?
Ans: 2
3. Why is this design better than opening two tabs in the same BrowserContext?
Ans: Because if we will open 2 tabs in the same BrowserContext, it can create conflicts and affect the shared authentication state.
Separate BrowserContexts are required for independent user sessions.

interview-perfect:
Two Pages in the same BrowserContext share cookies, local storage, session storage, and authentication state. If Employee logs in and then Manager logs in from another tab, the 
authentication session is shared. This prevents us from accurately simulating two independent users.

I'm looking for your architectural reasoning, not perfect syntax. This type of discussion comes up surprisingly often in senior SDET interviews.

Downloads (File Download Handling) ⭐⭐⭐⭐⭐
1. The Concept
How does Playwright know when the download has started?
Answer: The browser emits a download event.

Just like:
New Tab  → page event
Popup    → popup event
Download → download event

See the pattern?

Playwright is heavily event-driven.
2. Correct API Usage ⭐⭐⭐⭐⭐
const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', {name: 'Export Report'}).click()]);	

Now you have a Download object.
Save the file
await download.saveAs('downloads/report.pdf');

Enterprise Design ⭐⭐⭐⭐⭐
async downloadEmployeeReport() {
    const [download] = await Promise.all([this.page.waitForEvent('download'),this.exportButton.click()]);
    return download;
}

Test:
const report = await reportsPage.downloadEmployeeReport();

🎯 Interview Focus
Question 1:
Why do we register waitForEvent('download') before clicking Export?
Ideal Answer:
To avoid a race condition. If the browser starts the download immediately after the click, registering the listener first ensures Playwright doesn't miss the event.

Question 2:
After downloading a report, what would you validate?
A strong answer:
"It depends on the business requirement. At a minimum, I'd verify the download completed successfully. If the file is business-critical, I'd also validate the filename, file existence, and 
contents (such as CSV, Excel, or PDF data) rather than only checking that a download occurred."

Dialogs (Alerts, Confirmations & Prompts) ⭐⭐⭐⭐☆

Examples: 
- Delete confirmation
- Logout confirmation
- Unsaved changes warning
- JavaScript alert()
- JavaScript confirm()
- JavaScript prompt()

1 The Concept
There are two types of dialogs you'll encounter:
A. Native Browser Dialogs ✅
These are created using JavaScript:
alert("Saved Successfully");
confirm("Delete this record?");
prompt("Enter your name");

They are not part of the DOM.

B. Application Dialogs (Modal/Popup)
Example:
<div class="modal">
    Are you sure?
</div>

These are part of the DOM.
Treat them like any other element:
await page.getByRole('button', { name: 'Yes' }).click();

⭐ Rule to Remember
=> Native browser dialogs are handled using Playwright events.
=> Application modals are handled using normal locators.

page.on('dialog', async dialog => {
    await dialog.accept();
});

🎯 Interview Focus
Question 1:
How do you determine whether to use page.on('dialog') or locators?
Ideal Answer:
I first determine whether the dialog is a native browser dialog (alert, confirm, or prompt) or an application-built modal. Native dialogs are handled using Playwright's dialog 
event because they aren't part of the DOM. Application modals are ordinary DOM elements and should be automated using locators.

📌 Notes
=> Native dialogs → page.on('dialog')
=> Application modals → normal locators
=> Register the dialog listener before triggering the action

🌐 Network Interception & Mocking ⭐⭐⭐⭐⭐
This is one of the highest ROI topics in Playwright.

1. The Concept
Let's first understand why this feature exists.

Imagine this application:
 UI
  │
 ▼
Backend API
  │
 ▼
Database

When you click:
Login

The browser sends:
POST /login

The server responds:
{
    "token": "...",
    "user": "Jwala"
}

Normally your UI test depends on:
- Backend availability
- Database state
- Network latency
- Test environment

Now imagine...
Backend is down.

Should your UI test fail?
Maybe. Maybe not.

That's where interception comes in.

2. What is Network Interception?
Playwright allows us to stand between the browser and the server.

Browser
↓
Playwright
↓
Backend

Playwright can:
- Observe requests
- Modify requests
- Block requests
- Mock responses
- Continue requests

Think of Playwright as a traffic police officer.
Every request passes through it.

3. The Three Things You Can Do
Option 1 — Continue (Default)
Browser
↓
Playwright
↓
Backend

Nothing changes.

Option 2 — Modify
Example:
POST /login
Playwright changes:
{
    "username":"admin"
}
before sending.
Useful.

Option 3 — Mock ⭐⭐⭐⭐⭐
Browser asks:
GET /employees
Instead of going to backend...

Playwright says: I'll answer.

Returns:
[
  {
    "id":1,
    "name":"Jwala"
  }
]
The backend is never contacted.

4. Why Do Companies Use Mocking?

Imagine you're testing: Employee Dashboard

The UI team finished.
Backend team says: API will be ready next month.

Should UI automation wait?
No.

Mock it.
Development continues.

==> Another example.
Backend returns random data.

Yesterday:
10 Employees

Today:
11 Employees

Tomorrow:
0 Employees

Tests become flaky.

Mock:
[
 {
   "id":1,
   "name":"Alice"
 }
]

Now every execution is identical.
Deterministic.

Correct API Usage

Suppose application calls:
GET /employees

Playwright:
await page.route('**/employees', async route => {

    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
            {
                id:1,
                name:'John'
            },
            {
                id:2,
                name:'Alice'
            }
        ])
    });
});

Now...
Every call to:
/employees

gets your fake response.

7. Real World Example ⭐⭐⭐⭐⭐

Imagine:
Employee Dashboard
↓
GET /employees

Backend returns:
500 Internal Server Error

Should your UI automation stop?
Not necessarily.

You can intentionally mock:
[]
to verify:
"No Employees Found"

You're testing the UI's behavior, not the backend's health.

8. Enterprise Framework Thinking ⭐⭐⭐⭐⭐
This is where most frameworks become messy.

Junior engineers write:
page.route(...)

inside every test.
Bad.

Instead:
Mocks:
│
├── employee.mock.ts
├── order.mock.ts
├── payment.mock.ts

Example:
EmployeeMock.success(page);
EmployeeMock.empty(page);
EmployeeMock.serverError(page);

Now tests read beautifully:
await EmployeeMock.empty(page);
await dashboard.open();
await expect(
    dashboard.emptyMessage
).toBeVisible();

See the difference?
The test talks about business scenarios, not JSON construction.

9. When Should You Mock?
This is one of my favorite interview questions.

The answer is:
It depends on what you're testing.

Mock when:
- Backend isn't ready
- Backend is unstable
- Testing UI behavior
- Simulating rare error cases (500, 404, timeout)
- Creating deterministic tests

Don't Mock when:

You're performing:
- End-to-End testing
- API contract validation
- Backend integration verification

If you mock everything...

You're no longer testing the integration.

10. Selenium Comparison

Traditionally in Selenium:
Network interception required:
- BrowserMob Proxy
- Charles Proxy
- OWASP ZAP
- Custom proxy servers

Complex.

Playwright:
Built-in.
One API.

📌 Notes Summary
=> page.route() intercepts network requests before they reach the server.
=> Use mocking to isolate and stabilize UI tests—not to replace all end-to-end testing.
=> Keep mock definitions reusable and centralized (e.g., EmployeeMock.success(), EmployeeMock.serverError()) rather than embedding JSON directly in tests.

🌐 Network Monitoring (waitForRequest() & waitForResponse()) ⭐⭐⭐⭐⭐

Why is this important?
Imagine a bug report:

"Clicking Save shows 'Success', but nothing is actually saved."

How do you verify whether:
=> The UI sent the request?
=> The request payload was correct?
=> The server responded with 200?
=> The response contained the expected data?

This is where network monitoring comes in.

1. The Concept
Consider this flow:

Click Save
      │
     ▼
POST /employees
      │
     ▼
200 OK
      │
     ▼
Success Message

There are three things we can validate:
	User Action
		↓
	Outgoing Request
		↓
	Incoming Response
		↓
	UI Update

Most UI automation validates only:
	User Action
		↓
	UI Update

A Senior SDET validates the entire chain.

2. Two Important APIs
=> waitForRequest()
Waits for: The browser sends a request.

Example:
POST /employees

=> waitForResponse()
Waits for: The server sends a response.

Example: 200 OK

3. Correct API Usage
Waiting for a Request
const requestPromise = page.waitForRequest('**/employees');

await page.getByRole('button', {
    name: 'Save'
}).click();

const request = await requestPromise;

Now you have access to the request.
For example:
request.method();

returns
POST

Waiting for a Response
const responsePromise = page.waitForResponse('**/employees');

await page.getByRole('button', {
    name: 'Save'
}).click();

const response = await responsePromise;

Now you can verify:
expect(response.status()).toBe(200);

4. What Can You Validate?
Request

You can inspect:
- URL
- HTTP Method
- Headers
- Request Body

Example:
const body = request.postData();

Imagine verifying:
{
    "employeeName":"John"
}

instead of only checking that a success toast appeared.

Response

You can validate:
response.status();
200

or

404

or

500

You can also inspect the response body.

When Should You Use This?
✅ Good Use Cases
- Verify API payload
- Verify correct endpoint is called
- Verify HTTP status
- Debug intermittent failures
- Synchronize with backend completion

==> Use network monitoring when the network itself is part of the business behavior.

🎯 Interview Questions
Question 1:
What's the difference between waitForRequest() and waitForResponse()?
Ideal Answer:
waitForRequest() synchronizes when the browser sends a request and allows inspection of the outgoing request (URL, method, headers, payload). waitForResponse() synchronizes 
when the server responds and allows validation of the response status and body.

Question 2 ⭐⭐⭐⭐⭐
Your UI shows "Employee Created Successfully", but the backend actually returned HTTP 500. What would you validate?
Ideal Answer:
I wouldn't rely solely on the success message. I'd verify that the employee creation request was sent, inspect the response status (expecting 201 or 200 as appropriate), and 
ensure the UI behavior is consistent with the backend response. This helps detect false-positive UI behavior.

📌 Notes Summary
=> waitForRequest() → Observe and validate the outgoing request.
=> waitForResponse() → Observe and validate the incoming response.
=> Use these APIs when the network interaction is part of the business requirement, not as a replacement for normal UI assertions.

🔐 Authentication State & storageState ⭐⭐⭐⭐⭐
This feature eliminates repeated logins, dramatically speeds up test execution, and is used in almost every mature Playwright framework.

1. The Problem
Suppose we have 100 tests.

If every test does:

		Open browser
			↓
		Navigate to Login
			↓
		Enter username
			↓
		Enter password
			↓
		Click Login
			↓
		Wait for dashboard
			↓
		Run actual test

we've introduced a huge amount of unnecessary work.

Worse, login itself can become a source of failures.

For example:
- Authentication service is slow
- MFA appears
- CAPTCHA appears
- Login API is temporarily unavailable
- Session creation takes time

But most tests aren't actually testing login.

They're testing:
- Create Employee
- Edit Employee
- Delete Employee
- Generate Report

So we want to authenticate once and reuse the authenticated state.

2. What is storageState?
Playwright can save the browser's authentication-related storage state into a file.

Typically this includes:
- Cookies
- Local Storage

Conceptually:

Login
  ↓
Authenticated Session
  ↓
Save Storage State
  ↓
auth.json

Then another browser context can start with:

auth.json
  ↓
Create Context
  ↓
Already authenticated

So instead of performing login repeatedly:

Test 1 → Login
Test 2 → Login
Test 3 → Login
...
Test 100 → Login

we can do:
Authenticate once
       ↓
    auth.json
       ↓
Tests reuse state

Creating Authentication State

A common pattern is to create a dedicated setup test.

import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {

    await page.goto('/login');

    await page.getByLabel('Username').fill(
        process.env.USERNAME!
    );

    await page.getByLabel('Password').fill(
        process.env.PASSWORD!
    );

    await page.getByRole('button', {
        name: 'Login'
    }).click();

    await page.getByRole('heading', {
        name: 'Dashboard'
    }).waitFor();

    await page.context().storageState({ // This is the important line
        path: 'playwright/.auth/user.json'
    });
});
==> This saves the current context's storage state.

Reusing the State:
Now another test can create a context using that state.

In playwright.config.ts:
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        storageState: 'playwright/.auth/user.json'
    }
});

Now tests start with that authentication state.
For example:

import { test, expect } from '@playwright/test';

test('Create employee', async ({ page }) => {
    await page.goto('/employees');
    await page.getByRole('button', {
        name: 'Add Employee'
    }).click();
    // Actual test begins here...
});

No login code.

That's the important benefit.

6. Very Important: storageState ≠ Permanent Login

This is a common misunderstanding.
Suppose the authentication token expires.

Your:
user.json

doesn't magically remain valid forever.
The server may reject the expired token.
Then you'll need to authenticate again and regenerate the state.

So think:
==> storageState is a reusable snapshot of authentication state, not a permanent login.

7. Enterprise Framework Thinking ⭐⭐⭐⭐⭐

Eventually, we'll structure our framework something like:
playwright-project
│
├── tests
│
├── pages
│
├── components
│
├── fixtures
│
├── utils
│
├── test-data
│
├── playwright.config.ts
│
└── playwright/.auth
      ├── admin.json
      ├── manager.json
      └── employee.json

Then different test suites can use different identities.
For example:
Admin Tests
    ↓
admin.json

Manager Tests
    ↓
manager.json

Employee Tests
    ↓
employee.json

This becomes extremely powerful when combined with fixtures.
We'll eventually reach:
test('Manager approves leave', async ({
    managerPage
}) => {
    // ...
});

The test shouldn't care how the Manager got authenticated.

8. Multi-User Scenario
Remember our previous example:

Employee
   ↓
Submit Leave

Manager
   ↓
Approve Leave

We could have:
- employee.json
- manager.json
and create isolated contexts:

Browser
│
├── Employee Context
│      └── employee.json
│
└── Manager Context
       └── manager.json

This combines two concepts we've already learned:

BrowserContext isolation + authentication state.

That's exactly how these concepts eventually come together in a real framework.

9. Security Warning ⚠️

This is extremely important in enterprise projects.
The authentication state file can contain sensitive session information.

Therefore: playwright/.auth/

should generally not be committed to Git.

Add it to .gitignore: playwright/.auth/

Also don't print authentication state to logs or accidentally upload it as an artifact.

10. Should Every Test Use storageState?

No.

If you're specifically testing:
- Login
- Invalid password
- Account locked
- MFA
- Logout
- Session expiration

you obviously need to exercise the authentication flow itself.

But for:
- Employee creation
- Report generation
- Order management
- Profile editing

reusing authentication state is usually much better.

🎯 Interview Focus
Question 1:
What problem does storageState solve, and why is it better than logging in before every test?
Ideal Answer:
storageState allows us to persist and reuse browser authentication state, such as cookies and local storage, so tests don't need to repeatedly execute the login flow. This reduces 
execution time, removes unnecessary authentication dependencies from unrelated tests, and improves suite stability.

Question 2 ⭐⭐⭐⭐⭐
Your tests are using storageState, but suddenly all tests start returning 401 Unauthorized. What would you investigate?
A strong answer:
I'd first verify whether the stored authentication state has expired or become invalid. I'd also check whether the authentication mechanism changed, whether cookies or tokens are 
still being restored correctly, and whether the environment or base URL has changed. If the state is stale, I'd regenerate it rather than adding waits or modifying individual tests.

📌 Notes Summary:
=> storageState lets us persist and reuse authentication state instead of logging in repeatedly.
=> It stores browser state such as cookies and local storage; it doesn't save a "logged-in page."
=> Keep authentication state files out of source control and regenerate them when the session becomes invalid.

⭐ One Critical Distinction

Don't confuse these three:
Browser
   ↓
BrowserContext
   ↓
Page

with:
Authentication
   ↓
storageState
   ↓
Cookies / Local Storage

storageState is data used to initialize a BrowserContext.
That mental model will become very useful when we reach Fixtures and Framework Architecture.

🚀 API Testing with Playwright (APIRequestContext) ⭐⭐⭐⭐⭐
This is one of the most common topics in Senior SDET interviews.

1. The Concept
Traditionally, UI and API testing were done using different tools.

Example:

UI Testing
↓
Selenium

API Testing
↓
Postman / REST Assured

Playwright changes this.

Playwright
├── UI Automation
│
└── API Automation

-> One framework.
-> One language.
-> One reporting system.
-> One test runner.

2. APIRequestContext

Playwright provides a dedicated object: request

This is not the browser.
This is an HTTP client.

Think of it like:
Browser
↓
Page

(UI)

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

HTTP Client
↓
request

(API)

It communicates directly with the server.
No browser involved.

3. Your First API Call

Example:
import { test, expect } from '@playwright/test';

test('Get Employees', async ({ request }) => {
    const response = await request.get('/employees');
    expect(response.status()).toBe(200);
});

That's it.
No browser.
No page.

4. Reading JSON Response
Suppose API returns:
[
    {
        "id":1,
        "name":"John"
    }
]

Playwright:
const data = await response.json();
expect(data[0].name).toBe('John');

Very simple.

5. POST Request
Example:
const response = await request.post('/employees', {
    data: {
        name: 'John',
        department: 'QA'
    }
});

Notice:
- No browser.
- No form filling.
- Direct HTTP.

7. UI + API Together ⭐⭐⭐⭐⭐
This is where Playwright shines.

Imagine:
Create Employee
↓
UI
↓
Employee ID Generated
↓
API
↓
Verify Database State
↓
UI
↓
Verify Employee Appears

One framework.
One language.
One report.

🎯 Interview Questions
Question 1:
Why would you create test data through APIs instead of the UI?
Ideal Answer:
Creating test data through APIs is significantly faster, more reliable, and less dependent on UI workflows. It reduces execution time, minimizes flakiness, and allows UI tests to 
focus on validating user-facing functionality rather than setup activities.

Question 2 ⭐⭐⭐⭐⭐
When should you combine UI and API testing in the same test?
Ideal Answer:
When different layers provide better validation. For example, I might create an employee through the UI to validate the user workflow, verify the backend state through an 
API, and then confirm the UI reflects the correct data. This gives confidence in both the user experience and system integration.

📌 Notes Summary
=> request is an HTTP client provided by Playwright—it communicates directly with the backend without using the browser.
=> API calls are ideal for test data setup, cleanup, and backend verification.
=> Organize API operations into reusable classes (e.g., EmployeeApi, OrderApi) just as you organize UI interactions into Page Objects.

🏗️ Page Object Model (POM) ⭐⭐⭐⭐⭐
This is one of the most important topics in automation.

1. What is a Page Object?
A Page Object is simply a class that represents one page of your application.

Example:
Application
│
├── Login Page
├── Dashboard Page
├── Employee Page
├── Reports Page

Each page gets its own class.

Example:

pages
│
├── LoginPage.ts
├── DashboardPage.ts
├── EmployeePage.ts

2. Correct API Usage

Example:
import { Page } from '@playwright/test';

export class LoginPage {
    
	constructor(private page: Page) {}

    readonly username = this.page.getByLabel('Username');
    readonly password = this.page.getByLabel('Password');
    readonly loginButton = this.page.getByRole('button', {name: 'Login'});

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

}

Test:
test('Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('admin', 'password');
});

Much cleaner.

3. Internal Working (Superficial)

Playwright doesn't treat a Page Object specially.
It's simply:

Test
↓
LoginPage Object
↓
Playwright APIs
↓
Browser

The Page Object is our design pattern, not a Playwright feature.
This is important.
Playwright works perfectly fine without POM.
POM is introduced by us to improve maintainability.

🎯 Interview Questions
Question 1:
Why do we use the Page Object Model?
Ideal Answer:
POM improves maintainability by centralizing locators and page interactions. Changes to the application's UI usually require updates in only one place, reducing duplication
and making tests more readable and reusable.

Question 2:
Is POM a Playwright feature?
Ideal Answer:
No. POM is a design pattern, not a Playwright feature. It can be implemented in Playwright, Selenium, Cypress, or any UI automation framework to organize page interactions 
and improve code maintainability.

📌 Notes Summary
=> A Page Object encapsulates locators and page interactions for a specific page or screen.
=> POM is a design pattern created by us; Playwright does not require or enforce it.
=> Tests should express business workflows, while Page Objects handle UI interaction details.

🧠 Your Challenge
Suppose you have this page:

Login Page
Username
Password
Remember Me
Login Button

Design a LoginPage class.

You don't need to write every line of code.

Just answer these three questions:
1. Which members (locators) would you store inside the class?
2. Which methods would you expose?
3. Would you expose a clickLoginButton() method, or a higher-level login(username, password) method? Explain your reasoning.

This is one of the most common discussions in senior SDET interviews because it reveals whether you think in terms of UI actions or business actions.

📌 Notes Summary
=> Page Objects should encapsulate locators and page interactions.
=> Keep business assertions in the test layer, not inside Page Objects.
=> Expose meaningful actions (e.g., login()) instead of low-level UI operations whenever appropriate.

📌 Notes Summary
=> Prefer composition over heavy inheritance for scalable Page Object design.
=> Keep any BasePage small and limited to truly common functionality.
=> Reusable UI sections should be modeled as Component Objects, not inherited behavior.

🧩 Playwright Fixtures ⭐⭐⭐⭐⭐
1. The Concept
A fixture is a reusable piece of test setup that Playwright provides to your test.

You've already been using fixtures without explicitly realizing it:

test('Create employee', async ({ page }) => {
    // ...
});

Here: { page } is a Playwright fixture.

Playwright creates and manages that page for you.
Other built-in fixtures include:
- page
- context
- browser
- browserName
- request

So instead of manually doing:
const context = await browser.newContext();
const page = await context.newPage();

Playwright gives you:
async ({ page }) => {

That's the basic idea.

2. Why Do We Need Custom Fixtures?
The real power comes when we create our own fixtures.

Suppose we have:
- LoginPage
- EmployeePage
- DashboardPage

Without fixtures, every test may need:
const loginPage = new LoginPage(page);
const employeePage = new EmployeePage(page);

That's repetitive.
With custom fixtures:

test('Create employee', async ({ employeePage }) => {
    await employeePage.addEmployee(...);
});

The framework creates the Page Object for us.

That's where fixtures become an enterprise framework mechanism, rather than just a Playwright feature.

3. Creating a Custom Fixture
Suppose we have:
export class EmployeePage {
    
	constructor(private page: Page) {}
	
    async addEmployee(name: string) {
        // ...
    }
}

Now create a custom test fixture:
import { test as base } from '@playwright/test';
import { EmployeePage } from '../pages/EmployeePage';

type Fixtures = {
    employeePage: EmployeePage;
};

export const test = base.extend<Fixtures>({
    employeePage: async ({ page }, use) => {

        const employeePage = new EmployeePage(page);

        await use(employeePage); // use() essentially means: "Give this prepared object to the test."
    }
});

Now our test becomes:

import { test } from '../fixtures/test';

test('Create employee', async ({ employeePage }) => {

    await employeePage.addEmployee('John Smith');

});

Much cleaner.

4. What's Actually Happening?
Think of this:

employeePage: async ({ page }, use) => {
    const employeePage = new EmployeePage(page);
    await use(employeePage);
}

as:
Playwright creates page
        ↓
Fixture creates EmployeePage
        ↓
Fixture gives EmployeePage to test
        ↓
Test executes
        ↓
Fixture lifecycle completes

The important API here is:
await use(employeePage);
use() essentially means: "Give this prepared object to the test."

5. Why Is This Better?
Without fixture:

test('Test 1', async ({ page }) => {
    const employeePage = new EmployeePage(page);
});

test('Test 2', async ({ page }) => {
    const employeePage = new EmployeePage(page);
});

test('Test 3', async ({ page }) => {
    const employeePage = new EmployeePage(page);
});

With fixture:
test('Test 1', async ({ employeePage }) => {});
test('Test 2', async ({ employeePage }) => {});
test('Test 3', async ({ employeePage }) => {});

==> The test doesn't care how EmployeePage is constructed. That's dependency injection.

6. Real-World Scenario ⭐⭐⭐⭐⭐
Suppose your framework eventually has:

test
│
├── loginPage
├── dashboardPage
├── employeePage
├── reportPage
├── employeeApi
└── authenticatedUser

A test can simply request what it needs:
test(
    'Manager creates employee',
    async ({
        employeePage,
        employeeApi
    }) => {
        // Business scenario
    }
);

The test doesn't contain infrastructure/setup code.

That's exactly what we want in a scalable framework.

7. Fixture vs beforeEach()
This distinction is important.

==> beforeEach()
Typically performs setup:
test.beforeEach(async ({ page }) => {
    await page.goto('/employees');
});

==> Fixture
Provides a reusable dependency:
async ({ page }, use) => {
    const employeePage = new EmployeePage(page);
    await use(employeePage);
}

Think:
beforeEach
    ↓
"Do something before my test"

Fixture
    ↓
"Give my test something it needs"

There can be overlap, but this mental model is useful.

8. Common Mistake
Don't create fixtures for absolutely everything.

For example, don't turn:
const employeeId = '123';

into a fixture just because you can.

Fixtures are most valuable for reusable dependencies and lifecycle-managed setup.

Good candidates:
- Page Objects
- API clients
- Authenticated users
- Test environments
- Reusable application state

🎯 Interview Focus
Question 1:
What problem do Playwright fixtures solve?
Ideal Answer:
Fixtures provide reusable and isolated test dependencies and setup. They allow us to centralize object creation and lifecycle management, such as Page Objects, API clients, or 
authenticated users, so individual tests remain focused on business behavior.

Question 2 ⭐⭐⭐⭐⭐
Why would you use a fixture to create Page Objects instead of instantiating them directly inside every test?
Ideal Answer:
It removes repetitive setup from tests and centralizes dependency creation. It also gives us a clean dependency-injection model, making the framework easier to maintain and 
allowing changes to Page Object construction to happen in one place.

📌 Notes Summary
=> Playwright fixtures provide reusable test dependencies such as page, context, and request.
=> Custom fixtures can provide our Page Objects, API clients, authenticated users, etc.
=> await use(...) passes the prepared dependency to the test and participates in its lifecycle.

---------------------------------------------------------------------------------------
Page Object
    ↓
Defines HOW to interact with the page
---------------------------------------------------------------------------------------
Fixture
    ↓
Defines HOW the Page Object is provided to the test
---------------------------------------------------------------------------------------
Test
    ↓
Defines WHAT business scenario to validate
---------------------------------------------------------------------------------------
🧩 Fixture Scope & Lifecycle — test vs worker
==> We mainly need to understand when a fixture is created and destroyed and which scope to choose.

1. The Concept
Playwright has two important fixture scopes:
- test
- worker

==> test scope
The fixture is created for each test.

Conceptually:
		Test 1
		  ↓
		Create fixture
		  ↓
		Run test
		  ↓
		Destroy fixture

		Test 2
		  ↓
		Create fixture
		  ↓
		Run test
		  ↓
		Destroy fixture

This is the default and what you'll use most often.

==> worker scope
The fixture is created once per Playwright worker and can be reused by multiple tests running in that worker.

			Worker
			  ↓
			Create fixture

			Test 1
			Test 2
			Test 3
			Test 4
			  ↓
			Worker finishes
			  ↓
			Destroy fixture

This is useful for expensive resources that don't need to be recreated for every test.

🔐 Authentication + Fixtures — Putting Them Together ⭐⭐⭐⭐⭐
We've already learned storageState and fixtures separately. Now we'll combine them into a practical framework pattern.

1. The Concept
We want our tests to look like this:

test('Create employee', async ({ employeePage }) => {
    await employeePage.addEmployee('John');
});

The test shouldn't contain:
- Login
- Create BrowserContext
- Load authentication
- Create EmployeePage

All of that is framework infrastructure.

Our architecture becomes:
	Authentication
		↓
	storageState
		↓
	Fixture
		↓
	EmployeePage
		↓
	 Test

2. The Practical Pattern
We first create authentication state.

await page.context().storageState({
    path: 'playwright/.auth/user.json'
});

Then configure Playwright:
use: {
    storageState: 'playwright/.auth/user.json'
}

Now every test using that project starts with the saved authentication state.

Then our custom fixture creates the Page Object:
employeePage: async ({ page }, use) => {
    const employeePage = new EmployeePage(page);
    await use(employeePage);
}

So:
	Test
	 ↓
	employeePage fixture
	 ↓
	EmployeePage
	 ↓
	Authenticated page
	
3. Why This Is Powerful
Without this architecture:
test('Create employee', async ({ page }) => {
    await login(page);
    const employeePage = new EmployeePage(page);
    await employeePage.addEmployee('John');
});

With the framework:
test('Create employee', async ({ employeePage }) => {
    await employeePage.addEmployee('John');
});

The second version is much cleaner.
The test expresses only the business scenario.

🎯 Interview Focus
Question 1:
How would you design authentication for hundreds of Playwright tests?
Ideal Answer:
I would authenticate through a dedicated setup process and persist the authentication state using storageState. Tests can then reuse that state instead of repeatedly executing 
the login workflow. I'd combine this with fixtures for Page Object creation and use separate authentication states or projects when multiple user roles are required.

Question 2 ⭐⭐⭐⭐⭐
How would you test a workflow involving two users, such as Employee submitting a request and Manager approving it?
Ideal Answer:
I'd use separate BrowserContexts with independent authentication states for the Employee and Manager. This ensures each user has an isolated session. The Employee context 
performs the submission, and the Manager context verifies or approves it.

📌 Notes Summary
=> Combine storageState + fixtures + Page Objects to keep authentication and framework setup out of tests.
=> Use separate authentication states/contexts for different user roles.
=> Keep authentication state isolated and never commit sensitive state files to source control.

🌐 API Clients in the Framework ⭐⭐⭐⭐⭐
We've already learned API Testing with Playwright. Now we'll look at the framework-level question:
Where should reusable API operations live?
This is important because we don't want API calls scattered throughout 500 tests.

===> Notes creation pending

🧪 Data-Driven Testing in Playwright ⭐⭐⭐⭐⭐
==> A simple TypeScript data-driven approach:

import { test, expect } from '@playwright/test';

const loginData = [
    {
        username: 'admin',
        password: 'admin123'
    },
    {
        username: 'manager',
        password: 'manager123'
    },
    {
        username: 'employee',
        password: 'employee123'
    }
];

for (const data of loginData) {

    test(`Login with ${data.username}`, async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Username').fill(data.username);
        await page.getByLabel('Password').fill(data.password);

        await page.getByRole('button', {name: 'Login'}).click();

        await expect(page.getByRole('heading', {name: 'Dashboard'})).toBeVisible();
    });
}

The important idea is:
for (const data of loginData)

The same test logic executes against different datasets.

==> Better Enterprise Approach:
As the framework grows, don't necessarily keep large datasets directly inside the test file.

For example:
test-data/
│
├── loginData.json
├── employeeData.json
└── orderData.json

Then:
import loginData from '../test-data/loginData.json';

Your test remains focused on the workflow.

Real-World Scenario;
Employee registration might have:
John     Engineering
Sarah    Finance
Mike     HR
David    Marketing

Instead of:
Test 1 → Create John
Test 2 → Create Sarah
Test 3 → Create Mike
Test 4 → Create David

we can have:
for (const employee of employees) {
    test(`Create ${employee.name}`, async (...) => {
        // same workflow
    });
}
This is particularly useful when the workflow is identical but input varies.

==> Important Design Decision ⭐⭐⭐⭐⭐
Data-driven testing does not mean:
"Put everything into JSON."

Use the simplest appropriate source.
For example:
Small static dataset
        ↓
TypeScript array

Reusable test data
        ↓
    JSON

Large structured business data
        ↓
CSV / Excel / database / API

We'll deal with external data sources separately when we design the framework.

==> Data-driven testing works best when:
The test flow remains essentially the same and only the input varies.

🎯 Interview Focus
Question 1:
When would you use data-driven testing?
Ideal Answer:
I use data-driven testing when the test workflow remains the same but the input data varies. It reduces duplication and allows the same business behavior to be validated against 
multiple datasets.

Question 2 ⭐⭐⭐⭐⭐
Would you convert every similar-looking test into a data-driven test?
Ideal Answer:
No. I would use data-driven testing only when the underlying business workflow and expected behavior are substantially the same. If scenarios have different business rules or 
validation logic, separate tests provide better readability and maintainability.

📌 Notes Summary
=> Data-driven testing separates test logic from test data.
=> Use it when the workflow is the same but inputs vary.
=> Don't force fundamentally different business scenarios into one data-driven test.

🧠 Your Challenge
Consider these scenarios:
1. Login with 5 valid users (I will use data driven testing Because underlying business workflow and expected behavior are substantially the same)
2. Login with invalid password (separate test case, bc separate tests provide better readability and maintainability)
3. Locked account  (separate test case, bc separate tests provide better readability and maintainability)
4. Expired password  (separate test case, bc separate tests provide better readability and maintainability)

Which of these would you make data-driven, and which would you keep as separate tests?
And explain why.

📌 Final Tip
Data-driven testing is a tool for reducing duplication—not a goal in itself.

🗃️ Test Data Management & Isolation ⭐⭐⭐⭐⭐
🎯 Interview Focus
Question 1:
How would you design test data for a large parallel Playwright suite?
Ideal Answer:
I would avoid shared mutable test data and generate unique data where necessary. I'd use data factories for consistent test-data creation, API-based setup where appropriate, and cleanup mechanisms to prevent test data from leaking between tests.

Question 2 ⭐⭐⭐⭐⭐
Why would you prefer API-based test-data setup instead of creating data through the UI?
Ideal Answer:
API setup is generally faster and allows the test to focus on the UI behavior actually being validated. I would use the UI only when the data-creation workflow itself is what I'm testing.

📌 Notes Summary:
=> Tests should own their data and avoid depending on other tests.
=> Use factories + unique data for scalable parallel execution.
=> Prefer API setup when UI creation isn't the behavior under test.
=> Clean up test data to prevent environment pollution.

⚡ Parallel Execution & Test Isolation ⭐⭐⭐⭐⭐

So worker count should consider:
- CI resources
- application capacity
- database capacity
- API rate limits
- test-data isolation

🎯 Interview Focus
Question 1:
What is the biggest challenge when running Playwright tests in parallel?
Ideal Answer:
Test isolation. Tests must not share mutable state, test data, or execution dependencies. Each test should have an independent browser context and preferably its own test data 
so that parallel execution doesn't introduce race conditions or order-dependent failures.

Question 2 ⭐⭐⭐⭐⭐
Your tests pass when run sequentially but fail randomly when run with 8 workers. What would you investigate first?
Ideal Answer:
I'd first investigate shared state and test-data collisions. I'd check whether tests share backend records, users, files, environment state, or other mutable resources. I'd also look 
for execution-order dependencies before assuming Playwright's parallel execution is the problem.

📌 Notes Summary
- Parallel execution improves performance but requires strong test isolation.
- BrowserContext isolation protects browser state, but backend test data must also be isolated.
- Don't blindly increase worker count; balance parallelism against environment capacity.

🔄 Retries, Flaky Tests & Failure Classification ⭐⭐⭐⭐⭐
This is a Senior SDET-level topic because knowing how to use retries is easy; knowing when not to use them is what matters.

Common Sources of Flakiness
- Application timing
- API response slow
- UI rendering delayed
- Animation still running

Correct Use of Retries
Retries are useful as a diagnostic and resilience mechanism, not as a substitute for fixing flaky tests.

🎯 Interview Focus
Question 1
Would you use retries to fix flaky tests?
Ideal Answer:
No. Retries can provide resilience and diagnostic information, especially in CI, but they shouldn't replace fixing the underlying cause of flakiness. I'd investigate synchronization, 
locators, test-data isolation, shared state, and external dependencies first.

Question 2 ⭐⭐⭐⭐⭐
A test fails on the first attempt and passes on retry. What does that tell you?
Ideal Answer:
It indicates that the failure may be intermittent and the test should be investigated for flakiness. I wouldn't treat the retry as proof that the test is healthy. I'd examine the first 
failure and determine whether the root cause is timing, data, state, infrastructure, or an application issue.

📌 Notes Summary:
- Retry ≠ flakiness fix.
- Use limited retries, particularly in CI, as a resilience/diagnostic mechanism.
- A fail → pass retry result should trigger investigation, not complacency.
- Never use waitForTimeout() or excessive retries as a substitute for proper synchronization and isolation.

📊 Test Reporting, Traces & Debugging Failures ⭐⭐⭐⭐⭐

1. Trace Viewer ⭐⭐⭐⭐⭐
The most important one to know is Trace Viewer.

A trace can capture information about the test execution, including:
- Actions
- Screenshots
- DOM snapshots
- Network activity
- Console information
- Timing

Screenshot vs Trace

A screenshot tells you:
What did the page look like at that moment?

A trace can tell you much more:
What happened during the execution leading up to the failure?

Screenshot:
Employee page
"Save" button visible

Trace:
Entered employee name
↓
Selected department
↓
Clicked Save
↓
POST /employees
↓
500 response
↓
Error message appeared
↓
Assertion failed

The trace provides execution context, not just a picture.

Failure Classification:
This is a very important Senior SDET skill.
When a test fails, don't automatically assume: "Automation bug."

Classify the failure.

Failure
  │
  ├── Test/automation issue
  │
  ├── Application defect
  │
  ├── Environment/infrastructure issue
  │
  └── Test-data issue

For example:
Locator timeout

could be:
Bad locator
OR
Application didn't render element
OR
Backend failed
OR
Environment was slow

Evidence helps us distinguish these.

==> Enterprise Thinking:
A mature CI pipeline should make failures diagnosable.

Think:
Test Execution
      ↓
Failure
      ↓
Artifacts
      ├── Trace
      ├── Screenshot
      └── Video (when justified)
      ↓
CI Report
      ↓
Engineer investigates

The goal isn't simply: "Tests should tell us that something failed."

The goal is: "Tests should give engineers enough evidence to determine why it failed."

🎯 Interview Focus
Question 1:
What would you use to investigate a Playwright test that passes locally but fails in CI?
Ideal Answer:
I'd first inspect the Playwright trace and other available artifacts such as screenshots, network activity, and console information. I'd then determine whether the failure is 
caused by the test, application, environment, or test data rather than immediately modifying the test.

Question 2 ⭐⭐⭐⭐⭐
Why might you configure trace: 'on-first-retry' instead of tracing every test?
Ideal Answer:
Tracing every test can generate unnecessary overhead and artifacts. on-first-retry provides detailed diagnostic information when a test fails while keeping normal execution lighter.

📌 Notes Summary
- Trace Viewer is one of the most valuable Playwright debugging tools.
- Use traces and other artifacts to understand why a test failed.
- Don't automatically classify every failure as an automation defect.
- trace: 'on-first-retry' is a practical CI configuration.

🧠 Your Challenge
A test fails in CI:
❌ Click "Save Employee"
Timeout waiting for button

You open the trace and discover:
POST /employees
→ 500 Internal Server Error

Application shows: "Unable to load employee data"

Would you classify this primarily as:
A. Locator problem
B. Playwright synchronization problem
C. Application/backend problem
And why?
Ans:
Exactly — C is the stronger answer, and yes, the question is intentionally tricky.
A 500 Internal Server Error generally means the server received the request but encountered an unexpected condition while processing it. The server may be completely 
reachable and responding normally.

🧱 Environment Configuration & playwright.config.ts ⭐⭐⭐⭐⭐
This connects directly with your earlier preference to split configuration into multiple modules based on requirements.
The key goal here is to understand what belongs in configuration and how to keep it maintainable across environments.

Your Preferred Modular Configuration

You previously mentioned: "I would prefer to split the configuration into multiple modules based on the requirement."

That's a good enterprise direction.

For example:
config/
│
├── environments.ts
├── browser.config.ts
├── reporter.config.ts
└── project.config.ts


playwright.config.ts
Then the main config becomes the composition point:

import { defineConfig } from '@playwright/test';
import { environments } from './config/environments';

export default defineConfig({
    use: {
        baseURL: environments.qa.baseURL
    }
});

The important principle: Split configuration when it improves maintainability—not merely to create more files.

What Should NOT Go Into Config?
Don't put business logic into playwright.config.ts.
❌ Bad
if (process.env.ENV === 'qa') {
    // login
    // create employee
    // navigate
}
Configuration should configure how tests execute, not what the tests test.

==> Secrets ⭐⭐⭐⭐⭐

Avoid:
username: 'admin',
password: 'Admin@123'

inside: playwright.config.ts

or committed test files.

Instead use:
- Environment variables
- Secret management system
- CI/CD secret store

For example:
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

The exact secret-management mechanism depends on your CI/CD platform.

🎯 Interview Focus
Question 1
How would you make the same Playwright suite run against QA and Staging?
Ideal Answer:
I would externalize environment-specific configuration such as baseURL and credentials, typically through environment variables or CI configuration. The tests should remain 
environment-independent, while the configuration determines which environment they execute against.

Question 2 ⭐⭐⭐⭐⭐
Why shouldn't environment-specific logic be scattered throughout test cases?
Ideal Answer:
It creates duplication and makes tests harder to maintain. I prefer keeping environment-specific configuration centralized so the same test logic can execute against different 
environments without modification.

📌 Notes Summary:
- Use baseURL instead of hardcoding URLs throughout tests.
- Externalize environment-specific values.
- Keep secrets outside source code.
- Configuration should control execution, not contain business logic.
- Modular configuration is good when it improves maintainability.

🧠 Your Challenge
You have:
QA:
https://qa.example.com

Staging:
https://staging.example.com

And the requirement is:
Run the exact same test suite against either environment without changing test code.

How would you design the configuration?
Would you use:
A. Separate test folders for QA and Staging
B. Environment variables + centralized configuration
C. Hardcoded URLs with if/else inside every test

And why?
My Ans:
A. Separate test folders for QA and Staging
not a good approach

B. Environment variables + centralized configuration
Best approach, I will go with this.

C. Hardcoded URLs with if/else inside every test
Worst idea, to implement this approach.

Exactly. B is the clear choice. ✅

Your reasoning is correct:
A — Separate test folders: duplicates test logic and creates maintenance overhead.
B — Environment variables + centralized configuration: same tests, different execution environment.
C — Hardcoded URLs + if/else: tightly couples tests to environments and creates unnecessary clutter.

🎯 Interview Focus
Question 1
What is a Playwright Project?
Ideal Answer:
A Playwright Project is a named execution configuration that allows the same test suite to run under different conditions, such as browsers, authentication states, devices, or 
other configuration settings.

Question 2 ⭐⭐⭐⭐⭐
When would you use a project instead of an environment variable?
Ideal Answer:
I would use environment configuration for values such as the target environment or base URL. I'd use projects when I need distinct execution configurations—for example 
different browsers, authentication states, or device configurations. The choice should be based on whether the difference affects how the tests are executed.

Question 3
Would you create a separate project for every user role?
Ideal Answer:
Not automatically. I'd use separate projects when the authentication or execution context genuinely needs to be configured differently. Otherwise, I'd prefer fixtures or 
another abstraction to avoid unnecessary project complexity.

📌 Notes Summary
Environment Variables
→ Where to execute

Projects
→ Under what execution configuration

Fixtures
→ What dependencies the test receives

Page Objects
→ How the application is interacted with

Tests
→ What business behavior is validated

🎯 Interview Focus
Question 1
When would you use beforeEach() instead of a fixture?
A strong answer:
I use beforeEach() for common setup that every test in a group requires. I use fixtures when I need a reusable test dependency such as a Page Object, API client, authentication state, or 
test resource. Fixtures provide a cleaner dependency-injection model, while hooks are better suited to simple common setup or cleanup.

Question 2 ⭐⭐⭐⭐⭐
What's the danger of putting too much logic into beforeEach()?
It makes tests harder to understand because important setup becomes hidden, increases execution time by performing unnecessary work for every test, and can introduce unwanted 
dependencies or make failures harder to diagnose.

Question 3:
Should tests depend on the order in which they execute?
No. Tests should be independent and should not rely on another test having executed first.

📌 Final Mental Model
Remember this:
test.describe()
        ↓
Organize related tests

beforeEach()
        ↓
Common setup every test needs

afterEach()
        ↓
Common cleanup every test needs

fixture
        ↓
Reusable test dependency

test()
        ↓
Business behavior being validated

And the most important principle:
Keep setup as close to the test as necessary, but no closer than needed.

🧠 Your Challenge
Consider these four operations:
1. Navigate to /employees
2. Create an EmployeePage instance
3. Create a test employee through API
4. Delete the test employee after the test

Which would you put in:
- beforeEach()
- afterEach()
- fixture
- directly inside the test
And why?

==> Assertion Methods await expect(locator).toHaveText(): 
Validate DOM state, returning undefined on success or throwing an exception on failure.
=====================================================================================================================================================
A Promise in JavaScript and TypeScript is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.

Instead of immediately returning the final data (like a synchronous function does), an async function or asynchronous operation returns a Promise—a placeholder that promises to 
hand you the data (or an error) once the background task finishes.

The Three States of a Promise:
A promise is always in one of three mutually exclusive states:

Pending: The initial state; the asynchronous operation is still running, and the result is unknown.
Fulfilled (Resolved): The operation completed successfully, and the promise now has a resulting value.
Rejected: The operation failed, and the promise has a reason (an error) why it failed.

Once a promise is either fulfilled or rejected, it is considered settled, and its state can never change again.
=====================================================================================================================================================


