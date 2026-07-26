import searchIcon from '@/assets/icons/search.svg';

function getSuggestionText(suggestion) {
  if (typeof suggestion === 'string') return suggestion;
  return suggestion.query || suggestion.label || suggestion.name || '';
}

function getSuggestionKey(suggestion, index) {
  if (typeof suggestion === 'object' && suggestion !== null && (suggestion.id || suggestion.query || suggestion.label)) {
    return suggestion.id || suggestion.query || suggestion.label;
  }
  return index;
}

export default function AutocompleteSuggestions({
  suggestions = [],
  activeIndex = -1,
  isLoading = false,
  onSelect,
  onHover,
}) {
  if (isLoading) {
    return (
      <div
        id="autocomplete-suggestions"
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 200,
          background: '#fff',
          border: '1px solid #d1d5db',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '12px 16px',
          fontSize: '14px',
          color: '#6b7280',
        }}
      >
        Loading suggestions…
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul
      id="autocomplete-suggestions"
      role="listbox"
      aria-label="Search suggestions"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 200,
        background: '#fff',
        border: '1px solid #d1d5db',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        maxHeight: '320px',
        overflowY: 'auto',
      }}
    >
      {suggestions.map((suggestion, index) => {
        const text = getSuggestionText(suggestion);
        const isActive = index === activeIndex;

        return (
          <li
            key={getSuggestionKey(suggestion, index)}
            id={`suggestion-item-${index}`}
            role="option"
            aria-selected={isActive}
            onMouseEnter={() => onHover && onHover(index)}
            onMouseLeave={() => onHover && onHover(-1)}
            onClick={() => onSelect && onSelect(suggestion)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              cursor: 'pointer',
              backgroundColor: isActive ? '#f3f4f6' : 'transparent',
              fontSize: '14px',
              color: '#111827',
              userSelect: 'none',
              transition: 'background-color 0.1s',
            }}
          >
            <img
              src={searchIcon}
              alt=""
              aria-hidden="true"
              width={14}
              height={14}
              style={{ flexShrink: 0, opacity: 0.5 }}
            />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
