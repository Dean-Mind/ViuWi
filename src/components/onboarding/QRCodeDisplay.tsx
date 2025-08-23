'use client';

import Image from 'next/image';
import { RefreshCw } from 'lucide-react';
import AuthButton from '../ui/AuthButton';

interface QRCodeDisplayProps {
  qrCodeUrl?: string;
  qrCodeData?: string; // Base64 data
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export default function QRCodeDisplay({
  qrCodeUrl,
  qrCodeData,
  isLoading,
  error,
  onRetry
}: QRCodeDisplayProps) {
  // Determine what to display
  const hasQRCode = qrCodeUrl || qrCodeData;
  const displayDataUrl = qrCodeData ? `data:image/png;base64,${qrCodeData}` : qrCodeUrl;

  return (
    <div className="card border border-base-300 rounded-2xl p-8">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-80 h-80 bg-base-200 rounded-2xl flex items-center justify-center">
          {isLoading ? (
            // Loading state
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-brand-orange mb-4"></div>
              <p className="text-brand-label text-base-content">Generating QR Code...</p>
            </div>
          ) : error ? (
            // Error state
            <div className="text-center space-y-4">
              <div className="text-6xl text-error/30 mb-4">⚠️</div>
              <p className="text-brand-label text-error">Failed to generate QR code</p>
              <p className="text-sm text-base-content/60 max-w-xs">{error}</p>
              {onRetry && (
                <AuthButton
                  variant="secondary"
                  onClick={onRetry}
                  className="btn-sm"
                >
                  <RefreshCw size={16} />
                  Retry
                </AuthButton>
              )}
            </div>
          ) : hasQRCode && displayDataUrl ? (
            // QR Code display
            qrCodeData ? (
              // Base64 data - use regular img tag
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayDataUrl}
                alt="QR Code for WhatsApp connection"
                className="w-full h-full object-contain rounded-2xl"
              />
            ) : (
              // URL - use Next.js Image component
              <Image
                src={displayDataUrl}
                alt="QR Code for WhatsApp connection"
                width={320}
                height={320}
                className="w-full h-full object-contain rounded-2xl"
              />
            )
          ) : (
            // Placeholder state
            <div className="text-center">
              <div className="text-6xl text-base-content/30 mb-4">⬜</div>
              <p className="text-brand-label text-base-content">QR CODE</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}