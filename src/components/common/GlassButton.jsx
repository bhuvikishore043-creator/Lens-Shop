import React from 'react';
import { clsx } from 'clsx';

export const GlassButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'glass-button text-white shadow-glass-glow',
    peach: 'glass-button-peach text-white shadow-peach-glow',
    gold: 'glass-button-gold text-white shadow-gold-glow',
    secondary: 'bg-white/90 hover:bg-white border border-slate-300 text-slate-800 hover:text-slate-900 shadow-sm hover:shadow-md hover:border-sky-300',
    outline: 'bg-white/50 hover:bg-white/80 border border-sky-400 text-sky-700 hover:text-sky-800 shadow-sm',
    ghost: 'bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 shadow-none',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-bold tracking-wide',
  };

  return (
    <button
      className={clsx(baseClasses, variants[variant] || variants.primary, sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
