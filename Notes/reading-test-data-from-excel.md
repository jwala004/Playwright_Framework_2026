![Read Excel File FLow.](<read_excel_file.png>)

### Excel-Based Test Data in Playwright + TypeScript
# 1. Core concept
Excel-based test data management separates test inputs from automation logic. A QA engineer can update test scenarios in an .xlsx workbook without modifying the Playwright test code.

Typical workflow:
Excel workbook → SheetJS (xlsx) → TypeScript data objects → Playwright tests → Assertions and reports.
When to use it: Business-managed test data, large data sets, data-driven testing, and scenarios where non-developers need to maintain test inputs.

Trade-off: Excel is convenient for editing, but introduces file dependencies, schema-validation requirements, and possible data-formatting issues. JSON or TypeScript objects are often simpler for small, automation-owned data sets.

# 2. Setup and project structure
Install SheetJS:
npm install xlsx

Suggested structure:
project/
├── test-data/
│   └── login-data.xlsx
├── utils/
│   └── excel-reader.ts
├── tests/
│   └── login.spec.ts
├── playwright.config.ts
└── package.json


The xlsx package is also known as SheetJS Community Edition. Use the package documentation when selecting versions and reviewing security or maintenance requirements.

# 3. Sample Excel workbook
Create test-data/login-data.xlsx with a worksheet named LoginData.
username	    password	expectedMessage	        enabled
validUser	    Pass@123	Login successful	    true
invalidUser	    Wrong@123	Invalid credentials	    true
lockedUser	    Lock@123	Account locked	        false
Use these as sample values; adapt them to your application.

# 4. Build a reusable Excel reader
File: utils/excel-reader.ts

import XLSX from 'xlsx';

export function readExcelData<T>(fileName_with_filePath: string, sheetName?: string): T[] {
    // Read the Excel workbook
    const workbook = XLSX.readFile(fileName_with_filePath);

    // Get the required worksheet
    const worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];

    if (!worksheet) {
        throw new Error(
            `Worksheet "${sheetName}" not found in ${fileName_with_filePath}`
        );
    }

    // Convert worksheet rows into objects
    const data = XLSX.utils.sheet_to_json<T>(worksheet);
    
    if (data.length === 0) {
        throw new Error(`No test data found in "${sheetName}"`);
    }
    return data;
}

How the conversion works
const workbook = XLSX.readFile(filePath);

Loads the workbook into memory. workbook.SheetNames contains its worksheet names.
const worksheet = workbook.Sheets[sheetName];

Selects a worksheet by its exact name.
const data = XLSX.utils.sheet_to_json(worksheet, {defval: '', raw: false});

# Converts rows into an array of objects, using the first row as column headers by default. 
- defval: '' — supplies an empty string for otherwise missing cell values.
- raw: false — prefers formatted values where applicable; it does not guarantee that every value is a string.
- T — provides a TypeScript type hint, not runtime validation. 
  
For the sample workbook, the returned data resembles:
[
    {
        username: 'validUser',
        password: 'Pass@123',
        expectedMessage: 'Login successful',
        enabled: true
    },
    // Additional rows...
]

The actual runtime types depend on the cells and how SheetJS interprets them.

# 5. Implement a data-driven Playwright test
File: tests/login.spec.ts

import { test, expect } from '@playwright/test';
import { readExcelData } from '../utils/excel-reader';

interface LoginTestData {
    username: string;
    password: string | number;
}

const logindata = readExcelData<LoginTestData>('test-data/login-data.xlsx','LoginData');

for (const userslogindata of logindata) {

test(`Validate login from Excel ${userslogindata.username}`, async ({page, loginPage, landingPage}) => {
    await page.goto('/')

    // open login pop-up
    await landingPage.navigateToLandingPage()
    await landingPage.navigateToLoginPopUp()

    console.log(logindata);

    expect(logindata.length).toBeGreaterThan(0);
    expect(logindata[0].username).toBeTruthy();

    // login into the application
    await loginPage.login(userslogindata.username, String(userslogindata.password))
    console.log(`Logging in with user: ${userslogindata.username}`)

    // Validate successfull login
    await expect(page.getByText('Login successful')).toBeVisible()
    await expect(page.getByText('Login successful')).toHaveText('Login successful')
});

}

The locators and expected messages are illustrative. Replace them with the actual application's UI.
Execution model
1. The workbook is read when the test module loads.
2. Playwright registers one test per Excel row.
3. Each test uses its row's inputs and expected result.
4. Disabled rows are reported as skipped.
5. Each enabled test validates the actual application response.
This follows Playwright's documented parameterized-test pattern. 

Run the test:
npx playwright test tests/login.spec.ts

# 6. Best practices and common pitfalls
Concern	            	Recommended approach
Type safety	      		Define interfaces, then validate external workbook data at runtime.
Passwords	        	Store cells as Text to preserve leading zeros; don't commit real credentials.
Empty cells	        	Use defval, then explicitly validate required fields.
Worksheet names	        Validate that the expected sheet exists.
Duplicate headers		Reject duplicate column names before converting rows.
Test independence		Make each row a self-contained scenario; avoid shared mutable state.
File paths				Resolve paths relative to process.cwd() and ensure the workbook is available in CI.
Test volume			    Avoid generating thousands of UI tests when API-level validation or sampling is more suitable.

# Important architecture decision
Don't confuse a TypeScript interface with data validation. This declaration:
interface LoginTestData {
    username: string;
    password: string;
}

does not ensure that Excel actually contains strings or even the required columns. sheet_to_json<LoginTestData>() does not enforce that contract at runtime. 

For a production framework, add a validation layer after reading the workbook. Reject malformed rows with clear errors that identify the worksheet and row number rather than letting a test fail later with a cryptic locator or .fill() error.

# 7. Quick reference
7. Quick reference
API / command											Purpose
XLSX.readFile(path)										Load a workbook
workbook.SheetNames										List worksheet names
workbook.Sheets[name]									Select a worksheet
XLSX.utils.sheet_to_json<T>(sheet, options)				Convert rows to objects
defval: ''												Default missing cell values
raw: false												Prefer formatted cell values
test.skip(condition, reason)							Conditionally skip a test
npx playwright test										Execute tests
npx tsc --noEmit										Type-check the project

# 8. Interview questions
Q1. Does sheet_to_json<LoginTestData>() guarantee that every row matches the interface?
No. The generic provides compile-time type information; it does not validate the workbook at runtime. Validate required headers, field types, and business rules explicitly.

Q2. How would you handle a password such as 001234 in Excel?
Format the cell as Text before entering the value, then verify that the reader preserves the exact string. If Excel has already converted it to 1234, String() cannot restore the missing zeros.

Q3. What are the trade-offs between Excel-driven and JSON-driven testing?
Excel is convenient for business-managed test data but adds parsing, formatting, and schema-validation concerns. JSON is easier to version-control and review in code. For small, automation-owned datasets, TypeScript objects may be simpler still.

4. 
What does sheet_to_json() do?
const data = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });

The sheet_to_json() function reads the cells from the worksheet and converts each data row into an object.
Option	        Responsibility
worksheet	    Supplies the Excel sheet to read
defval: ''	    Supplies an empty string for blank cells
raw: false	    Prefers formatted cell values
sheet_to_json()	Converts worksheet rows into JavaScript objects
data	        Holds the resulting array

5. 

Recommended framework design: Keep Excel parsing in utils/excel-reader.ts, workbook validation in a dedicated validation layer, and application assertions in Playwright tests. This separation makes the framework easier to debug, maintain, and run in CI/CD.

