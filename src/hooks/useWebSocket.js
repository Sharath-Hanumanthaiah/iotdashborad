import { useEffect, useRef, useCallback } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { WS_URL } from '../utils/constants';

export function useWebSocket() {
  const { dispatch } = useDashboard();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] Connected');
        dispatch({ type: 'SET_WS_CONNECTED', payload: true });
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case 'telemetry':
              dispatch({ type: 'ADD_REALTIME_TELEMETRY', payload: msg.data });
              break;
            case 'metrics':
              dispatch({ type: 'SET_METRICS', payload: msg.data });
              break;
            case 'alert':
              dispatch({ type: 'ADD_ALERT', payload: msg.data });
              break;
            default:
              break;
          }
        } catch (e) {
          console.warn('[WS] Parse error:', e);
        }
      };

      ws.onclose = () => {
        console.log('[WS] Disconnected');
        dispatch({ type: 'SET_WS_CONNECTED', payload: false });
        wsRef.current = null;
        
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current++;
          console.log(`[WS] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = (err) => {
        console.warn('[WS] Error:', err);
      };
    } catch (e) {
      console.error('[WS] Connection failed:', e);
    }
  }, [dispatch]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connect, disconnect };
}
