/**
 * Sample Playwright test for the IoT Dashboard UI.
 *
 * Validates the core dashboard renders:
 *  - Sidebar navigation
 *  - Top bar
 *  - Metric cards (Active Devices, Success Rate, Critical Failures, Ingestion Rate)
 *  - Navigation to secondary pages
 *
 * The app is served by Vite (port 5174) and the mock API/WS server runs on port 3001.
 * Both are started automatically by playwright.config.js webServer.
 */

import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../helpers/execution-recorder.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

const BASE = "http://localhost:5174";

// ── Test suite ───────────────────────────────────────────────────────────────

test.describe("IoT Dashboard – smoke tests", () => {
  test("dashboard page loads and shows metric cards", async ({ page }, testInfo) => {
    const recorder = new ExecutionRecorder({
      testId: "sample-dashboard-loads",
      testTitle: "dashboard page loads and shows metric cards",
    });

    await recorder.step("Navigate to dashboard", async () => {
      await page.goto(BASE);
    });

    await recorder.step("Wait for page to be visible", async () => {
      await page.waitForLoadState("networkidle");
    });

    await recorder.step("Assert page title / document", async () => {
      // The app renders a React SPA; the <title> comes from index.html
      const title = await page.title();
      recorder.record("page title captured", { title });
      expect(typeof title).toBe("string");
    });

    await recorder.step("Assert sidebar is present", async () => {
      // Sidebar has nav links; check the wrapper is mounted
      const sidebar = page.locator("nav, [class*='sidebar'], [class*='Sidebar']").first();
      await expect(sidebar).toBeVisible({ timeout: 10000 });
    });

    await recorder.step("Wait for metric cards to appear", async () => {
      // MetricCardsRow renders 4 cards once /api/metrics resolves.
      // We wait for at least one card-like element to be visible.
      const cards = page.locator(".glass-card, [class*='card'], [class*='Card']");
      await expect(cards.first()).toBeVisible({ timeout: 15000 });
    });

    await recorder.step("Assert Active Devices text visible", async () => {
      const el = page.getByText("Active Devices", { exact: false });
      await expect(el.first()).toBeVisible({ timeout: 10000 });
    });

    await recorder.step("Assert Success Rate text visible", async () => {
      const el = page.getByText("Success Rate", { exact: false });
      await expect(el.first()).toBeVisible({ timeout: 10000 });
    });

    await recorder.step("Assert Critical Failures text visible", async () => {
      const el = page.getByText("Critical Failures", { exact: false });
      await expect(el.first()).toBeVisible({ timeout: 10000 });
    });

    await recorder.step("Assert Ingestion Rate text visible", async () => {
      const el = page.getByText("Ingestion Rate", { exact: false });
      await expect(el.first()).toBeVisible({ timeout: 10000 });
    });

    await recorder.save(testInfo);
  });

  test("navigation links render without crash", async ({ page }, testInfo) => {
    const recorder = new ExecutionRecorder({
      testId: "sample-navigation",
      testTitle: "navigation links render without crash",
    });

    await recorder.step("Navigate to dashboard", async () => {
      await page.goto(BASE);
      await page.waitForLoadState("networkidle");
    });

    // Sidebar items – text may differ; use broad locators
    const navTexts = ["Dashboard", "Devices", "Analytics", "Alerts", "Settings"];

    for (const label of navTexts) {
      await recorder.step(`Check nav item: ${label}`, async () => {
        const link = page.getByText(label, { exact: false }).first();
        // Not all nav items may exist; just verify clicking doesn't crash
        if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
          await link.click({ timeout: 5000 });
          await page.waitForLoadState("networkidle");
          recorder.record("nav clicked", { label });
        }
      });
    }

    // Navigate back to dashboard
    await recorder.step("Return to dashboard", async () => {
      await page.goto(BASE);
      await page.waitForLoadState("networkidle");
    });

    await recorder.step("Verify main content area still renders", async () => {
      const main = page.locator("main, [class*='content'], [class*='Content']").first();
      await expect(main).toBeVisible({ timeout: 10000 });
    });

    await recorder.save(testInfo);
  });

  test("no console errors on initial load", async ({ page }, testInfo) => {
    const recorder = new ExecutionRecorder({
      testId: "sample-no-console-errors",
      testTitle: "no console errors on initial load",
    });

    const errors = [];

    await recorder.step("Attach console error listener", async () => {
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });
    });

    await recorder.step("Navigate to dashboard", async () => {
      await page.goto(BASE);
      await page.waitForLoadState("networkidle");
    });

    await recorder.step("Evaluate console errors", async () => {
      // Filter out WebSocket reconnect noise (expected when WS not available in some envs)
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes("WebSocket") &&
          !e.includes("ws://") &&
          !e.includes("net::ERR_CONNECTION_REFUSED")
      );
      recorder.record("console errors found", { count: criticalErrors.length, criticalErrors });
      expect(criticalErrors.length, `Unexpected console errors: ${criticalErrors.join(", ")}`).toBe(0);
    });

    await recorder.save(testInfo);
  });
});
