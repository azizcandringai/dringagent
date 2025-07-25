import { MessageCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between p-3 md:p-4 border-b border-border bg-card">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
          <MessageCircle size={20} className="md:w-6 md:h-6" />
        </div>
        <h1 className="text-lg md:text-xl font-semibold truncate">{t('title')}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
};