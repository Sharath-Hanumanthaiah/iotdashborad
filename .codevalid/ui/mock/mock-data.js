/**
 * Mock data for the IoT Dashboard API endpoints.
 * Used by mock-server.js to return deterministic test fixtures.
 *
 * Shapes are aligned with what each React chart component expects:
 *   - /api/metrics          → flat object (MetricCardsRow)
 *   - /api/metrics/sparkline → { key: [{value},...] } (MetricCard sparkline)
 *   - /api/charts/timeseries → [{timestamp, temperature, humidity, pressure}] (TimeSeriesChart)
 *   - /api/charts/messages   → [{hourLabel, success, failed}] (StackedBarChart)
 *   - /api/charts/heatmap    → {hours[], regions[], data[][], min, max} (HeatmapChart)
 *   - /api/charts/scatter    → [{type, battery, rssi, status, deviceName}] (ScatterChart)
 *   - /api/charts/health     → {healthPercentage, segments[{name,value,color}]} (GaugeDonutChart)
 *   - /api/telemetry         → [{id, deviceId, type, region, status, timestamp, value}]
 */

export const mockMetrics = {
  activeDevices: 142,
  totalDevices: 160,
  successRate: 97.5,
  criticalFailures: 3,
  ingestionRate: 284,
};

// MetricCard.sparklineOption expects sparklineData.map(d => d.value)
export const mockSparkline = {
  activeDevices:    [130, 133, 138, 140, 141, 142, 142].map(v => ({ value: v })),
  successRate:      [96.1, 96.8, 97.0, 97.2, 97.3, 97.4, 97.5].map(v => ({ value: v })),
  criticalFailures: [5, 5, 4, 4, 3, 3, 3].map(v => ({ value: v })),
  ingestionRate:    [270, 275, 278, 280, 282, 283, 284].map(v => ({ value: v })),
};

// TimeSeriesChart expects: [{timestamp, temperature, humidity, pressure}]
export const mockTimeseries = Array.from({ length: 24 }, (_, i) => ({
  timestamp:   new Date(Date.now() - (23 - i) * 3600_000).toISOString(),
  temperature: Math.round((20 + Math.sin(i / 3) * 5) * 10) / 10,
  humidity:    Math.round((55 + Math.cos(i / 4) * 10) * 10) / 10,
  pressure:    Math.round((1013 + Math.sin(i / 6) * 3) * 10) / 10,
}));

// StackedBarChart expects: [{hourLabel, success, failed}]
export const mockMessages = Array.from({ length: 24 }, (_, i) => {
  const total   = Math.round(500 + Math.sin(i / 3) * 50);
  const failed  = Math.round(total * 0.02);
  const hour    = new Date(Date.now() - (23 - i) * 3600_000);
  return {
    hourLabel: hour.getHours().toString().padStart(2, '0') + ':00',
    success:   total - failed,
    failed,
  };
});

// HeatmapChart expects: { hours[], regions[], data: [[hourIdx, regionIdx, value]], min, max }
const _heatRegions = ['Assembly', 'Welding', 'Painting', 'Packaging'];
const _heatHours   = Array.from({ length: 12 }, (_, h) => `${(8 + h).toString().padStart(2, '0')}:00`);
const _heatRaw     = _heatRegions.flatMap((_, ri) =>
  _heatHours.map((_, hi) => [hi, ri, Math.round(60 + Math.random() * 35)])
);
export const mockHeatmap = {
  hours:   _heatHours,
  regions: _heatRegions,
  data:    _heatRaw,
  min:     60,
  max:     95,
};

// ScatterChart expects: [{type, battery, rssi, status, deviceName}]
const _deviceTypes   = ['Vibration Sensor', 'Power Meter', 'Environmental Gateway', 'Edge Gateway'];
const _deviceStatuses = ['online', 'online', 'warning', 'error'];
export const mockScatter = Array.from({ length: 40 }, (_, i) => ({
  deviceName: `Device-${String(i + 1).padStart(3, '0')}`,
  deviceId:   `DEV-${String(i + 1).padStart(3, '0')}`,
  type:       _deviceTypes[i % 4],
  battery:    Math.round(20 + Math.random() * 80),
  rssi:       Math.round(-90 + Math.random() * 60),
  status:     _deviceStatuses[i % 4],
}));

// GaugeDonutChart expects: { healthPercentage, segments: [{name, value, color}] }
export const mockHealth = {
  healthPercentage: 87,
  segments: [
    { name: 'Online',  value: 112, color: '#22c55e' },
    { name: 'Warning', value: 22,  color: '#f59e0b' },
    { name: 'Error',   value: 8,   color: '#ef4444' },
    { name: 'Offline', value: 18,  color: '#64748b' },
  ],
};

export const mockTelemetryRows = Array.from({ length: 20 }, (_, i) => ({
  id:        `EVT-${String(i + 1).padStart(4, '0')}`,
  deviceId:  `DEV-${String((i % 10) + 1).padStart(3, '0')}`,
  type:      _deviceTypes[i % 4],
  region:    ['floor-a', 'floor-b', 'floor-c', 'floor-d'][i % 4],
  status:    ['online', 'warning', 'error', 'offline'][i % 4],
  timestamp: new Date(Date.now() - i * 60_000).toISOString(),
  value:     Math.round(100 + (i * 37) % 900) / 10,
}));
