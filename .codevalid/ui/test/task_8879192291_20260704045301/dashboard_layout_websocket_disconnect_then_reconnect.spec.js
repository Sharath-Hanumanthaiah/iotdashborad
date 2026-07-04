import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../../../ui_test/helpers/execution-recorder.js";
import { setupDashboardMocks, emitDashboardTick, forceDisconnect, reconnectDashboard } from "../../../../ui_test/helpers/mock-api.js";

test("WebSocket Disconnection and Auto-Reconnection Update UI Status Correctly", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_layout_websocket_disconnect_then_reconnect", testInfo);

  await recorder.step("Set up dashboard mocks with active WebSocket");
  await setupDashboardMocks(page, { connected: true });

  await recorder.step("Navigate to dashboard and confirm initial connected state");
  await page.goto("/");
  await expect(page.getByText("LIVE", { exact: true })).toBeVisible();
  await expect(page.getByText("188")).toBeVisible();

  await recorder.step("Simulate WebSocket disconnection and verify offline state");
  await forceDisconnect(page);
  await expect(page.getByText("OFFLINE", { exact: true })).toBeVisible();

  await recorder.step("Simulate delayed auto-reconnection");
  await page.waitForTimeout(300);
  await reconnectDashboard(page);
  await expect(page.getByText("LIVE", { exact: true })).toBeVisible();

  await recorder.step("Emit resumed KPI updates after reconnection");
  await emitDashboardTick(page, {
    activeDevices: 191,
    successRate: 96.7,
    criticalFailures: 2,
    ingestionRate: 1260,
    sparkShift: 1,
  });

  await recorder.step("Verify KPI values resume updating after reconnection");
  await expect(page.getByText("191")).toBeVisible();
  await expect(page.getByText("96.7%")).toBeVisible();
  await expect(page.getByText("2")).toBeVisible();
  await expect(page.getByText("1260")).toBeVisible();

  const canvasCount = await page.locator("canvas").count();
  expect(canvasCount).toBeGreaterThanOrEqual(4);

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_layout_websocket_disconnect_then_reconnect");
  await recorder.save(testInfo);
});
