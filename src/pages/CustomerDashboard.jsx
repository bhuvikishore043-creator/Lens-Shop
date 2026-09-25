import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { appointmentService } from '../services/appointmentService';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Eye, Calendar, FileText, LogOut, Package,
  Heart, ShoppingBag, Plus,
  ShieldCheck, Clock, Edit3, Save, CheckCircle2
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'prescription', label: 'Prescription', icon: FileText },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
];

const MOCK_ORDERS = [
  {
    id: 'LUM-8801',
    product: 'Aetherium Titanium Specs',
    color: 'Obsidian Cyan',
    price: 420,
    status: 'Delivered',
    date: '2026-07-15',
    tracking: 'JP-4421-LUMX'
  },
  {
    id: 'LUM-7733',
    product: 'Biometric Retinal Lens Kit',
    color: 'Clear Optics',
    price: 280,
    status: 'Processing',
    date: '2026-08-10',
    tracking: 'JP-9922-LUMX'
  }
];

export const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { cartItems } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [isEditingPrescription, setIsEditingPrescription] = useState(false);
  const [prescription, setPrescription] = useState(
    user?.prescription || { od: { sph: '-2.25', cyl: '-0.50', axis: '180' }, os: { sph: '-2.00', cyl: '-0.75', axis: '175' }, pd: '63.5' }
  );
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', type: 'Comprehensive 3D Retina Scan & Custom Fitting' });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    appointmentService.getAppointments().then(setAppointments);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const apt = await appointmentService.bookAppointment({
      customerName: user?.name || 'Customer',
      email: user?.email || '',
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
    });
    setAppointments(prev => [apt, ...prev]);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
    setBookingForm({ date: '', time: '', type: bookingForm.type });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Profile Header */}
      <GlassCard className="p-8 border border-white bg-white/85 shadow-glass-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">{user?.name || 'Lumina Member'}</h1>
                <GlassBadge variant="sky">VIP Member</GlassBadge>
              </div>
              <p className="text-sm text-slate-600 font-mono mt-1 font-medium">{user?.email || 'member@lumina.design'}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 font-mono font-medium">
                <span>{MOCK_ORDERS.length} orders</span>
                <span>•</span>
                <span>{wishlist.length} saved frames</span>
                <span>•</span>
                <span>{appointments.length} appointments</span>
              </div>
            </div>
          </div>
          <GlassButton variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </GlassButton>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-200/80 overflow-x-auto pb-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white/80 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard interactive className="p-6 space-y-2 border border-white bg-white/85 shadow-sm" onClick={() => setActiveTab('orders')}>
            <Package className="w-8 h-8 text-sky-600" />
            <span className="font-mono font-black text-3xl text-slate-900 block">{MOCK_ORDERS.length}</span>
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Total Orders</span>
          </GlassCard>
          <GlassCard interactive className="p-6 space-y-2 border border-white bg-white/85 shadow-sm" onClick={() => setActiveTab('wishlist')}>
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <span className="font-mono font-black text-3xl text-slate-900 block">{wishlist.length}</span>
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Saved Frames</span>
          </GlassCard>
          <GlassCard interactive className="p-6 space-y-2 border border-white bg-white/85 shadow-sm" onClick={() => setActiveTab('appointments')}>
            <Calendar className="w-8 h-8 text-amber-600" />
            <span className="font-mono font-black text-3xl text-slate-900 block">{appointments.length}</span>
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Appointments</span>
          </GlassCard>
          <GlassCard interactive className="p-6 space-y-2 border border-white bg-white/85 shadow-sm" onClick={() => setActiveTab('prescription')}>
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="font-mono font-black text-xl text-slate-900 block mt-2">Active</span>
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Saved Prescription</span>
          </GlassCard>
        </div>
      )}

      {/* ─── ORDERS TAB ─── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-display font-black text-2xl text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-sky-600" /> Order History
          </h2>
          {MOCK_ORDERS.map(order => (
            <GlassCard key={order.id} className="p-6 border border-white bg-white/85 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-sky-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{order.product}</h4>
                  <span className="text-xs text-slate-600 font-medium block">Finish: {order.color}</span>
                  <span className="text-xs text-slate-500 font-mono">Ordered: {formatDate(order.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-mono font-black text-slate-900 text-lg block">{formatCurrency(order.price)}</span>
                  <span className="text-xs font-mono text-slate-500">#{order.tracking}</span>
                </div>
                <GlassBadge variant={order.status === 'Delivered' ? 'sky' : 'gold'}>
                  {order.status}
                </GlassBadge>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ─── PRESCRIPTION TAB ─── */}
      {activeTab === 'prescription' && (
        <GlassCard className="p-8 space-y-6 border border-white bg-white/85 shadow-glass-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-2xl text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-sky-600" /> Saved Optical Prescription
            </h2>
            <GlassButton
              size="sm"
              variant={isEditingPrescription ? 'primary' : 'secondary'}
              onClick={() => setIsEditingPrescription(!isEditingPrescription)}
            >
              {isEditingPrescription ? <><Save className="w-4 h-4 mr-1" /> Save Prescription</> : <><Edit3 className="w-4 h-4 mr-1" /> Edit</>}
            </GlassButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[['od', 'Right Eye (OD)'], ['os', 'Left Eye (OS)']].map(([eye, label]) => (
              <div key={eye} className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-base">{label}</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {['sph', 'cyl', 'axis'].map((field) => (
                    <div key={field}>
                      <span className="text-slate-500 font-bold uppercase block mb-1">{field}</span>
                      {isEditingPrescription ? (
                        <input
                          type="text"
                          value={prescription[eye][field]}
                          onChange={e => setPrescription(prev => ({ ...prev, [eye]: { ...prev[eye], [field]: e.target.value } }))}
                          className="glass-input p-2.5 rounded-lg text-sm w-full font-mono font-bold"
                        />
                      ) : (
                        <span className="font-mono font-black text-base text-slate-900">{prescription[eye][field]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Pupillary Distance (PD)</span>
            {isEditingPrescription ? (
              <input
                type="text"
                value={prescription.pd}
                onChange={e => setPrescription(prev => ({ ...prev, pd: e.target.value }))}
                className="glass-input p-2 rounded-lg text-sm w-24 text-sky-700 font-mono font-bold text-right"
              />
            ) : (
              <span className="font-mono font-black text-sky-700 text-xl">{prescription.pd} mm</span>
            )}
          </div>
        </GlassCard>
      )}

      {/* ─── APPOINTMENTS TAB ─── */}
      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book New */}
          <GlassCard className="p-8 space-y-5 border border-white bg-white/85 shadow-glass-card">
            <h2 className="font-display font-black text-xl text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" /> Book Clinic Appointment
            </h2>
            {bookingSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Appointment confirmed successfully!
              </div>
            )}
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Consultation Type</label>
                <select
                  value={bookingForm.type}
                  onChange={e => setBookingForm({ ...bookingForm, type: e.target.value })}
                  className="glass-input p-3.5 rounded-xl text-sm w-full bg-white font-medium"
                >
                  <option>Comprehensive 3D Retina Scan & Custom Fitting</option>
                  <option>CyberVisor Spatial Audio Fitting</option>
                  <option>Blue Light & Prescription Consultation</option>
                  <option>Progressive Lens Calibration</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Appointment Date *</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.date}
                    onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm w-full font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Preferred Time *</label>
                  <input type="time" required
                    value={bookingForm.time}
                    onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm w-full font-medium"
                  />
                </div>
              </div>
              <GlassButton type="submit" size="md" variant="primary" className="w-full shadow-glass-glow">
                <Calendar className="w-4 h-4 mr-1.5" /> Confirm Appointment
              </GlassButton>
            </form>
          </GlassCard>

          {/* Upcoming Appointments */}
          <div className="space-y-4">
            <h2 className="font-display font-black text-xl text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" /> Upcoming Clinic Schedule
            </h2>
            {appointments.slice(0, 4).map(apt => (
              <GlassCard key={apt.id} className="p-5 border border-white bg-white/85 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{apt.type}</h4>
                    <span className="text-xs text-slate-600 font-mono font-medium">{apt.optometrist} • {apt.date} at {apt.time}</span>
                  </div>
                </div>
                <GlassBadge variant={apt.status === 'Confirmed' ? 'sky' : 'gold'}>{apt.status}</GlassBadge>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ─── WISHLIST TAB ─── */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h2 className="font-display font-black text-2xl text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Saved Frames
          </h2>
          {wishlist.length === 0 ? (
            <GlassCard className="p-12 text-center border border-white bg-white/80 space-y-4 shadow-sm">
              <Heart className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-slate-600 text-base font-semibold">No frames saved to your wishlist yet.</p>
              <Link to="/catalog"><GlassButton size="md" variant="primary">Browse Catalog</GlassButton></Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map(product => (
                <GlassCard key={product.id} className="p-6 border border-white bg-white/85 shadow-glass-card space-y-4">
                  <div className="w-full h-40 bg-slate-100 rounded-xl p-3 flex items-center justify-center border border-slate-200">
                    <img
                      src={product.colors?.[0]?.image || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-lg">{product.name}</h4>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="font-mono font-black text-slate-900 text-lg">{formatCurrency(product.price)}</span>
                    <Link to={`/product/${product.id}`}>
                      <GlassButton size="sm" variant="outline">View Frame</GlassButton>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
