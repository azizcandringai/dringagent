import { useState, useEffect, useRef } from 'react';
import { openaiService } from '@/lib/openai';
import type { Message, FileAttachment } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Hello! I\'m your AI assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const generateBotResponse = async (userMessage: string, files?: FileAttachment[], conversationHistory: Message[] = []): Promise<string> => {
    try {
      // Convert our message format to OpenAI format
      const openaiMessages = conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      // Add the current user message
      openaiMessages.push({
        role: 'user' as const,
        content: files && files.length > 0 
          ? `${userMessage}\n\n[User has shared ${files.length} file(s): ${files.map(f => f.name).join(', ')}]`
          : userMessage
      });

      return await openaiService.sendMessage(openaiMessages);
    } catch (error) {
      console.error('Error generating bot response:', error);
      return 'I apologize, but I encountered an error while processing your message. Please try again.';
    }
  };

  const sendMessage = async (text: string, files?: FileAttachment[]) => {
    if (!text.trim() && (!files || files.length === 0)) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      files
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const botResponseText = await generateBotResponse(text, files, updatedMessages);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    messagesEndRef,
  };
};