import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <div style={styles.main}>
        <TopBar />
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary)'
  },
  main: {
    flex: 1,
    marginLeft: '64px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  content: {
    flex: 1,
    padding: 'var(--space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-6)',
    maxWidth: '1600px',
    width: '100%',
    margin: '0 auto'
  }
};
