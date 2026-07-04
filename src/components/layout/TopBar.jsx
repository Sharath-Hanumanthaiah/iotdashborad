import { useDashboard } from '../../context/DashboardContext';
import { TIME_RANGES } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

export default function TopBar() {
  const { timeRange, setTimeRange, wsConnected, metrics } = useDashboard();

  return (
    <header style={styles.topbar}>
      <div style={styles.left}>
        <h1 style={styles.title}>IoT Command Center</h1>
        <span style={styles.subtitle}>Smart Factory Monitoring</span>
      </div>
      <div style={styles.center}>
        <div style={styles.timeRangeGroup}>
          {TIME_RANGES.map(range => (
            <button
              key={range.value}
              className={`btn btn-ghost ${timeRange === range.value ? 'active' : ''}`}
              onClick={() => setTimeRange(range.value)}
              title={range.description}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.right}>
        <div className="live-indicator">
          <div className="dot" style={!wsConnected ? { background: 'var(--danger)', animation: 'none' } : {}} />
          <span style={!wsConnected ? { color: 'var(--danger)' } : {}}>
            {wsConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
        <span style={styles.lastUpdated}>
          {metrics?.lastUpdated ? formatDateTime(metrics.lastUpdated) : '—'}
        </span>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-4) var(--space-7)',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-primary)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  left: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-4)',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--text-primary), var(--accent))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 400
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
  timeRangeGroup: {
    display: 'flex',
    gap: 'var(--space-1)',
    background: 'var(--bg-primary)',
    padding: '3px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-primary)'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-5)',
  },
  lastUpdated: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)'
  }
};
