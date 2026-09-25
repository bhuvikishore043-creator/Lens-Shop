import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { appointmentService } from '../services/appointmentService';
import { dealService } from '../services/dealService';
import { staffService } from '../services/staffService';
import { productService } from '../services/productService';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Users, Phone, PhoneCall, CheckCircle2, DollarSign,
  Plus, Search, Filter,
  Stethoscope, ShoppingBag, Eye, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CALL_STATUSES = [
  { id: 'Pending', label: 'Pending Call', variant: 'slate' },
  { id: 'Called', label: 'Called', variant: 'peach' },
  { id: 'Confirmed', label: 'Confirmed', variant: 'sky' },
  { id: 'Visited', label: 'Visited Clinic', variant: 'emerald' },
  { id: 'Deal Closed', label: 'Deal Closed', variant: 'gold' }
];

export const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'deals' | 'new-deal'
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchLead, setSearchLead] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Customer Deal Entry Form State
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [selectedLeadForDeal, setSelectedLeadForDeal] = useState(null);
  const [dealForm, setDealForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    soldGlasses: '',
    frameId: 'lum-01',
    dealAmount: '',
    lensType: 'Zeiss Anti-Blue Shield',
    prescriptionNotes: '',
    storeLocation: user?.storeLocation || 'Lumina Flagship — 5th Avenue, New York'
  });

  const [dealSuccessMsg, setDealSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const apts = await appointmentService.getAppointments();
    const myDeals = await dealService.getDeals();
    const prods = await productService.getProducts();
    setLeads(apts);
    setDeals(myDeals);
    setProducts(prods);
  };

  const handleCallStatusUpdate = async (leadId, newStatus) => {
    await appointmentService.updateCallStatus(leadId, newStatus);
    loadData();
  };

  const handleOpenDealEntry = (lead = null) => {
    if (lead) {
      setSelectedLeadForDeal(lead);
      setDealForm({
        customerName: lead.customerName,
        phone: lead.phone || '',
        email: lead.email || '',
        soldGlasses: products[0]?.name || 'Aetherium Titanium Specs',
        frameId: products[0]?.id || 'lum-01',
        dealAmount: products[0]?.price || 420,
        lensType: 'Zeiss Anti-Blue Shield',
        prescriptionNotes: 'OD: -2.00/-0.50x180, OS: -1.75/-0.50x175, PD: 63.0mm.',
        storeLocation: lead.storeLocation || user?.storeLocation || 'Lumina Flagship — 5th Avenue, New York'
      });
    } else {
      setSelectedLeadForDeal(null);
      setDealForm({
        customerName: '',
        phone: '',
        email: '',
        soldGlasses: products[0]?.name || 'Aetherium Titanium Specs',
        frameId: products[0]?.id || 'lum-01',
        dealAmount: products[0]?.price || 420,
        lensType: 'Zeiss Anti-Blue Shield',
        prescriptionNotes: '',
        storeLocation: user?.storeLocation || 'Lumina Flagship — 5th Avenue, New York'
      });
    }
    setIsDealModalOpen(true);
  };

  const handleSaveCustomerDeal = async (e) => {
    e.preventDefault();
    if (!dealForm.customerName || !dealForm.dealAmount) return;

    await dealService.logCustomerDeal({
      customerName: dealForm.customerName,
      phone: dealForm.phone,
      email: dealForm.email,
      soldGlasses: dealForm.soldGlasses,
      frameId: dealForm.frameId,
      dealAmount: Number(dealForm.dealAmount),
      lensType: dealForm.lensType,
      prescriptionNotes: dealForm.prescriptionNotes,
      staffId: user?.id || 'staff-1',
      staffName: user?.name || 'Alex Rivera',
      storeLocation: dealForm.storeLocation
    });

    if (selectedLeadForDeal) {
      await appointmentService.updateCallStatus(selectedLeadForDeal.id, 'Deal Closed', `Deal closed for $${dealForm.dealAmount} (${dealForm.soldGlasses})`);
    }

    await staffService.updateStaffMetrics(user?.id || 'staff-1', dealForm.dealAmount);

    setIsDealModalOpen(false);
    setDealSuccessMsg(`Deal successfully logged for ${dealForm.customerName} ($${dealForm.dealAmount})!`);
    setTimeout(() => setDealSuccessMsg(''), 4000);
    loadData();
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.customerName?.toLowerCase().includes(searchLead.toLowerCase()) ||
                          l.phone?.toLowerCase().includes(searchLead.toLowerCase()) ||
                          l.id?.toLowerCase().includes(searchLead.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.callStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSalesByStaff = deals
    .filter(d => d.staffId === (user?.id || 'staff-1') || d.staffName === (user?.name || 'Alex Rivera'))
    .reduce((sum, d) => sum + (Number(d.dealAmount) || 0), 0);

  const totalDealsByStaff = deals
    .filter(d => d.staffId === (user?.id || 'staff-1') || d.staffName === (user?.name || 'Alex Rivera')).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Staff Header */}
      <GlassCard className="p-8 border border-white bg-white/85 shadow-glass-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 border-2 border-orange-400 flex items-center justify-center text-orange-700 shadow-sm">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                  {user?.name || 'Alex Rivera'}
                </h1>
                <GlassBadge variant="peach">Staff Workspace</GlassBadge>
              </div>
              <p className="text-xs text-slate-600 font-bold mt-1">
                {user?.roleTitle || 'Senior Optometrist & Style Lead'} • {user?.storeLocation || 'Lumina Flagship — 5th Avenue, New York'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GlassButton size="md" variant="peach" onClick={() => handleOpenDealEntry()}>
              <Plus className="w-4 h-4 mr-1.5" /> Log Customer Deal
            </GlassButton>
            <GlassButton size="sm" variant="outline" onClick={async () => { await logout(); navigate('/login'); }}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Success Notification Alert */}
      {dealSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {dealSuccessMsg}
        </div>
      )}

      {/* Staff KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 border border-white bg-white/85 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Eye Test Leads</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-slate-900">{leads.length}</span>
            <span className="text-xs text-sky-700 font-bold">Total registered</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">From online /book-test</span>
        </GlassCard>

        <GlassCard className="p-6 border border-white bg-white/85 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Calls</span>
            <div className="p-2 rounded-xl bg-orange-100 text-orange-800">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-orange-700">
              {leads.filter(l => l.callStatus === 'Pending' || !l.callStatus).length}
            </span>
            <span className="text-xs text-orange-600 font-bold">Require call</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Follow-up reminders</span>
        </GlassCard>

        <GlassCard className="p-6 border border-white bg-white/85 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deals Closed</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-slate-900">{totalDealsByStaff}</span>
            <span className="text-xs text-emerald-700 font-bold">Glasses sold</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">By your consultation</span>
        </GlassCard>

        <GlassCard className="p-6 border border-white bg-white/85 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue Generated</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-3xl text-slate-900">{formatCurrency(totalSalesByStaff)}</span>
            <span className="text-xs text-amber-700 font-bold">Total closed</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Personal sales telemetry</span>
        </GlassCard>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white/80 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <PhoneCall className="w-4 h-4" /> Free Eye Test Leads & Call Tracker ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'deals'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white/80 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Closed Customer Deals & Prescriptions ({deals.length})
        </button>
      </div>

      {/* ─── TAB 1: LEAD MANAGEMENT & CALL TRACKER ─── */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          
          {/* Filter Toolbar */}
          <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-white bg-white/85 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by customer name or phone..."
                value={searchLead}
                onChange={e => setSearchLead(e.target.value)}
                className="glass-input pl-9 pr-4 py-2.5 rounded-xl text-xs w-full font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
              {['all', 'Pending', 'Called', 'Confirmed', 'Visited', 'Deal Closed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {st === 'all' ? 'All Leads' : st}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Leads Table */}
          <GlassCard className="p-0 overflow-hidden border border-white bg-white/85 shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider">
                    <th className="py-4 px-5">Customer & Contact</th>
                    <th className="py-4 px-5">Preferred Slot & Date</th>
                    <th className="py-4 px-5">Store Location</th>
                    <th className="py-4 px-5">Call Status</th>
                    <th className="py-4 px-5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 text-sm block">{lead.customerName}</span>
                        <div className="flex items-center gap-2 text-slate-600 mt-0.5">
                          <span className="font-mono font-medium text-xs flex items-center gap-1 text-sky-700">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] font-mono text-slate-500">{lead.id}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 block">📅 {lead.date}</span>
                        <span className="text-xs text-sky-700 font-mono font-semibold">🕒 {lead.time}</span>
                      </td>

                      <td className="py-4 px-5">
                        <span className="text-slate-700 font-medium text-xs block max-w-[200px] truncate">
                          {lead.storeLocation || 'New York Flagship'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <select
                          value={lead.callStatus || 'Pending'}
                          onChange={e => handleCallStatusUpdate(lead.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none ${
                            lead.callStatus === 'Visited' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            lead.callStatus === 'Confirmed' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                            lead.callStatus === 'Called' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                            lead.callStatus === 'Deal Closed' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Pending">⏳ Pending Call</option>
                          <option value="Called">📞 Called Customer</option>
                          <option value="Confirmed">✅ Confirmed Slot</option>
                          <option value="Visited">🏥 Visited Clinic</option>
                          <option value="Deal Closed">💎 Deal Closed</option>
                        </select>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2">
                        <GlassButton
                          size="sm"
                          variant="peach"
                          onClick={() => handleOpenDealEntry(lead)}
                        >
                          <DollarSign className="w-3.5 h-3.5 mr-1" /> Log Deal
                        </GlassButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

        </div>
      )}

      {/* ─── TAB 2: CLOSED DEALS & PRESCRIPTIONS ─── */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          <GlassCard className="p-0 overflow-hidden border border-white bg-white/85 shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider">
                    <th className="py-4 px-5">Deal ID & Date</th>
                    <th className="py-4 px-5">Customer</th>
                    <th className="py-4 px-5">Eyewear Model Sold</th>
                    <th className="py-4 px-5">Lens Treatment</th>
                    <th className="py-4 px-5">Prescription Notes</th>
                    <th className="py-4 px-5 text-right">Deal Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-orange-700 text-sm block">{deal.id}</span>
                        <span className="text-xs text-slate-500 font-mono">{formatDate(deal.date)}</span>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 text-sm block">{deal.customerName}</span>
                        <span className="text-xs text-slate-500 font-mono">{deal.phone}</span>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 block">{deal.soldGlasses}</span>
                        <span className="text-xs text-slate-500 font-medium">{deal.storeLocation}</span>
                      </td>

                      <td className="py-4 px-5">
                        <GlassBadge variant="sky">{deal.lensType}</GlassBadge>
                      </td>

                      <td className="py-4 px-5">
                        <p className="text-xs text-slate-700 font-mono line-clamp-2 max-w-[280px]">
                          {deal.prescriptionNotes || 'Standard Optical Refraction'}
                        </p>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <span className="font-mono font-black text-slate-900 text-base block">
                          {formatCurrency(deal.dealAmount)}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">Attributed: {deal.staffName}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── CUSTOMER DEAL ENTRY MODAL ─── */}
      {isDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-xl p-8 space-y-6 border border-white bg-white/95 relative shadow-floating">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-orange-700 uppercase">Staff Point-of-Sale Log</span>
                <h3 className="font-display font-black text-2xl text-slate-900">
                  Record Customer Eyewear Deal
                </h3>
              </div>
              <button 
                onClick={() => setIsDealModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomerDeal} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={dealForm.customerName}
                    onChange={e => setDealForm({ ...dealForm, customerName: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm w-full font-medium"
                    placeholder="e.g. Elena Rostova"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Customer Phone Number</label>
                  <input
                    type="tel"
                    value={dealForm.phone}
                    onChange={e => setDealForm({ ...dealForm, phone: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm w-full font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sold Eyewear Frame *</label>
                  <select
                    value={dealForm.soldGlasses}
                    onChange={e => {
                      const selected = products.find(p => p.name === e.target.value);
                      setDealForm({
                        ...dealForm,
                        soldGlasses: e.target.value,
                        frameId: selected?.id || 'lum-01',
                        dealAmount: selected?.price || 420
                      });
                    }}
                    className="glass-input p-3 rounded-xl text-sm w-full bg-white font-bold text-slate-800"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} (${p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Total Deal Amount Closed ($) *</label>
                  <input
                    type="number"
                    required
                    value={dealForm.dealAmount}
                    onChange={e => setDealForm({ ...dealForm, dealAmount: e.target.value })}
                    className="glass-input p-3 rounded-xl text-sm w-full font-mono font-black text-slate-900"
                    placeholder="480"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Selected Zeiss Lens Optics</label>
                <select
                  value={dealForm.lensType}
                  onChange={e => setDealForm({ ...dealForm, lensType: e.target.value })}
                  className="glass-input p-3 rounded-xl text-sm w-full bg-white font-medium text-slate-800"
                >
                  <option value="Zeiss Anti-Blue Shield">Zeiss Anti-Blue Shield (Everyday Screen Protection)</option>
                  <option value="Polarized Sun UV400">Polarized Sun UV400 (Zero Glare Outdoor)</option>
                  <option value="Photochromic Adaptive Transitions">Photochromic Adaptive Transitions</option>
                  <option value="3D Digital Wavefront Progressive">3D Digital Wavefront Progressive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Prescription Notes (OD / OS / PD)</label>
                <textarea
                  rows={3}
                  value={dealForm.prescriptionNotes}
                  onChange={e => setDealForm({ ...dealForm, prescriptionNotes: e.target.value })}
                  className="glass-input p-3 rounded-xl text-xs w-full resize-none font-mono"
                  placeholder="OD: -2.25/-0.50x180, OS: -2.00/-0.75x175, PD: 63.5mm."
                />
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center justify-between font-medium">
                <span>Attributed Staff: <strong className="font-bold">{user?.name || 'Alex Rivera'}</strong></span>
                <span className="font-mono">{user?.storeLocation || '5th Ave New York'}</span>
              </div>

              <GlassButton
                type="submit"
                size="lg"
                variant="peach"
                className="w-full shadow-peach-glow py-4"
              >
                <CheckCircle2 className="w-5 h-5 mr-1.5" /> Complete & Record Deal (${dealForm.dealAmount || 0})
              </GlassButton>

            </form>

          </GlassCard>
        </div>
      )}

    </div>
  );
};
