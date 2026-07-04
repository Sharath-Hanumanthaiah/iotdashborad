export const API_BASE_URL = '';
export const WS_URL = 'ws://localhost:3001';

export const TIME_RANGES = [
  { label: '1H', value: 1, description: 'Last 1 Hour' },
  { label: '6H', value: 6, description: 'Last 6 Hours' },
  { label: '24H', value: 24, description: 'Last 24 Hours' },
  { label: '7D', value: 168, description: 'Last 7 Days' },
  { label: '30D', value: 720, description: 'Last 30 Days' }
];

export const DEVICE_TYPES = [
  'Vibration Sensor',
  'Power Meter',
  'Environmental Gateway',
  'Edge Gateway'
];

export const REGIONS = [
  { id: 'floor-a', name: 'Floor A - Assembly' },
  { id: 'floor-b', name: 'Floor B - Welding' },
  { id: 'floor-c', name: 'Floor C - Painting' },
  { id: 'floor-d', name: 'Floor D - Packaging' }
];

export const STATUS_CONFIG = {
  online: { label: 'Online', icon: '●', color: 'var(--success)' },
  offline: { label: 'Offline', icon: '●', color: 'var(--offline)' },
  warning: { label: 'Warning', icon: '▲', color: 'var(--warning)' },
  error: { label: 'Error', icon: '▲', color: 'var(--danger)' },
  success: { label: 'Success', icon: '●', color: 'var(--success)' }
};
