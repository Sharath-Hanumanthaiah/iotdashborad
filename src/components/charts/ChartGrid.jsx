import TimeSeriesChart from './TimeSeriesChart';
import StackedBarChart from './StackedBarChart';
import HeatmapChart from './HeatmapChart';
import ScatterChart from './ScatterChart';
import GaugeDonutChart from './GaugeDonutChart';
import { useDashboardData } from '../../hooks/useDashboardData';

export default function ChartGrid() {
  const { timeseries, messages, heatmap, scatter, health } = useDashboardData();

  return (
    <div style={styles.grid}>
      <div className="chart-card" style={styles.wide}>
        <div className="chart-card-header">
          <div>
            <h4>Environmental Metrics</h4>
            <span className="chart-subtitle">Temperature • Humidity • Pressure</span>
          </div>
        </div>
        <div className="chart-card-body" style={{ height: '260px' }}>
          <TimeSeriesChart data={timeseries?.data} />
        </div>
      </div>

      <div className="chart-card" style={styles.medium}>
        <div className="chart-card-header">
          <div>
            <h4>Message Throughput</h4>
            <span className="chart-subtitle">Success vs. Failures per Hour</span>
          </div>
        </div>
        <div className="chart-card-body" style={{ height: '260px' }}>
          <StackedBarChart data={messages?.data} />
        </div>
      </div>

      <div className="chart-card" style={styles.medium}>
        <div className="chart-card-header">
          <div>
            <h4>Fleet Health</h4>
            <span className="chart-subtitle">Device Status Distribution</span>
          </div>
        </div>
        <div className="chart-card-body" style={{ height: '260px' }}>
          <GaugeDonutChart data={health?.data} />
        </div>
      </div>

      <div className="chart-card" style={styles.medium}>
        <div className="chart-card-header">
          <div>
            <h4>Device Utilization Heatmap</h4>
            <span className="chart-subtitle">Activity by Region & Hour</span>
          </div>
        </div>
        <div className="chart-card-body" style={{ height: '260px' }}>
          <HeatmapChart data={heatmap?.data} />
        </div>
      </div>

      <div className="chart-card" style={styles.medium}>
        <div className="chart-card-header">
          <div>
            <h4>Battery vs. Signal Strength</h4>
            <span className="chart-subtitle">Device Correlation Analysis</span>
          </div>
        </div>
        <div className="chart-card-body" style={{ height: '260px' }}>
          <ScatterChart data={scatter?.data} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--space-5)'
  },
  wide: {
    gridColumn: 'span 2'
  },
  medium: {
    gridColumn: 'span 1'
  }
};
