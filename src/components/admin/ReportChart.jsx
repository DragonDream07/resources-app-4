import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DEFAULT_COLORS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
];

const ReportChart = ({
  type,
  data,
  dataKeys,
  xKey,
  title,
  colors,
  height,
  loading,
  emptyMessage,
}) => {
  const resolvedColors = colors && colors.length > 0 ? colors : DEFAULT_COLORS;

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white"
        style={{ height }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg
            className="animate-spin h-4 w-4 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Loading chart…
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white"
        style={{ height }}
      >
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((dk, i) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.label || dk.key}
                stroke={resolvedColors[i % resolvedColors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              {dataKeys.map((dk, i) => (
                <linearGradient
                  key={dk.key}
                  id={`grad-${dk.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={resolvedColors[i % resolvedColors.length]}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={resolvedColors[i % resolvedColors.length]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((dk, i) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.label || dk.key}
                stroke={resolvedColors[i % resolvedColors.length]}
                fill={`url(#grad-${dk.key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {dataKeys.map((dk, i) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                name={dk.label || dk.key}
                fill={resolvedColors[i % resolvedColors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys[0]?.key || 'value'}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius="70%"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={resolvedColors[i % resolvedColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

ReportChart.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'area', 'pie']).isRequired,
  data: PropTypes.array,
  dataKeys: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ),
  xKey: PropTypes.string,
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

ReportChart.defaultProps = {
  data: [],
  dataKeys: [],
  xKey: 'label',
  title: '',
  colors: [],
  height: 300,
  loading: false,
  emptyMessage: 'No data available.',
};

export default ReportChart;
