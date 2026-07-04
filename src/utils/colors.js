export const statusColors = {
  online: '#22c55e',
  offline: '#64748b',
  warning: '#f59e0b',
  error: '#ef4444',
  success: '#22c55e',
  critical: '#ef4444',
  healthy: '#22c55e'
};

export const chartPalette = [
  '#3b82f6',  // Blue
  '#f59e0b',  // Amber
  '#22c55e',  // Green
  '#ef4444',  // Red
  '#8b5cf6',  // Purple
  '#06b6d4',  // Cyan
  '#f97316',  // Orange
  '#ec4899',  // Pink
];

export const heatmapGradient = [
  { offset: 0, color: '#0f172a' },
  { offset: 0.2, color: '#1e3a5f' },
  { offset: 0.4, color: '#2563eb' },
  { offset: 0.6, color: '#f59e0b' },
  { offset: 0.8, color: '#f97316' },
  { offset: 1, color: '#ef4444' }
];

export const getStatusColor = (status) => statusColors[status] || '#64748b';

export const getDeviceTypeColor = (type) => {
  const map = {
    'Vibration Sensor': '#8b5cf6',
    'Power Meter': '#f59e0b',
    'Environmental Gateway': '#22c55e',
    'Edge Gateway': '#3b82f6'
  };
  return map[type] || '#64748b';
};
