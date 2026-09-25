import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { RatingStars } from '../components/common/RatingStars';
import { CustomerReviews } from '../components/ecommerce/CustomerReviews';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, Heart, ArrowLeft, ShieldCheck, Calendar } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    productService.getProductById(id || 'lum-01').then((p) => {
      setProduct(p);
      if (p?.colors?.length > 0) setSelectedColor(p.colors[0]);
    });
  }, [id]);

  if (!product) {
    return <div className="p-20 text-center text-slate-500 font-bold">Loading Lumina optics specifications...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Store Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Product Visual Container */}
        <GlassCard className="p-8 border border-white flex flex-col justify-between relative overflow-hidden bg-white/85 shadow-glass-card">
          <div className="absolute top-4 left-4 z-10">
            <GlassBadge variant="sky">{product.category}</GlassBadge>
          </div>

          <div className="w-full h-80 sm:h-96 flex items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 my-4">
            <img 
              src={selectedColor?.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
              alt={product.name} 
              className="max-h-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Color Selector */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Finish: <span className="text-slate-900 font-extrabold">{selectedColor?.name}</span>
            </span>
            <div className="flex items-center gap-3">
              {product.colors?.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                    selectedColor?.name === col.name ? 'scale-110 border-sky-600 ring-2 ring-sky-200' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Details & Specs */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-sky-700 uppercase tracking-widest font-bold">{product.brand}</span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.rating} size={18} />
              <span className="text-sm text-slate-600 font-bold">
                {product.rating} ({product.reviewCount} verified reviews)
              </span>
            </div>
          </div>

          <div className="font-mono text-3xl font-black text-slate-900">
            {formatCurrency(product.price)}
          </div>

          <p className="text-slate-700 text-base leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-200/80 text-sm">
            <div>
              <span className="text-slate-500 block font-semibold text-xs uppercase tracking-wider">Frame Material</span>
              <span className="text-slate-900 font-bold text-base">{product.frameMaterial}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold text-xs uppercase tracking-wider">Lens Optics</span>
              <span className="text-slate-900 font-bold text-base">{product.lensType}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <GlassButton size="lg" variant="primary" className="w-full sm:flex-1 shadow-glass-glow" onClick={() => addToCart(product, selectedColor)}>
              <ShoppingBag className="w-5 h-5 mr-1" />
              Add to Bag ({formatCurrency(product.price)})
            </GlassButton>

            <Link to="/book-test" className="w-full sm:w-auto">
              <GlassButton size="lg" variant="secondary" className="w-full">
                <Calendar className="w-5 h-5 mr-1.5 text-sky-600" />
                Book Free Eye Test
              </GlassButton>
            </Link>

            <button 
              onClick={() => toggleWishlist(product)}
              className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
              title="Add to Wishlist"
            >
              <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200/80 flex items-center gap-3 text-xs text-sky-900 font-medium">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
            <span>Includes 2-Year Titanium Warranty, Zeiss Anti-Reflective Coating & Free Worldwide Express Delivery.</span>
          </div>
        </div>

      </div>

      {/* Customer Reviews Section */}
      <CustomerReviews productId={product.id} />

    </div>
  );
};
