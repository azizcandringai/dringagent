import { Bot } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const TypingIndicator = () => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-3 p-4 animate-pulse">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-bot-bubble text-chat-bot-text border border-border flex items-center justify-center">
        <Bot size={16} />
      </div>
      <div className="bg-chat-bot-bubble text-chat-bot-text border border-border rounded-2xl rounded-bl-lg px-4 py-3 shadow-message">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">{t('botTyping')}</span>
          <div className="flex gap-1 ml-2">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};