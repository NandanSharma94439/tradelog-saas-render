import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const variants = {
    profit: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    loss: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    neutral: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-xs font-semibold' };
  return (
    <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
