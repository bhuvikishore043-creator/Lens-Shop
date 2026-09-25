import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { GlassBadge } from '../common/GlassBadge';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);

  return (
    <GlassCard interactive className="p-6 flex flex-col justify-between group relative bg-white/80 border border-white shadow-glass-card">
      <div className="space-y-4">
        {/* Card Image Container */}
        <div className="relative w-full h-48 rounded-xl bg-slate-100/80 border border-slate-200 flex items-center justify-center p-4 overflow-hidden">
          
          {/* Badge */}
          <span className="absolute top-3 left-3 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-bold">
            {product.badge || product.category}
          </span>

          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-600 hover:text-red-500 border border-slate-200 transition-colors z-10 shadow-sm"
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Quick View Trigger Overlay */}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-bold text-sky-800 transition-opacity duration-300 z-0"
            >
              <Eye className="w-4 h-4" /> Quick Preview
            </button>
          )}

          {/* Product Image */}
          <img 
            src={selectedColor?.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-bold">
              {product.brand}
            </span>
            {product.stock <= 10 && (
              <span className="text-[11px] text-orange-600 font-bold">
                Low Stock ({product.stock})
              </span>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-sky-700 transition-colors mt-0.5">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-1.5">
            <RatingStars rating={product.rating} size={14} />
            <span className="text-xs text-slate-600 font-bold">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Color Selector Dots */}
          {product.colors?.length > 1 && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Finish:</span>
              <div className="flex items-center gap-1.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(color);
                    }}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      selectedColor?.name === color.name 
                        ? 'scale-125 border-sky-600 ring-2 ring-sky-200' 
                        : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart */}
      <div className="pt-4 mt-4 border-t border-slate-200/90 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 block font-mono font-medium">Price</span>
          <span className="font-mono font-black text-xl text-slate-900">
            {formatCurrency(product.price)}
          </span>
        </div>

        <GlassButton 
          size="sm" 
          variant="primary"
          onClick={() => addToCart(product, selectedColor)}
        >
          <ShoppingBag className="w-3.5 h-3.5 mr-1" />
          Add to Cart
        </GlassButton>
      </div>
    </GlassCard>
  );
};
