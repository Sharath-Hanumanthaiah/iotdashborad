import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Initialize virtual IoT fleet simulation", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_initializes_iot_fleet_simulation",
    testTitle: "Initialize virtual IoT fleet simulation",
  });

  try {
    await recorder.step("Launch the application dashboard");
    await page.goto("/");

    await recorder.step("Wait for the IoT command center shell to render");
    await expect(page.getByRole("heading", { name: "IoT Command Center" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fleet Health" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Telemetry Logs" })).toBeVisible();

    await recorder.step("Allow telemetry simulation services to initialize and collect initial device data");
    await page.waitForTimeout(3000);

    await recorder.step("Query dashboard APIs for fleet inventory details");
    const fleetSummary = await page.evaluate(async () => {
      const metricsResponse = await fetch("/api/metrics");
      const metrics = await metricsResponse.json();

      const telemetryResponse = await fetch("/api/telemetry?page=1&limit=400");
      const telemetryPayload = await telemetryResponse.json();
      const rows = Array.isArray(telemetryPayload)
        ? telemetryPayload
        : telemetryPayload.records || telemetryPayload.data || telemetryPayload.items || [];

      const uniqueDeviceIds = new Set();
      const regions = new Set();
      const deviceTypes = new Set();

      for (const row of rows) {
        const deviceId = row.deviceId || row.device_id || row.id;
        const region = row.region || row.factoryRegion || row.site || row.location;
        const deviceType = row.deviceType || row.type || row.category;

        if (deviceId) uniqueDeviceIds.add(deviceId);
        if (region) regions.add(region);
        if (deviceType) deviceTypes.add(deviceType);
      }

      return {
        metrics,
        telemetryCount: rows.length,
        uniqueDeviceCount: uniqueDeviceIds.size,
        regions: Array.from(regions),
        deviceTypes: Array.from(deviceTypes),
      };
    });

    await recorder.step("Verify the fleet simulation exposes 200 devices across multiple regions and types");
    const reportedDeviceCount =
      fleetSummary.metrics?.deviceCount ??
      fleetSummary.metrics?.activeDevices ??
      fleetSummary.metrics?.totalDevices ??
      fleetSummary.uniqueDeviceCount;

    expect(reportedDeviceCount).toBe(200);
    expect(fleetSummary.regions.length).toBeGreaterThan(1);
    expect(fleetSummary.deviceTypes.length).toBeGreaterThan(1);

    console.log("CODEVALID_TEST_ASSERTION_OK:app_initializes_iot_fleet_simulation");
  } finally {
    await recorder.save(testInfo);
  }
});
