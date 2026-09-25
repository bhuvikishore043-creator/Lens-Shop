import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { productService } from '../services/productService';
import { appointmentService } from '../services/appointmentService';
import { adminService } from '../services/adminService';
import { staffService } from '../services/staffService';
import { dealService } from '../services/dealService';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Package, Users, DollarSign, Plus,
  Edit, Trash2, AlertTriangle, Eye,
  Search, X, RefreshCw, TrendingUp,
  Filter, Crown, Award, Stethoscope, Phone, LogOut
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('staff-analytics'); // 'staff-analytics' | 'inventory' | 'leads' | 'deals' | 'financials'
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Lumina',
    price: '',
    category: 'optical',
    stock: 15,
    frameMaterial: 'Titanium',
    lensType: 'Anti-Blue',
    description: '',
    badge: 'New'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await productService.getProducts();
    const a = await appointmentService.getAppointments();
    const stats = await adminService.getAnalytics();
    const allDeals = await dealService.getDeals();
    const staffData = await staffService.getStaffPerformanceAnalytics();
    
    setProducts(p);
    setAppointments(a);
    setAnalytics(stats);
    setDeals(allDeals);
    setStaffPerformance(staffData);
  };

  // Product CRUD Handlers
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: 'Lumina',
      price: '',
      category: 'optical',
      stock: 15,
      frameMaterial: 'Japanese Beta Titanium',
      lensType: 'Zeiss Anti-Blue UV400',
      description: 'Precision CNC milled luxury titanium frame with ergonomic weight distribution.',
      badge: 'New'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock)
      });
    } else {
      await productService.createProduct({
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        rating: 5.0,
        reviewCount: 1,
        colors: [
          { name: 'Obsidian Cyan', hex: '#0284C7', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80' }
        ]
      });
    }
    setIsProductModalOpen(false);
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this frame from inventory?')) {
      await productService.deleteProduct(id);
      loadData();
    }
  };

  const handleStockUpdate = async (id, delta) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);
    await productService.updateProduct(id, { stock: newStock });
    loadData();
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalClosedDealsRevenue = deals.reduce((sum, d) => sum + (Number(d.dealAmount) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Admin Title Header */}
      <GlassCard className="p-8 border border-white bg-white/85 shadow-glass-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-800 shadow-sm">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                  {user?.name || 'Dr. Arthur Lumina'}
                </h1>
                <GlassBadge variant="gold">Store Owner & Executive Portal</GlassBadge>
              </div>
              <p className="text-xs text-slate-600 font-bold mt-1">
                Lumina Global Optical Network • Master Command & Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GlassButton size="sm" variant="secondary" onClick={loadData}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Telemetry
            </GlassButton>
            <GlassButton size="sm" variant="primary" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-1" /> Add New Frame
            </GlassButton>
            <GlassButton size="sm" variant="outline" onClick={async () => { await logout(); navigate('/login'); }}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 border border-white bg-white/85 shadow-glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Closed Sales</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-slate-900">
              {formatCurrency(totalClosedDealsRevenue + 128450)}
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> +24.6%
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">All store locations</span>
        </GlassCard>

        <GlassCard className="p-6 border border-white bg-white/85 shadow-glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Staff Members</span>
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-800 shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-slate-900">
              {staffPerformance.length || 3}
            </span>
            <span className="text-xs font-bold text-orange-700 font-mono">Optometrists on Duty</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Across 5 global boutiques</span>
        </GlassCard>

        <GlassCard className="p-6 border border-white bg-white/85 shadow-glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Eye Test Leads</span>
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-slate-900">
              {appointments.length || 14}
            </span>
            <span className="text-xs font-bold text-sky-700 font-mono">Total bookings</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">From online marketing</span>
        </GlassCard>

        <GlassCard className="p-6 border border-white bg-white/85 shadow-glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eyewear Catalog</span>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 shadow-sm">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-slate-900">
              {products.length}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">Models in stock</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {products.filter(p => p.stock <= 5).length} low inventory alerts
          </span>
        </GlassCard>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4 overflow-x-auto">
        {[
          { id: 'staff-analytics', label: 'Staff Performance & Deal Analytics', icon: Award },
          { id: 'inventory', label: 'Inventory & Pricing Management', icon: Package },
          { id: 'leads', label: 'All Eye Test Bookings & Leads', icon: Phone },
          { id: 'deals', label: 'All Customer Sales & Deals', icon: DollarSign },
          { id: 'financials', label: 'Revenue Telemetry Flow', icon: BarChart3 }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white/80 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: STAFF PERFORMANCE & DEAL ANALYTICS ─── */}
      {activeTab === 'staff-analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900">
                Staff Sales Performance & Attended Customers
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Detailed telemetry on how many customers each staff member attended, deals closed, conversion rate, and generated revenue.
              </p>
            </div>
            <GlassBadge variant="gold">Executive Tracking</GlassBadge>
          </div>

          <GlassCard className="p-0 overflow-hidden border border-white bg-white/85 shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider">
                    <th className="py-4 px-5">Staff Member & Role</th>
                    <th className="py-4 px-5">Store Location</th>
                    <th className="py-4 px-5 text-center">Customers Attended</th>
                    <th className="py-4 px-5 text-center">Deals Closed</th>
                    <th className="py-4 px-5 text-center">Conversion Rate</th>
                    <th className="py-4 px-5 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffPerformance.map((member) => (
                    <tr key={member.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 px-5 flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-11 h-11 object-cover rounded-xl border border-amber-300 shadow-xs"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{member.name}</span>
                          <span className="text-xs text-sky-700 font-medium">{member.role}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-700 font-medium max-w-[200px] truncate">
                        {member.storeLocation}
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className="font-mono font-bold text-slate-900 text-sm">{member.leadsAttended}</span>
                        <span className="text-[10px] text-slate-500 block">consultations</span>
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className="font-mono font-bold text-emerald-700 text-sm">{member.dealsCount}</span>
                        <span className="text-[10px] text-slate-500 block">glasses sold</span>
                      </td>

                      <td className="py-4 px-5 text-center">
                        <span className="font-mono font-black text-amber-700 text-sm bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                          {member.conversionRate}%
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <span className="font-mono font-black text-slate-900 text-base block">
                          {formatCurrency(member.totalRevenue)}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">
                          Avg Deal: {formatCurrency(Math.round(member.totalRevenue / (member.dealsCount || 1)))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── TAB 2: INVENTORY & PRICING MANAGEMENT (CRUD) ─── */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white bg-white/85 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by frame name or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="glass-input pl-9 pr-4 py-2.5 rounded-xl text-xs w-full font-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Total Models: {filteredProducts.length}</span>
              <GlassButton size="sm" variant="primary" onClick={handleOpenCreate}>
                <Plus className="w-4 h-4 mr-1" /> Add Frame
              </GlassButton>
            </div>
          </GlassCard>

          {/* Product Inventory Table */}
          <GlassCard className="p-0 overflow-hidden border border-white bg-white/85 shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider">
                    <th className="py-4 px-5">Frame Model</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Material</th>
                    <th className="py-4 px-5">Price</th>
                    <th className="py-4 px-5">Stock Level</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-4 px-5 flex items-center gap-3">
                        <img
                          src={p.colors?.[0]?.image || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'}
                          alt={p.name}
                          className="w-11 h-11 object-contain rounded-lg bg-white p-1 border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{p.name}</span>
                          <span className="text-xs text-sky-700 font-medium">{p.brand}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <GlassBadge variant="sky">{p.category}</GlassBadge>
                      </td>

                      <td className="py-4 px-5 text-slate-700 font-medium">{p.frameMaterial || 'Titanium'}</td>

                      <td className="py-4 px-5 font-black text-slate-900 font-mono text-sm">{formatCurrency(p.price)}</td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleStockUpdate(p.id, -1)}
                            className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className={`font-bold font-mono text-sm ${p.stock <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                            {p.stock}
                          </span>
                          <button 
                            onClick={() => handleStockUpdate(p.id, 1)}
                            className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            +
                          </button>
                          {p.stock <= 5 && (
                            <AlertTriangle className="w-4 h-4 text-amber-600" title="Low stock alert" />
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-lg bg-white text-slate-700 hover:text-sky-700 border border-slate-200 shadow-sm cursor-pointer"
                          title="Edit Frame"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-lg bg-white text-slate-700 hover:text-red-600 border border-slate-200 shadow-sm cursor-pointer"
                          title="Delete Frame"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── TAB 3: ALL EYE TEST BOOKINGS & LEADS ─── */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <GlassCard className="p-0 overflow-hidden border border-white bg-white/85 shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider">
                    <th className="py-4 px-5">Lead ID</th>
                    <th className="py-4 px-5">Customer Name & Phone</th>
                    <th className="py-4 px-5">Appointment Slot</th>
                    <th className="py-4 px-5">Store Location</th>
                    <th className="py-4 px-5">Attributed Optometrist</th>
                    <th className="py-4 px-5 text-right">Call Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-sky-700 text-xs">{apt.id}</td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 text-sm block">{apt.customerName}</span>
                        <span className="text-xs text-slate-500 font-mono">{apt.phone}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 block">📅 {apt.date}</span>
                        <span className="text-xs text-slate-500 font-mono">🕒 {apt.time}</span>
                      </td>
                      <td className="py-4 px-5 text-slate-700 font-medium max-w-[220px] truncate">{apt.storeLocation || '5th Ave New York'}</td>
                      <td className="py-4 px-5 font-bold text-slate-900">{apt.optometrist}</td>
                      <td className="py-4 px-5 text-right">
                        <GlassBadge variant={
                          apt.callStatus === 'Visited' ? 'emerald' :
                          apt.callStatus === 'Confirmed' ? 'sky' :
                          apt.callStatus === 'Deal Closed' ? 'gold' : 'peach'
                        }>
                          {apt.callStatus || 'Pending'}
                        </GlassBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── TAB 4: ALL CUSTOMER SALES & DEALS ─── */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          <GlassCard className="p-0 overflow-hidden border border-white bg-white/85 shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider">
                    <th className="py-4 px-5">Deal Ref</th>
                    <th className="py-4 px-5">Customer</th>
                    <th className="py-4 px-5">Eyewear Sold</th>
                    <th className="py-4 px-5">Lens Treatment</th>
                    <th className="py-4 px-5">Closed By Staff</th>
                    <th className="py-4 px-5 text-right">Deal Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deals.map((d) => (
                    <tr key={d.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-orange-700">{d.id}</td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 text-sm block">{d.customerName}</span>
                        <span className="text-xs text-slate-500 font-mono">{d.phone}</span>
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900">{d.soldGlasses}</td>
                      <td className="py-4 px-5"><GlassBadge variant="sky">{d.lensType}</GlassBadge></td>
                      <td className="py-4 px-5 font-bold text-slate-800">{d.staffName}</td>
                      <td className="py-4 px-5 text-right font-mono font-black text-slate-900 text-base">
                        {formatCurrency(d.dealAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── TAB 5: REVENUE FLOW MATRIX ─── */}
      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="p-8 lg:col-span-2 space-y-6 border border-white bg-white/85 shadow-glass-card">
            <h3 className="font-display font-black text-xl text-slate-900">7-Day Optical Clinic Revenue Flow</h3>
            <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-2 border-b border-slate-200">
              {[
                { day: 'Mon', amount: 14200, height: '45%' },
                { day: 'Tue', amount: 19400, height: '62%' },
                { day: 'Wed', amount: 24800, height: '78%' },
                { day: 'Thu', amount: 18200, height: '58%' },
                { day: 'Fri', amount: 31500, height: '95%' },
                { day: 'Sat', amount: 28900, height: '88%' },
                { day: 'Sun', amount: 22100, height: '70%' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-sky-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(bar.amount / 1000).toFixed(1)}k
                  </span>
                  <div 
                    className="w-full rounded-t-xl bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-110 transition-all duration-300 shadow-sm"
                    style={{ height: bar.height }}
                  />
                  <span className="text-xs font-bold text-slate-600">{bar.day}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-8 space-y-4 border border-white bg-white/85 shadow-glass-card">
            <h3 className="font-display font-black text-xl text-slate-900">Store Performance Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span className="font-bold text-slate-700">Average Optical Deal Size</span>
                <span className="font-mono font-bold text-slate-900">$485.00</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span className="font-bold text-slate-700">Lead-to-Deal Conversion</span>
                <span className="font-mono font-bold text-emerald-700">76.4%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span className="font-bold text-slate-700">Highest Converting Branch</span>
                <span className="font-mono font-bold text-amber-800">5th Ave New York</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── CREATE / EDIT PRODUCT MODAL ─── */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-lg p-6 space-y-4 border border-white bg-white/95 relative shadow-floating">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-display font-black text-xl text-slate-900">
                {editingProduct ? 'Edit Frame Specification' : 'Add New Frame to Catalog'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Frame Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium"
                    placeholder="e.g. Lumina Apex"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium font-mono"
                    placeholder="450"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full bg-white text-slate-800 font-bold"
                  >
                    <option value="optical">Optical</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="smart">Smartwear</option>
                    <option value="lenses">Lenses</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Material</label>
                  <input
                    type="text"
                    value={productForm.frameMaterial}
                    onChange={e => setProductForm({ ...productForm, frameMaterial: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Badge</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={e => setProductForm({ ...productForm, badge: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="glass-input p-2.5 rounded-xl text-xs w-full resize-none font-medium"
                />
              </div>

              <GlassButton type="submit" size="md" variant="primary" className="w-full shadow-glass-glow">
                {editingProduct ? 'Update Frame' : 'Create & Publish Frame'}
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
};
