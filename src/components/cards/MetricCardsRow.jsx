import { useMemo, useCallback } from 'react';
import MetricCard from './MetricCard';
import { useDashboard } from '../../context/DashboardContext';
import { useDashboardData } from '../../hooks/useDashboardData';

export default function MetricCardsRow() {
  const { openDrawer, metrics: realtimeMetrics } = useDashboard();
  const { metrics: fetchedMetrics, sparkline } = useDashboardData();

  const metrics = realtimeMetrics || fetchedMetrics?.data;
  const sparkData = sparkline?.data;

  const handleFailuresClick = useCallback(() => {
    openDrawer('failures');
  }, [openDrawer]);

  const handleDevicesClick = useCallback(() => {
    openDrawer('devices');
  }, [openDrawer]);

  if (!metrics) {
    return (
      <div style={styles.row}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card" style={{ ...styles.skeleton, height: '160px', flex: 1 }}>
            <div className="skeleton" style={{ width: '60%', height: '12px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ width: '40%', height: '32px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '50px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.row}>
      <MetricCard
        title="Active Devices"
        value={metrics.activeDevices}
        sparklineData={sparkData?.activeDevices}
        color="#3b82f6"
        icon="📡"
        suffix={`/ ${metrics.totalDevices}`}
        onClick={handleDevicesClick}
      />
      <MetricCard
        title="Success Rate"
        value={metrics.successRate}
        format="percentage"
        sparklineData={sparkData?.successRate}
        color="#22c55e"
        icon="✓"
      />
      <MetricCard
        title="Critical Failures"
        value={metrics.criticalFailures}
        sparklineData={sparkData?.criticalFailures}
        color="#ef4444"
        icon="⚠"
        onClick={handleFailuresClick}
      />
      <MetricCard
        title="Ingestion Rate"
        value={metrics.ingestionRate}
        sparklineData={sparkData?.ingestionRate}
        color="#f59e0b"
        icon="⚡"
        suffix="msg/s"
      />
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    gap: 'var(--space-5)',
    flexWrap: 'wrap'
  },
  skeleton: {
    padding: 'var(--space-5)',
    minWidth: '200px'
  }
};
