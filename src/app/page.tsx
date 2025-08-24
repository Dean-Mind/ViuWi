'use client';

import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
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

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}