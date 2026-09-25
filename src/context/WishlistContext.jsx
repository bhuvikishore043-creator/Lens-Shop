import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../services/storageService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    const saved = getStorageData(LOCAL_STORAGE_KEYS.WISHLIST) || [];
    setWishlist(saved);
  }, []);

  const toggleWishlist = (product) => {
    let updated;
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      updated = wishlist.filter(item => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    setStorageData(LOCAL_STORAGE_KEYS.WISHLIST, updated);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isWishlistOpen,
      setIsWishlistOpen,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
