# Playwright + TypeScript: Reading Test Data from CSV
CSV is a natural next step after Excel. The objective is the same: separate test data from test logic and execute data-driven Playwright tests.
Unlike Excel, CSV is a plain-text format, so you don't need a workbook or worksheet name.

1. Create a CSV test-data file
Create test-data/login-data.csv:
username,password
newuser27thsept@gmail.com,123456
newuser24thsept@gmail.com,123456

The first row contains the column headers. Each subsequent row represents a test scenario.

2. Install a CSV parser
For a maintainable framework, use a dedicated CSV parser rather than manually splitting each line on commas.
npm install csv-parse


Why? CSV values can contain commas, quotes, and line breaks. A proper parser handles these cases according to CSV rules.

3. Create a reusable CSV reader
Create utils/csv-reader.ts:

import { parse } from 'csv-parse/sync';
import * as fs from 'node:fs';

export function readCsvData<T>(fileName_with_filePath: string): T[] {
    if (!fs.existsSync(fileName_with_filePath)) {
        throw new Error(`CSV file not found: ${fileName_with_filePath}`);
    }

    const csvContent = fs.readFileSync(fileName_with_filePath, 'utf-8');
    const data = parse(csvContent, {columns: true, skip_empty_lines: true, trim: true, bom: true}) as T[];

    if (data.length === 0) {
        throw new Error(`No test data found in ${fileName_with_filePath}`);
    }
    return data;
}

# Important configuration options
Option	                    Purpose
columns: true	            Uses the first row as object property names
skip_empty_lines: true	    Ignores empty lines
trim: true	                Removes surrounding whitespace from field values
bom: true	                Handles a UTF-8 byte-order mark in the file
parse()	                    Converts CSV text into JavaScript data

For example, the CSV becomes:
[
    {
        username: 'validUser',
        password: 'Pass@123',
        expectedMessage: 'Login successful',
        enabled: 'true'
    },
    {
        username: 'invalidUser',
        password: 'Wrong@123',
        expectedMessage: 'Invalid credentials',
        enabled: 'true'
    }
]

Important: CSV has no native number, boolean, or date types. Parsed fields are strings. The generic T helps TypeScript describe the expected shape, but the type assertion does not validate the actual CSV content.

4. Use CSV data in a Playwright test
Create tests/login-csv.spec.ts:

interface LoginTestData {
    username: string;
    password: string;
}

const logindata = readCsvData<LoginTestData>('test-data/login-data.csv');

for (const userslogindata of logindata) {

test(`Validate login from Excel ${userslogindata.username}`, async ({page, loginPage, landingPage}) => {
    await page.goto('/')

    // open login pop-up
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    console.log(logindata);

    // login into the application
    await loginPage.login(userslogindata.username, String(userslogindata.password))
    console.log(`Logging in with user: ${userslogindata.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
});

}

Run it:
npx playwright test tests/login-csv.spec.ts

The reader loads the CSV before Playwright registers the individual tests. Each row becomes a separate test.

5. CSV vs. Excel: engineering trade-offs
Feature	                CSV	                        Excel (.xlsx)
Library	                csv-parse	                xlsx
Multiple worksheets	    No	                        Yes
Data types	            Text-based	                Supports typed/formatted cells
Leading zeros	        Preserved as text	        Can be lost if stored numerically
Version control	        Easy to diff	            Less convenient
Best use case	        Simple tabular test data	Business-managed workbooks

6. Best practices
- Validate headers and required fields before generating tests. The generic type alone does not enforce the CSV schema.
- Keep passwords and identifiers as strings. CSV naturally preserves values such as 001234 when they are written that way.
- Use a real CSV parser. Avoid line.split(','), which fails when a field contains quoted commas.
- For large data sets, consider filtering or selecting scenarios rather than generating thousands of browser tests.
- Avoid putting real credentials in committed CSV files; use environment variables or a secrets manager.

7. Quick interview questions
Q1. Why use csv-parse instead of split(',')?
Because CSV supports quoted fields containing commas, escaped quotes, and other formatting rules that simple splitting cannot handle correctly.

Q2. Does TypeScript validate CSV data against an interface?
No. An interface provides compile-time typing. Runtime validation is required to detect missing columns, invalid values, or malformed rows.

Q3. When would you choose CSV over Excel?
Choose CSV for simple, flat datasets that are easy to diff, review, and maintain in version control. Choose Excel when multiple worksheets, spreadsheet formatting, or business-user workflows justify the additional complexity.


