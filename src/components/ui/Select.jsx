import React, { useId } from 'react';
import chevronDown from '@/assets/icons/chevron-down.svg';

const Select = ({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select an option',
  id: providedId,
  className = '',
  required = false,
  ...rest
}) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [
    error ? errorId : null,
    hint ? hintId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={[
            'block w-full appearance-none rounded-md border px-3 py-2 pr-8 text-sm text-gray-900',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            error
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white hover:border-gray-400',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
          ].join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <img src={chevronDown} alt="" className="h-4 w-4 text-gray-400" />
        </span>
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
