import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Eye, Calendar } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { GlassBadge } from '../common/GlassBadge';
import { GlassCard } from '../common/GlassCard';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative w-full space-y-8">

      {/* Hero Header Glass Box */}
      <GlassCard className="p-8 sm:p-12 relative overflow-hidden border border-white/90 bg-white/80 shadow-floating">

        {/* Glow ambient background spheres */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-sky-400/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">

          {/* Top Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <GlassBadge variant="sky" className="flex items-center gap-1.5 py-1 px-3.5">
              <Sparkles className="w-3.5 h-3.5" />
              LUMINA OPTICS LAB • EDITION 2026
            </GlassBadge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-slate-900"
          >
            ANATOMY MEETS <br />
            <span className="gradient-text-sky">ARCHITECTURE.</span>
          </motion.h1>

          {/* Luxury Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-700 text-lg sm:text-xl leading-relaxed font-semibold"
          >
            Precision 12g Japanese Beta Titanium fused with custom biometric retinal telemetry. Experience luxury eyewear designed with Apple & Gentle Monster aesthetic precision.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link to="/catalog">
              <GlassButton size="lg" variant="primary" className="shadow-glass-glow group">
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </GlassButton>
            </Link>

            <Link to="/book-test">
              <GlassButton variant="secondary" size="lg" className="border-slate-300 bg-white/95 text-slate-900 hover:bg-white font-black shadow-sm">
                <Calendar className="w-5 h-5 text-sky-600 mr-2" />
                Book Free Eye Test (100% Free for 1st Visit)
              </GlassButton>
            </Link>
          </motion.div>

        </div>

        {/* Floating Spec Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-10 border-t border-slate-200/80 mt-10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 font-bold shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-mono font-bold text-slate-900 text-base">12 Grams</span>
              <span className="text-xs text-slate-600 font-semibold">Beta Titanium Frame</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700 font-bold shadow-sm">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-mono font-bold text-slate-900 text-base">3D Retinal</span>
              <span className="text-xs text-slate-600 font-semibold">Wavefront Mapping</span>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-mono font-bold text-slate-900 text-base">UV400 Polar</span>
              <span className="text-xs text-slate-600 font-semibold">Zeiss Optics Coating</span>
            </div>
          </div>
        </div>

      </GlassCard>

    </section>
  );
};
