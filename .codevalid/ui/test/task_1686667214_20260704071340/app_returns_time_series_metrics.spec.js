import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Retrieve time-series KPI metrics", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_returns_time_series_metrics",
    testTitle: "Retrieve time-series KPI metrics",
  });

  try {
    await recorder.step("Launch the application");
    await page.goto("/");

    await recorder.step("Verify KPI visualizations are rendered");
    await expect(page.getByRole("heading", { name: "Fleet Health" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Environmental Metrics" })).toBeVisible();

    await recorder.step("Request time-series metrics for a valid metric and time range");
    const metricsResult = await page.evaluate(async () => {
      const now = Date.now();
      const params = new URLSearchParams({
        metric: "messageThroughput",
        startTime: new Date(now - 60 * 60 * 1000).toISOString(),
        endTime: new Date(now).toISOString(),
      });

      const response = await fetch(`/api/metrics/timeseries?${params.toString()}`);
      const body = await response.json();
      const series = Array.isArray(body)
        ? body
        : body.series || body.data || body.points || [];

      return {
        ok: response.ok,
        status: response.status,
        series,
      };
    });

    await recorder.step("Verify a non-empty time-series metrics payload is returned");
    expect(metricsResult.ok).toBe(true);
    expect(metricsResult.status).toBe(200);
    expect(Array.isArray(metricsResult.series)).toBe(true);
    expect(metricsResult.series.length).toBeGreaterThan(0);

    const firstPoint = metricsResult.series[0];
    expect(firstPoint).toBeTruthy();
    expect(firstPoint.timestamp || firstPoint.time || firstPoint.bucket).toBeTruthy();
    expect(
      firstPoint.value ?? firstPoint.metricValue ?? firstPoint.count ?? firstPoint.average
    ).not.toBeUndefined();

    console.log("CODEVALID_TEST_ASSERTION_OK:app_returns_time_series_metrics");
  } finally {
    await recorder.save(testInfo);
  }
});
