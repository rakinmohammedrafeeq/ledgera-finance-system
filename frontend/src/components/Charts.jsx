import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#d4af37', '#8b8b8b', '#ef4444', '#b0b0b0', '#6b7280', '#4b5563', '#9ca3af', '#cbd5f5'];

const tooltipStyle = {
  backgroundColor: '#111111',
  border: '1px solid rgba(212, 175, 55, 0.25)',
  borderRadius: '8px',
  color: '#f5f5f5',
  fontSize: '0.82rem',
};

export function MonthlyTrendsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-title">Monthly Trends</div>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden>
            <BarChart3 strokeWidth={1.5} />
          </div>
          <div className="empty-state-text">No trend data available</div>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: `${item.monthName} ${item.year}`,
    Income: parseFloat(item.income) || 0,
    Expense: parseFloat(item.expense) || 0,
  }));

  return (
    <div className="chart-card">
      <div className="chart-card-title">Monthly Trends</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} />
          <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.12)' }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '0.82rem', color: '#a1a1aa' }} />
          <Bar dataKey="Income" fill="#d4af37" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBreakdownChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-title">Category Breakdown</div>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden>
            <PieChartIcon strokeWidth={1.5} />
          </div>
          <div className="empty-state-text">No category data available</div>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: Math.abs(parseFloat(item.income || 0)) + Math.abs(parseFloat(item.expense || 0)),
  }));

  const renderLabel = ({ name, percent }) => {
    if (percent < 0.05) return null;
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="chart-card">
      <div className="chart-card-title">Category Breakdown</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            fill="#d4af37"
            dataKey="value"
            label={renderLabel}
            labelLine={{ stroke: '#6b7280' }}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
