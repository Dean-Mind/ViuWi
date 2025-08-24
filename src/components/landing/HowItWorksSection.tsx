'use client';

import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Daftar & Setup',
    description: 'Buat akun ViuWi dan ikuti panduan setup yang mudah untuk konfigurasi awal',
    details: ['Registrasi cepat', 'Verifikasi email', 'Setup profil bisnis'],
    icon: '🚀'
  },
  {
    number: '02',
    title: 'Konfigurasi AI',
    description: 'Upload basis pengetahuan dan biarkan AI belajar dari konten bisnis Anda',
    details: ['Upload dokumen', 'Training AI', 'Generate guidelines'],
    icon: '⚙️'
  },
  {
    number: '03',
    title: 'Integrasi Channel',
    description: 'Hubungkan WhatsApp Business dan channel komunikasi lainnya',
    details: ['Scan QR code', 'Test koneksi', 'Setup webhook'],
    icon: '🔗'
  },
  {
    number: '04',
    title: 'Otomatisasi Berjalan',
    description: 'AI mulai menangani percakapan pelanggan secara otomatis 24/7',
    details: ['Monitoring real-time', 'Handover otomatis', 'Analytics aktif'],
    icon: '🎯'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content">
              Bagaimana{' '}
              <span className="text-brand-orange bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent">
                ViuWi
              </span>{' '}
              Bekerja
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Proses yang sederhana namun powerful untuk transformasi customer service Anda
            </p>
          </div>

          {/* Steps Grid */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-brand-orange/30 to-transparent z-0"></div>
                )}

                <div className="relative bg-base-200/50 p-8 rounded-3xl border border-base-300/50 hover:border-brand-orange/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/10 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-base-content group-hover:text-brand-orange transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-base-content/70 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-sm text-base-content/60">
                          <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Visualization for Mobile */}
          <div className="lg:hidden space-y-4 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>
                <div className="flex-1 bg-base-200/50 p-6 rounded-3xl border border-base-300/50">
                  <div className="text-2xl mb-3">{step.icon}</div>
                  <h3 className="text-lg font-bold text-base-content mb-2">{step.title}</h3>
                  <p className="text-base-content/70 text-sm mb-3">{step.description}</p>
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-xs text-base-content/60">
                        <div className="w-1 h-1 bg-brand-orange rounded-full"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-base-200/50 to-base-300/30 rounded-3xl p-8 border border-base-300/50">
              <h3 className="text-2xl font-bold text-base-content mb-4">
                Siap Mulai Perjalanan Digital?
              </h3>
              <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
                Bergabunglah dengan ViuWi dan rasakan kemudahan mengelola customer service
                dengan teknologi AI terdepan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/auth/register'}
                  className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl px-8 py-3 font-semibold"
                >
                  Mulai Gratis Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}