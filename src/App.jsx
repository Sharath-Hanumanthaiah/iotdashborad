import { DashboardProvider } from './context/DashboardContext';
import { useWebSocket } from './hooks/useWebSocket';
import DashboardLayout from './components/layout/DashboardLayout';
import MetricCardsRow from './components/cards/MetricCardsRow';
import ChartGrid from './components/charts/ChartGrid';
import TelemetryTable from './components/table/TelemetryTable';
import TimestampDetailModal from './components/modals/TimestampDetailModal';
import DeviceProfileModal from './components/modals/DeviceProfileModal';
import RegionDrilldownModal from './components/modals/RegionDrilldownModal';
import SideDrawer from './components/layout/SideDrawer';

import { useDashboard } from './context/DashboardContext';

function DashboardContent() {
  // Initialize WebSocket connection
  useWebSocket();
  const { activePage } = useDashboard();

  let content;
  switch (activePage) {
    case 'devices':
      content = (
        <div style={{ color: 'var(--text-muted)', padding: 'var(--space-10)', textAlign: 'center' }}>
          <h2>Device Management</h2>
          <p>This module is under construction.</p>
        </div>
      );
      break;
    case 'analytics':
      content = (
        <div style={{ color: 'var(--text-muted)', padding: 'var(--space-10)', textAlign: 'center' }}>
          <h2>Advanced Analytics</h2>
          <p>This module is under construction.</p>
        </div>
      );
      break;
    case 'alerts':
      content = (
        <div style={{ color: 'var(--text-muted)', padding: 'var(--space-10)', textAlign: 'center' }}>
          <h2>Alerts & Notifications</h2>
          <p>This module is under construction.</p>
        </div>
      );
      break;
    case 'settings':
      content = (
        <div style={{ color: 'var(--text-muted)', padding: 'var(--space-10)', textAlign: 'center' }}>
          <h2>System Settings</h2>
          <p>This module is under construction.</p>
        </div>
      );
      break;
    case 'dashboard':
    default:
      content = (
        <>
          <MetricCardsRow />
          <ChartGrid />
          <TelemetryTable />
        </>
      );
      break;
  }

  return (
    <DashboardLayout>
      {content}
      
      {/* Modals & Drawers */}
      <TimestampDetailModal />
      <DeviceProfileModal />
      <RegionDrilldownModal />
      
      {/* Drawers content can be expanded later */}
      <SideDrawer title="System Details">
        <div style={{ color: 'var(--text-muted)' }}>
          Detailed view placeholder. Try clicking a specific chart element or table row for context-specific drill-downs.
        </div>
      </SideDrawer>
    </DashboardLayout>
  );
}

function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;
