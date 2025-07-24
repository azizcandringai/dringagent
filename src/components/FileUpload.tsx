import { useState, useRef } from 'react';
import { Paperclip, X } from 'lucide-react';
import type { FileAttachment } from '@/types/chat';

interface FileUploadProps {
  onFilesSelected: (files: FileAttachment[]) => void;
  selectedFiles: FileAttachment[];
  onRemoveFile: (fileId: string) => void;
}

export const FileUpload = ({ onFilesSelected, selectedFiles, onRemoveFile }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList) => {
    const fileAttachments: FileAttachment[] = [];
    
    Array.from(files).forEach(file => {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment: FileAttachment = {
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target?.result as string
        };
        fileAttachments.push(attachment);
        
        if (fileAttachments.length === files.length) {
          onFilesSelected(fileAttachments);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

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

  return (
    <div>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.json"
      />

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        title="Upload files"
      >
        <Paperclip size={18} />
      </button>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-2 bg-secondary rounded-lg"
            >
              {/* File Preview */}
              <div className="flex-shrink-0">
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-lg">
                    {getFileIcon(file.type)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemoveFile(file.id)}
                className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 bg-primary/10 border-2 border-dashed border-primary z-50 flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <Paperclip size={48} className="mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Drop files here to upload</p>
          </div>
        </div>
      )}
    </div>
  );
};