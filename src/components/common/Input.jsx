import React from 'react';

export const Input = ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-dark-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && <div className="absolute left-3 text-dark-muted pointer-events-none flex items-center">{leftIcon}</div>}
        <input
          id={inputId}
          className={`w-full bg-dark-bg border text-dark-text placeholder-dark-muted rounded-lg text-sm px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''} ${error ? 'border-rose-500 focus:ring-rose-500/50 focus:border-rose-500' : 'border-dark-border hover:border-dark-borderLight'} ${className}`}
          {...props}
        />
        {rightIcon && <div className="absolute right-3 text-dark-muted flex items-center">{rightIcon}</div>}
      </div>
      {error ? <p className="text-xs text-rose-400 font-medium">{error}</p>
        : helperText ? <p className="text-xs text-dark-muted">{helperText}</p>
        : null}
    </div>
  );
};

export const Select = ({ label, error, options, className = '', id, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-dark-muted">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-dark-bg border text-dark-text rounded-lg text-sm px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${error ? 'border-rose-500' : 'border-dark-border hover:border-dark-borderLight'} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-dark-card text-dark-text">{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
