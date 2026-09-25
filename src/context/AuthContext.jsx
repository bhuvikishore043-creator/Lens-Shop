import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, DEMO_ACCOUNTS } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const loginWithOTP = async (email, code, role = 'customer') => {
    const loggedUser = await authService.verifyOTP(email, code, role);
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  const loginAsRole = async (role) => {
    const loggedUser = await authService.loginDirectAsRole(role);
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthModalOpen,
      setIsAuthModalOpen,
      loginWithOTP,
      loginAsRole,
      logout,
      demoAccounts: DEMO_ACCOUNTS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
