import React from 'react';
import closeIcon from '@/assets/icons/close.svg';

const ActiveFilterBar = ({ filters = [], onRemove, onClearAll }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Active filters">
      <span className="text-xs font-medium text-gray-500 shrink-0">Active:</span>

      {filters.map((filter) => (
        <span
          key={filter.key}
          role="listitem"
          className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full border border-indigo-100"
        >
          {filter.label}
          <button
            type="button"
            onClick={() => onRemove && onRemove(filter.key)}
            aria-label={`Remove filter: ${filter.label}`}
            className="ml-0.5 hover:text-indigo-900 focus:outline-none rounded-full"
          >
            <img src={closeIcon} alt="" aria-hidden="true" className="w-3 h-3" />
          </button>
        </span>
      ))}

      {filters.length > 1 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-gray-700 underline shrink-0"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterBar;
