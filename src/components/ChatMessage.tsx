import { useEffect, useState } from 'react';
import { Bot, User, Download } from 'lucide-react';
import type { Message, FileAttachment } from '@/types/chat';

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('text')) return '📝';
    return '📎';
  };

  const handleFileDownload = (file: FileAttachment) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Message Content */}
      <div className="max-w-[75%] space-y-2">
        {/* Files */}
        {message.files && message.files.length > 0 && (
          <div className="space-y-2">
            {message.files.map((file) => (
              <div
                key={file.id}
                className={`rounded-xl border p-3 ${
                  isUser
                    ? 'bg-chat-user-bubble/10 border-chat-user-bubble/20'
                    : 'bg-chat-bot-bubble border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* File Preview */}
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-lg">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleFileDownload(file)}
                    className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    title="Download file"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Text Message */}
        {message.text && (
          <div
            className={`rounded-2xl px-4 py-3 shadow-message ${
              isUser
                ? 'bg-chat-user-bubble text-chat-user-text rounded-br-lg'
                : 'bg-chat-bot-bubble text-chat-bot-text border border-border rounded-bl-lg'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};