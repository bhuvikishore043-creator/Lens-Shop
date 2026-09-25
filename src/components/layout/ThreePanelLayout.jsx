import React from 'react';

/**
 * Simplified layout container wrapping the main scrollable e-commerce content.
 * Sits transparently on top of the fixed RainbowGlassesBackground.
 */
export const ThreePanelLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen relative text-slate-900">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen space-y-12">
        {children}
      </div>
    </div>
  );
};
