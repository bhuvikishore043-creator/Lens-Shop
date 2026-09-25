import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Eye, Mail, X, Shield, Sparkles, ArrowRight } from 'lucide-react';

const STAGES = { EMAIL: 'email', OTP: 'otp', SUCCESS: 'success' };

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithOTP } = useAuth();
  const [stage, setStage] = useState(STAGES.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const close = () => {
    setIsAuthModalOpen(false);
    setStage(STAGES.EMAIL);
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    setError('');
    try {
      await authService.sendEmailOTP(email);
      setStage(STAGES.OTP);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPInput = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the complete 6-digit code.'); return; }
    setLoading(true);
    setError('');
    try {
      await loginWithOTP(email, code);
      setStage(STAGES.SUCCESS);
      setTimeout(close, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <GlassCard className="w-full max-w-md p-0 overflow-hidden border border-white shadow-floating bg-white/95">

        {/* Top gradient accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500" />

        <div className="p-8 space-y-6">

          {/* Close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center">
                <Eye className="w-5 h-5 text-sky-600 animate-pulse" />
              </div>
              <div>
                <span className="font-display font-black text-slate-900 block text-lg">
                  {stage === STAGES.EMAIL ? 'Sign In to Lumina' : stage === STAGES.OTP ? 'Enter Verification Code' : 'Welcome Back'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {stage === STAGES.EMAIL ? 'Secure email-based access' : stage === STAGES.OTP ? 'Check your inbox' : 'Identity verified'}
                </span>
              </div>
            </div>
            <button onClick={close} className="p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Stage: Email Entry ── */}
          {stage === STAGES.EMAIL && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="name@example.com"
                  className="glass-input px-4 py-3 rounded-xl text-sm w-full font-medium"
                  required
                  autoFocus
                />
              </div>

              {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

              <GlassButton type="submit" size="lg" variant="primary" className="w-full shadow-glass-glow" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </GlassButton>

              <p className="text-xs text-center text-slate-500 font-medium">
                Demo: Use any email. OTP will be <span className="text-sky-700 font-bold font-mono">888999</span>
              </p>
            </form>
          )}

          {/* ── Stage: OTP Entry ── */}
          {stage === STAGES.OTP && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center space-y-1">
                <Shield className="w-8 h-8 text-sky-600 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Code sent to <span className="text-sky-700 font-bold">{email}</span>
                </p>
              </div>

              {/* 6-digit OTP input blocks */}
              <div className="flex items-center justify-center gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOTPInput(e.target.value, idx)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                        document.getElementById(`otp-${idx - 1}`)?.focus();
                      }
                    }}
                    className="w-11 h-14 text-center text-xl font-mono font-black rounded-xl glass-input text-sky-700 border-2 border-slate-300 focus:border-sky-600"
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-600 font-bold text-center">{error}</p>}

              <GlassButton type="submit" size="lg" variant="primary" className="w-full shadow-glass-glow" disabled={loading || otp.join('').length < 6}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </GlassButton>

              <button
                type="button"
                onClick={() => setStage(STAGES.EMAIL)}
                className="text-xs text-slate-500 hover:text-sky-700 font-bold block mx-auto transition-colors"
              >
                ← Change email address
              </button>
            </form>
          )}

          {/* ── Stage: Success ── */}
          {stage === STAGES.SUCCESS && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-sky-100 border border-sky-400 flex items-center justify-center mx-auto text-sky-700">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="font-display font-black text-2xl text-slate-900">Identity Verified</h3>
              <p className="text-sm text-slate-600 font-medium">
                Welcome back to Lumina Optics. Your dashboard is ready.
              </p>
            </div>
          )}

        </div>
      </GlassCard>
    </div>
  );
};
