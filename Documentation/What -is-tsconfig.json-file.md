# "tsconfig.json" — Playwright + TypeScript

# One liner:
> `tsconfig.json` controls how TypeScript understands and type-checks your Playwright project.

# 1. What is tsconfig.json?
tsconfig.json is the configuration file for TypeScript.

It defines how TypeScript should:
- Understand the project
- Type-check the code
- Resolve modules/imports
- Target JavaScript
- Identify project files

tsconfig.json = TypeScript project configuration

2. Recommended Playwright Configuration
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "types": ["node", "@playwright/test"],
    "noEmit": true
  },

  "include": [
    "tests/**/*.ts",
    "pages/**/*.ts",
    "fixtures/**/*.ts",
    "utils/**/*.ts",
    "playwright.config.ts"
  ]
}

3. compilerOptions

target

"target": "ESNext"

Purpose: Defines the JavaScript version/features TypeScript targets.

Typical Playwright choice:

ESNext

module

"module": "NodeNext"

Purpose: Defines the module system used by the project.

Supports modern Node.js module behavior such as:

import { test } from '@playwright/test';

moduleResolution

"moduleResolution": "NodeNext"

Purpose: Defines how TypeScript resolves import statements and finds modules/files.

- strict

"strict": true

Purpose: Enables strict TypeScript type checking.

Example:
let count: number = "10"; // Type error

Recommended: Always enable for enterprise automation frameworks.

- esModuleInterop

"esModuleInterop": true

Purpose: Improves compatibility between CommonJS and ES Module packages.

Makes imports from different module styles easier to work with.

- types

"types": [
  "node",
  "@playwright/test"
]

**Purpose:** Makes specific type definitions available to the project.

| Type               | Provides                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `node`             | Node.js types such as `process`, `Buffer`, etc.                   |
| `@playwright/test` | Playwright types such as `Page`, `Browser`, `Locator`, `TestInfo` |

- noEmit

"noEmit": true

Purpose: TypeScript performs type analysis without generating .js files.

Useful for Playwright because Playwright handles test execution.

4. include

"include": [
  "tests/**/*.ts",
  "pages/**/*.ts",
  "fixtures/**/*.ts",
  "utils/**/*.ts",
  "playwright.config.ts"
]

Purpose: Defines which TypeScript files belong to the project.

For example:
tests/       → Test cases
pages/       → Page Objects
fixtures/    → Custom fixtures
utils/       → Utilities/helpers
playwright.config.ts → Playwright configuration

As the framework grows, additional folders can be added:
- services/
- models/
- helpers/
- constants/

5. How it fits into a Playwright project

                tsconfig.json
                      │
                      ▼
          TypeScript Configuration
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      Tests         Pages        Fixtures
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                Playwright
                 Test Runner
                      │
                      ▼
                   Browser

You don't import tsconfig.json into your tests.

Just run: npx playwright test

6. tsconfig.json vs TypeScript version

These are different:

TypeScript version
       ↓
package.json
       ↓
typescript package/version


TypeScript configuration
       ↓
tsconfig.json
       ↓
target, module, strict, types, include, etc.

# 7. Most Important Options — Quick Revision

| Option             | Purpose                          |
| ------------------ | -------------------------------- |
| `target`           | JavaScript language target       |
| `module`           | Module system                    |
| `moduleResolution` | How imports/modules are resolved |
| `strict`           | Strict type checking             |
| `esModuleInterop`  | CJS/ESM interoperability         |
| `types`            | Available type definitions       |
| `noEmit`           | Don't generate JS files          |
| `include`          | TypeScript project files         |



