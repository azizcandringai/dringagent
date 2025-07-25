import { useState, useEffect } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { LanguageCode } from '@/lib/languages';

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(availableLanguages.find(lang => lang.code === currentLanguage));

  // Update current language display when language changes
  useEffect(() => {
    setCurrentLang(availableLanguages.find(lang => lang.code === currentLanguage));
  }, [currentLanguage, availableLanguages]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        title={t('language')}
      >
        <Languages size={14} className="md:w-4 md:h-4" />
        <span className="text-sm font-medium hidden sm:inline">{currentLang?.flag}</span>
        <span className="text-sm font-medium sm:hidden">{currentLang?.flag}</span>
        <ChevronDown size={12} className={`md:w-3.5 md:h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-soft z-20 min-w-[140px]">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code as LanguageCode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentLanguage === lang.code ? 'bg-secondary' : ''
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};