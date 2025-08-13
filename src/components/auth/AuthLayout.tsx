"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Delay image rendering slightly to ensure DOM is fully hydrated
    const timer = setTimeout(() => {
      setImageReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Safe fallback during SSR and initial client render to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    );
  }

  // Full responsive layout after hydration - CSS-only responsive design
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Form Section - Full width on mobile, left side on desktop */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
          {children}
        </div>
      </div>

      {/* Image Section - Hidden on mobile, shown on desktop */}
      <div
        className="hidden md:flex md:w-2/5 lg:w-2/5 xl:w-1/3 bg-gray-50 min-h-screen relative overflow-hidden"
        suppressHydrationWarning={true}
      >
        <div className="absolute inset-0 flex items-end justify-end">
          {imageReady ? (
            <Image
              src="/images/viuwi-auth.png"
              alt="ViuWi friendly robot character illustration"
              width={586}
              height={811}
              className="w-full h-full object-cover object-bottom-right"
              priority
              suppressHydrationWarning={true}
            />
          ) : (
            // Placeholder to maintain layout during image loading
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>
      </div>
    </div>
  );
}