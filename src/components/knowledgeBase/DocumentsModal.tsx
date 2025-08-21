'use client';

import React, { useState, useRef } from 'react';
import { useAddDocuments, DocumentFile } from '@/stores/knowledgeBaseStore';
import { useAppToast } from '@/hooks/useAppToast';
import { formatFileSize } from '@/utils/fileUtils';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentsModal({ isOpen, onClose }: DocumentsModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addDocuments = useAddDocuments();
  const toast = useAppToast();

  const supportedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (!supportedFormats.includes(file.type)) {
        errors.push(`${file.name}: Format tidak didukung`);
        return;
      }
      
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: Ukuran file terlalu besar (max 10MB)`);
        return;
      }
      
      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast.error(`Beberapa file tidak valid: ${errors.join(', ')}`);
    }

    if (validFiles.length > 0) {
      handleUpload(validFiles);
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const documentFiles: DocumentFile[] = files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }));
      
      addDocuments(documentFiles);
      toast.success(`Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}`);
      onClose();
    } catch (_error) {
      toast.error('Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box rounded-2xl max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-base-content">Upload Dokumen</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm rounded-2xl"
            disabled={isUploading}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragActive 
              ? 'border-brand-orange bg-brand-orange/5' 
              : 'border-base-300 hover:border-brand-orange/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="loading loading-spinner loading-lg text-brand-orange"></div>
              <p className="text-base-content/70">Uploading documents...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <svg className="h-16 w-16 text-base-content/40 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              <div>
                <p className="text-lg font-medium text-base-content mb-2">
                  Drag & drop files here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-brand-orange hover:text-brand-orange-light font-semibold"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-base-content/60">
                  Supported formats: PDF, DOC, DOCX (max {formatFileSize(maxFileSize)} each)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Info */}
        <div className="mt-6 p-4 bg-base-200 rounded-2xl">
          <h4 className="font-medium text-base-content mb-2">Tips:</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            <li>• Upload dokumen yang berisi informasi penting tentang bisnis Anda</li>
            <li>• FAQ, panduan produk, atau prosedur layanan sangat membantu</li>
            <li>• Dokumen akan diproses untuk membuat AI guidelines yang lebih akurat</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn btn-ghost rounded-2xl"
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
