import { useMemo, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import * as echarts from 'echarts/core';
import { ScatterChart as ScatterSeries } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useDashboard } from '../../context/DashboardContext';
import { getStatusColor, getDeviceTypeColor } from '../../utils/colors';

echarts.use([ScatterSeries, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default function ScatterChart({ data }) {
  const chartRef = useRef(null);
  const { openModal } = useDashboard();

  const option = useMemo(() => {
    if (!data || data.length === 0) return null;

    const typeGroups = {};
    data.forEach(d => {
      if (!typeGroups[d.type]) typeGroups[d.type] = [];
      typeGroups[d.type].push(d);
    });

    return {
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.1)',
        textStyle: { color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter' },
        formatter: (params) => {
          const d = params.data.raw;
          return `<b>${d.deviceName}</b><br/>Battery: ${d.battery}%<br/>RSSI: ${d.rssi} dBm<br/>Status: ${d.status}`;
        }
      },
      legend: {
        data: Object.keys(typeGroups),
        textStyle: { color: '#94a3b8', fontSize: 10 },
        top: 0,
        right: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8
      },
      grid: { top: 35, right: 15, bottom: 30, left: 50 },
      xAxis: {
        name: 'Battery %',
        nameTextStyle: { color: '#64748b', fontSize: 10 },
        nameLocation: 'center',
        nameGap: 20,
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
        axisLabel: { color: '#64748b', fontSize: 10 }
      },
      yAxis: {
        name: 'RSSI (dBm)',
        nameTextStyle: { color: '#64748b', fontSize: 10 },
        nameLocation: 'center',
        nameGap: 35,
        min: -100,
        max: -20,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
        axisLabel: { color: '#64748b', fontSize: 10 }
      },
      series: Object.entries(typeGroups).map(([type, devices]) => ({
        name: type,
        type: 'scatter',
        data: devices.map(d => ({
          value: [d.battery, d.rssi],
          raw: d,
          itemStyle: { color: getDeviceTypeColor(type), opacity: d.status === 'error' ? 1 : 0.7 }
        })),
        symbolSize: (val, params) => {
          return params.data.raw.status === 'error' ? 12 : 8;
        },
        emphasis: {
          itemStyle: { borderColor: '#fff', borderWidth: 2 }
        }
      }))
    };
  }, [data]);

  const handleClick = (params) => {
    if (params.data?.raw) {
      openModal('device', params.data.raw);
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
