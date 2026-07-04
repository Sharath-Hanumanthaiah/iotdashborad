import { useDashboard } from '../../context/DashboardContext';
import { IoGridOutline, IoHardwareChipOutline, IoAnalyticsOutline, IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';

const navItems = [
  { id: 'dashboard', icon: IoGridOutline, label: 'Dashboard' },
  { id: 'devices', icon: IoHardwareChipOutline, label: 'Devices' },
  { id: 'analytics', icon: IoAnalyticsOutline, label: 'Analytics' },
  { id: 'alerts', icon: IoNotificationsOutline, label: 'Alerts' },
  { id: 'settings', icon: IoSettingsOutline, label: 'Settings' }
];

export default function Sidebar() {
  const { activePage, setActivePage } = useDashboard();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>⚡</div>
      </div>
      <nav style={styles.nav}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {})
              }}
              title={item.label}
              aria-label={item.label}
            >
              {isActive && <div style={styles.activeIndicator} />}
              <Icon size={20} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} />
            </button>
          );
        })}
      </nav>
      <div style={styles.bottomSection}>
        <div style={styles.versionBadge}>v2.3</div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '64px',
    height: '100vh',
    background: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 'var(--space-5)',
    paddingBottom: 'var(--space-5)',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 100
  },
  logo: {
    marginBottom: 'var(--space-8)',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
    flex: 1,
  },
  navItem: {
    position: 'relative',
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    transition: 'background var(--transition-fast)',
  },
  navItemActive: {
    background: 'var(--accent-muted)',
  },
  activeIndicator: {
    position: 'absolute',
    left: '-8px',
    width: '3px',
    height: '20px',
    borderRadius: '0 3px 3px 0',
    background: 'var(--accent)',
  },
  navLabel: {
    fontSize: '0.55rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    fontFamily: 'var(--font-sans)',
  },
  bottomSection: {
    marginTop: 'auto',
  },
  versionBadge: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    background: 'var(--bg-elevated)',
    padding: '2px 6px',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
  }
};
