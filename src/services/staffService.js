import { dealService } from './dealService';

const STAFF_KEY = 'lumina_staff_directory';

const SEED_STAFF = [
  {
    id: 'staff-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@lumina.design',
    phone: '+1 (555) 101-2020',
    role: 'Senior Optometrist & Style Lead',
    storeLocation: 'Lumina Flagship — 5th Avenue, New York',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    leadsAttended: 18,
    dealsClosed: 14,
    revenueGenerated: 6850,
    rating: 4.95,
    joinedDate: '2024-03-15'
  },
  {
    id: 'staff-2',
    name: 'Maya Lin',
    email: 'maya.lin@lumina.design',
    phone: '+1 (555) 202-3030',
    role: 'Clinical Refraction Specialist',
    storeLocation: 'Lumina Boutique — Ginza, Tokyo',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    leadsAttended: 15,
    dealsClosed: 12,
    revenueGenerated: 5920,
    rating: 4.88,
    joinedDate: '2024-06-01'
  },
  {
    id: 'staff-3',
    name: 'David Kim',
    email: 'david.kim@lumina.design',
    phone: '+1 (555) 303-4040',
    role: 'Optical Dispenser & Frame Consultant',
    storeLocation: 'Lumina Atelier — Rue du Faubourg, Paris',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    leadsAttended: 12,
    dealsClosed: 9,
    revenueGenerated: 4210,
    rating: 4.82,
    joinedDate: '2025-01-10'
  }
];

function getStoredStaff() {
  const stored = localStorage.getItem(STAFF_KEY);
  if (!stored) {
    localStorage.setItem(STAFF_KEY, JSON.stringify(SEED_STAFF));
    return SEED_STAFF;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_STAFF;
  }
}

function saveStoredStaff(staffList) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staffList));
}

export const staffService = {
  async getStaffMembers() {
    return getStoredStaff();
  },

  async getStaffById(id) {
    const list = getStoredStaff();
    return list.find(s => s.id === id) || list[0];
  },

  async getStaffPerformanceAnalytics() {
    const staffList = getStoredStaff();
    const allDeals = await dealService.getDeals();

    return staffList.map(member => {
      const memberDeals = allDeals.filter(d => d.staffId === member.id || d.staffName === member.name);
      const totalRevenue = memberDeals.reduce((sum, d) => sum + (Number(d.dealAmount) || 0), member.revenueGenerated);
      const totalDealsClosed = member.dealsClosed + (memberDeals.length > 0 ? 0 : 0);
      const conversionRate = member.leadsAttended > 0 
        ? Math.round((totalDealsClosed / member.leadsAttended) * 100) 
        : 0;

      return {
        ...member,
        totalRevenue,
        dealsCount: totalDealsClosed,
        conversionRate,
        recentDeals: memberDeals.slice(0, 5)
      };
    });
  },

  async updateStaffMetrics(staffId, dealAmount) {
    const staffList = getStoredStaff();
    const updated = staffList.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          dealsClosed: s.dealsClosed + 1,
          revenueGenerated: s.revenueGenerated + Number(dealAmount)
        };
      }
      return s;
    });
    saveStoredStaff(updated);
  },

  async addStaffMember(memberData) {
    const staffList = getStoredStaff();
    const newMember = {
      id: `staff-${Date.now()}`,
      leadsAttended: 0,
      dealsClosed: 0,
      revenueGenerated: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      ...memberData
    };
    staffList.unshift(newMember);
    saveStoredStaff(staffList);
    return newMember;
  },

  async removeStaffMember(staffId) {
    const staffList = getStoredStaff();
    const filtered = staffList.filter(s => s.id !== staffId);
    saveStoredStaff(filtered);
    return true;
  }
};
