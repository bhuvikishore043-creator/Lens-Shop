import { getStorageData, setStorageData } from './storageService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const DEMO_ACCOUNTS = {
  customer: {
    id: 'usr-cust-01',
    name: 'Elena Rostova',
    email: 'customer@lumina.design',
    phone: '+1 (555) 234-8901',
    role: 'customer',
    roleTitle: 'VIP Customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    prescription: {
      od: { sph: '-2.25', cyl: '-0.50', axis: '180' },
      os: { sph: '-2.00', cyl: '-0.75', axis: '175' },
      pd: '63.5'
    }
  },
  staff: {
    id: 'staff-1',
    name: 'Alex Rivera',
    email: 'staff@lumina.design',
    phone: '+1 (555) 101-2020',
    role: 'staff',
    roleTitle: 'Senior Optometrist & Style Lead',
    storeLocation: 'Lumina Flagship — 5th Avenue, New York',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. Arthur Lumina',
    email: 'admin@lumina.design',
    phone: '+1 (555) 900-0001',
    role: 'admin',
    roleTitle: 'Store Owner & Chief Medical Director',
    storeLocation: 'Lumina Global Headquarters',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  }
};

export const authService = {
  async sendEmailOTP(email) {
    console.log(`[LUMINA AUTH] OTP dispatched to ${email}: 888999`);
    return Promise.resolve({ success: true, message: "Verification code sent to email" });
  },

  async verifyOTP(email, code, preferredRole = 'customer') {
    if (code !== '888999' && code !== '123456') {
      return Promise.reject(new Error("Invalid verification code. Try '888999' or '123456'"));
    }

    const lower = email.toLowerCase();
    let role = preferredRole;
    if (lower.includes('admin') || lower.includes('owner')) role = 'admin';
    else if (lower.includes('staff') || lower.includes('employee') || lower.includes('alex')) role = 'staff';

    let user;
    if (DEMO_ACCOUNTS[role] && lower.includes(role)) {
      user = { ...DEMO_ACCOUNTS[role], email };
    } else {
      user = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: role,
        roleTitle: role === 'admin' ? 'Store Owner' : role === 'staff' ? 'Optometry Staff' : 'Registered Customer',
        avatar: DEMO_ACCOUNTS[role]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        prescription: null
      };
    }

    setStorageData(LOCAL_STORAGE_KEYS.CURRENT_USER, user);
    return Promise.resolve(user);
  },

  async loginDirectAsRole(role) {
    const account = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.customer;
    setStorageData(LOCAL_STORAGE_KEYS.CURRENT_USER, account);
    return Promise.resolve(account);
  },

  getCurrentUser() {
    return getStorageData(LOCAL_STORAGE_KEYS.CURRENT_USER);
  },

  logout() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    return Promise.resolve(true);
  }
};
