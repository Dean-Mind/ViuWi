'use client';

import React, { useState } from 'react';
import { useTextContent } from '@/stores/knowledgeBaseStore';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import TextContentModal from './TextContentModal';

export default function TextContentSection() {
  const textContent = useTextContent();
  const [showModal, setShowModal] = useState(false);

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
              {textContent.content ? 'Edit' : 'Tambah'}
            </button>
          </div>

          {/* Text Content Display */}
          {textContent.content ? (
            <div className="space-y-4">
              <div className="p-4 bg-base-200 rounded-2xl">
                <div className="prose prose-sm max-w-none">
                  <p className="text-base-content whitespace-pre-wrap">
                    {truncateText(textContent.content)}
                  </p>
                </div>
                
                {textContent.content.length > 200 && (
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
                <span>{textContent.content.length} karakter</span>
                {textContent.lastUpdated && (
                  <span>
                    Last updated: {formatDistanceToNow(textContent.lastUpdated, { 
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
