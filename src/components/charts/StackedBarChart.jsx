import { useMemo, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useDashboard } from '../../context/DashboardContext';
import { useChartSync } from '../../hooks/useChartSync';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default function StackedBarChart({ data }) {
  const chartRef = useRef(null);
  const { setTableFilters } = useDashboard();
  useChartSync(chartRef);

  const option = useMemo(() => {
    if (!data || data.length === 0) return null;
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.1)',
        textStyle: { color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter' },
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Success', 'Failed'],
        textStyle: { color: '#94a3b8', fontSize: 11 },
        top: 0,
        right: 0,
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 3
      },
      grid: { top: 35, right: 15, bottom: 25, left: 45 },
      xAxis: {
        type: 'category',
        data: data.map(d => d.hourLabel),
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b', fontSize: 10, interval: Math.floor(data.length / 12) }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
        axisLabel: { color: '#64748b', fontSize: 10 }
      },
      series: [
        {
          name: 'Success',
          type: 'bar',
          stack: 'messages',
          data: data.map(d => d.success),
          itemStyle: { color: '#22c55e', borderRadius: [0, 0, 0, 0] },
          barWidth: '60%'
        },
        {
          name: 'Failed',
          type: 'bar',
          stack: 'messages',
          data: data.map(d => d.failed),
          itemStyle: { color: '#ef4444', borderRadius: [3, 3, 0, 0] },
          barWidth: '60%'
        }
      ]
    };
  }, [data]);

  const handleClick = (params) => {
    if (params.seriesName === 'Failed' && params.dataIndex !== undefined) {
      setTableFilters({ status: 'error', hourFilter: params.dataIndex });
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
