'use client';

import AuthButton from '../ui/AuthButton';
import ThumbsUpStarIcon from '../icons/ThumbsUpStarIcon';

interface OnboardingSuccessPageProps {
  onContinue?: () => void;
}

export default function OnboardingSuccessPage({ onContinue }: OnboardingSuccessPageProps) {
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
        <p className="text-sm md:text-base font-semibold text-base-content">
          Anda akan diarahkan ke dashboard dalam beberapa detik...
        </p>
        
        {onContinue && (
          <div className="pt-4">
            <AuthButton onClick={onContinue}>
              Lanjut ke Dashboard
            </AuthButton>
          </div>
        )}
      </div>
    </div>
  );
}
