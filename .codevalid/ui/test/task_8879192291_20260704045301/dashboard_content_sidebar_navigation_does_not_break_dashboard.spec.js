import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../helpers/execution-recorder.js";
import { setupDashboardMocks, emitDashboardTick, getDashboardState } from "../helpers/mock-api.js";

test("Sidebar Navigation Clicks Do Not Break DashboardContent or Clear State", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_content_sidebar_navigation_does_not_break_dashboard", "Sidebar Navigation Clicks Do Not Break DashboardContent or Clear State");

  await recorder.step("Open the application at the root URL");
  await setupDashboardMocks(page, { connected: true, autoStart: false });
  await page.goto("/");
  await emitDashboardTick(page, { activeDevices: 192, successRate: 97.1, criticalFailures: 2, ingestionRate: 1290, sparkShift: 4 });
  await page.waitForTimeout(200);

  await recorder.step("Confirm KPIs are visible and connection is LIVE");
  await expect(page.getByText("Active Devices")).toBeVisible();
  await expect(page.getByText("LIVE")).toBeVisible();
  const beforeNav = await getDashboardState(page);

  await recorder.step("Click Devices and confirm placeholder appears");
  await page.getByRole("button", { name: "Devices" }).click();
  await expect(page.getByRole("heading", { name: "Device Management" })).toBeVisible();
  await expect(page.getByText("This module is under construction.")).toBeVisible();

  await recorder.step("Click Analytics and confirm placeholder appears");
  await page.getByRole("button", { name: "Analytics" }).click();
  await expect(page.getByRole("heading", { name: "Advanced Analytics" })).toBeVisible();
  await expect(page.getByText("This module is under construction.")).toBeVisible();

  await recorder.step("Return to Dashboard and confirm KPI state and connection remain intact");
  await page.getByRole("button", { name: "Dashboard" }).click();
  await expect(page.getByText("Active Devices")).toBeVisible();
  await expect(page.getByText("LIVE")).toBeVisible();
  const afterNav = await getDashboardState(page);
  expect(afterNav.connected).toBe(true);
  expect(afterNav.metrics.activeDevices).toBe(beforeNav.metrics.activeDevices);
  expect(afterNav.metrics.ingestionRate).toBe(beforeNav.metrics.ingestionRate);

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_content_sidebar_navigation_does_not_break_dashboard");
  await recorder.save(testInfo);
});
