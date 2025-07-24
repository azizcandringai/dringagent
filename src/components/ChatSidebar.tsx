import { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  MoreVertical, 
  Trash2, 
  Menu,
  X,
  Clock,
  MessageCircle
} from 'lucide-react';
import type { ChatSession } from '@/types/chat';
import { useLanguage } from '@/hooks/useLanguage';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
}

export const ChatSidebar = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAll
}: ChatSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { t } = useLanguage();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getSessionPreview = (session: ChatSession) => {
    const lastMessage = session.messages[session.messages.length - 1];
    if (!lastMessage) return 'No messages yet';
    return lastMessage.text.slice(0, 50) + (lastMessage.text.length > 50 ? '...' : '');
  };

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-card border border-border shadow-soft"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30 w-80 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-primary" />
              <span className="font-semibold">Chat History</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onNewSession}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                title="New chat"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative rounded-lg p-3 cursor-pointer transition-colors hover:bg-secondary/50 ${
                  currentSessionId === session.id ? 'bg-secondary' : ''
                }`}
                onClick={() => {
                  onSelectSession(session.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={14} className="text-muted-foreground flex-shrink-0" />
                      <h3 className="font-medium text-sm truncate">{session.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {getSessionPreview(session)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{formatTime(new Date(session.updatedAt))}</span>
                      <span>•</span>
                      <span>{session.messages.length} messages</span>
                    </div>
                  </div>

                  {/* Options Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === session.id ? null : session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary transition-all"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeDropdown === session.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-soft z-20 min-w-[120px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                              setActiveDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {sessions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat sessions yet</p>
                <p className="text-xs">Start a new conversation!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {sessions.length > 1 && (
          <div className="p-4 border-t border-border">
            <button
              onClick={onClearAll}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Clear All Chats
            </button>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};