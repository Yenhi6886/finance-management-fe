import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations, defaultLanguage, getNestedTranslation } from '../i18n/index.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get language from localStorage or use default
    const savedLanguage = localStorage.getItem('app_language');
    return savedLanguage && translations[savedLanguage] ? savedLanguage : defaultLanguage;
  });

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('app_language', currentLanguage);
  }, [currentLanguage]);

  // Change language function
  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
    }
  };

  // Translation function
  const t = (key, params = {}, fallback = key) => {
    const translation = getNestedTranslation(translations[currentLanguage], key);
    
    if (translation === undefined) {
      return fallback;
    }
    
    // If translation is a string and params are provided, substitute placeholders
    if (typeof translation === 'string' && typeof params === 'object' && params !== null) {
      return translation.replace(/\{(\w+)\}/g, (match, placeholder) => {
        return params[placeholder] !== undefined ? params[placeholder] : match;
      });
    }
    
    return translation;
  };

  // Get current translations object
  const getCurrentTranslations = () => {
    return translations[currentLanguage];
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    const { languages } = require('../i18n/index.js');
    return languages[currentLanguage];
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getCurrentTranslations,
    getCurrentLanguageInfo,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
