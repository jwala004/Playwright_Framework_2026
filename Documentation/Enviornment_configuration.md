Installations done to set cross-env configurations;

==> install dotenv and cross-env
If you haven't already:

npm install dotenv
npm install -D cross-env

- dotenv (Runtime Dependency): Reads environment variables from a local .env file and injects them into process.env so your application can securely access configuration keys, database URLs, and secrets.

- cross-env (Dev Dependency): Provides a single command to set environment variables (e.g., NODE_ENV=production) uniformly across different operating systems—solving the syntax differences between Windows (SET) and Linux/macOS (export).


Environment selection and Playwright Project selection are two different dimensions.

npm run test:dev
        │
        ↓
TEST_ENV=dev
        │
        ↓
    .env.dev
        │
        ↓
https://learninglab.cloud
        │
        ↓
┌───────┼────────┐
↓       ↓        ↓
Chrome Firefox  WebKit

This is our first real combination of environment + Playwright Projects.

The architecture we've reached;
                         TEST
                           │
                           │
                 ┌─────────┴──────────────────┐
                 │                            │
            ENVIRONMENT                     PROJECT
                 │                            │
                 ↓                            ↓
            TEST_ENV                     --project
                 │                            │
        ┌────────┼────────┐             ┌─────┼──────┐
        ↓        ↓        ↓             ↓     ↓      ↓
       dev      uat      prod        Chrome Firefox WebKit
        │        │        │
        ↓        ↓        ↓
    .env.dev  .env.uat .env.prod
        │        │        │
        └────────┼────────┘
                 ↓
          Environment Config
                 │
                 ↓
             Playwright
                 │
                 ↓
               TEST

This is a much better mental model than thinking of .env.dev and .env.uat as Playwright Projects.            

We currently have a working configuration system. Now we're going to make it type-safe, fail-fast, and difficult to misuse.

The goal is:

TEST_ENV
   │
   ▼
Validate environment
   │
   ├── dev  ✓
   ├── uat  ✓
   ├── prod ✓
   └── anything else ✗
   │
   ▼
Load exact .env file
   │
   ▼
Validate required variables
   │
   ▼
Expose typed immutable config
   │
   ▼
Playwright


24th Aug:
Yes — understood. You want a text/ASCII architecture diagram, suitable for keeping as framework documentation.
Based on what we've built so far, I would represent the architecture like this:

                         PLAYWRIGHT TEST EXECUTION
                                   │
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
              ENVIRONMENT                      PROJECT
                    │                             │
                TEST_ENV                      --project
                    │                             │
          ┌─────────┼─────────┐          ┌────────┼────────┐
          ↓         ↓         ↓          ↓        ↓        ↓
         dev       uat       prod     chromium   edge    firefox
          │         │         │                   │
          ↓         ↓         ↓                   │
     .env.dev   .env.uat   .env.prod              │
          │         │         │                   │
          └─────────┼─────────┘                   │
                    ↓                             │
          ┌─────────────────────┐                 │
          │  Environment Config │                 │
          │   env.config.ts     │                 │
          └──────────┬──────────┘                 │
                     │                            │
                     │                            │
              ┌──────┴───────┐                    │
              │              │                    │
              ↓              ↓                    │
        Validate ENV     Validate Variables       │
        dev/uat/prod     BASE_URL                 │
              |          APP_USERNAME             │
              |          APP_PASSWORD             │
              │               │                   │
              └───────┬───────┘                   │
                      ↓                           │
              Typed Environment                   │
                   Config                         │
                      │                           │
                      └────────────┬──────────────┘
                                   ↓
                         playwright.config.ts
                                   │
                     ┌─────────────┼─────────────┐
                     │             │             │
                     ↓             ↓             ↓
                  baseURL       Projects       Global
                     |          Configuration   Settings
                     │             │             │
                     └─────────────┼─────────────┘
                                   ↓
                         PLAYWRIGHT EXECUTION
                                   │
                                   ↓
                                  TEST
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
                  ↓                ↓                ↓
             Environment       Browser          Execution
               agnostic        agnostic         agnostic
                  │                │                │
                  └────────────────┼────────────────┘
                                   ↓
                          Same Test Code

==> Environment and Project are independent dimensions.   

So a command like: npm run test:uat -- --project=edge
can be visualized as:
npm run test:uat
       │
       ↓
TEST_ENV=uat
       │
       ↓
   .env.uat
       │
       ↓
Environment Config
       │
       ├── BASE_URL
       ├── APP_USERNAME
       └── APP_PASSWORD
       │
       ↓
Playwright Config
       │
       ↓
--project=edge
       │
       ↓
 Microsoft Edge
       │
       ↓
     TEST

<!-- Future Enhancement roadmap: -->
Then: Playwright configuration architecture

After that, I'd tackle:

playwright.config.ts

We want it to become something like:

playwright.config.ts
        │
        ├── global test settings
        │
        ├── environment configuration
        │
        ├── browser projects
        │
        ├── reporters
        │
        ├── retries
        │
        ├── workers
        │
        └── execution settings

And keep the file readable rather than turning it into a 500-line configuration monster.

Then comes the really important Playwright topic
Fixtures

This is where I'd take your framework to the next level.

Instead of:

test('Login', async ({ page }) => {

eventually we'll have custom fixtures such as:

test('Login', async ({ page, testUser }) => {

or:

test('Dashboard', async ({ authenticatedPage }) => {

Fixtures are where Playwright starts becoming much more powerful than a simple Selenium-style framework.

Then Page Object Model

We'll build:

pages/
│
├── LoginPage.ts
├── HomePage.ts
├── DashboardPage.ts
└── ...

But I don't want to blindly create one class per page.

We'll discuss:

what belongs in a Page Object
what doesn't
component objects
avoiding giant Page Objects
keeping tests readable
Then Authentication

You've already learned storageState, so we won't repeat the basics.

We'll build something like:

Authentication
       │
       ↓
setup project
       │
       ↓
storageState
       │
       ↓
authenticated tests

This is where Project Dependencies become extremely interesting.

For example:

setup
  │
  ├── login
  ├── create storage state
  │
  ↓
chromium
firefox
edge
webkit

That avoids logging in repeatedly for every test.

Then Test Organization

You specifically wanted this topic earlier, so we'll cover:

test.describe()
test.beforeEach()
test.afterEach()

but with an emphasis on:

Hooks without overusing them

We'll design a structure that stays maintainable when you have hundreds of tests.

Then CI/CD

Finally:

Developer
    ↓
npm run test:dev
    ↓
Playwright
    ↓
Git
    ↓
Jenkins / GitHub Actions
    ↓
UAT
    ↓
Reports

We'll deal with:

environment variables in CI
secrets
parallel execution
retries
workers
artifacts
HTML reports
traces
screenshots
videos
failure handling
My recommended roadmap from here

I'd follow this sequence:

              CURRENT POSITION
                     │
                     ▼
        ┌─────────────────────────┐
        │ Environment Architecture│ ✓
        │ Playwright Projects     │ ✓
        └────────────┬────────────┘
                     │
                     ▼
          1. Configuration
             Hardening
                     │
                     ▼
          2. Playwright Fixtures
                     │
                     ▼
          3. Page Object Model
                     │
                     ▼
          4. Project Dependencies
             + Authentication
                     │
                     ▼
          5. Advanced Test
             Organization
                     │
                     ▼
          6. Test Data Management
                     │
                     ▼
          7. API + UI Integration
                     │
                     ▼
          8. Reporting & Debugging
                     │
                     ▼
          9. CI/CD Architecture
                     │
                     ▼
          10. Complete Framework

# how communication is happening between env.config.ts and playwright.config.ts.

The communication between env.config.ts and playwright.config.ts is a one-way synchronous dependency driven by Node.js's module loading system.

playwright.config.ts acts as the consumer, while env.config.ts acts as a self-executing configuration loader and validator.

Step-by-Step Execution Flow
When you run a command like TEST_ENV=qa npx playwright test, the following sequence occurs before a single browser opens:

Entry Point (playwright.config.ts):
Playwright starts by loading playwright.config.ts. At line 2, it hits:

TypeScript
import { config } from './config/env.config';
Node.js pauses evaluating playwright.config.ts and immediately executes env.config.ts from top to bottom.

Environment Resolution (env.config.ts):getEnvironment() runs immediately. It checks process.env.TEST_ENV (falling back to 'uat' if undefined) and validates it against ['qa', 'uat', 'prod', 'dev']. If invalid, it crashes the test run early with a clear error.

Variable Injection (env.config.ts):
It resolves the path env-files/.env.<environment>:

Locally: If the file exists, dotenv.config() reads the key-value pairs and injects them directly into Node's global process.env object.

In CI (GitHub Actions): The file doesn't exist, so it logs a message and skips dotenv, assuming BASE_URL, APP_USERNAME, and APP_PASSWORD are already injected into process.env by the CI runner.

Validation & Export (env.config.ts):
It constructs and exports the config object. While building it, getRequiredEnvVariable() checks process.env for BASE_URL, APP_USERNAME, and APP_PASSWORD. If any are missing, it throws a fail-fast error before tests can start.

Consumption (playwright.config.ts):
Control returns to playwright.config.ts, which now has access to the validated config object. Currently, it directly consumes config.baseUrl inside the use block:

TypeScript
use: {
    baseURL: config.baseUrl,
    // ...
}
How Other Files Participate (The Bigger Picture)
Notice that env.config.ts also exports username, password, and environment, even though playwright.config.ts only uses baseUrl.

global-setup.ts & Test Files: Because env.config.ts is a standard TypeScript module, your ./global-setup file (referenced on line 8 of playwright.config.ts) and your individual .spec.ts files can also do import { config } from '../config/env.config' to get config.username and config.password for logging in.

Module Caching: Node.js caches modules after the first import. When playwright.config.ts imports env.config.ts, the .env parsing and validation happen once. When global-setup.ts or test workers import it later, they receive the already-built config object from memory without re-reading disk files.

Two Subtle Gotchas to Watch Out For
Worker Process Environment Variables:
Playwright spawns separate worker processes to run tests in parallel (workers: 3). Because dotenv.config() mutated process.env in the main configuration process before workers were spawned, child workers automatically inherit those process.env variables. However, importing config directly in your tests (rather than reading process.env) is safer because you get TypeScript autocompletion and readonly protection.

Pre-existing Shell Variables:
By default, dotenv.config() does not overwrite environment variables that are already set in your terminal session. If you have BASE_URL exported globally in your OS/terminal, dotenv will leave it alone rather than overwriting it with what's inside .env.qa.