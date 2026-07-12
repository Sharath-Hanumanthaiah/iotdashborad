import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Receive live telemetry stream over WebSocket", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_streams_live_telemetry_over_websocket",
    testTitle: "Receive live telemetry stream over WebSocket",
  });

  try {
    await recorder.step("Launch the application");
    await page.goto("/");

    await recorder.step("Verify dashboard content is visible");
    await expect(page.getByRole("heading", { name: "IoT Command Center" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Telemetry Logs" })).toBeVisible();

    await recorder.step("Establish a WebSocket connection and observe live telemetry events");
    const wsObservation = await page.evaluate(() => {
      return new Promise((resolve) => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.hostname}:3001`;
        const socket = new WebSocket(wsUrl);
        const telemetryMessages = [];
        let opened = false;
        let closed = false;

        const finalize = (extra = {}) => {
          if (closed) return;
          closed = true;
          try {
            socket.close();
          } catch {
            // ignore
          }
          resolve({
            opened,
            telemetryCount: telemetryMessages.length,
            sample: telemetryMessages.slice(0, 3),
            ...extra,
          });
        };

        const timeoutId = setTimeout(() => finalize({ timeout: true }), 7000);

        socket.addEventListener("open", () => {
          opened = true;
        });

        socket.addEventListener("message", (event) => {
          try {
            const payload = JSON.parse(event.data);
            const category = payload.type || payload.event || payload.channel;
            if (
              category === "telemetry" ||
              payload.deviceId ||
              payload.temperature !== undefined ||
              payload.metrics
            ) {
              telemetryMessages.push(payload);
            }
            if (telemetryMessages.length >= 5) {
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

    await recorder.step("Verify the WebSocket remained active and delivered telemetry payloads");
    expect(wsObservation.opened).toBe(true);
    expect(wsObservation.telemetryCount).toBeGreaterThan(0);

    await recorder.step("Observe telemetry continues streaming in the UI");
    await page.waitForTimeout(2500);
    await expect(page.getByRole("heading", { name: "Telemetry Logs" })).toBeVisible();

    console.log("CODEVALID_TEST_ASSERTION_OK:app_streams_live_telemetry_over_websocket");
  } finally {
    await recorder.save(testInfo);
  }
});
