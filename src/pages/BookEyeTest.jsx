import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { appointmentService } from '../services/appointmentService';
import { 
  Calendar, Clock, MapPin, User, Phone, CheckCircle2, 
  Sparkles, ShieldCheck, Gift, ArrowRight, Eye, Stethoscope, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STORE_LOCATIONS = [
  { id: 'loc-1', name: 'Lumina Flagship — 5th Avenue, New York', address: '720 5th Ave, New York, NY 10019' },
  { id: 'loc-2', name: 'Lumina Boutique — Ginza, Tokyo', address: '6-10-1 Ginza, Chuo City, Tokyo 104-0061' },
  { id: 'loc-3', name: 'Lumina Atelier — Rue du Faubourg, Paris', address: '24 Rue du Faubourg Saint-Honoré, 75008 Paris' },
  { id: 'loc-4', name: 'Lumina Studio — Via Montenapoleone, Milan', address: 'Via Monte Napoleone 8, 20121 Milano' },
  { id: 'loc-5', name: 'Lumina Lab — Oxford Street, London', address: '178 Oxford St, London W1D 1NN' }
];

const TIME_SLOTS = [
  '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
  '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM',
  '04:30 PM', '05:15 PM', '06:00 PM'
];

export const BookEyeTest = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    date: '',
    time: '',
    storeLocation: STORE_LOCATIONS[0].name
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.date || !formData.time || !formData.storeLocation) {
      setError('Please fill in all booking fields to reserve your complimentary slot.');
      return;
    }

    setLoading(true);
    const bookingRef = `LUM-OPT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const apt = await appointmentService.bookAppointment({
        customerName: formData.fullName,
        email: `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@customer.optics`,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        type: 'Free Comprehensive 3D Retina Scan & Computerized Eye Test',
        storeLocation: formData.storeLocation,
        bookingRef,
        optometrist: 'Dr. Marcus Vance (Chief Optometrist)'
      });

      setBookingConfirmed({
        ...formData,
        bookingRef,
        optometrist: 'Dr. Marcus Vance',
        createdApt: apt
      });
    } catch (err) {
      console.error(err);
      setError('Failed to reserve appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Min selectable date is today
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top High-Visibility 100% Free Offer Badge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 text-white shadow-glass-glow flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
            <Gift className="w-6 h-6 text-amber-300 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-200 block">
              Exclusive First-Time Customer Privilege
            </span>
            <h2 className="font-display font-black text-base sm:text-lg text-white">
              First Consultation & Computerized Eye Test — 100% FREE for First Time Customers!
            </h2>
          </div>
        </div>

        <GlassBadge variant="gold" className="bg-amber-400 text-slate-950 font-black px-4 py-1.5 shrink-0 shadow-sm">
          $150 Value • $0 Today
        </GlassBadge>
      </div>

      {/* Main Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2">
          <GlassBadge variant="sky">Clinical Optometry Suite</GlassBadge>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Book Your Free 3D Eye Examination
        </h1>
        <p className="text-slate-600 text-base sm:text-lg font-medium">
          Experience precision corneal topography, digital wavefront refraction, and personalized frame fitting by certified optometrists.
        </p>
      </div>

      {/* Booking Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Booking Form (7 Cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 sm:p-10 border border-white bg-white/90 shadow-glass-card space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <h3 className="font-display font-black text-2xl text-slate-900">
                  Appointment Reservation
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Instant confirmation • No credit card required
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-sky-600" /> Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="glass-input p-3.5 rounded-xl text-sm w-full font-medium"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-sky-600" /> Phone Number (For SMS Confirmation) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="glass-input p-3.5 rounded-xl text-sm w-full font-medium"
                  required
                />
              </div>

              {/* Store Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-600" /> Select Store Location *
                </label>
                <select
                  name="storeLocation"
                  value={formData.storeLocation}
                  onChange={handleChange}
                  className="glass-input p-3.5 rounded-xl text-sm w-full bg-white font-bold text-slate-800"
                  required
                >
                  {STORE_LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" /> Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={minDate}
                    value={formData.date}
                    onChange={handleChange}
                    className="glass-input p-3.5 rounded-xl text-sm w-full font-medium"
                    required
                  />
                </div>

                {/* Time Slot */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" /> Preferred Time Slot *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="glass-input p-3.5 rounded-xl text-sm w-full bg-white font-bold text-slate-800"
                    required
                  >
                    <option value="">Select a time slot</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-700 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <GlassButton
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full py-4 shadow-glass-glow"
                  disabled={loading}
                >
                  {loading ? 'Reserving Free Slot...' : 'Confirm Free Appointment (100% Free)'}
                  <ArrowRight className="w-5 h-5 ml-1.5" />
                </GlassButton>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero obligations • Instant SMS confirmation • Certified Optometrist</span>
              </div>

            </form>

          </GlassCard>
        </div>

        {/* Right Column: What to Expect & Test Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <GlassCard className="p-8 border border-white bg-white/85 shadow-glass-card space-y-6">
            <h3 className="font-display font-black text-xl text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600" /> What Your Free Test Includes
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: 'Computerized 3D Retinal Wavefront Scan',
                  desc: 'High-precision non-invasive imaging maps over 20,000 corneal data points.',
                  tag: 'Free'
                },
                {
                  title: 'Digital Refraction & Visual Acuity Test',
                  desc: 'Exact SPH, CYL, and AXIS measurement calibrated for digital screen comfort.',
                  tag: 'Free'
                },
                {
                  title: 'Glaucoma & Intraocular Pressure Check',
                  desc: 'Advanced gentle tonometer screening for total eye health peace of mind.',
                  tag: 'Free'
                },
                {
                  title: 'Personalized Titanium Frame Fitting',
                  desc: 'Ergonomic temple length and bridge alignment tailored by eyewear stylists.',
                  tag: 'Free'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 space-y-1 font-medium">
              <span className="font-bold block text-sky-950">⏱️ Test Duration: Approx. 25 Minutes</span>
              <p>You will receive a printed optical prescription slip right after your appointment.</p>
            </div>
          </GlassCard>

          {/* Testimonial / Trust Card */}
          <GlassCard className="p-6 border border-white bg-white/85 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-bold text-slate-800 ml-2 font-mono">4.9 / 5.0 Rating</span>
            </div>
            <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
              "The 3D retina scan at the 5th Avenue flagship was by far the most thorough eye test I've ever had. Completely free on my first visit and no sales pressure!"
            </p>
            <span className="text-[11px] font-bold text-slate-900 block">— Sarah J., Verified Patient</span>
          </GlassCard>

        </div>

      </div>

      {/* ─── INSTANT SUCCESS CONFIRMATION MODAL ─── */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-lg p-8 space-y-6 border border-white bg-white/95 shadow-floating text-center relative">
            
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-12 h-12 animate-bounce" />
            </div>

            <div className="space-y-2">
              <GlassBadge variant="emerald">100% Free Booking Confirmed</GlassBadge>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                You're All Set, {bookingConfirmed.fullName}!
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                Your complimentary computerized eye test has been booked. An SMS confirmation was sent to <span className="font-bold text-slate-900">{bookingConfirmed.phone}</span>.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Booking Reference</span>
                <span className="font-mono font-black text-sky-700">{bookingConfirmed.bookingRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-slate-900">📅 {bookingConfirmed.date} at {bookingConfirmed.time}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Store Location</span>
                <span className="font-bold text-slate-900 text-right max-w-[220px] truncate">{bookingConfirmed.storeLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Consultation Fee</span>
                <span className="font-mono font-black text-emerald-700">$0.00 (100% FREE)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link to="/dashboard" className="w-full sm:flex-1">
                <GlassButton size="md" variant="primary" className="w-full shadow-glass-glow">
                  View in Customer Portal
                </GlassButton>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <GlassButton size="md" variant="secondary" className="w-full" onClick={() => setBookingConfirmed(null)}>
                  Return to Home
                </GlassButton>
              </Link>
            </div>

          </GlassCard>
        </div>
      )}

    </div>
  );
};
