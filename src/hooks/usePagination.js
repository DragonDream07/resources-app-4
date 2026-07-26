import { useState, useCallback, useMemo } from 'react';

export function usePagination({ initialPage = 1, initialLimit = 20 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => (limit > 0 ? Math.ceil(total / limit) : 0), [total, limit]);

  const goToPage = useCallback(
    (nextPage) => {
      const clamped = Math.max(1, Math.min(nextPage, totalPages || 1));
      setPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage((prev) => (totalPages > 0 ? Math.min(prev + 1, totalPages) : prev + 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const updateLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const queryParams = useMemo(
    () => ({ page, limit }),
    [page, limit]
  );

  return {
    page,
    limit,
    total,
    totalPages,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    setLimit: updateLimit,
    queryParams,
  };
}
