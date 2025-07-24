import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { FileUpload } from './FileUpload';
import type { FileAttachment } from '@/types/chat';

interface ChatInputProps {
  onSendMessage: (message: string, files?: FileAttachment[]) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const { t } = useLanguage();

  const handleSend = () => {
    if ((message.trim() || selectedFiles.length > 0) && !disabled) {
      onSendMessage(message.trim(), selectedFiles);
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFilesSelected = (files: FileAttachment[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="p-4 border-t border-border bg-card space-y-3">
      {/* File Upload */}
      <FileUpload
        onFilesSelected={handleFilesSelected}
        selectedFiles={selectedFiles}
        onRemoveFile={handleRemoveFile}
      />
      
      {/* Input Area */}
      <div className="flex gap-3 items-end">{/* ... keep existing code */}
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
          disabled={(!message.trim() && selectedFiles.length === 0) || disabled}
          className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
            (message.trim() || selectedFiles.length > 0) && !disabled
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