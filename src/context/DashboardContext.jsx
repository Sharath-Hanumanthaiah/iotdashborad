import { createContext, useContext, useReducer, useCallback } from 'react';

const DashboardContext = createContext(null);

const initialState = {
  activePage: 'dashboard',
  timeRange: 24,
  wsConnected: false,
  activeDrawer: null,
  drawerData: null,
  activeModal: null,
  modalData: null,
  tableFilters: {
    status: '',
    type: '',
    region: '',
    search: '',
    hourFilter: null
  },
  metrics: null,
  realtimeTelemetry: [],
  alerts: []
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, activePage: action.payload };
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload };
    case 'SET_WS_CONNECTED':
      return { ...state, wsConnected: action.payload };
    case 'OPEN_DRAWER':
      return { ...state, activeDrawer: action.payload.type, drawerData: action.payload.data };
    case 'CLOSE_DRAWER':
      return { ...state, activeDrawer: null, drawerData: null };
    case 'OPEN_MODAL':
      return { ...state, activeModal: action.payload.type, modalData: action.payload.data };
    case 'CLOSE_MODAL':
      return { ...state, activeModal: null, modalData: null };
    case 'SET_TABLE_FILTERS':
      return { ...state, tableFilters: { ...state.tableFilters, ...action.payload } };
    case 'RESET_TABLE_FILTERS':
      return { ...state, tableFilters: initialState.tableFilters };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload };
    case 'ADD_REALTIME_TELEMETRY':
      return {
        ...state,
        realtimeTelemetry: [...action.payload, ...state.realtimeTelemetry].slice(0, 100)
      };
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts].slice(0, 50)
      };
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const openDrawer = useCallback((type, data = null) => {
    dispatch({ type: 'OPEN_DRAWER', payload: { type, data } });
  }, []);

  const closeDrawer = useCallback(() => {
    dispatch({ type: 'CLOSE_DRAWER' });
  }, []);

  const openModal = useCallback((type, data = null) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type, data } });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const setTimeRange = useCallback((range) => {
    dispatch({ type: 'SET_TIME_RANGE', payload: range });
  }, []);

  const setTableFilters = useCallback((filters) => {
    dispatch({ type: 'SET_TABLE_FILTERS', payload: filters });
  }, []);

  const setActivePage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const resetTableFilters = useCallback(() => {
    dispatch({ type: 'RESET_TABLE_FILTERS' });
  }, []);

  const value = {
    ...state,
    dispatch,
    openDrawer,
    closeDrawer,
    openModal,
    closeModal,
    setTimeRange,
    setTableFilters,
    resetTableFilters,
    setActivePage
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export default DashboardContext;
