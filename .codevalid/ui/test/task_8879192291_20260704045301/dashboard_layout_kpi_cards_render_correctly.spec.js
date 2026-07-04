import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../../../ui_test/helpers/execution-recorder.js";
import { setupDashboardMocks } from "../../../../ui_test/helpers/mock-api.js";

test("KPI Cards Render with Correct Data and Sparklines on Initial Load", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_layout_kpi_cards_render_correctly", testInfo);

  await recorder.step("Set up dashboard mocks for initial KPI render");
  await setupDashboardMocks(page, { connected: true });

  await recorder.step("Navigate to dashboard");
  await page.goto("/");

  await recorder.step("Verify four KPI cards are visible");
  const cardTitles = ["Active Devices", "Success Rate", "Critical Failures", "Ingestion Rate"];
  for (const title of cardTitles) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }

  await recorder.step("Verify KPI numeric values are rendered");
  await expect(page.getByText("188")).toBeVisible();
  await expect(page.getByText("96.2%")).toBeVisible();
  await expect(page.getByText("3")).toBeVisible();
  await expect(page.getByText("1225")).toBeVisible();
  await expect(page.getByText("/ 200")).toBeVisible();
  await expect(page.getByText("msg/s")).toBeVisible();

  await recorder.step("Verify trend indicators are displayed on KPI cards");
  const trendValues = await page.locator("svg").evaluateAll((nodes) => nodes.length);
  expect(trendValues).toBeGreaterThan(0);

  await recorder.step("Verify each KPI card contains a canvas-rendered sparkline");
  const sparklineCount = await page.locator("canvas").count();
  expect(sparklineCount).toBeGreaterThanOrEqual(4);

  const canvasSizes = await page.locator("canvas").evaluateAll((nodes) =>
    nodes.slice(0, 4).map((node) => ({ width: node.width, height: node.height }))
  );
  for (const size of canvasSizes) {
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  }

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_layout_kpi_cards_render_correctly");
  await recorder.save(testInfo);
});
