import { useEffect, useState } from 'react';
import { Bot, User } from 'lucide-react';
import type { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  isNew?: boolean;
}

export const ChatMessage = ({ message, isNew = false }: ChatMessageProps) => {
  const [isVisible, setIsVisible] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex gap-3 p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-chat-user-bubble text-chat-user-text' 
            : 'bg-chat-bot-bubble text-chat-bot-text border border-border'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-message ${
          isUser
            ? 'bg-chat-user-bubble text-chat-user-text rounded-br-lg'
            : 'bg-chat-bot-bubble text-chat-bot-text border border-border rounded-bl-lg'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
      </div>
    </div>
  );
};