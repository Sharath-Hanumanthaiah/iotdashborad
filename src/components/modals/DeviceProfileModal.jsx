import { useDashboard } from '../../context/DashboardContext';
import { useFetchData } from '../../hooks/useDashboardData';
import { formatRelativeTime } from '../../utils/formatters';
import { STATUS_CONFIG } from '../../utils/constants';
import { IoHardwareChipOutline, IoWifiOutline, IoBatteryHalfOutline, IoTimeOutline, IoLocationOutline, IoInformationCircleOutline } from 'react-icons/io5';

export default function DeviceProfileModal() {
  const { activeModal, modalData, closeModal } = useDashboard();
  
  // Only fetch profile if this modal is active and we have a device id
  const { data, loading } = useFetchData(
    activeModal === 'device' && modalData?.deviceId ? `/api/devices/${modalData.deviceId}/profile` : null,
    {},
    [activeModal, modalData]
  );

  if (activeModal !== 'device' || !modalData) return null;

  const device = data || modalData;
  const statusConf = STATUS_CONFIG[device.status] || STATUS_CONFIG.offline;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={styles.iconBox}>
              <IoHardwareChipOutline size={24} />
            </div>
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {device.name}
                <span className={`status-badge ${device.status}`}>
                  <span style={{ color: statusConf.color }}>{statusConf.icon}</span> {statusConf.label}
                </span>
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }} className="font-mono">
                {device.deviceId || device.id} • {device.type}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="live-indicator">Loading Profile...</div>
            </div>
          ) : (
            <div style={styles.grid}>
              <div style={styles.sidebar}>
                <h3 style={styles.sectionHeader}>Hardware Specs</h3>
                <div style={styles.specsList}>
                  <div style={styles.specItem}>
                    <IoInformationCircleOutline className="text-muted" />
                    <span>Model:</span>
                    <strong style={{ marginLeft: 'auto' }}>{device.model || 'Unknown'}</strong>
                  </div>
                  <div style={styles.specItem}>
                    <IoHardwareChipOutline className="text-muted" />
                    <span>Firmware:</span>
                    <strong style={{ marginLeft: 'auto' }} className="font-mono">{device.firmware || 'v1.0.0'}</strong>
                  </div>
                  <div style={styles.specItem}>
                    <IoWifiOutline className="text-muted" />
                    <span>IP Address:</span>
                    <strong style={{ marginLeft: 'auto' }} className="font-mono">{device.ipAddress || '192.168.x.x'}</strong>
                  </div>
                  <div style={styles.specItem}>
                    <IoLocationOutline className="text-muted" />
                    <span>Location:</span>
                    <strong style={{ marginLeft: 'auto' }}>{device.regionName || 'Unknown'}</strong>
                  </div>
                  <div style={styles.specItem}>
                    <IoTimeOutline className="text-muted" />
                    <span>Last Seen:</span>
                    <strong style={{ marginLeft: 'auto' }}>{formatRelativeTime(device.lastSeen)}</strong>
                  </div>
                </div>

                <h3 style={styles.sectionHeader} style={{ ...styles.sectionHeader, marginTop: 'var(--space-6)' }}>Health & Connectivity</h3>
                <div style={styles.healthGrid}>
                  <div className="glass-card" style={styles.healthCard}>
                    <IoBatteryHalfOutline size={20} color={device.battery < 20 ? 'var(--danger)' : 'var(--success)'} />
                    <div style={styles.healthValue}>{device.battery || 100}%</div>
                    <div style={styles.healthLabel}>Battery</div>
                  </div>
                  <div className="glass-card" style={styles.healthCard}>
                    <IoWifiOutline size={20} color={device.rssi < -85 ? 'var(--warning)' : 'var(--success)'} />
                    <div style={styles.healthValue}>{device.rssi || -50} dBm</div>
                    <div style={styles.healthLabel}>Signal Strength</div>
                  </div>
                </div>
              </div>
              
              <div style={styles.main}>
                <h3 style={styles.sectionHeader}>Configuration</h3>
                <pre className="json-viewer" style={{ marginBottom: 'var(--space-6)' }}>
                  {JSON.stringify(device.config || { reportingInterval: 5, encryptionEnabled: true }, null, 2)}
                </pre>

                <h3 style={styles.sectionHeader}>Recent Telemetry Logs</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {device.recentTelemetry?.slice(0, 5).map((log, i) => (
                      <tr key={i}>
                        <td className="font-mono">{formatRelativeTime(log.timestamp)}</td>
                        <td>
                          <span className={`status-badge ${log.status === 'error' ? 'error' : 'success'}`}>
                            {log.status === 'error' ? 'Error' : 'OK'}
                          </span>
                        </td>
                        <td className="truncate" style={{ maxWidth: '200px' }}>{log.message}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>No recent logs available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: 'var(--space-7)'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    display: 'flex',
    flexDirection: 'column'
  },
  sectionHeader: {
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-primary)',
    paddingBottom: 'var(--space-2)',
    marginBottom: 'var(--space-4)'
  },
  specsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)'
  },
  specItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontSize: '0.85rem',
    padding: 'var(--space-2)',
    background: 'var(--bg-elevated)',
    borderRadius: 'var(--radius-sm)'
  },
  healthGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-3)'
  },
  healthCard: {
    padding: 'var(--space-3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-1)'
  },
  healthValue: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginTop: 'var(--space-1)'
  },
  healthLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  }
};
