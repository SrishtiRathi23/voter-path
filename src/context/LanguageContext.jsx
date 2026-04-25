import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translateText } from '../services/translate';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN'); // EN, HI, TA

  useEffect(() => {
    const savedLang = localStorage.getItem('vp_lang');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('vp_lang', lang);
  };

  const t = useCallback(
    async (text) => {
      if (language === 'EN') return text;
      try {
        return await translateText(text, language);
      } catch (e) {
        console.error('Translation error', e);
        return text;
      }
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
