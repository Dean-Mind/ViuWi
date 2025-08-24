'use client';

import React from 'react';
import { useKnowledgeBaseProcessingStatus } from '@/stores/knowledgeBaseStore';

interface ProcessingStatusIndicatorProps {
  className?: string;
}

export default function ProcessingStatusIndicator({ className = '' }: ProcessingStatusIndicatorProps) {
  const processingStatus = useKnowledgeBaseProcessingStatus();

  if (!processingStatus.isProcessing) {
    return null;
  }

  return (
    <div className={`bg-base-200 rounded-2xl p-4 border border-base-300 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Spinner */}
        <div className="loading loading-spinner loading-sm text-brand-orange"></div>
        
        {/* Status Text */}
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content">
            {processingStatus.currentStep}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-base-300 rounded-full h-2 mt-2">
            <div 
              className="bg-brand-orange h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, processingStatus.progress))}%` }}
            ></div>
          </div>
          
          {/* Progress Percentage */}
          <p className="text-xs text-base-content/70 mt-1">
            {Math.round(processingStatus.progress)}% complete
          </p>
        </div>
      </div>
    </div>
  );
}
