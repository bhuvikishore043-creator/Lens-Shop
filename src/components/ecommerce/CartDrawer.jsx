import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { GlassBadge } from '../common/GlassBadge';
import { formatCurrency } from '../../utils/formatters';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, FileText } from 'lucide-react';

export const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal,
    cartCount 
  } = useCart();
  const navigate = useNavigate();
  const [lensOption, setLensOption] = useState('non-prescription');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 border-l border-white p-6 flex flex-col justify-between shadow-floating backdrop-blur-glass">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h2 className="font-display font-black text-xl text-slate-900">
                Your Bag ({cartCount})
              </h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 my-2 pr-1">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-400 animate-pulse" />
                <p className="font-medium text-sm text-slate-600">Your bag is empty.</p>
                <GlassButton size="sm" variant="primary" onClick={() => setIsCartOpen(false)}>
                  Explore Store Catalog
                </GlassButton>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <img 
                    src={item.color?.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
                    alt={item.product.name}
                    className="w-16 h-16 object-contain bg-white rounded-lg p-2 border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] font-mono text-sky-700 font-bold block">
                      Finish: {item.color?.name || 'Standard'}
                    </span>
                    <span className="font-mono font-black text-slate-900 text-sm mt-1 block">
                      {formatCurrency(item.product.price)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-slate-600 hover:text-slate-900 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono text-slate-900 font-bold px-1">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-slate-600 hover:text-slate-900 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Prescription Selection & Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200/80 pt-4 space-y-4">
              
              {/* Prescription lens choice */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" /> Lens Configuration:
                </span>
                <select
                  value={lensOption}
                  onChange={(e) => setLensOption(e.target.value)}
                  className="glass-input p-2.5 rounded-xl text-xs w-full bg-white border border-slate-300 text-slate-800 font-bold"
                >
                  <option value="non-prescription">Non-Prescription (Zeiss Anti-Blue Included)</option>
                  <option value="single-vision">Single Vision Prescription (+$50)</option>
                  <option value="progressive">3D Digital Wavefront Progressive (+$120)</option>
                </select>
              </div>

              {/* Price summary */}
              <div className="space-y-1 text-sm font-semibold">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-mono font-bold">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Express Shipping</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
              </div>

              <GlassButton 
                size="lg" 
                variant="primary"
                className="w-full shadow-glass-glow"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
