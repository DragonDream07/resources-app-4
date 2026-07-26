import { useState, useEffect, useRef, useCallback } from 'react';

const DEBOUNCE_DELAY_MS = 300;

async function fetchSearchResults(query, params = {}) {
  const searchParams = new URLSearchParams({ q: query, ...params });
  const res = await fetch(`/search?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Search request failed');
  return res.json();
}

async function fetchSuggestions(query) {
  const searchParams = new URLSearchParams({ q: query });
  const res = await fetch(`/search/suggest?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Suggest request failed');
  return res.json();
}

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimerRef = useRef(null);

  const search = useCallback(async (searchQuery, params = {}) => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSearchResults(searchQuery.trim(), params);
      setResults(Array.isArray(data) ? data : (data.results || data.data || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAutocompleteSuggestions = useCallback((value) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!value || !value.trim()) {
      setSuggestions([]);
      return;
    }
    debounceTimerRef.current = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const data = await fetchSuggestions(value.trim());
        setSuggestions(Array.isArray(data) ? data : (data.suggestions || data.data || []));
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);
  }, []);

  const updateQuery = useCallback(
    (value) => {
      setQuery(value);
      fetchAutocompleteSuggestions(value);
    },
    [fetchAutocompleteSuggestions]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return {
    query,
    setQuery: updateQuery,
    results,
    suggestions,
    loading,
    suggestionsLoading,
    error,
    search,
    clearSuggestions,
  };
}
