'use client';

import { useState, useRef, useEffect } from 'react';
import AuthButton from '../ui/AuthButton';
import ThumbsUpStarIcon from '../icons/ThumbsUpStarIcon';

interface EmailVerificationPageProps {
  email: string;
  onResendEmail: () => void;
  onBackToLogin: () => void;
  isResending?: boolean;
}

export default function EmailVerificationPage({ 
  email, 
  onResendEmail, 
  onBackToLogin,
  isResending = false 
}: EmailVerificationPageProps) {
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
        resendTimerRef.current = null;
      }
    };
  }, []);

  const handleResendEmail = () => {
    if (resendCooldown > 0) return;

    // Clear any existing timer before starting a new one
    if (resendTimerRef.current) {
      clearInterval(resendTimerRef.current);
      resendTimerRef.current = null;
    }

    onResendEmail();
    setResendCooldown(60);

    resendTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) {
            clearInterval(resendTimerRef.current);
            resendTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-28 h-28 bg-brand-orange rounded-full flex items-center justify-center">
          <ThumbsUpStarIcon width={56} height={56} color="white" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[40px] font-bold text-base-content">Cek inbox Anda</h2>
        <p className="text-[24px] font-normal text-base-content">
          Kami telah mengirimkan email verifikasi ke{' '}
          <span className="text-brand-orange font-medium">{email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-[20px] font-semibold text-base-content">
          Tidak mendapatkan email?
        </p>
        
        <button
          onClick={handleResendEmail}
          disabled={resendCooldown > 0 || isResending}
          className="text-[20px] font-semibold text-brand-orange underline hover:text-brand-orange-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              Mengirim ulang...
            </span>
          ) : resendCooldown > 0 ? (
            `Kirim ulang email (${resendCooldown}s)`
          ) : (
            'Kirim ulang email'
          )}
        </button>
      </div>

      <div className="pt-8">
        <AuthButton 
          variant="secondary"
          onClick={onBackToLogin}
        >
          Kembali ke Login
        </AuthButton>
      </div>
    </div>
  );
}