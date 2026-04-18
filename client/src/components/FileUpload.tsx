import React, { useRef, useState } from 'react';
import { Upload, File, X, FileText, Image, FileSpreadsheet, Paperclip } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface FileAttachment {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

interface FileUploadProps {
  entityType: 'contact' | 'company' | 'deal';
  entityId: number;
  attachments: FileAttachment[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function FileUpload({ entityType, entityId, attachments, onUpload, onDelete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
      showToast('success', `${file.name} uploaded successfully`);
    } catch (error) {
      showToast('error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
    return File;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        
        {uploading ? (
          <div className="text-gray-600 dark:text-gray-400">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            Uploading...
          </div>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Drag and drop files here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maximum file size: 10MB
            </p>
          </>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Attachments ({attachments.length})
          </h4>
          {attachments.map(attachment => {
            const Icon = getFileIcon(attachment.mime_type);
            return (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {attachment.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(attachment.file_size)} • {new Date(attachment.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(attachment.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
