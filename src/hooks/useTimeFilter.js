import { useDashboard } from '../context/DashboardContext';

export function useTimeFilter() {
  const { timeRange, setTimeRange } = useDashboard();
  return { timeRange, setTimeRange };
}
