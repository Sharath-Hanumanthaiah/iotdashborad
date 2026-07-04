import { useMemo, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import { IoTrendingUpOutline, IoTrendingDownOutline } from 'react-icons/io5';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

export default function MetricCard({ title, value, format = 'number', sparklineData, color, icon, onClick, suffix }) {
  const chartRef = useRef(null);

  const displayValue = format === 'percentage' ? formatPercentage(value) : formatNumber(value);
  
  const trend = useMemo(() => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const recent = sparklineData[sparklineData.length - 1]?.value;
    const prev = sparklineData[sparklineData.length - 5]?.value || sparklineData[0]?.value;
    if (!recent || !prev) return null;
    const change = ((recent - prev) / prev * 100).toFixed(1);
    return { value: Math.abs(change), positive: change >= 0 };
  }, [sparklineData]);

  const sparklineOption = useMemo(() => {
    if (!sparklineData || sparklineData.length === 0) return null;
    const values = sparklineData.map(d => d.value);
    return {
      grid: { top: 5, right: 0, bottom: 0, left: 0 },
      xAxis: { type: 'category', show: false, data: values.map((_, i) => i) },
      yAxis: { type: 'value', show: false, min: Math.min(...values) * 0.95, max: Math.max(...values) * 1.05 },
      series: [{
        type: 'line',
        data: values,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: color || 'var(--accent)' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: (color || '#3b82f6') + '40' },
            { offset: 1, color: (color || '#3b82f6') + '05' }
          ])
        }
      }],
      tooltip: { show: false }
    };
  }, [sparklineData, color]);

  return (
    <div
      className="glass-card interactive"
      data-testid="metric-card"
      style={styles.card}
      onClick={onClick}
    >
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        {icon && <span style={{ fontSize: '1rem', opacity: 0.5 }}>{icon}</span>}
      </div>
      <div style={styles.valueRow}>
        <span style={{ ...styles.value, color: color || 'var(--text-primary)' }}>
          {displayValue}
        </span>
        {suffix && <span style={styles.suffix}>{suffix}</span>}
      </div>
      {trend && (
        <div style={{ ...styles.trend, color: trend.positive ? 'var(--success)' : 'var(--danger)' }}>
          {trend.positive ? <IoTrendingUpOutline size={14} /> : <IoTrendingDownOutline size={14} />}
          <span>{trend.value}%</span>
        </div>
      )}
      {sparklineOption && (
        <div style={styles.sparkline}>
          <ReactEChartsCore
            ref={chartRef}
            echarts={echarts}
            option={sparklineOption}
            style={{ height: '50px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            notMerge={true}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: 'var(--space-5)',
    flex: 1,
    minWidth: '200px',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-2)'
  },
  title: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-2)'
  },
  value: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.03em'
  },
  suffix: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 500
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.7rem',
    fontWeight: 600,
    marginTop: '4px'
  },
  sparkline: {
    marginTop: 'var(--space-3)',
    marginLeft: '-var(--space-5)',
    marginRight: '-var(--space-5)',
    marginBottom: 'calc(-1 * var(--space-5))'
  }
};
