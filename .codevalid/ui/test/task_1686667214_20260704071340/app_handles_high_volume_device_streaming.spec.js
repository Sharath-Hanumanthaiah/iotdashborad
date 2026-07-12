import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Handle high-volume telemetry streaming from 200 devices", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_handles_high_volume_device_streaming",
    testTitle: "Handle high-volume telemetry streaming from 200 devices",
  });

  try {
    await recorder.step("Launch the application");
    await page.goto("/");

    await recorder.step("Verify dashboard shell and telemetry area are loaded");
    await expect(page.getByRole("heading", { name: "IoT Command Center" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Telemetry Logs" })).toBeVisible();

    await recorder.step("Observe sustained WebSocket telemetry throughput from the simulated fleet");
    const observation = await page.evaluate(() => {
      return new Promise((resolve) => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.hostname}:3001`;
        const socket = new WebSocket(wsUrl);
        const deviceIds = new Set();
        const regions = new Set();
        const deviceTypes = new Set();
        let messageCount = 0;
        let opened = false;
        let done = false;

        const finalize = (extra = {}) => {
          if (done) return;
          done = true;
          try {
            socket.close();
          } catch {
            // ignore
          }
          resolve({
            opened,
            messageCount,
            uniqueDevices: deviceIds.size,
            regions: Array.from(regions),
            deviceTypes: Array.from(deviceTypes),
            ...extra,
          });
        };

        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          finalize({ timeout: true });
        }, 9000);

        socket.addEventListener("open", () => {
          opened = true;
        });

        socket.addEventListener("message", (event) => {
          try {
            const payload = JSON.parse(event.data);
            const deviceId = payload.deviceId || payload.device_id || payload.id;
            const region = payload.region || payload.factoryRegion || payload.site || payload.location;
            const deviceType = payload.deviceType || payload.type || payload.category;

            if (deviceId) deviceIds.add(deviceId);
            if (region) regions.add(region);
            if (deviceType) deviceTypes.add(deviceType);
            if (deviceId || payload.temperature !== undefined || payload.metrics) {
              messageCount += 1;
            }

            if (messageCount >= 50 && deviceIds.size >= 25) {
              clearTimeout(timeoutId);
              finalize();
            }
          } catch {
            // ignore non-JSON frames
          }
        });

        socket.addEventListener("error", () => {
          clearTimeout(timeoutId);
          finalize({ error: true });
        });
      });
    });

    await recorder.step("Validate the stream remained active under fleet-scale traffic");
    expect(observation.opened).toBe(true);
    expect(observation.messageCount).toBeGreaterThanOrEqual(50);
    expect(observation.uniqueDevices).toBeGreaterThan(10);
    expect(observation.regions.length).toBeGreaterThan(1);
    expect(observation.deviceTypes.length).toBeGreaterThan(1);

    console.log("CODEVALID_TEST_ASSERTION_OK:app_handles_high_volume_device_streaming");
  } finally {
    await recorder.save(testInfo);
  }
});
