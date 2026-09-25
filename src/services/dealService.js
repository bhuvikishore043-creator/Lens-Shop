const DEALS_KEY = 'lumina_customer_deals';

const SEED_DEALS = [
  {
    id: 'DEAL-901',
    customerName: 'Elena Rostova',
    phone: '+1 (555) 234-8901',
    email: 'elena@lumina.design',
    soldGlasses: 'Aetherium Titanium Specs',
    frameId: 'lum-01',
    dealAmount: 465,
    lensType: 'Zeiss Anti-Blue Shield',
    prescriptionNotes: 'OD: -2.25/-0.50x180, OS: -2.00/-0.75x175, PD: 63.5mm. Recommended blue light filter for 8h daily screen work.',
    staffId: 'staff-1',
    staffName: 'Alex Rivera',
    storeLocation: 'Lumina Flagship — 5th Avenue, New York',
    date: '2026-08-22',
    status: 'Completed'
  },
  {
    id: 'DEAL-902',
    customerName: 'Julian Thorne',
    phone: '+1 (555) 345-6789',
    email: 'julian.t@example.com',
    soldGlasses: 'CyberVisor Spatial Audio',
    frameId: 'lum-02',
    dealAmount: 625,
    lensType: 'Polarized Sun UV400',
    prescriptionNotes: 'OD: -1.75/-0.25x90, OS: -1.50/-0.50x85, PD: 65.0mm. Spatial audio calibrated for daily commute and cycling.',
    staffId: 'staff-2',
    staffName: 'Maya Lin',
    storeLocation: 'Lumina Boutique — Ginza, Tokyo',
    date: '2026-08-23',
    status: 'Completed'
  },
  {
    id: 'DEAL-903',
    customerName: 'Sophia Mercer',
    phone: '+1 (555) 987-6543',
    email: 'sophia.m@example.com',
    soldGlasses: 'Monolith Bio-Acetate',
    frameId: 'lum-03',
    dealAmount: 435,
    lensType: 'Photochromic Adaptive',
    prescriptionNotes: 'OD: -3.00 SPH, OS: -2.75 SPH, PD: 62.0mm. Anti-scratch premium hard coating applied.',
    staffId: 'staff-1',
    staffName: 'Alex Rivera',
    storeLocation: 'Lumina Flagship — 5th Avenue, New York',
    date: '2026-08-24',
    status: 'Completed'
  },
  {
    id: 'DEAL-904',
    customerName: 'David Zhang',
    phone: '+1 (555) 678-1234',
    email: 'david.z@example.com',
    soldGlasses: 'Aetherium Titanium Specs',
    frameId: 'lum-01',
    dealAmount: 420,
    lensType: 'Zeiss Anti-Blue Shield',
    prescriptionNotes: 'OD: -1.00/-0.50x180, OS: -1.25/-0.50x170, PD: 64.0mm. Lightweight titanium rimless fit.',
    staffId: 'staff-3',
    staffName: 'David Kim',
    storeLocation: 'Lumina Atelier — Rue du Faubourg, Paris',
    date: '2026-08-24',
    status: 'Completed'
  }
];

function getStoredDeals() {
  const stored = localStorage.getItem(DEALS_KEY);
  if (!stored) {
    localStorage.setItem(DEALS_KEY, JSON.stringify(SEED_DEALS));
    return SEED_DEALS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_DEALS;
  }
}

function saveStoredDeals(deals) {
  localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
}

export const dealService = {
  async getDeals() {
    return getStoredDeals();
  },

  async getDealsByStaff(staffId) {
    const deals = getStoredDeals();
    return deals.filter(d => d.staffId === staffId);
  },

  async logCustomerDeal(dealData) {
    const deals = getStoredDeals();
    const newDeal = {
      id: `DEAL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      ...dealData
    };
    deals.unshift(newDeal);
    saveStoredDeals(deals);
    return newDeal;
  },

  async getTotalRevenue() {
    const deals = getStoredDeals();
    return deals.reduce((sum, d) => sum + (Number(d.dealAmount) || 0), 0);
  }
};
