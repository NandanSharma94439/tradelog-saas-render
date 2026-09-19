import React from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  title = 'No trades logged yet',
  description = 'Your performance dashboard and metrics will appear here once you log your first trade entry.',
  actionText = '+ Add Your First Trade',
  onAction,
  icon,
}) => (
  <div className="glass-panel rounded-2xl border border-dark-border p-10 text-center flex flex-col items-center justify-center my-6">
    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 shadow-glow-brand">
      {icon || <BarChart3 className="w-8 h-8" />}
    </div>
    <h3 className="text-xl font-bold text-dark-text mb-2 tracking-tight">{title}</h3>
    <p className="text-sm text-dark-muted max-w-md mb-6">{description}</p>
    {onAction && (
      <Button onClick={onAction} variant="primary" size="lg" icon={Plus}>{actionText}</Button>
    )}
  </div>
);
