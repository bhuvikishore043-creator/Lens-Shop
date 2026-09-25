import { getStorageData, setStorageData } from './storageService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

// ─── Seed mock orders if not already present ───────────────────────────────
const MOCK_ORDERS = [
  { id: 'ORD-3041', customer: 'Arjun Mehta',    item: 'Aetherium Titanium Specs',  total: 420, status: 'Delivered',  date: '2026-08-10' },
  { id: 'ORD-3042', customer: 'Sophie Laurent',  item: 'NovaPulse Anti-Blue Lens',  total: 280, status: 'Shipped',    date: '2026-08-12' },
  { id: 'ORD-3043', customer: 'Marcus Vance',    item: 'VisionX Smart Frames Pro',  total: 850, status: 'Processing', date: '2026-08-14' },
  { id: 'ORD-3044', customer: 'Priya Krishnan',  item: 'Lumina Apex Cat-Eye',       total: 510, status: 'Processing', date: '2026-08-15' },
  { id: 'ORD-3045', customer: 'Leo Fontaine',    item: 'Zeiss Prestige Sunshield',  total: 390, status: 'Delivered',  date: '2026-08-09' },
  { id: 'ORD-3046', customer: 'Yuna Nakamura',   item: 'Nano Acetate Rounds',       total: 320, status: 'Shipped',    date: '2026-08-13' },
  { id: 'ORD-3047', customer: 'Daniel Okafor',   item: 'Meridian Sport Polarised',  total: 440, status: 'Processing', date: '2026-08-16' },
  { id: 'ORD-3048', customer: 'Amara Diallo',    item: 'Aetherium Titanium Specs',  total: 420, status: 'Delivered',  date: '2026-08-11' },
];

export const adminService = {
  /** Full analytics payload */
  async getAnalytics() {
    const products    = getStorageData(LOCAL_STORAGE_KEYS.PRODUCTS)     || [];
    const appointments = getStorageData(LOCAL_STORAGE_KEYS.APPOINTMENTS) || [];
    const reviews     = getStorageData(LOCAL_STORAGE_KEYS.REVIEWS)      || [];

    const totalRevenue  = products.reduce((acc, p) => acc + p.price * 12, 0);
    const totalStock    = products.reduce((acc, p) => acc + p.stock, 0);

    return {
      totalRevenue,
      totalOrders: MOCK_ORDERS.length,
      totalStock,
      appointmentCount: appointments.length,
      reviewCount: reviews.length,
      recentSales: [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 61000 },
        { month: 'Apr', revenue: 58000 },
        { month: 'May', revenue: 73000 },
        { month: 'Jun', revenue: 89000 },
        { month: 'Jul', revenue: 94000 },
      ],
    };
  },

  /** Alias used by AdminDashboard */
  async getDashboardAnalytics() {
    return this.getAnalytics();
  },

  /** Return mock orders (persisted via localStorage) */
  async getOrders() {
    const stored = getStorageData('lumina_orders');
    if (!stored || stored.length === 0) {
      setStorageData('lumina_orders', MOCK_ORDERS);
      return MOCK_ORDERS;
    }
    return stored;
  },

  /** Update a single order's status */
  async updateOrderStatus(orderId, newStatus) {
    const orders  = getStorageData('lumina_orders') || MOCK_ORDERS;
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setStorageData('lumina_orders', updated);
    return updated;
  },

  /** Get inventory stats (stock totals, low-stock alerts) */
  async getInventoryStats() {
    const products = getStorageData(LOCAL_STORAGE_KEYS.PRODUCTS) || [];
    return {
      total:    products.length,
      lowStock: products.filter(p => p.stock <= 5).length,
      outOfStock: products.filter(p => p.stock === 0).length,
    };
  },

  /** Update stock for a product */
  async updateStock(productId, quantity) {
    const products = getStorageData(LOCAL_STORAGE_KEYS.PRODUCTS) || [];
    const updated  = products.map(p => p.id === productId ? { ...p, stock: quantity } : p);
    setStorageData(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
    return updated;
  },
};
