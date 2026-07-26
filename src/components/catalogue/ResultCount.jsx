import React from 'react';

/**
 * ResultCount displays total search/filter results and optional per-option facet counts.
 *
 * Props:
 *   total: number               – total number of results
 *   query: string               – optional search query label
 *   facets: Array<{ label, count }> – optional facet breakdown to show
 *   loading: boolean
 */
const ResultCount = ({ total = 0, query = '', facets = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm text-gray-600">
        {query ? (
          <>
            <span className="font-semibold text-gray-900">{total.toLocaleString('en-IN')}</span>
            {' result'}
            {total !== 1 ? 's' : ''}
            {' for '}
            <span className="font-semibold text-gray-900">&ldquo;{query}&rdquo;</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-900">{total.toLocaleString('en-IN')}</span>
            {' product'}
            {total !== 1 ? 's' : ''}
          </>
        )}
      </p>

      {facets.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Facet counts">
          {facets.map((facet) => (
            <span
              key={facet.label}
              className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
            >
              <span className="font-medium text-gray-700">{facet.label}</span>
              <span>({facet.count.toLocaleString('en-IN')})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultCount;
