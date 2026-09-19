import React from 'react';

export const Card = ({ children, className = '', title, subtitle, action, hoverEffect = false }) => (
  <div className={`glass-panel rounded-xl p-5 border border-dark-border shadow-card-dark ${hoverEffect ? 'glass-panel-hover' : ''} ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-border/50">
        <div>
          {title && <h3 className="text-base font-bold text-dark-text tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-dark-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);
