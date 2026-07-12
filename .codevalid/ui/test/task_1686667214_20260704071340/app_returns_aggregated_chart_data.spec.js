import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Retrieve aggregated chart data for dashboards and analytics", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_returns_aggregated_chart_data",
    testTitle: "Retrieve aggregated chart data for dashboards and analytics",
  });

  try {
    await recorder.step("Launch the application dashboard");
    await page.goto("/");

    await recorder.step("Confirm chart-oriented dashboard sections are visible");
    await expect(page.getByRole("heading", { name: "Battery vs. Signal Strength" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Device Utilization Heatmap" })).toBeVisible();

    await recorder.step("Request aggregated chart data with filtering parameters");
    const aggregateResult = await page.evaluate(async () => {
      const now = Date.now();
      const params = new URLSearchParams({
        region: "north",
        deviceType: "sensor",
        startTime: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now).toISOString(),
      });

      const response = await fetch(`/api/analytics/aggregate?${params.toString()}`);
      const body = await response.json();
      const dataset = Array.isArray(body)
        ? body
        : body.data || body.series || body.records || body.items || [];

      return {
        ok: response.ok,
        status: response.status,
        dataset,
      };
    });

    await recorder.step("Verify aggregated chart-ready data is returned");
    expect(aggregateResult.ok).toBe(true);
    expect(aggregateResult.status).toBe(200);
    expect(Array.isArray(aggregateResult.dataset)).toBe(true);
    expect(aggregateResult.dataset.length).toBeGreaterThan(0);

    console.log("CODEVALID_TEST_ASSERTION_OK:app_returns_aggregated_chart_data");
  } finally {
    await recorder.save(testInfo);
  }
});
