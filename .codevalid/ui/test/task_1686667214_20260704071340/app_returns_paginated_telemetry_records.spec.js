import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Retrieve paginated telemetry records", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_returns_paginated_telemetry_records",
    testTitle: "Retrieve paginated telemetry records",
  });

  try {
    await recorder.step("Launch the application");
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Telemetry Logs" })).toBeVisible();

    await recorder.step("Request the first page of telemetry records");
    const paginationResult = await page.evaluate(async () => {
      const fetchPage = async (pageNumber) => {
        const response = await fetch(`/api/telemetry?page=${pageNumber}&limit=10`);
        const body = await response.json();
        const records = Array.isArray(body)
          ? body
          : body.records || body.data || body.items || [];
        return {
          ok: response.ok,
          status: response.status,
          records,
        };
      };

      const first = await fetchPage(1);
      const second = await fetchPage(2);

      return {
        first,
        second,
      };
    });

    await recorder.step("Verify pagination returns distinct and consistent pages");
    expect(paginationResult.first.ok).toBe(true);
    expect(paginationResult.second.ok).toBe(true);
    expect(paginationResult.first.status).toBe(200);
    expect(paginationResult.second.status).toBe(200);
    expect(paginationResult.first.records.length).toBeGreaterThan(0);
    expect(paginationResult.second.records.length).toBeGreaterThan(0);

    const firstPageIds = paginationResult.first.records.map(
      (record) => record.id || record.telemetryId || `${record.deviceId}-${record.timestamp}`
    );
    const secondPageIds = paginationResult.second.records.map(
      (record) => record.id || record.telemetryId || `${record.deviceId}-${record.timestamp}`
    );

    expect(firstPageIds).not.toEqual(secondPageIds);

    console.log("CODEVALID_TEST_ASSERTION_OK:app_returns_paginated_telemetry_records");
  } finally {
    await recorder.save(testInfo);
  }
});
