'use client';

import React from 'react';

interface ProcessingStatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  onProcess?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ProcessingStatusBadge({ 
  status, 
  onProcess, 
  onRetry, 
  className = '' 
}: ProcessingStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          badge: 'badge-neutral',
          text: 'Pending',
          showProcessButton: true,
          showRetryButton: false
        };
      case 'processing':
        return {
          badge: 'badge-warning',
          text: 'Processing',
          showProcessButton: false,
          showRetryButton: false
        };
      case 'completed':
        return {
          badge: 'badge-success',
          text: 'Completed',
          showProcessButton: false,
          showRetryButton: false
        };
      case 'failed':
        return {
          badge: 'badge-error',
          text: 'Failed',
          showProcessButton: false,
          showRetryButton: true
        };
      default:
        return {
          badge: 'badge-neutral',
          text: 'Unknown',
          showProcessButton: false,
          showRetryButton: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Badge */}
      <div className={`badge ${config.badge} badge-sm gap-1`}>
        {status === 'processing' && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        {config.text}
      </div>

      {/* Process Button */}
      {config.showProcessButton && onProcess && (
        <button
          onClick={onProcess}
          className="btn btn-xs btn-primary rounded-2xl"
          title="Process this item"
        >
          Process
        </button>
      )}

      {/* Retry Button */}
      {config.showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-xs btn-warning rounded-2xl"
          title="Retry processing"
        >
          Retry
        </button>
      )}
    </div>
  );
}
