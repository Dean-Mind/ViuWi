'use client';

import { useRef } from 'react';
import CloudUploadIcon from '../icons/CloudUploadIcon';
import AuthButton from '../ui/AuthButton';

interface FileUploadAreaProps {
  onFileSelect: (files: FileList) => void;
  supportedFormats: string[];
  isLoading?: boolean;
  accept?: string;
  maxFileSize?: string;
  multiple?: boolean;
  buttonText?: string;
}

export default function FileUploadArea({
  onFileSelect,
  supportedFormats,
  isLoading,
  accept,
  maxFileSize,
  multiple = false,
  buttonText
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

  return (
    <div className="card border border-base-300 rounded-2xl p-8">
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
    </div>
  );
}