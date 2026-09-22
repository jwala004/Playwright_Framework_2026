import { defineConfig, devices } from '@playwright/test';
import { config } from './config/env.config';

export default defineConfig({
    // Point to the TypeScript global setup file
    globalSetup: require.resolve('./global-setup'),
    testDir: './tests',
    //   /* Run tests in files in parallel */
    fullyParallel: true,

    use: {
        baseURL: config.baseUrl,
        viewport: {
            width: 1920,
            height: 1080,
        },
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        // Force headless mode in CI environments
        headless: process.env.CI ? true : false,
    },

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    // Use 2 workers in CI (matches 2 vCPUs), fallback to environment variable or 3 locally
    workers: process.env.CI ? 2 : Number(process.env.WORKERS ?? 3),
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html', { open: 'never' }],
        // ['allure-playwright']
    ],
    // reporter: 'html',

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // headless: true, // not needed, as headless is already set in the global use options
            }
        },

        {
            name: 'edge',
            use: {
                ...devices['Desktop Edge'],
                 channel: 'msedge',
                //  headless: true, // not needed, as headless is already set in the global use options
                //  slowMo: 500
            }
        },

        // {
        //     name: 'Microsoft Edge',
        //     use: {
        //         ...devices['Desktop Edge'],
        //          headless: false, // not needed, as headless is already set in the global use options
        //          channel: 'msedge',
        //          slowMo: 500
        //     }
        // }, // command: npm run test:dev:headed -- --project="Microsoft Edge"

        // 
        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox']
        //     }
        // },
        // 
        // {
        //     name: 'webkit',
        //     use: {
        //         ...devices['Desktop Safari']
        //     }
        // }
    ]
});

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// export default defineConfig({
//   testDir: './tests',
//   /* Run tests in files in parallel */
//   fullyParallel: true,
//   /* Fail the build on CI if you accidentally left test.only in the source code. */
//   forbidOnly: !!process.env.CI,
//   /* Retry on CI only */
//   retries: process.env.CI ? 2 : 0,
//   /* Opt out of parallel tests on CI. */
//   workers: process.env.CI ? 1 : undefined,
//   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//   reporter: 'html',
//   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//   use: {
//     /* Base URL to use in actions like `await page.goto('')`. */
//     // baseURL: 'http://localhost:3000',

//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     trace: 'on-first-retry',
//   },

//   /* Configure projects for major browsers */
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },

//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },

//     /* Test against mobile viewports. */
//     // {
//     //   name: 'Mobile Chrome',
//     //   use: { ...devices['Pixel 5'] },
//     // },
//     // {
//     //   name: 'Mobile Safari',
//     //   use: { ...devices['iPhone 12'] },
//     // },

//     /* Test against branded browsers. */
//     // {
//     //   name: 'Microsoft Edge',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
//     // },
//     // {
//     //   name: 'Google Chrome',
//     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//     // },
//   ],

//   /* Run your local dev server before starting the tests */
//   // webServer: {
//   //   command: 'npm run start',
//   //   url: 'http://localhost:3000',
//   //   reuseExistingServer: !process.env.CI,
//   // },
// });
