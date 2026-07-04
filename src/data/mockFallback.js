// Fallback data for when the mock server is unavailable
export const fallbackMetrics = {
  totalDevices: 200,
  activeDevices: 182,
  successRate: 96.5,
  criticalFailures: 4,
  warnings: 12,
  ingestionRate: 1150,
  lastUpdated: new Date().toISOString()
};

export const fallbackSparkline = {
  activeDevices: Array.from({ length: 25 }, (_, i) => ({
    timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
    value: 170 + Math.floor(Math.random() * 25)
  })),
  successRate: Array.from({ length: 25 }, (_, i) => ({
    timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
    value: 94 + Math.random() * 5
  })),
  criticalFailures: Array.from({ length: 25 }, (_, i) => ({
    timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
    value: Math.floor(Math.random() * 8)
  })),
  ingestionRate: Array.from({ length: 25 }, (_, i) => ({
    timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
    value: 800 + Math.floor(Math.random() * 600)
  }))
};
