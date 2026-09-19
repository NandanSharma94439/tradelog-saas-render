import React from 'react';

export const Button = ({
  children, variant = 'primary', size = 'md', isLoading = false,
  icon: Icon, className = '', disabled, ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-glow-brand focus:ring-brand-500 border border-brand-500/30',
    secondary: 'bg-dark-cardHover hover:bg-dark-border text-dark-text border border-dark-border focus:ring-brand-500',
    outline: 'bg-transparent hover:bg-dark-cardHover text-dark-text border border-dark-border hover:border-dark-muted focus:ring-brand-500',
    danger: 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-glow-loss focus:ring-rose-500 border border-rose-500/30',
    success: 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-glow-profit focus:ring-emerald-500 border border-emerald-500/30',
    ghost: 'bg-transparent hover:bg-dark-cardHover text-dark-muted hover:text-dark-text focus:ring-brand-500',
  };

  const sizes = { sm: 'px-3 py-1.5 text-xs gap-1.5', md: 'px-4 py-2 text-sm gap-2', lg: 'px-5 py-2.5 text-base gap-2.5' };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
};
