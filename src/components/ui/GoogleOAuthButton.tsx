'use client';

import GoogleLogoIcon from '../icons/GoogleLogoIcon';

interface GoogleOAuthButtonProps {
  text: string;
  onClick: () => void;
  loading?: boolean;
}

export default function GoogleOAuthButton({ text, onClick, loading = false }: GoogleOAuthButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="btn w-full h-[55px] bg-transparent hover:bg-base-200 border border-base-300 border-[0.6px] rounded-2xl flex items-center justify-center gap-4"
    >
      <GoogleLogoIcon width={26} height={26} color="" />
      <span className="text-brand-body text-base-content/50">
        {text}
      </span>
    </button>
  );
}