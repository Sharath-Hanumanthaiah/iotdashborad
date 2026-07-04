import { useDashboard } from '../../context/DashboardContext';
import { formatDateTime } from '../../utils/formatters';

export default function TimestampDetailModal() {
  const { activeModal, modalData, closeModal } = useDashboard();

  if (activeModal !== 'timestamp' || !modalData) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Environmental Readings at {formatDateTime(modalData.timestamp)}</h2>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>
        <div className="modal-body">
          <div style={styles.grid}>
            <div className="glass-card" style={styles.card}>
              <div style={styles.label}>Temperature</div>
              <div style={{ ...styles.value, color: '#ef4444' }}>
                {modalData.temperature} <span style={styles.unit}>°C</span>
              </div>
              <div style={styles.status}>Status: <span style={{ color: 'var(--success)' }}>Normal</span></div>
            </div>
            
            <div className="glass-card" style={styles.card}>
              <div style={styles.label}>Humidity</div>
              <div style={{ ...styles.value, color: '#3b82f6' }}>
                {modalData.humidity} <span style={styles.unit}>%</span>
              </div>
              <div style={styles.status}>Status: <span style={{ color: 'var(--success)' }}>Normal</span></div>
            </div>
            
            <div className="glass-card" style={styles.card}>
              <div style={styles.label}>Pressure</div>
              <div style={{ ...styles.value, color: '#22c55e' }}>
                {modalData.pressure} <span style={styles.unit}>hPa</span>
              </div>
              <div style={styles.status}>Status: <span style={{ color: 'var(--success)' }}>Normal</span></div>
            </div>
          </div>
          
          <div style={styles.sectionTitle}>Affected Devices (Sample)</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Location</th>
                <th>Reading</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono">EG-0001</td>
                <td>Floor A - Assembly</td>
                <td>{modalData.temperature}°C</td>
                <td><span className="status-badge success">● Normal</span></td>
              </tr>
              <tr>
                <td className="font-mono">EG-0002</td>
                <td>Floor B - Welding</td>
                <td>{modalData.temperature + 1.2}°C</td>
                <td><span className="status-badge success">● Normal</span></td>
              </tr>
              <tr>
                <td className="font-mono">EG-0003</td>
                <td>Floor C - Painting</td>
                <td>{modalData.temperature - 0.5}°C</td>
                <td><span className="status-badge success">● Normal</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--space-5)',
    marginBottom: 'var(--space-6)'
  },
  card: {
    padding: 'var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-2)'
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  value: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1
  },
  unit: {
    fontSize: '1.2rem',
    fontWeight: 600,
    opacity: 0.7
  },
  status: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: 'var(--space-2)'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: 'var(--space-4)',
    borderBottom: '1px solid var(--border-primary)',
    paddingBottom: 'var(--space-2)'
  }
};
