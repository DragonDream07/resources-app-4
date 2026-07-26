import React, { useId } from 'react';

const Checkbox = ({
  label,
  error,
  id: providedId,
  className = '',
  checked,
  onChange,
  disabled = false,
  required = false,
  ...rest
}) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[
            'h-4 w-4 rounded border-gray-300 text-indigo-600',
            'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-150',
          ].join(' ')}
          {...rest}
        />
        {label && (
          <label
            htmlFor={id}
            className={[
              'text-sm text-gray-700 select-none',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 ml-6">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
