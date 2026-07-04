import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../helpers/execution-recorder.js";
import { setupDashboardMocks } from "../helpers/mock-api.js";

test("Dashboard Content Adapts Responsively Across Widescreen Viewports Using CSS Grid and Flexbox", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_content_responsive_layout_on_widescreen", "Dashboard Content Adapts Responsively Across Widescreen Viewports Using CSS Grid and Flexbox");

  await recorder.step("Open the application at the root URL at 1920px width");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await setupDashboardMocks(page, { connected: true, autoStart: false });
  await page.goto("/");

  await recorder.step("Capture KPI cards, sidebar, and top action bar at 1920px width");
  await expect(page.getByRole("heading", { name: "IoT Command Center" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Active Devices")).toBeVisible();
  const overflow1920 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow1920).toBeLessThanOrEqual(1);

  await recorder.step("Resize viewport to 1440px and ensure layout remains responsive");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByText("Success Rate")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(4);
  const overflow1440 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow1440).toBeLessThanOrEqual(1);

  await recorder.step("Resize viewport to 1366px and verify no horizontal scrolling occurs");
  await page.setViewportSize({ width: 1366, height: 768 });
  await expect(page.getByText("Critical Failures")).toBeVisible();
  const overflow1366 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow1366).toBeLessThanOrEqual(1);

  await recorder.step("Confirm sidebar remains fixed and top bar remains aligned");
  const sidebarBox = await page.getByRole("button", { name: "Dashboard" }).boundingBox();
  const topBarBox = await page.getByRole("heading", { name: "IoT Command Center" }).boundingBox();
  expect(sidebarBox?.x ?? 999).toBeLessThan(100);
  expect(topBarBox?.y ?? 999).toBeLessThan(120);

  await recorder.step("Ensure sparklines and text remain legible at all sizes");
  await expect(page.getByText("Ingestion Rate")).toBeVisible();
  await expect(page.locator("canvas").first()).toBeVisible();

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_content_responsive_layout_on_widescreen");
  await recorder.save(testInfo);
});
