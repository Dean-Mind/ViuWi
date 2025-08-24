'use client';

import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface MockDataNoticeProps {
  feature: string;
  dismissible?: boolean;
  className?: string;
}

/**
 * MockDataNotice component to inform users about mock data usage
 * Features:
 * - Dismissible with localStorage persistence
 * - DaisyUI alert styling with info variant
 * - Rounded-2xl corners following Apple-style design
 * - Responsive design
 */
export default function MockDataNotice({
  feature,
  dismissible = true,
  className = ''
}: MockDataNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = `mock-data-notice-${feature}`;

  // Check if notice was previously dismissed
  useEffect(() => {
    if (dismissible) {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    }
  }, [dismissible, storageKey]);

  const handleDismiss = () => {
    if (dismissible) {
      setIsVisible(false);
      localStorage.setItem(storageKey, 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`alert alert-info bg-info/10 border-info/20 rounded-2xl mb-6 relative ${className}`}>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content hover:bg-base-200 z-10"
          title="Tutup notifikasi"
          aria-label="Tutup notifikasi"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <div className="flex items-start gap-3 pr-12">
        <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-base-content mb-1">
            Data Demo
          </div>
          <p className="text-sm text-base-content/70">
            Saat ini menampilkan data contoh untuk demonstrasi.
            Integrasi dengan data real akan tersedia pada 27 September 2025.
          </p>
        </div>
      </div>
    </div>
  );
}