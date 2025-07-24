import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('placeholder')}
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:chat-input-focus outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              overflow: 'auto'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
            message.trim() && !disabled
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          title={t('send')}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};