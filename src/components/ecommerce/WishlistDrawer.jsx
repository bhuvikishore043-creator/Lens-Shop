import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { GlassButton } from '../common/GlassButton';
import { formatCurrency } from '../../utils/formatters';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={() => setIsWishlistOpen(false)} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 border-l border-white p-6 flex flex-col justify-between shadow-floating backdrop-blur-glass">
          
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="font-display font-black text-xl text-slate-900">
                Saved Wishlist ({wishlist.length})
              </h2>
            </div>
            <button 
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2 pr-1">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                <Heart className="w-12 h-12 text-slate-400 animate-pulse" />
                <p className="font-medium text-sm text-slate-600">No frames saved to wishlist.</p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div 
                  key={product.id} 
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <img 
                    src={product.colors?.[0]?.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
                    alt={product.name}
                    className="w-16 h-16 object-contain bg-white rounded-lg p-2 border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {product.name}
                    </h4>
                    <span className="font-mono font-black text-slate-900 text-sm mt-1 block">
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        addToCart(product);
                        toggleWishlist(product);
                      }}
                      className="p-2 rounded-lg bg-sky-100 text-sky-700 border border-sky-300 hover:bg-sky-200"
                      title="Move to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="p-2 rounded-lg bg-white text-slate-400 hover:text-red-500 border border-slate-200"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
