import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Eye, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center">
      <GlassCard className="p-8 space-y-6 border border-white/10">
        <Eye className="w-16 h-16 text-cyan-glow mx-auto animate-pulse" />
        <h1 className="font-display font-extrabold text-4xl text-slate-100">404</h1>
        <p className="text-slate-400 text-sm">
          The requested optics spectrum could not be resolved by our 3D laboratory.
        </p>
        <Link to="/">
          <GlassButton size="md" className="w-full">
            <ArrowLeft className="w-4 h-4" /> Return to Lumina Home
          </GlassButton>
        </Link>
      </GlassCard>
    </div>
  );
};
