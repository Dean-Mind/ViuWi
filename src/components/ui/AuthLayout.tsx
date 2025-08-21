'use client';

import LottieMascot from './LottieMascot';
import ThemeToggle from './ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section */}
      <header className="w-full bg-base-100/95 backdrop-blur-sm border-b border-base-content/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-brand-heading text-brand-orange">ViuWi</h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Form Content - 65% */}
          <div className="w-full lg:w-[65%] flex flex-col justify-center px-6 py-6 sm:py-8 lg:py-12 lg:px-8 relative">
            <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-4xl xl:max-w-5xl">
              {children}
            </div>
          </div>

          {/* Right side - Robot illustration */}
          <div className="hidden lg:flex lg:w-[35%] items-center justify-center bg-gradient-to-br from-base-100 to-base-200 sticky top-16 h-[calc(100vh-4rem)]">
            <LottieMascot
              autoplay={true}
              loop={true}
              onLoad={() => console.log('Mascot animation loaded')}
              onError={(error) => console.error('Mascot animation error:', error)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}