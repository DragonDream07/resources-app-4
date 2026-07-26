import React from 'react';
import PropTypes from 'prop-types';

const TrendIndicator = ({ trend }) => {
  if (trend === null || trend === undefined) return null;

  const isPositive = trend >= 0;
  const color = isPositive ? 'text-green-600' : 'text-red-500';
  const arrow = isPositive ? '▲' : '▼';
  const absValue = Math.abs(trend);

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${color}`}>
      <span aria-hidden="true">{arrow}</span>
      <span>{absValue}%</span>
    </span>
  );
};

TrendIndicator.propTypes = {
  trend: PropTypes.number,
};

const StatsCard = ({ label, value, trend, icon, formatValue }) => {
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        {icon && (
          <span className="text-gray-400" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{displayValue}</span>
        <TrendIndicator trend={trend} />
      </div>
      {trend !== null && trend !== undefined && (
        <p className="text-xs text-gray-400">
          {trend >= 0 ? 'Up' : 'Down'} compared to last period
        </p>
      )}
    </div>
  );
};

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.number,
  icon: PropTypes.node,
  formatValue: PropTypes.func,
};

StatsCard.defaultProps = {
  trend: null,
  icon: null,
  formatValue: null,
};

export default StatsCard;
