import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";
import { setupDashboardMocks, emitDashboardTick } from "../../helpers/mock-api.js";

test("Global Time Range Filter Updates KPI Values and Sparklines Consistently", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_layout_time_range_filter_synchronizes_kpi_data", testInfo);

  await recorder.step("Set up dashboard mocks with live connection");
  await setupDashboardMocks(page, { connected: true });

  await recorder.step("Navigate to dashboard and confirm initial KPI data");
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await expect(page.getByText("Active Devices", { exact: true })).toBeVisible();
  // formatNumber(188) = "188"; initial metrics from WS shim on connect
  await expect(page.getByText("188")).toBeVisible();

  await recorder.step("Capture initial sparkline canvas dimensions");
  const initialCanvasInfo = await page.locator("canvas").evaluateAll((nodes) =>
    nodes.slice(0, 4).map((node) => ({ width: node.width, height: node.height }))
  );
  expect(initialCanvasInfo.length).toBeGreaterThanOrEqual(4);

  await recorder.step("Select an alternate global time range button");
  const timeRangeButtons = page.locator(".btn.btn-ghost");
  // Wait for time range buttons to render
  await expect(timeRangeButtons.first()).toBeVisible();
  const count = await timeRangeButtons.count();
  expect(count).toBeGreaterThan(1);
  const activeBtn = page.locator(".btn.btn-ghost.active");
  await expect(activeBtn).toBeVisible();
  const currentActive = await activeBtn.textContent();
  for (let i = 0; i < count; i += 1) {
    const candidate = timeRangeButtons.nth(i);
    const label = (await candidate.textContent())?.trim();
    if (label && label !== currentActive?.trim()) {
      await candidate.click();
      break;
    }
  }
  await expect(page.locator(".btn.btn-ghost.active")).not.toHaveText(currentActive || "");

  await recorder.step("Emit a synchronized KPI update after time range change");
  await emitDashboardTick(page, {
    activeDevices: 182,
    successRate: 94.8,
    criticalFailures: 5,
    ingestionRate: 1180,
    sparkShift: 2,
  });
  await page.waitForTimeout(300);

  await recorder.step("Verify KPI values update consistently across all cards");
  await expect(page.getByText("182")).toBeVisible();
  await expect(page.getByText("94.8%")).toBeVisible();
  await expect(page.getByText("5")).toBeVisible();
  // formatNumber(1180) → "1.2K"
  await expect(page.getByText("1.2K")).toBeVisible();

  await recorder.step("Verify trend indicators and sparklines remain rendered after update");
  const canvasCountAfter = await page.locator("canvas").count();
  expect(canvasCountAfter).toBeGreaterThanOrEqual(4);
  const updatedCanvasInfo = await page.locator("canvas").evaluateAll((nodes) =>
    nodes.slice(0, 4).map((node) => ({ width: node.width, height: node.height }))
  );
  for (const size of updatedCanvasInfo) {
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  }

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_layout_time_range_filter_synchronizes_kpi_data");
  await recorder.save(testInfo);
});
