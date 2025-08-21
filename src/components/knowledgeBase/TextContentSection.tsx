'use client';

import React, { useState } from 'react';
import { useTextContent } from '@/stores/knowledgeBaseStore';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import TextContentModal from './TextContentModal';

// Centralized preview length constant
const PREVIEW_MAX_LENGTH = 200;

export default function TextContentSection() {
  const textContent = useTextContent();
  const [showModal, setShowModal] = useState(false);

  // Null-safe truncateText function
  const truncateText = (text: string | undefined, maxLength: number = PREVIEW_MAX_LENGTH): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Defensive date formatting with fallback
  const formatLastUpdated = (date: Date | null | undefined): string | null => {
    if (!date) return null;

    try {
      // Handle both Date objects and date strings
      const dateObj = date instanceof Date ? date : new Date(date);

      // Check if date is valid
      if (isNaN(dateObj.getTime())) return null;

      return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: id
      });
    } catch {
      return null;
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Konten Teks
              </h3>
              <p className="text-sm text-base-content/70">
                Input teks manual untuk informasi bisnis, FAQ, atau prosedur
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl px-4"
            >
              {textContent?.content ? 'Edit' : 'Tambah'}
            </button>
          </div>

          {/* Text Content Display */}
          {textContent?.content ? (
            <div className="space-y-4">
              <div className="p-4 bg-base-200 rounded-2xl">
                <div className="prose prose-sm max-w-none">
                  <p className="text-base-content whitespace-pre-wrap">
                    {truncateText(textContent.content)}
                  </p>
                </div>

                {(textContent.content?.length || 0) > PREVIEW_MAX_LENGTH && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-brand-orange hover:text-brand-orange-light text-sm font-medium mt-2"
                  >
                    Lihat selengkapnya →
                  </button>
                )}
              </div>

              {/* Content Stats */}
              <div className="flex items-center justify-between text-sm text-base-content/60">
                <span>{textContent.content?.length || 0} karakter</span>
                {(() => {
                  const formattedDate = formatLastUpdated(textContent?.lastUpdated);
                  return formattedDate ? (
                    <span>Last updated: {formattedDate}</span>
                  ) : null;
                })()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="h-16 w-16 text-base-content/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <p className="text-base-content/60 mb-2">Belum ada konten teks</p>
              <p className="text-sm text-base-content/50">
                Tambahkan informasi bisnis, FAQ, atau prosedur dalam bentuk teks
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Text Content Modal */}
      <TextContentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
