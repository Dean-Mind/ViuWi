'use client';

import React, { useState } from 'react';
import { useAIGuidelines, useUnlockAIGuidelines, useLockAIGuidelines } from '@/stores/knowledgeBaseStore';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { truncateText } from '@/utils/textFormatting';
import UnlockGuidelinesModal from './UnlockGuidelinesModal';
import GuidelinesEditorModal from './GuidelinesEditorModal';

export default function AIGuidelinesSection() {
  const aiGuidelines = useAIGuidelines();
  const unlockAIGuidelines = useUnlockAIGuidelines();
  const lockAIGuidelines = useLockAIGuidelines();
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleUnlock = () => {
    unlockAIGuidelines();
    setShowUnlockModal(false);
  };

  const handleLock = () => {
    lockAIGuidelines();
  };

  const getStatusBadge = () => {
    if (!aiGuidelines.content) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-base-300 text-base-content/60">
          Not generated
        </span>
      );
    }
    
    if (aiGuidelines.isGenerated && !aiGuidelines.isUnlocked) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
          🤖 Auto-generated
        </span>
      );
    }
    
    if (aiGuidelines.isUnlocked) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-orange/10 text-brand-orange">
          🔓 Unlocked for editing
        </span>
      );
    }
    
    return null;
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Guidelines
              </h3>
              <p className="text-sm text-base-content/70">
                Panduan AI yang dihasilkan dari basis pengetahuan Anda
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {aiGuidelines.content && !aiGuidelines.isUnlocked && (
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="btn btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl px-4"
                >
                  🔒 Unlock for Editing
                </button>
              )}
              {aiGuidelines.content && aiGuidelines.isUnlocked && (
                <>
                  <button
                    onClick={() => setShowEditorModal(true)}
                    className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl px-4"
                  >
                    Edit Guidelines
                  </button>
                  <button
                    onClick={handleLock}
                    className="btn btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl px-4"
                  >
                    🔒 Lock Guidelines
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Guidelines Display */}
          {aiGuidelines.content ? (
            <div className="space-y-4">
              <div className="p-4 bg-base-200 rounded-2xl">
                <div className="prose prose-sm max-w-none">
                  <p className="text-base-content whitespace-pre-wrap">
                    {showFullContent ? aiGuidelines.content : truncateText(aiGuidelines.content, 300)}
                  </p>
                </div>

                {aiGuidelines.content.length > 300 && (
                  <button
                    onClick={() => setShowFullContent(!showFullContent)}
                    className="text-brand-orange hover:text-brand-orange-light text-sm font-medium mt-2"
                  >
                    {showFullContent ? '← Show less' : 'View full guidelines →'}
                  </button>
                )}
              </div>

              {/* Guidelines Info */}
              <div className="flex items-center justify-between text-sm text-base-content/60">
                <div className="flex items-center gap-4">
                  <span>{aiGuidelines.content.length} karakter</span>
                  {aiGuidelines.isGenerated && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Generated
                    </span>
                  )}
                </div>
                {aiGuidelines.lastUpdated && (
                  <span>
                    Last updated: {formatDistanceToNow(aiGuidelines.lastUpdated, { 
                      addSuffix: true, 
                      locale: id 
                    })}
                  </span>
                )}
              </div>

              {/* Unlock Notice */}
              {!aiGuidelines.isUnlocked && (
                <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-warning">Guidelines Locked</p>
                      <p className="text-xs text-warning/80 mt-1">
                        These AI guidelines were automatically generated. Click &quot;Unlock for Editing&quot; to customize them according to your specific needs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="h-16 w-16 text-base-content/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-base-content/60 mb-2">AI Guidelines belum dibuat</p>
              <p className="text-sm text-base-content/50">
                Tambahkan dokumen, teks, atau URL terlebih dahulu, lalu klik &quot;Generate AI Guidelines&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Unlock Modal */}
      <UnlockGuidelinesModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onConfirm={handleUnlock}
      />

      {/* Editor Modal */}
      <GuidelinesEditorModal
        isOpen={showEditorModal}
        onClose={() => setShowEditorModal(false)}
      />
    </>
  );
}
