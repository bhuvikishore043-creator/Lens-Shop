import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { GlassBadge } from '../common/GlassBadge';
import { RatingStars } from '../common/RatingStars';
import { ShieldCheck, ThumbsUp, Upload, Plus, X } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CustomerReviews = ({ productId = 'lum-01' }) => {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    title: '',
    comment: '',
    photos: []
  });

  useEffect(() => {
    reviewService.getReviewsByProduct(productId).then(setReviews);
  }, [productId]);

  const handleVoteHelpful = async (reviewId) => {
    await reviewService.voteHelpful(reviewId);
    const updated = await reviewService.getReviewsByProduct(productId);
    setReviews(updated);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const urls = files.map(file => URL.createObjectURL(file));
      setNewReview(prev => ({ ...prev, photos: [...prev.photos, ...urls] }));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.author || !newReview.title || !newReview.comment) return;

    await reviewService.submitReview({
      productId,
      author: newReview.author,
      rating: Number(newReview.rating),
      title: newReview.title,
      comment: newReview.comment,
      userPhotos: newReview.photos,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    setIsWriteOpen(false);
    setNewReview({ author: '', rating: 5, title: '', comment: '', photos: [] });
    const refreshed = await reviewService.getReviewsByProduct(productId);
    setReviews(refreshed);
  };

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    if (filterRating === 'photos') return r.userPhotos?.length > 0;
    return r.rating === Number(filterRating);
  });

  return (
    <section className="space-y-8 pt-6">
      
      {/* Header & Rating Breakdown */}
      <GlassCard className="p-8 space-y-6 border border-white bg-white/85 shadow-glass-card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="font-display font-black text-5xl text-slate-900 block">4.9</span>
              <RatingStars rating={4.9} size={18} className="mt-1 justify-center" />
              <span className="text-xs text-slate-500 font-bold mt-1 block">Based on 42 reviews</span>
            </div>

            <div className="h-16 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="space-y-1 w-48 text-xs font-mono">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-slate-600 font-bold w-3">{star}★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600" 
                      style={{ width: star === 5 ? '88%' : star === 4 ? '10%' : '2%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlassButton size="md" variant="primary" className="shadow-glass-glow" onClick={() => setIsWriteOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Write a Review
          </GlassButton>

        </div>

        {/* Rating Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200">
          {['all', '5', '4', 'photos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterRating(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterRating === tab 
                  ? 'bg-sky-600 text-white shadow-sm' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab === 'all' ? 'All Reviews' : tab === 'photos' ? 'With Customer Photos' : `${tab} Stars`}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Review Submission Modal */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-lg p-6 space-y-4 border border-white bg-white/95 relative shadow-floating">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-display font-black text-xl text-slate-900">Submit Verified Review</h3>
              <button onClick={() => setIsWriteOpen(false)} className="p-1 text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Aris Thorne" 
                  value={newReview.author}
                  onChange={e => setNewReview({ ...newReview, author: e.target.value })}
                  className="glass-input p-3 rounded-xl text-sm w-full font-medium"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Rating:</span>
                <select 
                  value={newReview.rating}
                  onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
                  className="glass-input p-2 rounded-xl text-xs bg-white text-slate-800 font-bold"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Review Headline *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Unrivaled optical clarity and weightlessness" 
                  value={newReview.title}
                  onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                  className="glass-input p-3 rounded-xl text-sm w-full font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Review Comment *</label>
                <textarea 
                  placeholder="Share your optical clarity & frame fit experience..." 
                  rows={4}
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  className="glass-input p-3 rounded-xl text-sm w-full resize-none font-medium"
                  required
                />
              </div>

              {/* Photo Upload UI */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5 cursor-pointer hover:text-sky-700">
                  <Upload className="w-4 h-4 text-sky-600" /> Upload Photo of Frame
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>

                {newReview.photos.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {newReview.photos.map((url, idx) => (
                      <img key={idx} src={url} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-sky-400" />
                    ))}
                  </div>
                )}
              </div>

              <GlassButton type="submit" size="md" variant="primary" className="w-full shadow-glass-glow">
                Post Review
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <GlassCard key={rev.id} className="p-6 space-y-3 border border-white bg-white/80 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={rev.avatar} alt={rev.author} className="w-10 h-10 rounded-full object-cover border border-sky-400" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.author}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-sky-700 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Buyer
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{formatDate(rev.date)}</span>
                  </div>
                </div>
              </div>

              <RatingStars rating={rev.rating} size={16} />
            </div>

            <h5 className="font-bold text-slate-900 text-sm">{rev.title}</h5>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>

            {/* Customer Photos */}
            {rev.userPhotos?.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {rev.userPhotos.map((photo, i) => (
                  <img key={i} src={photo} alt="Customer fit" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button 
                onClick={() => handleVoteHelpful(rev.id)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-sky-700 transition-colors font-bold cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount})
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

    </section>
  );
};
