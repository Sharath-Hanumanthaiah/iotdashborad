import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../helpers/execution-recorder.js";
import { setupDashboardMocks, emitDashboardTick, getDashboardState } from "../helpers/mock-api.js";

test("Dashboard Loads Correctly and Streams Real-Time KPI Updates via WebSocket", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_content_initial_load_and_live_updates", "Dashboard Loads Correctly and Streams Real-Time KPI Updates via WebSocket");

  await recorder.step("Open the application at the root URL");
  await setupDashboardMocks(page, { connected: true, autoStart: false });
  await page.goto("/");

  await recorder.step("Confirm presence of global top action bar with connection status LIVE");
  await expect(page.getByRole("heading", { name: "IoT Command Center" })).toBeVisible();
  await expect(page.getByText("Smart Factory Monitoring")).toBeVisible();
  await expect(page.getByText("LIVE")).toBeVisible();

  await recorder.step("Verify four KPI cards are visible with labeled metrics");
  await expect(page.getByText("Active Devices")).toBeVisible();
  await expect(page.getByText("Success Rate")).toBeVisible();
  await expect(page.getByText("Critical Failures")).toBeVisible();
  await expect(page.getByText("Ingestion Rate")).toBeVisible();

  const activeDevicesValue = page.locator("text=Active Devices").locator("..").locator("text=/\\d+/ ").first();
  const successRateValue = page.locator("text=Success Rate").locator("..").locator("text=/%/").first();

  await recorder.step("Confirm each KPI card contains a Canvas-rendered micro-sparkline");
  await expect(page.locator("canvas")).toHaveCount(4);

  await recorder.step("Verify each KPI includes a percentage trend indicator");
  await expect(page.locator("text=/[↑↓]/")).toHaveCount(4);

  await recorder.step("Emit five 2-second telemetry updates and verify KPI values evolve plausibly");
  const snapshots = [];
  for (let i = 0; i < 5; i += 1) {
    await emitDashboardTick(page, {
      activeDevices: 188 + i,
      successRate: 94.2 + i * 0.5,
      criticalFailures: 2 + (i % 3),
      ingestionRate: 1210 + i * 25,
      totalDevices: 200,
      sparkShift: i + 1
    });
    await page.waitForTimeout(200);
    snapshots.push(await getDashboardState(page));
  }

  expect(snapshots).toHaveLength(5);
  for (const snap of snapshots) {
    expect(snap.connected).toBe(true);
    expect(snap.metrics.activeDevices).toBeGreaterThanOrEqual(180);
    expect(snap.metrics.activeDevices).toBeLessThanOrEqual(200);
    expect(snap.metrics.successRate).toBeGreaterThanOrEqual(92);
    expect(snap.metrics.successRate).toBeLessThanOrEqual(99);
  }
  expect(new Set(snapshots.map((s) => s.metrics.activeDevices)).size).toBeGreaterThan(1);
  expect(new Set(snapshots.map((s) => s.metrics.ingestionRate)).size).toBeGreaterThan(1);
  await expect(page.getByText("LIVE")).toBeVisible();

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_content_initial_load_and_live_updates");
  await recorder.save(testInfo);
});
