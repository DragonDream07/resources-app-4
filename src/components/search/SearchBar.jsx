import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const DEBOUNCE_DELAY = 300;

export default function SearchBar({ initialQuery = '', className = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function fetchSuggestions(value) {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    fetch(`/search/suggest?q=${encodeURIComponent(value.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error('Suggest request failed');
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : (data.suggestions || data.data || []);
        setSuggestions(items);
        setIsOpen(items.length > 0);
        setActiveIndex(-1);
      })
      .catch(() => {
        setSuggestions([]);
        setIsOpen(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, DEBOUNCE_DELAY);
  }

  function handleSubmit(e) {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSuggestionSelect(suggestion) {
    const text = typeof suggestion === 'string' ? suggestion : (suggestion.query || suggestion.label || suggestion.name || '');
    setQuery(text);
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(text.trim())}`);
  }

  function handleKeyDown(e) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') handleSubmit();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSuggestionSelect(suggestions[activeIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current && inputRef.current.blur();
    }
  }

  function handleClear() {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current && inputRef.current.focus();
  }

  return (
    <div ref={containerRef} className={`search-bar-container ${className}`} style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }} role="search" aria-label="Site search">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          <span
            style={{ position: 'absolute', left: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}
            aria-hidden="true"
          >
            <img src={searchIcon} alt="" width={18} height={18} />
          </span>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search products…"
            autoComplete="off"
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls={isOpen ? 'autocomplete-suggestions' : undefined}
            aria-activedescendant={activeIndex >= 0 ? `suggestion-item-${activeIndex}` : undefined}
            aria-expanded={isOpen}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: query ? '72px' : '48px',
              paddingTop: '10px',
              paddingBottom: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '44px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <img src={closeIcon} alt="" width={16} height={16} />
            </button>
          )}

          <button
            type="submit"
            aria-label="Submit search"
            style={{
              position: 'absolute',
              right: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
          >
            <img src={searchIcon} alt="" width={18} height={18} />
          </button>
        </div>
      </form>

      {isOpen && (
        <AutocompleteSuggestions
          suggestions={suggestions}
          activeIndex={activeIndex}
          isLoading={isLoading}
          onSelect={handleSuggestionSelect}
          onHover={(index) => setActiveIndex(index)}
        />
      )}
    </div>
  );
}
