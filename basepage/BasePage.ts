import { Page, Locator } from "@playwright/test";

export class BasePage {

    protected readonly page: Page
    constructor(page: Page) {
        this.page = page
    }

    protected async getNormalizedText(locator: Locator): Promise<string> {
                return (await locator.innerText()).replace(/\s+/g, " ").trim()
    }

    async goToUrl(url: string, description: string = "page"): Promise<void> {
            await this.page.goto(url, { waitUntil: "domcontentloaded" })
    }

    // Just for dummy purpose to use how we can write this kind of function
    async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
        try {
            await locator.waitFor({ state: "visible", timeout });
        } catch (error) {
            throw new Error(`${locator} was not visible within ${timeout}ms`);
        }
    }
    // Just for dummy purpose to use how we can write this kind of function
    async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void> {
        try {
            await locator.waitFor({ state: "hidden", timeout });
        } catch (error) {
            throw new Error(`${locator} did not disappear within ${timeout}ms`);
        }
    }
    // Just for dummy purpose to use how we can write this kind of function
    async click(locator: Locator, elementName: string): Promise<void> {
        try {
            await locator.waitFor({ state: "visible", timeout: 10000 });
            await locator.click();
        } catch (error) {
            throw new Error(`Failed to click on ${elementName}`);
        }
    }
    // Just for dummy purpose to use how we can write this kind of function
    async type(locator: Locator, value: string, elementName: string): Promise<void> {
        try {
            await locator.waitFor({ state: "visible", timeout: 10000 });
            await locator.fill(value);
        } catch (error) {
            throw new Error(`Failed to enter value into ${elementName}`);
        }
    }
}