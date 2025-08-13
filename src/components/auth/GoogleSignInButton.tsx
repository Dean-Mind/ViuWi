"use client";

import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/GoogleIcon";

interface GoogleSignInButtonProps {
  text: string;
  onClick?: () => void;
}

export function GoogleSignInButton({ text, onClick }: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full max-w-sm sm:w-80 h-12 sm:h-14 border-viuwi-border rounded-md flex items-center justify-center gap-3 sm:gap-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50"
      onClick={onClick}
    >
      <GoogleIcon width={24} height={24} className="sm:w-[26px] sm:h-[26px]" />
      <span className="viuwi-button-text text-viuwi-text-secondary">{text}</span>
    </Button>
  );
}