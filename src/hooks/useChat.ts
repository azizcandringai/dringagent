import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, ChatState, ChatSession, FileAttachment } from '@/types/chat';
import { useLanguage } from '@/hooks/useLanguage';

const STORAGE_KEY = 'chatbot-sessions';

export const useChat = () => {
  const { t } = useLanguage();
  const [chatState, setChatState] = useState<ChatState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Convert date strings back to Date objects
        const sessions = parsedState.sessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        return { ...parsedState, sessions };
      }
    }
    
    // Initialize with first session
    const initialSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return {
      sessions: [initialSession],
      currentSessionId: initialSession.id,
      isTyping: false,
    };
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatState));
    }
  }, [chatState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSession = chatState.sessions.find(s => s.id === chatState.currentSessionId);
  const messages = currentSession?.messages || [];

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatState.isTyping]);

  // Initialize with welcome message for new sessions
  useEffect(() => {
    if (currentSession && currentSession.messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-' + currentSession.id,
        text: t('welcome'),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setChatState(prev => ({
        ...prev,
        sessions: prev.sessions.map(session =>
          session.id === currentSession.id
            ? { ...session, messages: [welcomeMessage], updatedAt: new Date() }
            : session
        )
      }));
    }
  }, [currentSession?.id, t]);

  const generateBotResponse = (userMessage: string, files?: FileAttachment[]): string => {
    const message = userMessage.toLowerCase();
    
    if (files && files.length > 0) {
      const fileTypes = files.map(f => f.type.split('/')[0]).join(', ');
      return `I can see you've shared ${files.length} file(s) (${fileTypes}). This is a demo chatbot, so I can't actually process the files, but in a real implementation, I could analyze images, read documents, etc.`;
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hola') || message.includes('merhaba')) {
      return t('welcome');
    }
    
    if (message.includes('help') || message.includes('ayuda') || message.includes('yardım')) {
      return 'I\'m here to help! You can ask me anything or share files. This is a demo chatbot to showcase the interface.';
    }
    
    if (message.includes('weather') || message.includes('tiempo') || message.includes('hava')) {
      return 'I don\'t have access to real weather data, but I hope it\'s nice where you are! ☀️';
    }
    
    return t('defaultBotResponse');
  };

  const sendMessage = useCallback(async (text: string, files?: FileAttachment[]) => {
    if (!currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      files
    };

    // Add user message and set typing
    setChatState(prev => ({
      ...prev,
      sessions: prev.sessions.map(session =>
        session.id === currentSession.id
          ? { 
              ...session, 
              messages: [...session.messages, userMessage],
              updatedAt: new Date(),
              title: session.messages.length === 0 ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : session.title
            }
          : session
      ),
      isTyping: true,
    }));

    // Generate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(text, files),
        sender: 'bot',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        sessions: prev.sessions.map(session =>
          session.id === currentSession.id
            ? { 
                ...session, 
                messages: [...session.messages, botMessage],
                updatedAt: new Date()
              }
            : session
        ),
        isTyping: false,
      }));
    }, 1000 + Math.random() * 1500);
  }, [t, currentSession]);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChatState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      currentSessionId: newSession.id,
      isTyping: false
    }));
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    setChatState(prev => ({
      ...prev,
      currentSessionId: sessionId,
      isTyping: false
    }));
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setChatState(prev => {
      const remainingSessions = prev.sessions.filter(s => s.id !== sessionId);
      
      if (remainingSessions.length === 0) {
        // Create a new session if all are deleted
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return {
          sessions: [newSession],
          currentSessionId: newSession.id,
          isTyping: false
        };
      }

      return {
        ...prev,
        sessions: remainingSessions,
        currentSessionId: prev.currentSessionId === sessionId 
          ? remainingSessions[0].id 
          : prev.currentSessionId
      };
    });
  }, []);

  const clearAllSessions = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChatState({
      sessions: [newSession],
      currentSessionId: newSession.id,
      isTyping: false
    });
  }, []);

  return {
    messages,
    sessions: chatState.sessions,
    currentSession,
    isTyping: chatState.isTyping,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    clearAllSessions,
    messagesEndRef,
  };
};