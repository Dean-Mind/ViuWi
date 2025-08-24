'use client';

import React, { useState } from 'react';
import { useDocuments, useRemoveDocument, useProcessDocumentManually, DocumentFile } from '@/stores/knowledgeBaseStore';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatFileSize } from '@/utils/fileUtils';
import DocumentsModal from './DocumentsModal';
import ProcessingStatusBadge from './ProcessingStatusBadge';
import { useAppToast } from '@/hooks/useAppToast';

export default function DocumentsSection() {
  const documents = useDocuments();
  const removeDocument = useRemoveDocument();
  const processDocument = useProcessDocumentManually();
  const toast = useAppToast();
  const [showModal, setShowModal] = useState(false);
  const [documentToRemove, setDocumentToRemove] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRemoveDocument = (documentId: string) => {
    setDocumentToRemove(documentId);
    setIsConfirmOpen(true);
  };

  const confirmRemove = () => {
    if (documentToRemove) {
      removeDocument(documentToRemove);
      setDocumentToRemove(null);
    }
    setIsConfirmOpen(false);
  };

  const cancelRemove = () => {
    setDocumentToRemove(null);
    setIsConfirmOpen(false);
  };

  const handleProcessDocument = async (documentId: string, documentName: string) => {
    try {
      await processDocument(documentId);
      toast.success(`Document '${documentName}' processed successfully`);
    } catch (_error) {
      toast.error(`Failed to process '${documentName}'`);
    }
  };

  // Get document processing status from the actual file data
  const getDocumentStatus = (file: DocumentFile): 'pending' | 'processing' | 'completed' | 'failed' => {
    return file.processingStatus;
  };

  return (
    <>
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300">
        <div className="p-6">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold text-base-content flex items-center gap-2">
                <svg className="h-5 w-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Dokumen ({documents.files.length})
              </h3>
              <p className="text-sm text-base-content/70">
                Upload dokumen PDF, DOC, atau DOCX untuk basis pengetahuan
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl px-4"
            >
              {documents.files.length > 0 ? 'Edit' : 'Upload'}
            </button>
          </div>

          {/* Documents List */}
          {documents.files.length > 0 ? (
            <div className="space-y-3">
              {documents.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-2xl hover:bg-base-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      {file.type.includes('pdf') ? (
                        <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      ) : (
                        <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1">
                      <p className="font-medium text-base-content">{file.name}</p>
                      <p className="text-sm text-base-content/60">
                        {formatFileSize(file.size)} • Uploaded {formatDistanceToNow(file.uploadedAt, {
                          addSuffix: true,
                          locale: id
                        })}
                      </p>

                      {/* Processing Status */}
                      <div className="mt-2">
                        <ProcessingStatusBadge
                          status={getDocumentStatus(file)}
                          onProcess={() => handleProcessDocument(file.id, file.name)}
                          onRetry={() => handleProcessDocument(file.id, file.name)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleRemoveDocument(file.id)}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-2xl"
                    title="Hapus dokumen"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Last Updated */}
              {documents.lastUpdated && (
                <div className="text-xs text-base-content/50 text-center pt-2">
                  Last updated: {formatDistanceToNow(documents.lastUpdated, { 
                    addSuffix: true, 
                    locale: id 
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="h-16 w-16 text-base-content/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-base-content/60 mb-2">Belum ada dokumen yang diupload</p>
              <p className="text-sm text-base-content/50">
                Upload dokumen PDF, DOC, atau DOCX untuk memulai
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Documents Modal */}
      <DocumentsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="text-lg font-semibold text-base-content mb-4">Konfirmasi Hapus</h3>
            <p className="text-base-content/80 mb-6">
              Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-action">
              <button
                onClick={cancelRemove}
                className="btn btn-ghost rounded-2xl"
              >
                Batal
              </button>
              <button
                onClick={confirmRemove}
                className="btn btn-error text-white rounded-2xl"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
