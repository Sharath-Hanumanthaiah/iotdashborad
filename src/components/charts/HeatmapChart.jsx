import { useMemo, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import * as echarts from 'echarts/core';
import { HeatmapChart as HeatmapSeries } from 'echarts/charts';
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useDashboard } from '../../context/DashboardContext';

echarts.use([HeatmapSeries, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

export default function HeatmapChart({ data }) {
  const chartRef = useRef(null);
  const { openModal } = useDashboard();

  const option = useMemo(() => {
    if (!data) return null;
    return {
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.1)',
        textStyle: { color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter' },
        formatter: (params) => {
          const [hour, region, value] = params.data;
          return `<b>${data.regions[region]}</b><br/>Hour: ${data.hours[hour]}<br/>Utilization: <b>${value}%</b>`;
        }
      },
      grid: { top: 10, right: 80, bottom: 35, left: 90 },
      xAxis: {
        type: 'category',
        data: data.hours,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b', fontSize: 9, interval: 3 },
        splitArea: { show: false }
      },
      yAxis: {
        type: 'category',
        data: data.regions,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 10 },
        splitArea: { show: false }
      },
      visualMap: {
        min: data.min,
        max: data.max,
        calculable: false,
        orient: 'vertical',
        right: 5,
        top: 'center',
        itemHeight: 120,
        itemWidth: 10,
        textStyle: { color: '#64748b', fontSize: 10 },
        inRange: {
          color: ['#0f172a', '#1e3a5f', '#2563eb', '#f59e0b', '#ef4444']
        }
      },
      series: [{
        type: 'heatmap',
        data: data.data,
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          }
        },
        itemStyle: {
          borderColor: 'var(--bg-primary)',
          borderWidth: 2,
          borderRadius: 3
        }
      }]
    };
  }, [data]);

  const handleClick = (params) => {
    if (params.data && data) {
      const [hourIdx, regionIdx] = params.data;
      const regionName = data.regions[regionIdx];
      const regionMap = { 'Assembly': 'floor-a', 'Welding': 'floor-b', 'Painting': 'floor-c', 'Packaging': 'floor-d' };
      openModal('region', { regionId: regionMap[regionName] || 'floor-a', regionName });
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
