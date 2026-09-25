import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import initialProducts from '../data/products.json';
import initialCategories from '../data/categories.json';
import initialReviews from '../data/reviews.json';
import initialAppointments from '../data/appointments.json';
import initialUsers from '../data/users.json';

export const initializeStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initialAppointments));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CART)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify([]));
  }
};

export const getStorageData = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage`, err);
    return null;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to LocalStorage`, err);
  }
};
