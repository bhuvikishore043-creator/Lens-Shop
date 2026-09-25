import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassBadge } from '../components/common/GlassBadge';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { QuickViewModal } from '../components/ecommerce/QuickViewModal';
import { productService } from '../services/productService';
import { Search } from 'lucide-react';

export const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    productService.filterProducts({ category, search: searchQuery, sortBy }).then(setProducts);
  }, [category, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <GlassBadge variant="sky">Store Catalog</GlassBadge>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Biometric Eyewear & Optics
        </h1>
        <p className="text-slate-600 text-base font-medium max-w-2xl">
          Browse luxury Japanese titanium frames, UV400 Zeiss polarized lenses, and spatial audio smart glasses.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <GlassCard className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-white bg-white/85 shadow-glass-card">
        
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Frames' },
            { id: 'optical', label: 'Optical' },
            { id: 'sunglasses', label: 'Sunglasses' },
            { id: 'smart', label: 'Smartwear' },
            { id: 'lenses', label: 'Lenses' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                category === id 
                  ? 'bg-sky-600 text-white shadow-sm' 
                  : 'bg-white/80 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search frames..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-9 pr-4 py-2 rounded-xl text-xs w-full font-medium"
            />
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-800 font-bold"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

      </GlassCard>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={(p) => setQuickViewProduct(p)} 
          />
        ))}
      </div>

      {/* Quick View Modal Overlay */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

    </div>
  );
};
