'use client';

import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Left side - Form content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 max-w-2xl relative">
        {/* Theme toggle button */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-brand-heading text-brand-orange mb-8">ViuWi</h1>
          {children}
        </div>
      </div>
      
      {/* Right side - Robot illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-base-100 to-base-200">
        <div className="relative w-full h-full max-w-lg">
          <Image
            src="/images/robot-mascot.png"
            alt="ViuWi Robot Mascot"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}