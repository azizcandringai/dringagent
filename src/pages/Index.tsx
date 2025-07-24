import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';
import { ChatSidebar } from '@/components/ChatSidebar';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const { 
    sessions, 
    currentSession, 
    createNewSession, 
    switchSession, 
    deleteSession, 
    clearAllSessions 
  } = useChat();

  return (
    <div className="h-screen flex bg-background theme-transition">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSession?.id || null}
        onSelectSession={switchSession}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        onClearAll={clearAllSessions}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full flex flex-col">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
};

export default Index;
