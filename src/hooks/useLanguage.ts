import { useState, useEffect } from 'react';
import { languages, type LanguageCode, type Translation } from '@/lib/languages';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatbot-language') as LanguageCode;
      if (saved && saved in languages) return saved;
      
      // Detect browser language
      const browserLang = navigator.language.slice(0, 2) as LanguageCode;
      return browserLang in languages ? browserLang : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('chatbot-language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
  };

  const t = (key: keyof Translation): string => {
    return languages[currentLanguage].translations[key];
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.values(languages)
  };
};