### 1. TypeScript private vs. JavaScript # Private Fields
# Core Comparison
1. private (TypeScript Keyword): Compile-time check only. Disappears after compilation into standard public fields.

2. # (ECMAScript Private Fields): Runtime enforcement native to JavaScript/V8. Access outside the class throws a runtime TypeError.

# Key Advantages of #
1. True Hard Encapsulation: Cannot be accessed, overridden, or inspected externally at runtime (even via dynamic key lookup like obj['field']).

2. Subclass Protection: Prevents naming collisions. A subclass can safely declare a #field with the same name without overwriting the base class field.

3. Native Standard: Supported out-of-the-box by modern Node.js and browsers without relying on TypeScript transpilation tricks.

# Playwright / Automation Best Practice
1. Strict POM Design: Using # for Locator objects forces test files to interact strictly through public page methods rather than directly poking internal locators.

2. Only Trade-off: Prevents external mocking or inspection of internal state during low-level unit test debugging.

### 2. Encapsulation: Classic OOP vs. Test Automation (POM)
Classic OOP (Data Encapsulation): Protects internal state (data) by exposing validated public getters and setters (e.g., get age(), set age()).

Page Object Model (Behavioral Encapsulation): Hides UI implementation details (DOM selectors/locators) and exposes user workflows and assertions.

### 3. Why Getters / Functions Returning Locators Are Anti-Patterns
Leaks Implementation: Functions or getters returning Locator objects (e.g., getEmailInput(): Locator) expose raw DOM selectors to test files.

Creates Fragile Tests: If the UI structure changes (e.g., single input becomes a multi-step component), every test file using that locator getter breaks.

Violates Separation of Concerns: Test files should define what to test, not how to interact with individual DOM elements.

###  4. Page Object Model Best Practices Checklist
Lock Down Locators: Keep all Locator objects strictly private using # fields (e.g., #emailInput, #submitButton).

Expose Goal-Oriented Workflows: Provide high-level methods that perform complete user actions (e.g., login(email, pass)).

Expose State & Data, Not Elements: Return evaluated primitives (string, boolean) rather than locator instances (e.g., async getErrorMessage(): Promise<string>).

Encapsulate Assertions: Create custom verification methods on the Page Object (e.g., expectLoginError(text)).


