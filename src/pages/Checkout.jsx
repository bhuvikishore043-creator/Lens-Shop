import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { formatCurrency } from '../utils/formatters';
import { CreditCard, CheckCircle2, Lock, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Checkout = () => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      setError('Please fill in all shipping details before proceeding.');
      return;
    }
    if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
      setError('Please fill in complete payment details.');
      return;
    }

    if (clearCart) clearCart();
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <GlassCard className="p-10 border border-white bg-white/90 shadow-floating space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-sky-100 border border-sky-400 flex items-center justify-center mx-auto text-sky-700 shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
            Order Confirmed #LUM-8820
          </h1>
          <p className="text-slate-700 text-lg leading-relaxed font-medium">
            Thank you, <span className="font-bold text-slate-900">{formData.firstName} {formData.lastName}</span>! Your optical order has been received. A tracking confirmation has been sent to <span className="font-bold text-sky-700">{formData.email}</span>.
          </p>
          <Link to="/dashboard">
            <GlassButton size="lg" variant="primary" className="mt-4 shadow-glass-glow">
              View Order in Customer Portal
            </GlassButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-2">
        <GlassBadge variant="sky">Secure Optical Checkout</GlassBadge>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Order Checkout & Payment
        </h1>
        <p className="text-slate-600 text-base font-semibold">
          High-accessibility checkout for clear and effortless optical ordering.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Checkout Form Sections */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Shipping Details */}
          <GlassCard className="p-8 space-y-6 border border-white bg-white/85 shadow-glass-card">
            <h3 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2.5">
              <MapPin className="w-6 h-6 text-sky-600" /> 1. Customer & Shipping Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">First Name *</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Alexander" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Last Name *</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Vance" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium" 
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-slate-900 block">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alexander.vance@example.com" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium" 
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-slate-900 block">Shipping Street Address *</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Luxury Avenue, Suite 400" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">City *</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Postal / Zip Code *</label>
                <input 
                  type="text" 
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10001" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium" 
                  required
                />
              </div>
            </div>
          </GlassCard>

          {/* Section 2: Payment Details */}
          <GlassCard className="p-8 space-y-6 border border-white bg-white/85 shadow-glass-card">
            <h3 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2.5">
              <CreditCard className="w-6 h-6 text-sky-600" /> 2. Payment Information
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Cardholder Name *</label>
                <input 
                  type="text" 
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Name as printed on card" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Card Number *</label>
                <input 
                  type="text" 
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="4000 1234 5678 9010" 
                  className="glass-input p-3.5 rounded-xl text-base w-full font-medium font-mono" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 block">Expiration Date *</label>
                  <input 
                    type="text" 
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="MM / YY" 
                    className="glass-input p-3.5 rounded-xl text-base w-full font-medium font-mono" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 block">CVV Security Code *</label>
                  <input 
                    type="password" 
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="3 or 4 digits" 
                    className="glass-input p-3.5 rounded-xl text-base w-full font-medium font-mono" 
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {error && (
            <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-red-700 font-bold text-sm">
              {error}
            </div>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <div>
          <GlassCard className="p-6 space-y-6 sticky top-24 border border-white bg-white/90 shadow-floating">
            <h3 className="font-display font-bold text-xl text-slate-900">
              Bag Summary
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.product.name}</span>
                    <span className="text-slate-600 font-mono text-xs">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono text-slate-900 font-bold text-base">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-200 text-sm font-semibold">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Shipping</span>
                <span className="font-mono text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-lg pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="font-mono text-sky-700">{formatCurrency(cartSubtotal)}</span>
              </div>
            </div>

            <GlassButton size="lg" variant="primary" type="submit" className="w-full text-base py-4 shadow-glass-glow">
              Place Order & Pay Now <ArrowRight className="w-5 h-5 ml-1" />
            </GlassButton>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> 256-Bit SSL Encrypted Payment
            </div>
          </GlassCard>
        </div>

      </form>

    </div>
  );
};
