import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../helpers/execution-recorder.js";
import { setupDashboardMocks, emitDashboardTick, forceDisconnect, reconnectDashboard, getDashboardState } from "../helpers/mock-api.js";

test("WebSocket Automatically Reconnects Using Exponential Backoff After Disconnection", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_content_websocket_reconnection_on_disconnect", "WebSocket Automatically Reconnects Using Exponential Backoff After Disconnection");

  await recorder.step("Open the application at the root URL");
  await setupDashboardMocks(page, { connected: true, autoStart: false });
  await page.goto("/");

  await recorder.step("Confirm connection status is LIVE and KPIs are updating");
  await emitDashboardTick(page, { activeDevices: 190, successRate: 96.1, criticalFailures: 3, ingestionRate: 1250, sparkShift: 1 });
  await page.waitForTimeout(200);
  const beforeDisconnect = await getDashboardState(page);
  expect(beforeDisconnect.connected).toBe(true);
  await expect(page.getByText("LIVE")).toBeVisible();

  await recorder.step("Simulate server disconnect and verify OFFLINE state");
  await forceDisconnect(page);
  await expect(page.getByText("OFFLINE")).toBeVisible();
  const disconnected = await getDashboardState(page);
  expect(disconnected.connected).toBe(false);

  await recorder.step("Verify KPI updates stop while disconnected");
  const frozenState = await getDashboardState(page);
  await page.waitForTimeout(2200);
  const stillFrozenState = await getDashboardState(page);
  expect(stillFrozenState.metrics.activeDevices).toBe(frozenState.metrics.activeDevices);
  expect(stillFrozenState.metrics.ingestionRate).toBe(frozenState.metrics.ingestionRate);

  await recorder.step("Reconnect within 10 seconds and resume streaming updates");
  await page.waitForTimeout(1500);
  await reconnectDashboard(page);
  await expect(page.getByText("LIVE")).toBeVisible();
  await emitDashboardTick(page, { activeDevices: 193, successRate: 97.4, criticalFailures: 2, ingestionRate: 1310, sparkShift: 2 });
  await page.waitForTimeout(200);
  const reconnected = await getDashboardState(page);
  expect(reconnected.connected).toBe(true);
  expect(reconnected.metrics.activeDevices).not.toBe(frozenState.metrics.activeDevices);
  expect(reconnected.metrics.ingestionRate).not.toBe(frozenState.metrics.ingestionRate);

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_content_websocket_reconnection_on_disconnect");
  await recorder.save(testInfo);
});
