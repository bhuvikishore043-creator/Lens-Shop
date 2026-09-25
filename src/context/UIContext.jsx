import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [activeFrameModel, setActiveFrameModel] = useState('lum-01');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <UIContext.Provider value={{
      activeFrameModel,
      setActiveFrameModel,
      isSearchOpen,
      setIsSearchOpen,
      isChatOpen,
      setIsChatOpen
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
