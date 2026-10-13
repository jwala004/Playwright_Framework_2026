# Playwright + TypeScript: Reading Test Data from JSON

# JSON reader utility
import { readFileSync } from 'node:fs';
import * as fs from 'node:fs';

export function readJson<T>(fileName_with_filePath: string): T {
    // Read the Json file
    try {
        const content = readFileSync(fileName_with_filePath, 'utf-8');
        return JSON.parse(content) as T;
    } catch (error) {
        throw new Error(
            `Failed to read JSON file "${fileName_with_filePath}": ${
                error instanceof Error ? error.message : String(error)
            }`
        );
    }
}

In the test-class;
interface User {
    username: string;
    password: string;
}

const users = readJson<User[]>('test-data/login-data.json');

for (const user of users) {

    test(`Parametrised Login Test => Reading test data from json file ${user.username}`, async ({ page, landingPage, loginPage }) => {
    
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    // login into the application
    await loginPage.login(user.username, String(user.password))
    console.log(`Logging in with user: ${user.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
  
    });
}

This handles file reading and JSON parsing in one reusable function, without introducing an external dependency.

# Here:
- readFileSync() reads the file as a string.
- JSON.parse() converts the string into an array of JavaScript objects.
- for...of iterates over that array.

