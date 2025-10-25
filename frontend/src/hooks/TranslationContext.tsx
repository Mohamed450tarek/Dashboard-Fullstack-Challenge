// src/contexts/TranslationContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

const TranslationContext = createContext<any>(null);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useI18nTranslation();

  const toggleLanguage = () => {
     const newLang = i18n.language.startsWith('en') ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
   // document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <TranslationContext.Provider value={{ toggleLanguage, language: i18n.language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
