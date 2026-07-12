import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../helpers/execution-recorder.js";

test("Receive KPI metrics and alert events over WebSocket", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder({
    testId: "app_streams_kpi_metrics_and_alert_events",
    testTitle: "Receive KPI metrics and alert events over WebSocket",
  });

  try {
    await recorder.step("Launch the application");
    await page.goto("/");

    await recorder.step("Confirm KPI and alerts dashboard areas are available");
    await expect(page.getByRole("heading", { name: "Fleet Health" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Message Throughput" })).toBeVisible();

    await recorder.step("Open WebSocket connection and collect KPI and alert style events");
    const wsObservation = await page.evaluate(() => {
      return new Promise((resolve) => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.hostname}:3001`;
        const socket = new WebSocket(wsUrl);
        const kpiMessages = [];
        const alertMessages = [];
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
            kpiCount: kpiMessages.length,
            alertCount: alertMessages.length,
            kpiSample: kpiMessages[0] || null,
            alertSample: alertMessages[0] || null,
            ...extra,
          });
        };

        const timeoutId = setTimeout(() => finalize({ timeout: true }), 8000);

        socket.addEventListener("open", () => {
          opened = true;
        });

        socket.addEventListener("message", (event) => {
          try {
            const payload = JSON.parse(event.data);
            const kind = String(payload.type || payload.event || payload.channel || "").toLowerCase();
            const hasKpiShape = payload.kpi !== undefined || payload.metricName || payload.metricType || payload.series;
            const hasAlertShape = payload.alert !== undefined || payload.severity || payload.message || kind.includes("alert");

            if (kind.includes("kpi") || kind.includes("metric") || hasKpiShape) {
              kpiMessages.push(payload);
            }
            if (kind.includes("alert") || hasAlertShape) {
              alertMessages.push(payload);
            }

            if (kpiMessages.length > 0 && alertMessages.length > 0) {
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

    await recorder.step("Verify KPI metrics and alert events were both observed");
    expect(wsObservation.opened).toBe(true);
    expect(wsObservation.kpiCount).toBeGreaterThan(0);
    expect(wsObservation.alertCount).toBeGreaterThan(0);

    console.log("CODEVALID_TEST_ASSERTION_OK:app_streams_kpi_metrics_and_alert_events");
  } finally {
    await recorder.save(testInfo);
  }
});
