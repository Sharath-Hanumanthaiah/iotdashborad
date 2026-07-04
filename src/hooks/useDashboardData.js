import { useState, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { API_BASE_URL } from '../utils/constants';

export function useFetchData(endpoint, params = {}, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    
    setLoading(true);
    setError(null);
    
    try {
      const queryString = Object.entries(params)
        .filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
      const url = `${API_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error(`[Fetch] ${endpoint} error:`, err);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData, ...deps]);

  return { data, loading, error, refetch: fetchData };
}

export function useDashboardData() {
  const { timeRange } = useDashboard();
  
  const metrics = useFetchData('/api/metrics', {}, [timeRange]);
  const sparkline = useFetchData('/api/metrics/sparkline', { hours: timeRange }, [timeRange]);
  const timeseries = useFetchData('/api/charts/timeseries', { hours: timeRange }, [timeRange]);
  const messages = useFetchData('/api/charts/messages', { hours: timeRange }, [timeRange]);
  const heatmap = useFetchData('/api/charts/heatmap', {}, [timeRange]);
  const scatter = useFetchData('/api/charts/scatter', {}, [timeRange]);
  const health = useFetchData('/api/charts/health', {}, [timeRange]);

  return { metrics, sparkline, timeseries, messages, heatmap, scatter, health };
}
