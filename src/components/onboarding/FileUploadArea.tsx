'use client';

import { useRef } from 'react';
import CloudUploadIcon from '../icons/CloudUploadIcon';
import AuthButton from '../ui/AuthButton';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'completed' | 'failed';
  type: string;
}

interface FileUploadAreaProps {
  onFileSelect: (files: FileList) => void;
  supportedFormats: string[];
  isLoading?: boolean;
  accept?: string;
  maxFileSize?: string;
  multiple?: boolean;
  buttonText?: string;
  uploadedFiles?: UploadedFile[];
  onRemoveFile?: (fileId: string) => void;
}

export default function FileUploadArea({
  onFileSelect,
  supportedFormats,
  isLoading,
  accept,
  maxFileSize,
  multiple = false,
  buttonText,
  uploadedFiles = [],
  onRemoveFile
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert display formats (["PDF", "DOC", "DOCX"]) to accept format (".pdf,.doc,.docx")
  const formatToAccept = (formats: string[]) => {
    return formats.map(format => `.${format.toLowerCase()}`).join(',');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      case 'uploading':
        return 'text-warning';
      default:
        return 'text-base-content';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Berhasil';
      case 'failed':
        return 'Gagal';
      case 'uploading':
        return 'Mengunggah...';
      default:
        return '';
    }
  };

  return (
    <div className="card border border-base-300 rounded-2xl p-6">
      {/* Upload Area */}
      <div className="flex flex-col items-center text-center space-y-4">
        <CloudUploadIcon width={34} height={34} color="var(--color-base-content)" />

        <p className="text-brand-body text-base-content">
          Format yang didukung: {supportedFormats.join(', ')}
          {maxFileSize && ` (Maks. ${maxFileSize})`}
        </p>

        <AuthButton
          onClick={handleClick}
          loading={isLoading}
          className="w-auto px-8"
        >
          {buttonText || 'Unggah Dokumen'}
        </AuthButton>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={accept || formatToAccept(supportedFormats)}
          className="hidden"
          multiple={multiple}
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-base-300">
          <h4 className="font-semibold text-base-content mb-4">
            Dokumen Terunggah ({uploadedFiles.length})
          </h4>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-base-100 rounded-xl border border-base-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getFileIcon(file.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base-content truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-base-content/60">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-base-content/40">•</span>
                      <span className={`font-medium ${getStatusColor(file.status)}`}>
                        {getStatusText(file.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <div className="loading loading-spinner loading-sm text-warning"></div>
                  )}
                  {file.status === 'completed' && (
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="text-success text-sm">✓</span>
                    </div>
                  )}
                  {file.status === 'failed' && (
                    <div className="w-6 h-6 rounded-full bg-error/20 flex items-center justify-center">
                      <span className="text-error text-sm">✗</span>
                    </div>
                  )}

                  {/* Remove Button */}
                  {onRemoveFile && (
                    <button
                      onClick={() => onRemoveFile(file.id)}
                      className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-error hover:bg-error/10"
                      title="Hapus dokumen"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}