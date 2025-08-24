'use client';

import React from 'react';
import { X, RefreshCw, Info } from 'lucide-react';

interface SystemPromptRegenerationBannerProps {
  onRegenerate: () => void;
  onDismiss: () => void;
  reason?: string;
  className?: string;
  isLoading?: boolean;
}

export default function SystemPromptRegenerationBanner({
  onRegenerate,
  onDismiss,
  reason = "Content has been updated",
  className = '',
  isLoading = false
}: SystemPromptRegenerationBannerProps) {
  return (
    <div className={`alert alert-info rounded-2xl ${className}`}>
      <Info className="h-4 w-4" />
      <div className="flex-1">
        <h3 className="font-medium">System Prompt Update Recommended</h3>
        <div className="text-sm opacity-75">
          {reason}. Consider regenerating your AI guidelines to include the latest information.
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRegenerate}
          className="btn btn-sm btn-primary rounded-2xl gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" />
              Regenerate Now
            </>
          )}
        </button>
        <button
          onClick={onDismiss}
          className="btn btn-sm btn-ghost rounded-2xl"
          title="Dismiss this notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
