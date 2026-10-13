# Source-Agnostic Test Data Management in Playwright + TypeScript

## 1. Objective

Build a reusable test-data loading mechanism for a Playwright +
TypeScript framework that supports **JSON, CSV, and Excel** files while
keeping each module focused on one responsibility.

The design should let a test choose: - the input file, - the validation
schema, - and, when reading Excel, an optional worksheet name.

It should avoid hard-coded dataset registries and unnecessary
abstractions.

## 2. Architecture at a glance
``` text
Test case
   |
   | file path + Zod schema + optional reader options
   v
TestDataFactory
   |
   | detects file extension and selects a reader
   v
JSON reader / CSV reader / Excel reader
   |
   | returns records as an array
   v
TestDataFactory
   |
   | validates all records against the supplied schema
   v
Validated, typed test data
```
### Responsibilities

  -----------------------------------------------------------------------
  Module                  Responsibility          Should not be
                                                  responsible for
  ----------------------- ----------------------- -----------------------
  Test case               Selects data file and   Parsing file formats
                          schema; consumes        
                          records                 

  `TestDataFactory`       Resolves the path,      Implementing
                          chooses a reader,       format-specific parsing
                          validates records       

  JSON reader             Reads and parses JSON   Login-specific
                                                  validation

  CSV reader              Parses CSV rows into    Choosing test scenarios
                          records                 

  Excel reader            Reads a worksheet into  Validating a particular
                          records                 test's business rules

  Zod schema              Defines the shape and   Knowing where data came
                          constraints of valid    from
                          records                 

  Playwright fixtures     Provides test-lifecycle Injecting ordinary
                          resources such as Page  utilities that are
                          Objects                 imported directly
  -----------------------------------------------------------------------

The factory coordinates the process; it does not replace the readers or schemas.

## 3. Suggested project structure

Adapt folder names to the existing repository, but keep the
responsibilities clear.

``` text
project-root/
├── data/
│   ├── contracts/
│   │   └── login-data.schema.ts
│   ├── factories/
│   │   └── TestDataFactory.ts
│   ├── test-data/
│   │   ├── login-data.json
│   │   ├── login-data.csv
│   │   └── login-data.xlsx
│   └── test-data-readers/
│       ├── json-reader.ts
│       ├── csv-reader.ts
│       └── excel-reader.ts
├── fixtures/
│   └── test-fixtures.ts
└── tests/
    └── login.spec.ts
```
The factory below assumes data files live under `data/test-data/` and that `process.cwd()` is the project root.

## 4. Define a data contract with Zod

**File:** `data/contracts/login-data.schema.ts`
``` ts
import { z } from 'zod';

export const loginDataSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    expectedResult: z.enum(['success', 'failure']),
});

export type LoginData = z.infer<typeof loginDataSchema>;
```

### Why this schema is independent
-   It defines the expected fields and validation rules for a login data
    record.
-   It does not depend on JSON, CSV, or Excel.
-   The inferred `LoginData` type can be used wherever a compile-time
    type is useful.
-   Runtime validation is still necessary because external file data is
    not made trustworthy by a TypeScript type assertion.

A TypeScript type describes what the program expects at compile time.
Zod checks whether the actual data matches that expectation at runtime.

## 5. Implement the readers
Each reader has one job: read its format and return records. The factory
performs shared schema validation afterwards.

### 5.1 JSON reader
**File:** `data/test-data-readers/json-reader.ts`
``` ts
import * as fs from 'node:fs';
import { readFileSync } from 'node:fs';

export function readJson<T>(filePath: string): T[] {
    if (!fs.existsSync(filePath)) {
        throw new Error(`JSON file not found: ${filePath}`);
    }

    try {
        const content = readFileSync(filePath, 'utf-8');
        const parsed: unknown = JSON.parse(content);

        if (!Array.isArray(parsed)) {
            throw new Error('Expected the JSON root value to be an array.');
        }

        return parsed as T[];
    } catch (error) {
        throw new Error(
            `Failed to read JSON file "${filePath}": ${
                error instanceof Error ? error.message : String(error)
            }`
        );
    }
}
```

Example JSON data:

``` json
[
  {
    "username": "validUser",
    "password": "validPassword",
    "expectedResult": "success"
  },
  {
    "username": "invalidUser",
    "password": "wrongPassword",
    "expectedResult": "failure"
  }
]
```

`JSON.parse()` is required when reading a JSON file as text: it converts
the text into JavaScript data. A `for...of` loop can iterate over parsed
records, but it does not parse JSON text itself.

### 5.2 CSV reader

**File:** `data/test-data-readers/csv-reader.ts`

This implementation uses the `csv-parse` package's synchronous parser.

``` ts
import * as fs from 'node:fs';
import { parse } from 'csv-parse/sync';

export function readCsvData<T>(filePath: string): T[] {
    if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
    }) as T[];

    if (records.length === 0) {
        throw new Error(`No data found in CSV file: ${filePath}`);
    }

    return records;
}
```

Example CSV data:

``` csv
username,password,expectedResult
validUser,validPassword,success
invalidUser,wrongPassword,failure
```

`columns: true` treats the first row as column headers and uses them as
object property names.

### 5.3 Excel reader

**File:** `data/test-data-readers/excel-reader.ts`

This implementation uses SheetJS (`xlsx`) and supports an optional
worksheet name.

``` ts
import * as fs from 'node:fs';
import * as XLSX from 'xlsx';

export function readExcelData<T>(
    filePath: string,
    sheetName?: string
): T[] {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Excel file not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const selectedSheet = sheetName ?? workbook.SheetNames[0];
    const worksheet = workbook.Sheets[selectedSheet];

    if (!worksheet) {
        throw new Error(`Worksheet not found: ${selectedSheet}`);
    }

    const data = XLSX.utils.sheet_to_json<T>(worksheet, {
        defval: '',
        raw: false,
    });

    if (data.length === 0) {
        throw new Error(`No data found in worksheet: ${selectedSheet}`);
    }

    return data;
}
```

Important: - If no worksheet name is supplied, the first worksheet is
selected. - `defval: ''` supplies an empty string for empty cells. -
`raw: false` asks SheetJS to return formatted values rather than raw
underlying values in supported cases. - If values must preserve leading
zeros (for example, `001234`), format those Excel cells as **Text**. If
Excel has already stored a value as a number and discarded leading
zeros, the reader cannot reliably restore them. - Formatting a cell as
text is especially important for identifiers, usernames, passwords,
postal codes, and other values that are not meant to be numbers.

## 6. Implement the source-agnostic factory

**File:** `data/factories/TestDataFactory.ts`

The factory accepts a path relative to the configured test-data
directory, a Zod schema, and optional format-specific options.

``` ts
import path from 'node:path';
import { z } from 'zod';

import { readJson } from '../test-data-readers/json-reader';
import { readCsvData } from '../test-data-readers/csv-reader';
import { readExcelData } from '../test-data-readers/excel-reader';

const DATA_DIRECTORY = path.resolve(
    process.cwd(),
    'data',
    'test-data'
);

export interface TestDataOptions {
    sheetName?: string;
}

export class TestDataFactory {
    static load<S extends z.ZodType>(
        filePath: string,
        schema: S,
        options?: TestDataOptions
    ): z.infer<S>[] {
        const resolvedPath = path.resolve(DATA_DIRECTORY, filePath);
        const relativePath = path.relative(DATA_DIRECTORY, resolvedPath);

        // Prevent a supplied path from escaping the configured data directory.
        if (
            relativePath === '..' ||
            relativePath.startsWith(`..${path.sep}`) ||
            path.isAbsolute(relativePath)
        ) {
            throw new Error(
                `Test-data path must remain inside "${DATA_DIRECTORY}"`
            );
        }

        let rawData: unknown[];

        switch (path.extname(resolvedPath).toLowerCase()) {
            case '.json':
                rawData = readJson<unknown>(resolvedPath);
                break;

            case '.csv':
                rawData = readCsvData<unknown>(resolvedPath);
                break;

            case '.xlsx':
                rawData = readExcelData<unknown>(
                    resolvedPath,
                    options?.sheetName
                );
                break;

            default:
                throw new Error(
                    `Unsupported test-data format: "${resolvedPath}". ` +
                    'Supported formats: .json, .csv, .xlsx'
                );
        }

        if (!Array.isArray(rawData) || rawData.length === 0) {
            throw new Error(`No test records found in "${resolvedPath}".`);
        }

        const result = z.array(schema).safeParse(rawData);

        if (!result.success) {
            const details = result.error.issues.map(issue => ({
                record:
                    typeof issue.path[0] === 'number'
                        ? issue.path[0] + 1
                        : 'unknown',
                field: issue.path.slice(1).join('.') || '(record)',
                message: issue.message,
            }));

            throw new Error(
                `Validation failed for "${resolvedPath}":\n` +
                JSON.stringify(details, null, 2)
            );
        }

        return result.data;
    }
}
```

### Factory design notes

-   `path.extname()` chooses the reader based on the file extension.
-   The path is resolved under `data/test-data/`; callers should
    normally pass only a filename or a path relative to that directory.
-   The path guard prevents paths such as `../../other-folder/file.json`
    from escaping the configured data directory.
-   Each reader returns records; `z.array(schema)` validates every
    record against the supplied schema.
-   `safeParse()` lets the factory report validation issues with record
    numbers, field paths, and messages.
-   The generic return type `z.infer<S>[]` preserves the schema's
    inferred TypeScript type for consumers.
-   The factory does not know about login-specific fields. It can load
    any dataset as long as the caller supplies the appropriate schema.

## 7. Use the factory from a test

Import the factory and schema directly. A separate Playwright fixture is
not necessary just to expose a static utility method.

``` ts
import { test, expect } from '../fixtures/test-fixtures';
import { TestDataFactory } from '../data/factories/TestDataFactory';
import { loginDataSchema } from '../data/contracts/login-data.schema';

const loginTestData = TestDataFactory.load(
    'login-data.json',
    loginDataSchema
);

for (const userData of loginTestData) {
    test(`Login - ${userData.username}`, async ({
        page,
        loginPage,
        landingPage,
    }) => {
        await page.goto('/');

        await landingPage.navigateToLoginPopUp();

        await loginPage.login(
            userData.username,
            userData.password
        );

        if (userData.expectedResult === 'success') {
            // Replace with the success assertion for your application.
            await expect(
                page.getByText('Login successful', { exact: true })
            ).toBeVisible();
        } else {
            // Replace with the failure assertion for your application.
            await expect(
                page.getByText('Invalid username or password')
            ).toBeVisible();
        }
    });
}
```

The Page Object method names and success/failure messages above are
examples; use the methods and assertions that match your application.

### Why load the data outside `test()`?

Playwright collects test declarations before executing them. Loading the
data at module scope and creating one `test()` per record means each
record becomes a separate test with its own reporting and retry
identity.

By contrast, looping through all records inside one `test()` creates one
test containing several data iterations. A failure in one iteration then
fails that single test rather than a separately named test case for each
record.

## 8. Use JSON, CSV, or Excel from the same factory

The caller chooses the source; the factory handles the mechanics.

``` ts
const jsonData = TestDataFactory.load(
    'login-data.json',
    loginDataSchema
);

const csvData = TestDataFactory.load(
    'login-data.csv',
    loginDataSchema
);

const excelData = TestDataFactory.load(
    'login-data.xlsx',
    loginDataSchema,
    { sheetName: 'LoginData' }
);
```

All three calls return validated `LoginData[]` values.

If a different test uses an employee dataset, define an employee schema
and supply that schema to `load()`. The factory does not need to know
the details of the employee record.

## 9. Keep Playwright fixtures focused

Page Objects that depend on Playwright's `page` fixture belong in the
custom fixture setup. For example:

``` ts
import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { LandingPage } from '../pages/LandingPage';
import { LogoutPage } from '../pages/LogoutPage';

type CustomFixtures = {
    loginPage: LoginPage;
    landingPage: LandingPage;
    logoutPage: LogoutPage;
};

export const test = base.extend<CustomFixtures>({
    landingPage: async ({ page }, use) => {
        await use(new LandingPage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },
});

export { expect };
```

There is no need to add a `testData` fixture solely to expose
`TestDataFactory`. Since it is a regular utility with a static `load()`
method, import it directly where needed.

## 10. Dependencies

The implementations above require these packages:

``` bash
npm install zod csv-parse xlsx
```

The examples use Node.js built-in modules (`node:fs` and `node:path`)
for file access and path handling.

## 11. Common issues and fixes

### A. The path contains `data/test-data` twice

**Symptom:**

``` text
.../data/test-data/data/test-data/login-data.json
```

**Cause:** The factory already prefixes paths with `data/test-data`, but
the caller passes that prefix again.

**Correct:**

``` ts
TestDataFactory.load('login-data.json', loginDataSchema);
```

For a file in a subdirectory:

``` ts
TestDataFactory.load(
    'regression/login-data.json',
    loginDataSchema
);
```

The supplied path is relative to the configured data directory.

### B. Zod reports `password` as a number

**Symptom:**

``` text
Invalid input: expected string, received number
```

**Cause:** Excel or another input source supplies a number, while the
schema requires a string.

**Preferred fix:** Store password values as text in Excel and make sure
the reader returns the intended string values. Do not change the schema
to accept numbers merely to hide inconsistent input data.

### C. Excel worksheet not found

Confirm that the worksheet name passed to `sheetName` exactly matches a
name in the workbook:

``` ts
TestDataFactory.load(
    'login-data.xlsx',
    loginDataSchema,
    { sheetName: 'LoginData' }
);
```

If no sheet is specified, the reader selects the first worksheet.

### D. Unsupported extension

The factory currently supports `.json`, `.csv`, and `.xlsx`. Add a new
reader and extend the factory's extension switch if another format
becomes a real requirement.

### E. JSON root is not an array

The JSON reader expects a root array of records. A JSON object
containing a nested array needs either to be reshaped to the expected
format or handled deliberately by changing the reader's contract.

## 12. Design principles demonstrated

1.  **Single responsibility:** Each reader handles one file format; each
    schema defines one data contract; the factory coordinates loading
    and validation.
2.  **Separation of concerns:** File parsing is independent from
    business-specific validation and test execution.
3.  **Low coupling:** The schema does not depend on the reader, and
    readers do not depend on the schema.
4.  **Reuse:** One factory works with many datasets and schemas.
5.  **Open for practical extension:** New datasets can be introduced
    without a registry or factory change. A new file format requires a
    reader and a small factory update.
6.  **Runtime safety:** Zod checks real input data before tests consume
    it.
7.  **Clear failure messages:** File, worksheet, parsing, and
    schema-validation errors identify the problem.
8.  **No unnecessary fixture:** A static utility does not need
    dependency injection through Playwright fixtures unless the
    framework has a specific reason to expose it that way.

## 13. Final checklist

-   [ ] Data files are under `data/test-data/`.
-   [ ] Each dataset has an appropriate Zod schema.
-   [ ] Each reader is responsible only for reading its format.
-   [ ] The factory selects a reader by extension.
-   [ ] The factory validates all records using the supplied schema.
-   [ ] Tests pass a filename relative to `data/test-data/`.
-   [ ] Excel worksheet names are supplied only when needed.
-   [ ] Excel values that must remain strings are stored as text where
    appropriate.
-   [ ] Each data record is declared as a separate Playwright test when
    independent reporting and retries are desired.
-   [ ] `TestDataFactory` is imported directly rather than injected as
    an unnecessary fixture.

**Core takeaway:** The test chooses *what data to load* and *how that
data should be validated*. Readers know *how to read a format*. The
factory coordinates the two. This keeps the implementation dynamic,
readable, and straightforward to maintain.
