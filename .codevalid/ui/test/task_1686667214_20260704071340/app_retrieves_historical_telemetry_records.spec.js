import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Retrieve historical telemetry data using REST endpoints", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_retrieves_historical_telemetry_records",
    testTitle: "Retrieve historical telemetry data using REST endpoints",
  });

  try {
    await recorder.step("Launch the application");
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Telemetry Logs" })).toBeVisible();

    await recorder.step("Request historical telemetry records with device and time range filters");
    const result = await page.evaluate(async () => {
      const now = Date.now();
      const params = new URLSearchParams({
        deviceId: "device-001",
        startTime: new Date(now - 60 * 60 * 1000).toISOString(),
        endTime: new Date(now).toISOString(),
      });

      const response = await fetch(`/api/telemetry/history?${params.toString()}`);
      const body = await response.json();
      const records = Array.isArray(body)
        ? body
        : body.records || body.data || body.items || [];

      return {
        ok: response.ok,
        status: response.status,
        records,
      };
    });

    await recorder.step("Verify the response returns matching historical telemetry data");
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(Array.isArray(result.records)).toBe(true);
    expect(result.records.length).toBeGreaterThan(0);

    const firstRecord = result.records[0];
    expect(firstRecord).toBeTruthy();
    expect(firstRecord.deviceId || firstRecord.device_id).toBeTruthy();
    expect(firstRecord.timestamp || firstRecord.recordedAt).toBeTruthy();

    console.log("CODEVALID_TEST_ASSERTION_OK:app_retrieves_historical_telemetry_records");
  } finally {
    await recorder.save(testInfo);
  }
});
