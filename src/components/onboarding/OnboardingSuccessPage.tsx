'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AuthButton from '../ui/AuthButton';
import ThumbsUpStarIcon from '../icons/ThumbsUpStarIcon';

interface OnboardingSuccessPageProps {
  onContinue?: () => void;
  autoRedirect?: boolean;
}

export default function OnboardingSuccessPage({
  onContinue,
  autoRedirect = true
}: OnboardingSuccessPageProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Auto-redirect countdown logic
  useEffect(() => {
    if (!autoRedirect) return;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Clear timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoRedirect]);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && autoRedirect && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/dashboard');
    }
  }, [countdown, autoRedirect, isRedirecting, router]);

  // Manual continue handler
  const handleContinue = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRedirecting(true);

    if (onContinue) {
      onContinue();
    } else {
      router.push('/dashboard');
    }
  };
  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-28 h-28 bg-brand-orange rounded-full flex items-center justify-center">
          <ThumbsUpStarIcon width={56} height={56} color="white" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-base-content">Selamat!</h2>
        <p className="text-base md:text-lg font-normal text-base-content">
          Setup ViuWi Anda telah selesai.{' '}
          <span className="text-brand-orange font-medium">Chatbot Anda siap digunakan!</span>
        </p>
      </div>

      <div className="space-y-4">
        {autoRedirect && countdown > 0 && !isRedirecting ? (
          <p
            className="text-sm md:text-base font-semibold text-base-content"
            aria-live="polite"
          >
            Anda akan diarahkan ke dashboard dalam{' '}
            <span className="text-brand-orange font-bold">{countdown}</span> detik...
          </p>
        ) : isRedirecting ? (
          <p
            className="text-sm md:text-base font-semibold text-base-content"
            aria-live="polite"
          >
            Mengarahkan ke dashboard...
          </p>
        ) : (
          <p
            className="text-sm md:text-base font-semibold text-base-content"
            aria-live="polite"
          >
            Siap untuk melanjutkan ke dashboard
          </p>
        )}

        <div className="pt-4">
          <AuthButton
            onClick={handleContinue}
            loading={isRedirecting}
            disabled={isRedirecting}
          >
            {isRedirecting ? 'Mengarahkan...' : 'Lanjut ke Dashboard'}
          </AuthButton>
        </div>
      </div>
    </div>
  );
}
