import React, { createContext, useContext, useState } from 'react';
import i18n from '../i18n';
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lng, setLng] = useState('ar');

  const changeLanguage = (newLng) => {
    i18n.changeLanguage(newLng);
    setLng(newLng);
  };

  return (
    <LanguageContext.Provider value={{ lng, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};