import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { GlassBadge } from '../common/GlassBadge';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency } from '../../utils/formatters';
import { X, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <GlassCard className="w-full max-w-3xl p-6 sm:p-8 relative border border-white shadow-floating bg-white/95 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Image preview */}
          <div className="relative w-full h-64 sm:h-80 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center p-6">
            <GlassBadge variant="sky" className="absolute top-3 left-3">
              {product.category}
            </GlassBadge>

            <img 
              src={selectedColor?.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
              alt={product.name} 
              className="max-h-full object-contain"
            />
          </div>

          {/* Specs & Add */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-widest font-bold">{product.brand}</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-0.5">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <RatingStars rating={product.rating} size={16} />
                <span className="text-xs text-slate-600 font-bold">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="font-mono text-2xl font-black text-slate-900">
              {formatCurrency(product.price)}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Select Frame Finish:</span>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                        selectedColor?.name === color.name
                          ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-200'
                          : 'border-slate-200 bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <GlassButton 
                size="md" 
                variant="primary"
                className="flex-1 shadow-glass-glow"
                onClick={() => {
                  addToCart(product, selectedColor);
                  onClose();
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-1.5" /> Add to Bag
              </GlassButton>

              <button 
                onClick={() => toggleWishlist(product)}
                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-500 transition-colors shadow-sm"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

          </div>

        </div>

      </GlassCard>
    </div>
  );
};
