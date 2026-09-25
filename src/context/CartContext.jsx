import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../services/storageService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = getStorageData(LOCAL_STORAGE_KEYS.CART) || [];
    setCartItems(savedCart);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    setStorageData(LOCAL_STORAGE_KEYS.CART, items);
  };

  const addToCart = (product, selectedColor = null, prescription = null) => {
    const existingIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.color?.name === selectedColor?.name
    );

    let updated = [...cartItems];
    if (existingIndex > -1) {
      updated[existingIndex].quantity += 1;
    } else {
      updated.push({
        id: `${product.id}-${Date.now()}`,
        product,
        color: selectedColor || product.colors?.[0],
        prescription,
        quantity: 1
      });
    }
    updateCart(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    const updated = cartItems.filter(item => item.id !== cartItemId);
    updateCart(updated);
  };

  const updateQuantity = (cartItemId, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(updated);
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity),
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartSubtotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
