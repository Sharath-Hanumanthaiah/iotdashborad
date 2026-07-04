import { useMemo, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useDashboard } from '../../context/DashboardContext';
import { useChartSync } from '../../hooks/useChartSync';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

export default function TimeSeriesChart({ data }) {
  const chartRef = useRef(null);
  const { openModal } = useDashboard();
  useChartSync(chartRef);

  const option = useMemo(() => {
    if (!data || data.length === 0) return null;
    const timestamps = data.map(d => {
      const date = new Date(d.timestamp);
      return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    });

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.1)',
        textStyle: { color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter' },
        axisPointer: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } }
      },
      legend: {
        data: ['Temperature', 'Humidity', 'Pressure'],
        textStyle: { color: '#94a3b8', fontSize: 11 },
        top: 0,
        right: 0,
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 3
      },
      grid: { top: 35, right: 15, bottom: 45, left: 45 },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }],
      xAxis: {
        type: 'category',
        data: timestamps,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b', fontSize: 10, interval: Math.floor(timestamps.length / 8) }
      },
      yAxis: [
        {
          type: 'value',
          name: '°C / %',
          nameTextStyle: { color: '#64748b', fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
          axisLabel: { color: '#64748b', fontSize: 10 }
        }
      ],
      series: [
        {
          name: 'Temperature',
          type: 'line',
          data: data.map(d => d.temperature),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: '#ef4444' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(239, 68, 68, 0.15)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0)' }
            ])
          }
        },
        {
          name: 'Humidity',
          type: 'line',
          data: data.map(d => d.humidity),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: '#3b82f6' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.15)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ])
          }
        },
        {
          name: 'Pressure',
          type: 'line',
          data: data.map(d => d.pressure),
          smooth: true,
          showSymbol: false,
          yAxisIndex: 0,
          lineStyle: { width: 2, color: '#22c55e' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(34, 197, 94, 0.15)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0)' }
            ])
          }
        }
      ]
    };
  }, [data]);

  const handleClick = (params) => {
    if (params.dataIndex !== undefined && data) {
      const point = data[params.dataIndex];
      openModal('timestamp', point);
    }
  };

  if (!option) return <div className="skeleton" style={{ height: '100%' }} />;

  return (
    <ReactEChartsCore
      ref={chartRef}
      echarts={echarts}
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      onEvents={{ click: handleClick }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
