import { test, expect } from "@playwright/test";

// Global error collector for console errors
const consoleErrors: string[] = [];

test.describe("Smoke Tests", () => {
  test.beforeEach(() => {
    consoleErrors.length = 0;
  });

  test.afterEach(() => {
    if (consoleErrors.length > 0) {
      console.log("Console errors found:", consoleErrors);
    }
  });

  test("Home page loads without errors", async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("my-app");
    expect(consoleErrors).toHaveLength(0);
  });

  test("Library page loads without errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    const response = await page.goto("/library");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("Library");
    expect(errors).toHaveLength(0);
  });

  test("Navigation works without errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/");
    await page.click("text=Get Started");
    await page.waitForURL("/library");
    expect(errors).toHaveLength(0);
  });
});

test.describe("Mobile Viewport Tests", () => {
  test.use({
    viewport: { width: 390, height: 844 },
  });

  test("Home page loads on mobile without errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("my-app");
    expect(errors).toHaveLength(0);
  });
});

test.describe("Console Error Detection", () => {
  test("captures console.errors and fails the test", async ({ page }) => {
    const consoleMessages: { type: string; text: string }[] = [];

    page.on("console", (msg) => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });

    await page.goto("/");
    const errors = consoleMessages.filter((m) => m.type === "error");
    expect(errors).toHaveLength(0);
  });
});
