import React from 'react';
import { clsx } from 'clsx';

export const GlassCard = ({ children, className = '', interactive = false, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-2xl backdrop-blur-glass transition-all duration-300',
        interactive ? 'glass-panel-interactive cursor-pointer' : 'glass-panel',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
