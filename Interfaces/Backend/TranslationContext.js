import React, { createContext, useState, useContext } from 'react';

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [enableTranslationsChat, setEnableTranslationsChat] = useState(1); // Start with 1 for enabled

  const toggleTranslations = () => {
    setEnableTranslationsChat(prevState => (prevState === 1 ? 0 : 1)); // Toggle between 0 and 1
  };

  return (
    <TranslationContext.Provider value={{ enableTranslationsChat, toggleTranslations }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useEnableTranslation = () => {
  return useContext(TranslationContext);
};
