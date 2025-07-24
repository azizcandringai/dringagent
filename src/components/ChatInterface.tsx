import { useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '@/hooks/useChat';

export const ChatInterface = () => {
  const { messages, isTyping, sendMessage, messagesEndRef } = useChat();

  return (
    <div className="flex flex-col h-full bg-chat-background rounded-xl border border-border shadow-soft overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isNew={index === messages.length - 1 && message.sender === 'bot'}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
    </div>
  );
};