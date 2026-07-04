/**
 * Mock data definitions for the IoT Dashboard application.
 * Used by mock-server.js to return deterministic test data.
 */

export const mockMetrics = {
  totalDevices: 200,
  activeDevices: 182,
  successRate: 96.5,
  criticalFailures: 4,
  warnings: 12,
  ingestionRate: 1150,
  lastUpdated: new Date().toISOString(),
};

function generateSparklinePoints(count, baseValue, variance) {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(now - (count - i) * 3600000).toISOString(),
    value: baseValue + (Math.sin(i / 3) * variance),
  }));
}

export const mockSparkline = {
  activeDevices: generateSparklinePoints(25, 180, 10),
  successRate: generateSparklinePoints(25, 96, 2),
  criticalFailures: generateSparklinePoints(25, 4, 2),
  ingestionRate: generateSparklinePoints(25, 1150, 200),
};

export const mockTimeseries = {
  labels: Array.from({ length: 24 }, (_, i) => {
    const d = new Date(Date.now() - (23 - i) * 3600000);
    return d.toISOString();
  }),
  datasets: [
    {
      name: "Active Devices",
      data: Array.from({ length: 24 }, (_, i) => 170 + Math.round(Math.sin(i / 4) * 15)),
    },
    {
      name: "Critical Failures",
      data: Array.from({ length: 24 }, (_, i) => Math.max(0, 4 + Math.round(Math.sin(i / 3) * 3))),
    },
  ],
};

export const mockMessages = {
  labels: Array.from({ length: 24 }, (_, i) => {
    const d = new Date(Date.now() - (23 - i) * 3600000);
    return d.toISOString();
  }),
  datasets: [
    {
      name: "Messages Ingested",
      data: Array.from({ length: 24 }, (_, i) => 1000 + Math.round(Math.sin(i / 3) * 300)),
    },
  ],
};

export const mockHeatmap = {
  regions: ["Floor A - Assembly", "Floor B - Welding", "Floor C - Painting", "Floor D - Packaging"],
  hours: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  data: Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 24 }, (_, h) => Math.round(50 + Math.sin((r + h) / 3) * 40))
  ),
};

export const mockScatter = {
  points: Array.from({ length: 60 }, (_, i) => ({
    x: 80 + Math.round(Math.sin(i / 5) * 18),
    y: 1000 + Math.round(Math.cos(i / 4) * 300),
    device: `device-${i + 1}`,
    region: ["Floor A - Assembly", "Floor B - Welding", "Floor C - Painting", "Floor D - Packaging"][i % 4],
    status: i % 10 === 0 ? "warning" : i % 20 === 0 ? "error" : "online",
  })),
};

export const mockHealth = {
  regions: [
    { id: "floor-a", name: "Floor A - Assembly", status: "online", deviceCount: 52, failureRate: 2.1 },
    { id: "floor-b", name: "Floor B - Welding", status: "warning", deviceCount: 48, failureRate: 5.8 },
    { id: "floor-c", name: "Floor C - Painting", status: "online", deviceCount: 56, failureRate: 1.4 },
    { id: "floor-d", name: "Floor D - Packaging", status: "online", deviceCount: 44, failureRate: 3.2 },
  ],
};

export const mockTelemetryRows = Array.from({ length: 20 }, (_, i) => ({
  id: `device-${i + 1}`,
  deviceId: `DEV-${String(i + 1).padStart(4, "0")}`,
  type: ["Vibration Sensor", "Power Meter", "Environmental Gateway", "Edge Gateway"][i % 4],
  region: ["Floor A - Assembly", "Floor B - Welding", "Floor C - Painting", "Floor D - Packaging"][i % 4],
  status: i % 10 === 0 ? "warning" : i % 15 === 0 ? "error" : "online",
  value: (80 + i * 1.5).toFixed(2),
  unit: ["rpm", "kW", "°C", "Mbps"][i % 4],
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
}));

export const mockTelemetry = {
  data: mockTelemetryRows,
  total: mockTelemetryRows.length,
  page: 1,
  pageSize: 20,
};
