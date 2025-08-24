'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LandingHeader() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Fitur', href: '#features' },
    { name: 'Cara Kerja', href: '#demo' },
  ];

  return (
    <header className="w-full bg-base-100/95 backdrop-blur-sm border-b border-base-content/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <Image
                  src="/ViuWi.png"
                  alt="ViuWi Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority={true}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-brand-heading text-brand-orange font-bold">ViuWi</h1>
                <p className="text-xs text-base-content/60 -mt-1">AI Customer Service</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.substring(1))}
                className="text-base-content/70 hover:text-brand-orange transition-colors duration-300 font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleSignIn}
              className="btn btn-ghost btn-sm text-base-content/70 hover:text-brand-orange hover:bg-brand-orange/10 rounded-2xl"
            >
              Masuk
            </button>
            <button
              onClick={handleGetStarted}
              className="btn btn-primary btn-sm bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white rounded-2xl"
            >
              Mulai Gratis
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-ghost btn-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-base-content/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className="block w-full text-left px-3 py-2 text-base-content/70 hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors duration-300"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-base-content/10 pt-3 mt-3 space-y-2">
                <button
                  onClick={handleSignIn}
                  className="block w-full text-left px-3 py-2 text-base-content/70 hover:text-brand-orange hover:bg-brand-orange/10 rounded-2xl transition-colors duration-300"
                >
                  Masuk
                </button>
                <button
                  onClick={handleGetStarted}
                  className="block w-full px-3 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-2xl transition-colors duration-300 font-semibold"
                >
                  Mulai Gratis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}