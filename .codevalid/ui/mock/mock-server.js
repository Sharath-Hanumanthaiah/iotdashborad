/**
 * Mock HTTP + WebSocket server for the IoT Dashboard Playwright tests.
 *
 * Endpoints served (matching vite proxy config -> localhost:3001):
 *   GET /api/metrics
 *   GET /api/metrics/sparkline
 *   GET /api/charts/timeseries
 *   GET /api/charts/messages
 *   GET /api/charts/heatmap
 *   GET /api/charts/scatter
 *   GET /api/charts/health
 *   GET /api/telemetry
 *
 * WebSocket: ws://localhost:3001
 *   Emits { type: "metrics", data: mockMetrics } on connection.
 *   Emits { type: "telemetry", data: [...] } every 2 seconds.
 *
 * Usage:
 *   node .codevalid/ui/mock/mock-server.js
 *
 * Environment variables:
 *   MOCK_PORT  – HTTP + WS port (default: 3001)
 */

import http from "http";
import { WebSocketServer } from "ws";
import {
  mockMetrics,
  mockSparkline,
  mockTimeseries,
  mockMessages,
  mockHeatmap,
  mockScatter,
  mockHealth,
  mockTelemetry,
  mockTelemetryRows,
} from "./mock-data.js";

const PORT = parseInt(process.env.MOCK_PORT ?? "3001", 10);

// ── Route table ──────────────────────────────────────────────────────────────

const ROUTES = {
  "/api/metrics": { data: mockMetrics },
  "/api/metrics/sparkline": { data: mockSparkline },
  "/api/charts/timeseries": { data: mockTimeseries },
  "/api/charts/messages": { data: mockMessages },
  "/api/charts/heatmap": { data: mockHeatmap },
  "/api/charts/scatter": { data: mockScatter },
  "/api/charts/health": { data: mockHealth },
  "/api/telemetry": mockTelemetry,
};

// ── HTTP server ──────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  // CORS for Vite dev server
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Strip query string for route matching
  const pathname = req.url?.split("?")[0] ?? "/";
  const payload = ROUTES[pathname];

  if (payload !== undefined) {
    const body = JSON.stringify(payload);
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    });
    res.end(body);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found", path: pathname }));
});

// ── WebSocket server ─────────────────────────────────────────────────────────

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  // Send initial metrics snapshot
  ws.send(JSON.stringify({ type: "metrics", data: mockMetrics }));

  // Push live telemetry rows every 2 s
  const interval = setInterval(() => {
    if (ws.readyState !== ws.OPEN) {
      clearInterval(interval);
      return;
    }
    const sample = mockTelemetryRows.slice(0, 5).map((row) => ({
      ...row,
      timestamp: new Date().toISOString(),
      value: (parseFloat(row.value) + (Math.random() - 0.5) * 2).toFixed(2),
    }));
    ws.send(JSON.stringify({ type: "telemetry", data: sample }));
  }, 2000);

  ws.on("close", () => clearInterval(interval));
});

// ── Start ────────────────────────────────────────────────────────────────────

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[mock-server] HTTP + WS listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
