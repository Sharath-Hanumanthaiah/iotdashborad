import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../helpers/execution-recorder.js";
import { setupDashboardMocks, emitDashboardTick, forceDisconnect, reconnectDashboard, getDashboardState } from "../helpers/mock-api.js";

test("Global Time Range Filter Synchronizes State Across Dashboard Components", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_content_global_time_range_filter_synchronization", "Global Time Range Filter Synchronizes State Across Dashboard Components");

  await recorder.step("Open the application at the root URL");
  await setupDashboardMocks(page, { connected: true, autoStart: false });
  await page.goto("/");

  await recorder.step("Confirm default time range button is selected");
  const defaultButton = page.getByRole("button", { name: /24 Hours|Last 24 Hours/i });
  await expect(defaultButton).toBeVisible();

  await recorder.step("Change time range to Last 1 Hour if present, otherwise 1 Hour");
  const oneHourButton = page.getByRole("button", { name: /Last 1 Hour|1 Hour/i });
  await expect(oneHourButton).toBeVisible();
  await oneHourButton.click();
  await expect(oneHourButton).toHaveClass(/active/);

  await recorder.step("Emit KPI update and verify cards remain visible under the selected range");
  await emitDashboardTick(page, { activeDevices: 191, successRate: 95.6, criticalFailures: 4, ingestionRate: 1275, sparkShift: 3 });
  await page.waitForTimeout(200);
  await expect(page.getByText("Active Devices")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(4);

  await recorder.step("Simulate WebSocket disconnect and reconnect");
  await forceDisconnect(page);
  await expect(page.getByText("OFFLINE")).toBeVisible();
  await reconnectDashboard(page);
  await expect(page.getByText("LIVE")).toBeVisible();

  await recorder.step("Confirm time range setting is preserved after reconnection");
  await expect(oneHourButton).toHaveClass(/active/);
  const state = await getDashboardState(page);
  expect(state.connected).toBe(true);
  expect(state.timeRange).not.toBeNull();

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_content_global_time_range_filter_synchronization");
  await recorder.save(testInfo);
});
