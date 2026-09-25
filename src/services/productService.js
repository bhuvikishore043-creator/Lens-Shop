import { getStorageData, setStorageData } from './storageService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const productService = {
  async getProducts() {
    const products = getStorageData(LOCAL_STORAGE_KEYS.PRODUCTS) || [];
    return Promise.resolve(products);
  },

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async filterProducts({ category, search, minPrice, maxPrice, sortBy }) {
    let products = await this.getProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    return Promise.resolve(products);
  },

  async createProduct(newProduct) {
    const products = await this.getProducts();
    const productToAdd = {
      id: `lum-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      stock: 10,
      featured: false,
      ...newProduct
    };
    products.unshift(productToAdd);
    setStorageData(LOCAL_STORAGE_KEYS.PRODUCTS, products);
    return Promise.resolve(productToAdd);
  },

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    setStorageData(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
    return Promise.resolve(updated.find(p => p.id === id));
  },

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    setStorageData(LOCAL_STORAGE_KEYS.PRODUCTS, filtered);
    return Promise.resolve(true);
  }
};
