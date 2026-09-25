import React from 'react';
import { Eye, ShieldCheck, Truck, RefreshCw, Sparkles, Send, Calendar } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-white/80 border-t border-slate-200/90 relative overflow-hidden mt-20 text-slate-800 backdrop-blur-glass">
      
      {/* Ambient background glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-400/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Brand Guarantee Bar */}
      <div className="border-b border-slate-200/80 py-10 bg-slate-50/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">2-Year Lumina Warranty</h4>
              <p className="text-xs text-slate-500 font-medium">Covers titanium structural integrity & lens coatings.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Worldwide Express Shipping</h4>
              <p className="text-xs text-slate-500 font-medium">Complimentary insured delivery on orders over $250.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">30-Day Optical Guarantee</h4>
              <p className="text-xs text-slate-500 font-medium">Free lens remaking if prescription fit isn't perfect.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-400/50 flex items-center justify-center">
              <Eye className="w-6 h-6 text-sky-600" />
            </div>
            <span className="font-display font-black text-xl tracking-wider text-slate-900 uppercase">
              LUMINA
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Where ocular anatomy meets architectural luxury. Crafting next-generation eyewear for discerning visionaries.
          </p>
          <div className="pt-2 text-xs font-mono text-sky-700 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            PARIS • TOKYO • NEW YORK • MILAN
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
            <li><Link to="/catalog" className="hover:text-sky-700 transition-colors">Titanium Optical</Link></li>
            <li><Link to="/catalog" className="hover:text-sky-700 transition-colors">Polarized Sun Series</Link></li>
            <li><Link to="/catalog" className="hover:text-sky-700 transition-colors">Spatial Audio Smartwear</Link></li>
            <li><Link to="/catalog" className="hover:text-sky-700 transition-colors">Biometric Retinal Lenses</Link></li>
          </ul>
        </div>

        {/* Studio & Tools */}
        <div>
          <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">
            Clinical Care & Lab
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
            <li><Link to="/book-test" className="hover:text-sky-700 transition-colors flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-sky-600" /> Book Free Eye Test</Link></li>
            <li><Link to="/catalog" className="hover:text-sky-700 transition-colors">Store Catalog</Link></li>
            <li><Link to="/dashboard" className="hover:text-sky-700 transition-colors">Prescription Manager</Link></li>
            <li><Link to="/admin" className="hover:text-sky-700 transition-colors">Admin Laboratory</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wider">
            Private Access
          </h4>
          <p className="text-xs text-slate-600 font-medium">
            Receive exclusive invites to limited frame drops and optical telemetry updates.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="glass-input px-3.5 py-2 rounded-xl text-xs flex-1 border border-slate-300"
            />
            <GlassButton size="sm" type="submit" variant="primary">
              <Send className="w-3.5 h-3.5" />
            </GlassButton>
          </form>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 font-medium">
        © 2026 LUMINA OPTICS LAB. Inspired by Apple, Gentle Monster & Nothing. All rights reserved.
      </div>

    </footer>
  );
};
