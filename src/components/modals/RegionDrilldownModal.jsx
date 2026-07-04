import { useDashboard } from '../../context/DashboardContext';
import { useFetchData } from '../../hooks/useDashboardData';
import { STATUS_CONFIG } from '../../utils/constants';
import { IoLocationOutline } from 'react-icons/io5';

export default function RegionDrilldownModal() {
  const { activeModal, modalData, closeModal, openModal } = useDashboard();
  
  const { data, loading } = useFetchData(
    activeModal === 'region' && modalData?.regionId ? `/api/regions/${modalData.regionId}/devices` : null,
    {},
    [activeModal, modalData]
  );

  if (activeModal !== 'region' || !modalData) return null;

  const devices = data?.data || [];
  
  const stats = devices.reduce((acc, dev) => {
    acc.total++;
    acc[dev.status] = (acc[dev.status] || 0) + 1;
    if (!acc.byType[dev.type]) acc.byType[dev.type] = 0;
    acc.byType[dev.type]++;
    return acc;
  }, { total: 0, online: 0, warning: 0, error: 0, offline: 0, byType: {} });

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <IoLocationOutline size={24} color="var(--accent)" />
            <h2>{modalData.regionName}</h2>
          </div>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ padding: 'var(--space-10)', textAlign: 'center' }}>Loading region data...</div>
          ) : (
            <>
              <div style={styles.statsGrid}>
                <div className="glass-card" style={styles.statCard}>
                  <div style={styles.statLabel}>Total Devices</div>
                  <div style={styles.statValue}>{stats.total}</div>
                </div>
                <div className="glass-card" style={styles.statCard}>
                  <div style={styles.statLabel}>Online</div>
                  <div style={{ ...styles.statValue, color: 'var(--success)' }}>{stats.online}</div>
                </div>
                <div className="glass-card" style={styles.statCard}>
                  <div style={styles.statLabel}>Warnings</div>
                  <div style={{ ...styles.statValue, color: 'var(--warning)' }}>{stats.warning}</div>
                </div>
                <div className="glass-card" style={styles.statCard}>
                  <div style={styles.statLabel}>Critical</div>
                  <div style={{ ...styles.statValue, color: 'var(--danger)' }}>{stats.error}</div>
                </div>
              </div>

              <h3 style={styles.listHeader}>Device Fleet</h3>
              <div style={styles.listContainer}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Type</th>
                      <th>Model</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map(dev => {
                      const conf = STATUS_CONFIG[dev.status] || STATUS_CONFIG.offline;
                      return (
                        <tr key={dev.id} onClick={() => openModal('device', { deviceId: dev.id })}>
                          <td>
                            <div style={{ fontWeight: 500 }}>{dev.name}</div>
                            <div className="font-mono text-muted text-xs">{dev.id}</div>
                          </td>
                          <td>{dev.type}</td>
                          <td>{dev.model}</td>
                          <td>
                            <span className={`status-badge ${dev.status}`}>
                              <span style={{ color: conf.color }}>{conf.icon}</span> {conf.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--space-4)',
    marginBottom: 'var(--space-6)'
  },
  statCard: {
    padding: 'var(--space-4)',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: 'var(--space-2)'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1
  },
  listHeader: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: 'var(--space-3)',
    borderBottom: '1px solid var(--border-primary)',
    paddingBottom: 'var(--space-2)'
  },
  listContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-md)'
  }
};
