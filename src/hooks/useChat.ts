import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, ChatState, ChatSession, FileAttachment } from '@/types/chat';
import { useLanguage } from '@/hooks/useLanguage';
import { openaiService } from '@/lib/openai';

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

  const generateBotResponse = async (userMessage: string, files?: FileAttachment[], conversationHistory: Message[] = []): Promise<string> => {
    try {
      // Prepare conversation context for OpenAI
      const messages = [
        {
          role: 'system' as const,
          content: 'You are a helpful AI assistant. Be concise and helpful in your responses.'
        },
        // Add recent conversation history (last 10 messages)
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user' as const,
          content: files && files.length > 0 
            ? `${userMessage}\n\n[User has shared ${files.length} file(s): ${files.map(f => f.name).join(', ')}]`
            : userMessage
        }
      ];

      return await openaiService.sendMessage(messages);
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Sorry, I encountered an error while processing your message. Please try again.';
    }
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
    setTimeout(async () => {
      try {
        const responseText = await generateBotResponse(text, files, currentSession.messages);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
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
      } catch (error) {
        console.error('Error generating bot response:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setChatState(prev => ({
          ...prev,
          sessions: prev.sessions.map(session =>
            session.id === currentSession.id
              ? { 
                  ...session, 
                  messages: [...session.messages, errorMessage],
                  updatedAt: new Date()
                }
              : session
          ),
          isTyping: false,
        }));
      }
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