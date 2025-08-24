'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-12">

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-base-content leading-tight">
              Platform{' '}
              <span className="text-brand-orange bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent">
                ViuWi
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-base-content/80 max-w-4xl mx-auto leading-relaxed font-light">
              Solusi lengkap manajemen bisnis dengan AI cerdas untuk layanan pelanggan otomatis
            </p>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border border-base-300/50 hover:border-brand-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-xl font-bold text-base-content mb-3">AI Otomatis</h3>
              <p className="text-base-content/70 leading-relaxed">
                Teknologi AI canggih untuk percakapan alami dan respons cepat
              </p>
            </div>

            <div className="group bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border border-base-300/50 hover:border-brand-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-xl font-bold text-base-content mb-3">Setup Mudah</h3>
              <p className="text-base-content/70 leading-relaxed">
                Mulai dalam hitungan menit dengan panduan onboarding interaktif
              </p>
            </div>

            <div className="group bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border border-base-300/50 hover:border-brand-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/10">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-xl font-bold text-base-content mb-3">Wawasan Bisnis</h3>
              <p className="text-base-content/70 leading-relaxed">
                Analitik real-time untuk tingkatkan kepuasan pelanggan
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <button
              onClick={handleGetStarted}
              className="group btn bg-gradient-to-r from-brand-orange to-brand-orange-light hover:from-brand-orange-light hover:to-brand-orange text-white border-none rounded-2xl px-12 py-4 text-lg font-semibold min-w-64 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Mulai Gratis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={handleSignIn}
              className="btn btn-outline border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white rounded-2xl px-12 py-4 text-lg font-semibold min-w-64 hover:scale-105 transition-all duration-300"
            >
              Masuk
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 space-y-4">
            <p className="text-base-content/60 text-sm font-medium">
              Dipercaya oleh ribuan bisnis di Indonesia
            </p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-2xl">🏪</div>
              <div className="text-2xl">🏥</div>
              <div className="text-2xl">🏫</div>
              <div className="text-2xl">🏢</div>
              <div className="text-2xl">🛒</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}