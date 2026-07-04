import { formatJsonSyntax } from '../../utils/formatters';

export default function ExpandedRow({ data }) {
  // Safe extraction of the payload to avoid rendering issues
  const payload = data.payload || {};
  
  return (
    <div className="expanded-row-content">
      <div style={styles.grid}>
        <div style={styles.column}>
          <h5 style={styles.header}>Raw Telemetry Payload</h5>
          <pre
            className="json-viewer"
            dangerouslySetInnerHTML={{ __html: formatJsonSyntax(payload) }}
          />
        </div>
        
        <div style={styles.column}>
          <h5 style={styles.header}>Event Metadata</h5>
          <div style={styles.metaCard}>
            <div style={styles.metaRow}>
              <span className="text-muted">Event ID:</span>
              <span className="font-mono">{data.id}</span>
            </div>
            <div style={styles.metaRow}>
              <span className="text-muted">Device ID:</span>
              <span className="font-mono">{data.deviceId}</span>
            </div>
            <div style={styles.metaRow}>
              <span className="text-muted">Timestamp:</span>
              <span className="font-mono">{new Date(data.timestamp).toISOString()}</span>
            </div>
            <div style={styles.metaRow}>
              <span className="text-muted">Server Rx Time:</span>
              <span className="font-mono">{new Date(new Date(data.timestamp).getTime() + 142).toISOString()}</span>
            </div>
            <div style={styles.metaRow}>
              <span className="text-muted">Protocol:</span>
              <span className="font-mono">MQTT (QoS 1)</span>
            </div>
            <div style={styles.metaRow}>
              <span className="text-muted">Topic:</span>
              <span className="font-mono">iot/{data.region}/{data.deviceType.toLowerCase().replace(' ', '-')}/{data.deviceId}/telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: 'var(--space-6)',
    maxWidth: '1200px'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)'
  },
  header: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  metaCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    borderBottom: '1px solid var(--border-primary)',
    paddingBottom: 'var(--space-2)'
  }
};
