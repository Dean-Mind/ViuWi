'use client';

import { DotLottieReact, DotLottie } from '@lottiefiles/dotlottie-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';



interface LottieMascotProps {
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function LottieMascot({
  className = '',
  autoplay = true,
  loop = true,
  onLoad,
  onError
}: LottieMascotProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [dotLottieEl, setDotLottieEl] = useState<DotLottie | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Store the dotLottie element reference
  const dotLottieRef = useRef<DotLottie | null>(null);

  // Ref callback to store the element
  const handleDotLottieRef = useCallback((dotLottie: DotLottie | null) => {
    dotLottieRef.current = dotLottie;
    setDotLottieEl(dotLottie);
  }, []);

  // Handle event listeners in useEffect with proper cleanup
  useEffect(() => {
    if (!dotLottieEl) return;

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleLoadError = () => {
      setHasError(true);
      onError?.(new Error('Failed to load Lottie animation'));
    };

    // Add event listeners
    dotLottieEl.addEventListener('load', handleLoad);
    dotLottieEl.addEventListener('loadError', handleLoadError);

    // Cleanup function
    return () => {
      dotLottieEl.removeEventListener('load', handleLoad);
      dotLottieEl.removeEventListener('loadError', handleLoadError);
    };
  }, [dotLottieEl, onLoad, onError]);

  // Fallback to static image on error or if user prefers reduced motion
  if (hasError || prefersReducedMotion) {
    return (
      <div className={`relative w-full h-full max-w-lg ${className}`}>
        <Image
          src="/images/robot-mascot.png"
          alt="ViuWi Robot Mascot"
          fill
          sizes="(max-width: 1024px) 0px, 35vw"
          className="object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full max-w-lg ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 rounded-lg">
          <div className="loading loading-spinner loading-lg text-brand-orange"></div>
        </div>
      )}
      
      {/* Lottie Animation */}
      <DotLottieReact
        src="/images/live-chatbot.lottie"
        loop={loop}
        autoplay={autoplay}
        dotLottieRefCallback={handleDotLottieRef}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
