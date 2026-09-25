import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import {
  User, ShieldCheck, Stethoscope, Crown, Mail,
  ArrowRight, Eye
} from 'lucide-react';

const ROLES = [
  {
    id: 'customer',
    label: 'Customer Portal',
    icon: User,
    color: 'sky',
    badgeText: 'Role 1: Customer',
    description: 'Browse architectural eyewear, book complimentary eye tests, view orders, and manage digital optical prescriptions.',
    demoEmail: 'customer@lumina.design',
    demoName: 'Elena Rostova',
    redirectPath: '/dashboard'
  },
  {
    id: 'staff',
    label: 'Staff Workspace',
    icon: Stethoscope,
    color: 'peach',
    badgeText: 'Role 2: Optometry Staff',
    description: 'Manage Free Eye Test leads, update calling status (Called/Confirmed/Visited), close customer deals, and log prescriptions.',
    demoEmail: 'staff@lumina.design',
    demoName: 'Alex Rivera (Senior Optometrist)',
    redirectPath: '/staff/dashboard'
  },
  {
    id: 'admin',
    label: 'Owner / Admin',
    icon: Crown,
    color: 'gold',
    badgeText: 'Role 3: Store Owner & Admin',
    description: 'Master control over eyewear inventory, pricing CRUD, staff sales conversion telemetry, and clinic revenue analytics.',
    demoEmail: 'admin@lumina.design',
    demoName: 'Dr. Arthur Lumina (Store Owner)',
    redirectPath: '/admin'
  }
];

export const Login = () => {
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginAsRole, loginWithOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUser = (role) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }
    if (role === 'admin') navigate('/admin', { replace: true });
    else if (role === 'staff') navigate('/staff/dashboard', { replace: true });
    else navigate('/dashboard', { replace: true });
  };

  // Instant 1-Click Demo Login
  const handleQuickDemoLogin = async (roleId) => {
    setLoading(true);
    setError('');
    try {
      const loggedIn = await loginAsRole(roleId);
      redirectUser(loggedIn.role);
    } catch (err) {
      setError('Failed to log in with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 400);
  };

  const handleOTPChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 5) {
      document.getElementById(`login-otp-${idx + 1}`)?.focus();
    }
  };

  const handleVerifyAndLogin = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const loggedIn = await loginWithOTP(email, code, activeRole.id);
      redirectUser(loggedIn.role);
    } catch (err) {
      setError(err.message || 'Invalid verification code. Try 888999');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top Title & Brand */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2">
          <GlassBadge variant="sky">Unified Multi-Role Authentication</GlassBadge>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Lumina Optics Operating Access
        </h1>
        <p className="text-slate-600 text-base font-medium max-w-xl mx-auto">
          Select your portal role to access dedicated dashboards for Customers, Optometry Staff, or Store Owners.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = activeRole.id === role.id;
          return (
            <button
              key={role.id}
              onClick={() => {
                setActiveRole(role);
                setEmail(role.demoEmail);
                setError('');
                setStep('credentials');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-sky-500 bg-white shadow-floating ring-2 ring-sky-200'
                  : 'border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${
                  role.id === 'customer' ? 'bg-sky-100 text-sky-800' :
                  role.id === 'staff' ? 'bg-orange-100 text-orange-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">{role.badgeText}</span>
              </div>
              <div>
                <h3 className="font-display font-black text-slate-900 text-base">{role.label}</h3>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-0.5">{role.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Login Card with Quick 1-Click Demo & Manual Option */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Quick 1-Click Demo Logins & Role Highlights */}
        <div className="md:col-span-7 space-y-6">
          <GlassCard className="p-8 border border-white bg-white/90 shadow-glass-card space-y-6">
            
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-mono">
                ⚡ 1-Click Instant Demo Authentication
              </span>
              <h3 className="font-display font-black text-2xl text-slate-900">
                Log In As {activeRole.label}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Click the button below to immediately access the {activeRole.label} with preloaded demo records and test data.
              </p>
            </div>

            {/* Quick Demo Button for Active Role */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                    <activeRole.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{activeRole.demoName}</h4>
                    <span className="text-xs text-slate-500 font-mono font-medium">{activeRole.demoEmail}</span>
                  </div>
                </div>
                <GlassBadge variant={activeRole.id === 'customer' ? 'sky' : activeRole.id === 'staff' ? 'peach' : 'gold'}>
                  {activeRole.id.toUpperCase()}
                </GlassBadge>
              </div>

              <GlassButton
                size="lg"
                variant={activeRole.id === 'customer' ? 'primary' : activeRole.id === 'staff' ? 'peach' : 'gold'}
                onClick={() => handleQuickDemoLogin(activeRole.id)}
                className="w-full py-4 shadow-sm"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : `Instant 1-Click Login (${activeRole.label})`}
                <ArrowRight className="w-5 h-5 ml-1.5" />
              </GlassButton>
            </div>

            {/* All 3 Demo Buttons in a quick bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block">Switch & Test Other Demo Portals:</span>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleQuickDemoLogin(r.id)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <r.icon className="w-3.5 h-3.5 text-sky-600" />
                    {r.id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

          </GlassCard>
        </div>

        {/* Right 5 Cols: Standard Email/OTP Login */}
        <div className="md:col-span-5">
          <GlassCard className="p-8 border border-white bg-white/90 shadow-glass-card space-y-5">
            
            <div className="space-y-1 border-b border-slate-200/80 pb-3">
              <span className="text-xs font-mono font-bold text-slate-500">Manual Entry</span>
              <h3 className="font-display font-black text-xl text-slate-900">Email Verification</h3>
            </div>

            {step === 'credentials' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-sky-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeRole.demoEmail}
                    className="glass-input p-3.5 rounded-xl text-sm w-full font-medium"
                    required
                  />
                </div>

                {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

                <GlassButton
                  type="submit"
                  size="md"
                  variant="primary"
                  className="w-full shadow-glass-glow"
                  disabled={loading}
                >
                  {loading ? 'Sending Code...' : 'Send Verification OTP'}
                </GlassButton>

                <p className="text-[11px] text-center text-slate-500 font-medium font-mono">
                  Universal Demo OTP: <span className="text-sky-700 font-bold">888999</span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndLogin} className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-600 font-medium">
                    Code sent to <span className="font-bold text-slate-900">{email}</span>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`login-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOTPChange(e.target.value, idx)}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                          document.getElementById(`login-otp-${idx - 1}`)?.focus();
                        }
                      }}
                      className="w-10 h-12 text-center text-lg font-mono font-black rounded-xl glass-input text-sky-700 border-2 border-slate-300 focus:border-sky-600"
                    />
                  ))}
                </div>

                {error && <p className="text-xs text-red-600 font-bold text-center">{error}</p>}

                <GlassButton
                  type="submit"
                  size="md"
                  variant="primary"
                  className="w-full shadow-glass-glow"
                  disabled={loading || otp.join('').length < 6}
                >
                  {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
                </GlassButton>

                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-xs text-slate-500 hover:text-sky-700 font-bold block mx-auto transition-colors cursor-pointer"
                >
                  ← Change Email Address
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Role-Based Access Control (RBAC) Active</span>
            </div>

          </GlassCard>
        </div>

      </div>

    </div>
  );
};
