import { useMemo, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useDashboard } from '../../context/DashboardContext';

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

export default function GaugeDonutChart({ data }) {
  const chartRef = useRef(null);
  const { openDrawer } = useDashboard();

  const option = useMemo(() => {
    if (!data) return null;
    return {
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.1)',
        textStyle: { color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter' },
        formatter: (params) => `${params.name}: <b>${params.value}</b> devices (${params.percent}%)`
      },
      legend: {
        orient: 'vertical',
        right: 5,
        top: 'center',
        textStyle: { color: '#94a3b8', fontSize: 10 },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 8
      },
      series: [{
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: { borderRadius: 6 },
        label: {
          show: true,
          position: 'center',
          formatter: () => `${data.healthPercentage}%`,
          fontSize: 22,
          fontWeight: 800,
          color: '#f1f5f9',
          fontFamily: 'Inter'
        },
        emphasis: {
          label: { show: true, fontSize: 24, fontWeight: 800 },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' }
        },
        labelLine: { show: false },
        data: data.segments.map(s => ({
          value: s.value,
          name: s.name,
          itemStyle: { color: s.color }
        }))
      }]
    };
  }, [data]);

  const handleClick = () => {
    openDrawer('health');
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
