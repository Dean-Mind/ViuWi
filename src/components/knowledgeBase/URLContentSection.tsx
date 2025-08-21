'use client';

import React, { useState } from 'react';
import { useUrlContent } from '@/stores/knowledgeBaseStore';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import URLContentModal from './URLContentModal';

export default function URLContentSection() {
  const urlContent = useUrlContent();
  const [showModal, setShowModal] = useState(false);

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'extracting':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
            <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Extracting...
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
            ✓ Extracted
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
            ✗ Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-base-300 text-base-content/60">
            Not extracted
          </span>
        );
    }
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                Website URL
              </h3>
              <p className="text-sm text-base-content/70">
                Ekstrak konten dari root website untuk scraping otomatis semua halaman
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl px-4"
            >
              {urlContent.url ? 'Edit' : 'Tambah'}
            </button>
          </div>

          {/* URL Content Display */}
          {urlContent.url ? (
            <div className="space-y-4">
              {/* URL Info */}
              <div className="p-4 bg-base-200 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-sm font-medium text-base-content/80">URL:</span>
                  </div>
                  {getStatusBadge(urlContent.status)}
                </div>
                
                <a
                  href={urlContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:text-brand-orange-light break-all"
                >
                  {urlContent.url}
                </a>
              </div>

              {/* Extracted Content */}
              {urlContent.extractedContent && (
                <div className="p-4 bg-base-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-base-content/80">Extracted Content:</span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-base-content whitespace-pre-wrap">
                      {truncateText(urlContent.extractedContent)}
                    </p>
                  </div>
                  
                  {urlContent.extractedContent.length > 200 && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-brand-orange hover:text-brand-orange-light text-sm font-medium mt-2"
                    >
                      Lihat selengkapnya →
                    </button>
                  )}
                </div>
              )}

              {/* Content Stats */}
              <div className="flex items-center justify-between text-sm text-base-content/60">
                <span>
                  {urlContent.extractedContent ? 
                    `${urlContent.extractedContent.length} karakter extracted` : 
                    'No content extracted'
                  }
                </span>
                {urlContent.lastUpdated && (
                  <span>
                    Last updated: {formatDistanceToNow(urlContent.lastUpdated, { 
                      addSuffix: true, 
                      locale: id 
                    })}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="h-16 w-16 text-base-content/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              <p className="text-base-content/60 mb-2">Belum ada URL yang ditambahkan</p>
              <p className="text-sm text-base-content/50">
                Tambahkan URL website atau halaman FAQ untuk ekstraksi konten
              </p>
            </div>
          )}
        </div>
      </div>

      {/* URL Content Modal */}
      <URLContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
