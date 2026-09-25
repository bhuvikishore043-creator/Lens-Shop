import React from 'react';
import { clsx } from 'clsx';

export const GlassBadge = ({ children, variant = 'sky', className = '' }) => {
  const variants = {
    sky: 'bg-sky-100/80 border-sky-300 text-sky-800 shadow-sm',
    cyan: 'bg-sky-100/80 border-sky-300 text-sky-800 shadow-sm',
    peach: 'bg-orange-100/80 border-orange-300 text-orange-800 shadow-sm',
    gold: 'bg-amber-100/80 border-amber-300 text-amber-800 shadow-sm',
    emerald: 'bg-emerald-100/80 border-emerald-300 text-emerald-800 shadow-sm',
    blue: 'bg-blue-100/80 border-blue-300 text-blue-800 shadow-sm',
    slate: 'bg-slate-100/80 border-slate-300 text-slate-700 shadow-sm',
  };

  return (
    <span className={clsx(
      'inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-md transition-colors',
      variants[variant] || variants.sky,
      className
    )}>
      {children}
    </span>
  );
};
