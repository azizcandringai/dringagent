import { MessageCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';

export const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <MessageCircle size={24} />
        </div>
        <h1 className="text-xl font-semibold">{t('title')}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
};