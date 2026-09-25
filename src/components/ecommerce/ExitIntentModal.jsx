import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { RatingStars } from '../common/RatingStars';
import { reviewService } from '../../services/reviewService';
import { X, Star, Sparkles, Gift, CheckCircle2 } from 'lucide-react';

export const ExitIntentModal = ({ productId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Trigger when cursor leaves from the top of viewport
      if (e.clientY < 10 && !hasTriggered.current) {
        hasTriggered.current = true;
        setTimeout(() => setIsOpen(true), 300);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setLoading(true);

    if (productId) {
      await reviewService.submitReview({
        productId,
        author: 'Quick Exit Review',
        rating,
        title: 'Quick exit feedback',
        comment: feedback || 'Left a quick rating.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isVerifiedBuyer: false
      });
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <GlassCard className="w-full max-w-md overflow-hidden border border-white shadow-floating bg-white/95 relative">

        {/* Top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-sky-500 to-amber-500" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 space-y-6 relative z-10">

          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>
              <h3 className="font-display font-black text-2xl text-slate-900">
                Thank You, Visionary!
              </h3>
              <p className="text-sm text-slate-600 font-medium">
                Your feedback powers our optical lab. Enjoy <span className="text-sky-700 font-bold">15% off</span> your next order with code:
              </p>
              <div className="mx-auto px-6 py-2.5 rounded-xl bg-sky-50 border border-sky-300 font-mono font-black text-sky-700 tracking-widest text-xl">
                LUMINA15
              </div>
              <GlassButton size="md" variant="primary" className="w-full shadow-glass-glow" onClick={() => setIsOpen(false)}>
                <Sparkles className="w-4 h-4 mr-1" /> Continue Shopping
              </GlassButton>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-700 shadow-sm">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-2xl text-slate-900">
                  Wait — A Gift For You!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
                  Rate your Lumina experience today and receive an exclusive <span className="text-amber-700 font-bold">15% discount</span> on your next frame.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star rating interactive */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">How was your visit?</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors duration-150 ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-xs font-bold text-sky-700 animate-fade-in">
                      {['', 'Needs improvement', 'Below expectations', 'Decent experience', 'Really enjoying it!', 'Absolutely outstanding!'][rating]}
                    </span>
                  )}
                </div>

                {/* Optional comment */}
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Share what you loved or what we can improve..."
                  className="glass-input p-3 rounded-xl text-sm w-full resize-none font-medium"
                />

                <GlassButton
                  type="submit"
                  size="lg"
                  variant="gold"
                  className="w-full shadow-gold-glow"
                  disabled={!rating || loading}
                >
                  {loading ? 'Submitting...' : 'Claim My 15% Discount'}
                </GlassButton>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 block mx-auto transition-colors"
                >
                  No thanks, continue without discount
                </button>
              </form>
            </>
          )}
        </div>

      </GlassCard>
    </div>
  );
};
