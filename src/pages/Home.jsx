import React, { useEffect, useState } from 'react';
import { ThreePanelLayout } from '../components/layout/ThreePanelLayout';
import { HeroSection } from '../components/ecommerce/HeroSection';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { RatingStars } from '../components/common/RatingStars';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { formatCurrency } from '../utils/formatters';
import { ArrowRight, ShieldCheck, Heart, ShoppingBag, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    productService.getProducts().then(data => {
      setFeaturedProducts(data.slice(0, 3));
    });
    reviewService.getReviews().then(data => {
      setReviews(data);
    });
  }, []);

  return (
    <ThreePanelLayout>

      {/* Main Store Hero Section */}
      <HeroSection />

      {/* Free Eye Test Booking Feature Banner */}
      <section className="pt-2">
        <GlassCard className="p-8 sm:p-10 border border-white/90 bg-gradient-to-r from-white via-sky-50/70 to-white shadow-floating flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <GlassBadge variant="sky">Free Clinical Consultation</GlassBadge>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                100% Free First Visit
              </span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Computerized 3D Retinal Scan & Eye Test
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              Schedule a 25-minute comprehensive eye examination with certified optometrists at our flagship studios. Includes wavefront refraction, glaucoma check, and custom titanium frame fitting.
            </p>
          </div>

          <Link to="/book-test" className="shrink-0">
            <GlassButton size="lg" variant="primary" className="shadow-glass-glow">
              <Calendar className="w-5 h-5 mr-2" />
              Book Free Eye Test ($0)
            </GlassButton>
          </Link>
        </GlassCard>
      </section>

      {/* Featured Luxury Frames Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <GlassBadge variant="sky">Featured Collection</GlassBadge>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-2">
              Architectural Eyewear
            </h2>
          </div>
          <Link to="/catalog" className="text-sm font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1">
            View All Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <GlassCard key={product.id} interactive className="p-6 flex flex-col justify-between group bg-white/80 border border-white shadow-glass-card">
              <div className="space-y-4">
                <div className="relative w-full h-48 rounded-xl bg-slate-100/90 border border-slate-200 flex items-center justify-center overflow-hidden p-4">
                  <span className="absolute top-3 left-3 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-bold">
                    {product.badge || 'New'}
                  </span>
                  
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-slate-600 hover:text-red-500 border border-slate-200 transition-colors shadow-sm"
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <img 
                    src={product.colors[0]?.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-bold">
                    {product.brand}
                  </span>
                  <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-sky-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/90 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-mono font-medium">Price</span>
                  <span className="font-mono font-black text-xl text-slate-900">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <GlassButton size="sm" variant="primary" onClick={() => addToCart(product)}>
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Add to Cart
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Technology & Material Highlight */}
      <section className="pt-4">
        <GlassCard className="p-8 sm:p-10 border border-white/90 bg-white/80 shadow-glass-card">
          <div className="max-w-xl space-y-4">
            <GlassBadge variant="peach">Gentle Monster & Apple Inspired</GlassBadge>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Zero-Pressure Titanium Bevels
            </h3>
            <p className="text-base text-slate-700 leading-relaxed font-medium">
              Every frame is CNC milled from aerospace-grade Japanese Beta Titanium blocks, requiring 120 hours of hand polishing to achieve seamless glassmorphic contours.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <div className="text-center px-5 py-3 rounded-xl bg-slate-100 border border-slate-200">
                <span className="block font-mono font-black text-2xl text-sky-700">120 hrs</span>
                <span className="text-xs text-slate-600 font-bold">Hand Polishing</span>
              </div>
              <div className="text-center px-5 py-3 rounded-xl bg-slate-100 border border-slate-200">
                <span className="block font-mono font-black text-2xl text-orange-600">0.02 mm</span>
                <span className="text-xs text-slate-600 font-bold">CNC Tolerance</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Customer Review Highlights */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <GlassBadge variant="gold">Verified Buyer Reviews</GlassBadge>
            <h2 className="font-display font-black text-2xl text-slate-900 mt-1">
              What Visionaries Say
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <GlassCard key={rev.id} className="p-6 space-y-3 bg-white/80 border border-white shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={rev.avatar} alt={rev.author} className="w-11 h-11 rounded-full object-cover border border-sky-400/50" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rev.author}</h4>
                    <span className="text-xs text-sky-700 flex items-center gap-1 font-mono font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Buyer
                    </span>
                  </div>
                </div>
                <RatingStars rating={rev.rating} size={16} />
              </div>
              <h5 className="font-bold text-slate-900 text-sm">{rev.title}</h5>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>
            </GlassCard>
          ))}
        </div>
      </section>

    </ThreePanelLayout>
  );
};
