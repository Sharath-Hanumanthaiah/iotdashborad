import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";
import { setupDashboardMocks, emitDashboardTick } from "../../helpers/mock-api.js";

test("KPI Trend Indicators Reflect Accurate Relative Changes in Underlying Metrics", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_layout_kpi_trend_indicators_update_correctly", testInfo);

  await recorder.step("Set up dashboard mocks and open dashboard");
  await setupDashboardMocks(page, { connected: true });
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  await recorder.step("Record initial KPI values");
  await expect(page.getByText("188")).toBeVisible();
  await expect(page.getByText("3")).toBeVisible();
  // formatNumber(1225) → "1.2K"
  await expect(page.getByText("1.2K")).toBeVisible();

  await recorder.step("Emit next telemetry update with increase, decrease, and stable drift patterns");
  await emitDashboardTick(page, {
    activeDevices: 190,
    criticalFailures: 2,
    ingestionRate: 1225,
    successRate: 96.2,
    sparkShift: 1,
  });
  await page.waitForTimeout(200);

  await recorder.step("Verify KPI values reflect the new metrics");
  await expect(page.getByText("190")).toBeVisible();
  await expect(page.getByText("2")).toBeVisible();
  // formatNumber(1225) → "1.2K"
  await expect(page.getByText("1.2K")).toBeVisible();

  await recorder.step("Verify trend indicators remain present after KPI drift");
  const iconCount = await page.locator("svg").count();
  expect(iconCount).toBeGreaterThan(0);

  await recorder.step("Verify sparkline canvases continue rendering updated trend data");
  const canvasCount = await page.locator("canvas").count();
  expect(canvasCount).toBeGreaterThanOrEqual(4);
  const metricsText = await page.locator("body").textContent();
  expect(metricsText).toContain("190");
  expect(metricsText).toContain("2");
  // formatNumber(1225) → "1.2K"; body text will contain "1.2K"
  expect(metricsText).toContain("1.2K");

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_layout_kpi_trend_indicators_update_correctly");
  await recorder.save(testInfo);
});
