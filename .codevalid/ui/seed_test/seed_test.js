/**
 * Seed test for the IoT Dashboard.
 *
 * Validates the fundamental health of the application:
 *   1. The page loads successfully (HTTP 200).
 *   2. The main dashboard layout (sidebar + content area) is rendered.
 *   3. At least one metric card label is visible, confirming the API mock
 *      (mock-server.js) is serving data and the React components hydrated.
 *
 * All mock data and API responses come from the mock server at
 * .codevalid/ui/mock/mock-server.js — this file contains no inline mock data.
 *
 * ExecutionRecorder saves a structured flow JSON so the result is picked up
 * by print-execution-results.js and uploaded to S3 in global-teardown.js.
 */

import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../helpers/execution-recorder.js";

test("seed – dashboard loads and metric cards are visible", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder(
    "seed-dashboard-loads",
    "Seed: dashboard loads and metric cards are visible"
  );

  // ── 1. Navigate to root ────────────────────────────────────────────────────
  recorder.record("navigate to /");
  const response = await page.goto("/");

  recorder.record("assert HTTP 200");
  expect(response?.status()).toBe(200);

  // ── 2. Wait for the app shell ──────────────────────────────────────────────
  recorder.record("wait for network idle");
  await page.waitForLoadState("networkidle", { timeout: 30_000 });

  // ── 3. Assert sidebar / nav is visible ────────────────────────────────────
  recorder.record("assert navigation sidebar is present");
  const sidebar = page
    .locator("nav, aside, [class*='Sidebar'], [class*='sidebar']")
    .first();
  await expect(sidebar).toBeVisible({ timeout: 10_000 });

  // ── 4. Assert at least one metric card label ───────────────────────────────
  recorder.record("wait for metric card labels to appear");
  await page.waitForFunction(
    () => {
      const labels = ["Active Devices", "Success Rate", "Critical Failures", "Ingestion Rate"];
      return labels.some((label) =>
        [...document.querySelectorAll("*")].some(
          (el) => el.textContent?.trim() === label || el.textContent?.includes(label)
        )
      );
    },
    { timeout: 15_000 }
  );

  recorder.record("assert 'Active Devices' label is visible");
  await expect(page.getByText("Active Devices", { exact: false })).toBeVisible({
    timeout: 10_000,
  });

  // ── 5. Save flow recording ─────────────────────────────────────────────────
  await recorder.save(testInfo);
});
