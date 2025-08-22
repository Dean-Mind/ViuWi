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
  const [resendCount, setResendCount] = useState(0);
  const [_showSpamTip, _setShowSpamTip] = useState(false);
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
    setResendCount(prev => prev + 1);

    // Progressive cooldown: 60s, 120s, 300s (5min), then 600s (10min)
    const cooldownTimes = [60, 120, 300, 600];
    const cooldownTime = cooldownTimes[Math.min(resendCount, cooldownTimes.length - 1)];
    setResendCooldown(cooldownTime);

    // Show spam tip after first resend
    if (resendCount === 0) {
      _setShowSpamTip(true);
    }

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

  // Format cooldown time for display
  const formatCooldownTime = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-28 h-28 bg-brand-orange rounded-full flex items-center justify-center">
          <ThumbsUpStarIcon width={56} height={56} color="white" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-base-content">Cek inbox Anda</h2>
        <p className="text-base md:text-lg font-normal text-base-content">
          Kami telah mengirimkan email verifikasi ke{' '}
          <span className="text-brand-orange font-medium">{email}</span>
        </p>

        <p className="text-base md:text-lg font-normal text-base-content/80 mt-4">
          Email verifikasi mungkin masuk ke folder spam atau junk mail. Pastikan untuk memeriksa kedua folder tersebut.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm md:text-base font-semibold text-base-content">
          Tidak mendapatkan email?
        </p>

        {/* Enhanced resend section with progressive messaging */}
        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0 || isResending}
            className="text-sm md:text-base font-semibold text-brand-orange underline hover:text-brand-orange-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Mengirim ulang...
              </span>
            ) : resendCooldown > 0 ? (
              `Kirim ulang email (${formatCooldownTime(resendCooldown)})`
            ) : (
              'Kirim ulang email'
            )}
          </button>

          {/* Simple progressive messaging */}
          {resendCount > 0 && (
            <div className="text-sm text-base-content/70 mt-3 space-y-2">
              {resendCount === 1 && (
                <p>Email kedua telah dikirim. Mohon tunggu beberapa menit.</p>
              )}
              {resendCount === 2 && (
                <p>Jika masih belum menerima, coba cek koneksi internet dan folder spam.</p>
              )}
              {resendCount >= 3 && (
                <p>Sudah mengirim {resendCount + 1} email. Jika masih bermasalah, silakan hubungi support atau coba daftar dengan email lain.</p>
              )}
            </div>
          )}
        </div>
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