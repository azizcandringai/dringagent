import { useState } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { LanguageCode } from '@/lib/languages';

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        title={t('language')}
      >
        <Languages size={16} />
        <span className="text-sm font-medium">{currentLang?.flag}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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