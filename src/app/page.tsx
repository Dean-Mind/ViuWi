'use client';

import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <section id="demo">
        <HowItWorksSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}