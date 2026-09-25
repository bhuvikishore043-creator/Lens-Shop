import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, size = 16, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 text-amber-400 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-600"}
        />
      ))}
    </div>
  );
};
