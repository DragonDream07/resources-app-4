import { useState, useCallback, useMemo } from 'react';

const DEFAULT_FILTERS = {
  categoryId: null,
  brandId: null,
  minPrice: null,
  maxPrice: null,
  sort: null,
  attributes: {},
};

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setAttributeFilter = useCallback((attributeKey, value) => {
    setFilters((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attributeKey]: value },
    }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: DEFAULT_FILTERS[key] ?? null }));
  }, []);

  const removeAttributeFilter = useCallback((attributeKey) => {
    setFilters((prev) => {
      const nextAttributes = { ...prev.attributes };
      delete nextAttributes[attributeKey];
      return { ...prev, attributes: nextAttributes };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, ...initialFilters });
  }, [initialFilters]);

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.brandId) params.brandId = filters.brandId;
    if (filters.minPrice !== null && filters.minPrice !== undefined)
      params.minPrice = filters.minPrice;
    if (filters.maxPrice !== null && filters.maxPrice !== undefined)
      params.maxPrice = filters.maxPrice;
    if (filters.sort) params.sort = filters.sort;
    Object.entries(filters.attributes).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        params[`attr_${k}`] = v;
      }
    });
    return params;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.brandId) count++;
    if (filters.minPrice !== null && filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) count++;
    if (filters.sort) count++;
    count += Object.values(filters.attributes).filter(
      (v) => v !== null && v !== undefined && v !== ''
    ).length;
    return count;
  }, [filters]);

  return {
    filters,
    setFilter,
    setAttributeFilter,
    removeFilter,
    removeAttributeFilter,
    resetFilters,
    queryParams,
    activeFilterCount,
  };
}
