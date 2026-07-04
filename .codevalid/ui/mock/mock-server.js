/**
 * Lightweight HTTP + WebSocket mock server for the IoT Dashboard.
 *
 * HTTP routes mirror the Vite dev-server proxy targets:
 *   GET /api/metrics
 *   GET /api/metrics/sparkline
 *   GET /api/charts/timeseries
 *   GET /api/charts/messages
 *   GET /api/charts/heatmap
 *   GET /api/charts/scatter
 *   GET /api/charts/health
 *   GET /api/telemetry
 *
 * WebSocket server listens on ws://localhost:3001 and pushes one
 * "metrics" frame per second so the app's useWebSocket hook stays happy.
 *
 * Usage (from repo root):
 *   node .codevalid/ui/mock/mock-server.js
 *
 * The server binds to port 3001 by default; override with PORT env var.
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
  mockTelemetryRows,
} from "./mock-data.js";

const PORT = Number(process.env.MOCK_PORT || process.env.PORT || 3001);

// ── HTTP routes ──────────────────────────────────────────────────────────────

const ROUTES = {
  "/api/metrics": () => mockMetrics,
  "/api/metrics/sparkline": () => mockSparkline,
  "/api/charts/timeseries": () => mockTimeseries,
  "/api/charts/messages": () => mockMessages,
  "/api/charts/heatmap": () => mockHeatmap,
  "/api/charts/scatter": () => mockScatter,
  "/api/charts/health": () => mockHealth,
  "/api/telemetry": () => ({ data: mockTelemetryRows, total: mockTelemetryRows.length }),
};

function respond(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // Strip query string for route matching
  const pathname = req.url?.split("?")[0] ?? "/";
  const handler = ROUTES[pathname];

  if (handler) {
    try {
      respond(res, 200, handler());
    } catch (err) {
      respond(res, 500, { error: err.message });
    }
  } else {
    respond(res, 404, { error: `Not found: ${pathname}` });
  }
});

// ── WebSocket server ─────────────────────────────────────────────────────────

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  // Send an initial metrics push immediately
  const sendMetrics = () => {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify({ type: "metrics", data: mockMetrics }));
    }
  };

  sendMetrics();
  const interval = setInterval(sendMetrics, 2000);

  socket.on("close", () => clearInterval(interval));
  socket.on("error", () => clearInterval(interval));
});

// ── Start ────────────────────────────────────────────────────────────────────

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[mock-server] HTTP + WS listening on port ${PORT}`);
});

// Allow graceful shutdown from the Playwright web-server lifecycle
process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
