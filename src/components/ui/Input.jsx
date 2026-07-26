import React, { useId } from 'react';

const Input = ({
  label,
  error,
  hint,
  type = 'text',
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
      <input
        id={id}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-white hover:border-gray-400',
          'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
        ].join(' ')}
        {...rest}
      />
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

export default Input;
