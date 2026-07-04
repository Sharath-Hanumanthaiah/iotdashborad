import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const CHART_GROUP = 'iot-dashboard';

export function useChartSync(chartRef) {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!chartRef?.current) return;
    
    const instance = chartRef.current.getEchartsInstance?.();
    if (instance && !registeredRef.current) {
      instance.group = CHART_GROUP;
      echarts.connect(CHART_GROUP);
      registeredRef.current = true;
    }

    return () => {
      registeredRef.current = false;
    };
  }, [chartRef]);
}

export default useChartSync;
