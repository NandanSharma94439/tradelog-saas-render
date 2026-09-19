import React from 'react';

export const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => (
  <div className={`bg-dark-cardHover/70 animate-pulse-subtle rounded-lg ${height} ${width} ${className}`} />
);

export const CardSkeleton = () => (
  <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton width="w-24" height="h-4" />
      <Skeleton width="w-8" height="h-8" className="rounded-full" />
    </div>
    <Skeleton width="w-36" height="h-8" />
    <Skeleton width="w-20" height="h-3" />
  </div>
);
