import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { productService } from '../services/productService';
import { appointmentService } from '../services/appointmentService';
import { adminService } from '../services/adminService';
import { staffService } from '../services/staffService';
import { dealService } from '../services/dealService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Package, Users, DollarSign, Plus,
  Edit, Trash2, AlertTriangle, Eye,
  Search, X, RefreshCw, TrendingUp,
  Filter, Crown, Award, Stethoscope, Phone, LogOut,
  Calendar, Mail, UserPlus
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('staff-management'); // 'staff-management' | 'staff-analytics' | 'inventory' | 'leads' | 'deals' | 'financials'
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Modals & Feedback
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');
  const [staffFormError, setStaffFormError] = useState('');

  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Senior Optometrist & Style Lead',
    storeLocation: 'Lumina Flagship — 5th Avenue, New York',
    joinedDate: new Date().toISOString().split('T')[0],
    avatar: ''
  });

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
    const staffList = await staffService.getStaffMembers();
    
    setProducts(p);
    setAppointments(a);
    setAnalytics(stats);
    setDeals(allDeals);
    setStaffPerformance(staffData);
    setStaffMembers(staffList);
  };

  // Staff CRUD Handlers
  const handleOpenAddStaff = () => {
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      role: 'Senior Optometrist & Style Lead',
      storeLocation: 'Lumina Flagship — 5th Avenue, New York',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: ''
    });
    setStaffFormError('');
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.name.trim() || !staffForm.email.trim()) {
      setStaffFormError('Please provide both Staff Name and Email address.');
      return;
    }
    if (!staffForm.email.includes('@')) {
      setStaffFormError('Please enter a valid email address.');
      return;
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    ];
    const fallbackAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    await staffService.addStaffMember({
      name: staffForm.name.trim(),
      email: staffForm.email.trim().toLowerCase(),
      phone: staffForm.phone.trim() || '+1 (555) 100-2020',
      role: staffForm.role,
      storeLocation: staffForm.storeLocation,
      joinedDate: staffForm.joinedDate || new Date().toISOString().split('T')[0],
      avatar: staffForm.avatar.trim() || fallbackAvatar
    });

    setIsStaffModalOpen(false);
    setStaffSuccessMsg(`Staff member ${staffForm.name} successfully added! Credentials active.`);
    setTimeout(() => setStaffSuccessMsg(''), 4000);
    await loadData();
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (window.confirm(`Are you sure you want to remove ${staffName} from the staff directory? This action cannot be undone.`)) {
      await staffService.removeStaffMember(staffId);
      setStaffSuccessMsg(`Staff member ${staffName} has been removed.`);
      setTimeout(() => setStaffSuccessMsg(''), 4000);
      await loadData();
    }
  };

  const filteredStaff = staffMembers.filter(s =>
    (s.name || '').toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    (s.role || '').toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    (s.storeLocation || '').toLowerCase().includes(staffSearchQuery.toLowerCase())
  );

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
            <GlassButton size="sm" variant="primary" onClick={handleOpenAddStaff}>
              <UserPlus className="w-4 h-4 mr-1" /> + Add Staff
            </GlassButton>
            <GlassButton size="sm" variant="outline" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-1" /> Add Frame
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
              {staffMembers.length || 3}
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
          { id: 'staff-management', label: 'Staff Management', icon: Users },
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

      {/* ─── TAB 1: STAFF MANAGEMENT (STAFF DIRECTORY & CRUD) ─── */}
      {activeTab === 'staff-management' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900">
                Staff & Employee Directory
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Manage optometry staff, roles, and store credentials. Add new team members dynamically or remove them with instant synchronization.
              </p>
            </div>
            <GlassButton size="sm" variant="primary" onClick={handleOpenAddStaff} className="shadow-glass-glow">
              <UserPlus className="w-4 h-4 mr-1.5" /> + Add New Staff
            </GlassButton>
          </div>

          {staffSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fade-in shadow-xs">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {staffSuccessMsg}
              </span>
              <button onClick={() => setStaffSuccessMsg('')} className="p-1 text-emerald-600 hover:text-emerald-900 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white bg-white/85 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, email, or role..."
                value={staffSearchQuery}
                onChange={e => setStaffSearchQuery(e.target.value)}
                className="glass-input pl-9 pr-4 py-2.5 rounded-xl text-xs w-full font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs font-bold text-slate-600">
                Active Staff: <span className="font-mono text-slate-900 font-black">{filteredStaff.length}</span> / {staffMembers.length}
              </span>
              {staffSearchQuery && (
                <button
                  onClick={() => setStaffSearchQuery('')}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
          </GlassCard>

          {/* Staff List Table */}
          <GlassCard className="p-0 overflow-hidden border border-white bg-white/85 shadow-glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-700 uppercase font-bold tracking-wider">
                    <th className="py-4 px-5">Staff Member</th>
                    <th className="py-4 px-5">Email Address</th>
                    <th className="py-4 px-5">Role / Position</th>
                    <th className="py-4 px-5">Store Location</th>
                    <th className="py-4 px-5">Joined Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="text-sm font-bold text-slate-700">No staff members found</p>
                          <p className="text-xs text-slate-500">
                            {staffSearchQuery ? `No results match "${staffSearchQuery}"` : 'Get started by adding your first team member'}
                          </p>
                          {staffSearchQuery ? (
                            <GlassButton size="xs" variant="secondary" onClick={() => setStaffSearchQuery('')} className="mt-2">
                              Reset Filter
                            </GlassButton>
                          ) : (
                            <GlassButton size="sm" variant="primary" onClick={handleOpenAddStaff} className="mt-2">
                              <UserPlus className="w-4 h-4 mr-1" /> + Add Staff Member
                            </GlassButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-4 px-5 flex items-center gap-3">
                          <img
                            src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={member.name}
                            className="w-11 h-11 object-cover rounded-xl border border-amber-300 shadow-xs shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">{member.name}</span>
                            <span className="text-xs text-slate-500 font-medium font-mono">{member.phone || '+1 (555) 000-0000'}</span>
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <a
                            href={`mailto:${member.email}`}
                            className="font-mono text-sky-700 hover:text-sky-900 font-bold hover:underline inline-flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {member.email}
                          </a>
                        </td>

                        <td className="py-4 px-5">
                          <GlassBadge variant={
                            member.role?.toLowerCase().includes('senior') || member.role?.toLowerCase().includes('lead') ? 'gold' :
                            member.role?.toLowerCase().includes('refraction') || member.role?.toLowerCase().includes('optometrist') ? 'sky' : 'peach'
                          }>
                            {member.role || 'Staff Member'}
                          </GlassBadge>
                        </td>

                        <td className="py-4 px-5 text-slate-700 font-medium max-w-[220px] truncate">
                          {member.storeLocation || 'Lumina Flagship — 5th Avenue, New York'}
                        </td>

                        <td className="py-4 px-5 text-slate-700 font-mono font-medium">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(member.joinedDate || '2024-03-15')}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDeleteStaff(member.id, member.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer shadow-xs active:scale-95"
                            title={`Delete ${member.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete / Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── TAB 2: STAFF PERFORMANCE & DEAL ANALYTICS ─── */}
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
      {activeTab === 'leads' && (() => {
        // Helper: compute days remaining from a date string (YYYY-MM-DD or similar)
        const getDaysRemaining = (dateStr, status) => {
          if (status === 'COMPLETED' || status === 'Visited' || status === 'Deal Closed') return null;
          if (!dateStr) return null;
          const today = new Date(); today.setHours(0,0,0,0);
          const apptDate = new Date(dateStr); apptDate.setHours(0,0,0,0);
          const diff = Math.round((apptDate - today) / (1000 * 60 * 60 * 24));
          return diff;
        };

        const renderDaysBadge = (diff) => {
          if (diff === null) return null;
          if (diff > 0) return <span style={{display:'inline-block',padding:'2px 8px',borderRadius:9999,fontSize:10,fontWeight:700,background:'#e0f2fe',color:'#0369a1',marginTop:4}}>In {diff} day{diff>1?'s':''}</span>;
          if (diff === 0) return <span style={{display:'inline-block',padding:'2px 8px',borderRadius:9999,fontSize:10,fontWeight:700,background:'#fef9c3',color:'#92400e',marginTop:4}}>Today</span>;
          return <span style={{display:'inline-block',padding:'2px 8px',borderRadius:9999,fontSize:10,fontWeight:700,background:'#fee2e2',color:'#991b1b',marginTop:4}}>Overdue</span>;
        };

        const statusStyles = {
          PENDING:   { bg:'#fef3c7', color:'#92400e', border:'#fde68a' },
          CONFIRMED: { bg:'#dbeafe', color:'#1e40af', border:'#bfdbfe' },
          COMPLETED: { bg:'#d1fae5', color:'#065f46', border:'#a7f3d0' },
          CANCELLED: { bg:'#fee2e2', color:'#991b1b', border:'#fecaca' },
        };

        const normaliseStatus = (s) => {
          if (!s) return 'PENDING';
          const up = s.toUpperCase();
          if (up === 'VISITED' || up === 'DEAL CLOSED' || up === 'COMPLETED') return 'COMPLETED';
          if (up === 'CONFIRMED') return 'CONFIRMED';
          if (up === 'CANCELLED') return 'CANCELLED';
          return 'PENDING';
        };

        const handleStatusChange = async (aptId, newStatus) => {
          await appointmentService.updateCallStatus(aptId, newStatus);
          const refreshed = await appointmentService.getAppointments();
          setAppointments(refreshed);
        };

        return (
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
                      <th className="py-4 px-5 text-center">Call Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((apt) => {
                      const normStatus = normaliseStatus(apt.callStatus);
                      const diff = getDaysRemaining(apt.date, normStatus);
                      const st = statusStyles[normStatus] || statusStyles.PENDING;
                      return (
                        <tr key={apt.id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="py-4 px-5 font-mono font-bold text-sky-700 text-xs">{apt.id}</td>
                          <td className="py-4 px-5">
                            <span className="font-bold text-slate-900 text-sm block">{apt.customerName}</span>
                            <span className="text-xs text-slate-500 font-mono">{apt.phone}</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="font-bold text-slate-900 block">📅 {apt.date}</span>
                            <span className="text-xs text-slate-500 font-mono">🕒 {apt.time}</span>
                            {renderDaysBadge(diff)}
                          </td>
                          <td className="py-4 px-5 text-slate-700 font-medium max-w-[220px] truncate">{apt.storeLocation || '5th Ave New York'}</td>
                          <td className="py-4 px-5 font-bold text-slate-900">{apt.optometrist}</td>
                          <td className="py-4 px-5 text-center">
                            {/* Colored badge above the dropdown */}
                            <span style={{
                              display:'inline-block', padding:'3px 12px', borderRadius:9999,
                              fontSize:10, fontWeight:800, letterSpacing:'0.06em',
                              background: st.bg, color: st.color,
                              border: `1px solid ${st.border}`, marginBottom:6
                            }}>
                              {normStatus}
                            </span>
                            {/* Interactive dropdown */}
                            <select
                              value={normStatus}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              style={{
                                display:'block', width:'100%', padding:'5px 8px',
                                borderRadius:8, border:'1px solid #cbd5e1',
                                background:'#f8fafc', color:'#1e293b',
                                fontSize:11, fontWeight:700, cursor:'pointer',
                                outline:'none', transition:'border-color 0.2s'
                              }}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        );
      })()}

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

      {/* ─── ADD NEW STAFF MODAL ─── */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-lg p-6 space-y-4 border border-white bg-white/95 relative shadow-floating">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900">
                    Add New Staff Member
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Create dynamic employee credentials and profile</p>
                </div>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {staffFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {staffFormError}
              </div>
            )}

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.name}
                    onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium"
                    placeholder="e.g. Dr. Sarah Connor"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium font-mono"
                    placeholder="sarah.connor@lumina.design"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={staffForm.phone}
                    onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium font-mono"
                    placeholder="+1 (555) 777-8899"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Role / Position *</label>
                  <select
                    value={staffForm.role}
                    onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full bg-white text-slate-800 font-bold"
                  >
                    <option value="Senior Optometrist & Style Lead">Senior Optometrist & Style Lead</option>
                    <option value="Clinical Refraction Specialist">Clinical Refraction Specialist</option>
                    <option value="Optical Dispenser & Frame Consultant">Optical Dispenser & Frame Consultant</option>
                    <option value="Lead Eyewear Stylist">Lead Eyewear Stylist</option>
                    <option value="Boutique Store Manager">Boutique Store Manager</option>
                    <option value="Optometric Resident">Optometric Resident</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Store Boutique Location</label>
                <select
                  value={staffForm.storeLocation}
                  onChange={e => setStaffForm({ ...staffForm, storeLocation: e.target.value })}
                  className="glass-input p-2.5 rounded-xl text-xs w-full bg-white text-slate-800 font-bold"
                >
                  <option value="Lumina Flagship — 5th Avenue, New York">Lumina Flagship — 5th Avenue, New York</option>
                  <option value="Lumina Boutique — Ginza, Tokyo">Lumina Boutique — Ginza, Tokyo</option>
                  <option value="Lumina Atelier — Rue du Faubourg, Paris">Lumina Atelier — Rue du Faubourg, Paris</option>
                  <option value="Lumina Studio — Bond Street, London">Lumina Studio — Bond Street, London</option>
                  <option value="Lumina Lab — Bahnhofstrasse, Zurich">Lumina Lab — Bahnhofstrasse, Zurich</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Joined Date</label>
                  <input
                    type="date"
                    value={staffForm.joinedDate}
                    onChange={e => setStaffForm({ ...staffForm, joinedDate: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Avatar Image URL (Optional)</label>
                  <input
                    type="url"
                    value={staffForm.avatar}
                    onChange={e => setStaffForm({ ...staffForm, avatar: e.target.value })}
                    className="glass-input p-2.5 rounded-xl text-xs w-full font-medium"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <GlassButton
                  type="button"
                  size="md"
                  variant="secondary"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="w-1/3"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  type="submit"
                  size="md"
                  variant="primary"
                  className="w-2/3 shadow-glass-glow"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Create Staff Member
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
};
