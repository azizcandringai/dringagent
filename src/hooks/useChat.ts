import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, ChatState } from '@/types/chat';
import { useLanguage } from '@/hooks/useLanguage';

export const useChat = () => {
  const { t } = useLanguage();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: t('welcome'),
      sender: 'bot',
      timestamp: new Date(),
    };
    setChatState(prev => ({ ...prev, messages: [welcomeMessage] }));
  }, [t]);

  const generateBotResponse = (userMessage: string): string => {
    // Simple mock responses based on keywords
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hola') || message.includes('merhaba')) {
      return t('welcome');
    }
    
    if (message.includes('help') || message.includes('ayuda') || message.includes('yardım')) {
      return 'I\'m here to help! You can ask me anything. This is a demo chatbot to showcase the interface.';
    }
    
    if (message.includes('weather') || message.includes('tiempo') || message.includes('hava')) {
      return 'I don\'t have access to real weather data, but I hope it\'s nice where you are! ☀️';
    }
    
    return t('defaultBotResponse');
  };

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    // Simulate bot thinking time
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));
    }, 1000 + Math.random() * 1500);
  }, [t]);

  return {
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    sendMessage,
    messagesEndRef,
  };
};