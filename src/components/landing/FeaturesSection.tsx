'use client';

import React from 'react';

const features = [
  {
    icon: '🤖',
    title: 'Chatbot AI Cerdas',
    description: 'AI yang memahami konteks dan memberikan respons yang natural dalam berbagai bahasa Indonesia',
    details: ['Percakapan alami', 'Multi-bahasa', 'Pembelajaran otomatis']
  },
  {
    icon: '📚',
    title: 'Basis Pengetahuan',
    description: 'Kelola dokumen, konten teks, dan URL website untuk pelatihan AI yang optimal',
    details: ['Upload dokumen PDF/DOC', 'Ekstrak konten website', 'Generate AI guidelines']
  },
  {
    icon: '📱',
    title: 'Integrasi WhatsApp',
    description: 'Terhubung langsung dengan WhatsApp Business untuk komunikasi yang seamless',
    details: ['QR Code setup', 'Auto-sync pesan', 'Multi-device support']
  },
  {
    icon: '👥',
    title: 'Manajemen Pelanggan',
    description: 'CRM lengkap untuk kelola data pelanggan, riwayat interaksi, dan preferensi',
    details: ['Profil pelanggan', 'Riwayat pesanan', 'Segmentasi otomatis']
  },
  {
    icon: '📦',
    title: 'Katalog Produk',
    description: 'Kelola inventori dengan mudah melalui import CSV/Excel dan tracking stok real-time',
    details: ['Import massal', 'Tracking stok', 'Kategori produk']
  },
  {
    icon: '🛒',
    title: 'Sistem Pesanan',
    description: 'Proses pesanan multi-produk dengan status tracking dan notifikasi otomatis',
    details: ['Multi-produk order', 'Status tracking', 'Auto-notifikasi']
  },
  {
    icon: '💳',
    title: 'Pembayaran',
    description: 'Integrasi gateway pembayaran untuk transaksi yang aman dan terpercaya',
    details: ['Multi-gateway', 'Secure payment', 'Auto-receipt']
  },
  {
    icon: '📊',
    title: 'Analitik & Laporan',
    description: 'Dashboard analitik real-time untuk pantau performa bisnis dan customer satisfaction',
    details: ['Real-time metrics', 'Performance report', 'Customer insights']
  },
  {
    icon: '🎯',
    title: 'Handover CS',
    description: 'Transfer percakapan ke customer service manusia saat diperlukan',
    details: ['Smart routing', 'Live chat', 'Performance tracking']
  },
  {
    icon: '📅',
    title: 'Booking & Jadwal',
    description: 'Sistem appointment booking untuk layanan yang memerlukan penjadwalan',
    details: ['Auto-scheduling', 'Calendar sync', 'Reminder system']
  },
  {
    icon: '📝',
    title: 'Formulir Dinamis',
    description: 'Buat formulir custom untuk capture informasi pelanggan yang spesifik',
    details: ['Drag-drop builder', 'Validation rules', 'Auto-save']
  },
  {
    icon: '🔧',
    title: 'Feature Toggle',
    description: 'Aktifkan/nonaktifkan fitur sesuai kebutuhan bisnis Anda',
    details: ['Flexible configuration', 'A/B testing', 'Gradual rollout']
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-base-200/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content">
              Fitur Lengkap untuk{' '}
              <span className="text-brand-orange bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent">
                Bisnis Modern
              </span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              ViuWi menyediakan semua tools yang Anda butuhkan untuk mengelola bisnis,
              mulai dari customer service otomatis hingga analitik bisnis yang mendalam
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-base-100 p-8 rounded-3xl border border-base-300/50 hover:border-brand-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/10 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-base-content group-hover:text-brand-orange transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-base-content/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-sm text-base-content/60">
                        <div className="w-1.5 h-1.5 bg-brand-orange rounded-full"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-brand-orange/10 to-brand-orange-light/10 rounded-3xl p-8 border border-brand-orange/20">
              <h3 className="text-2xl font-bold text-base-content mb-4">
                Siap Tingkatkan Bisnis Anda?
              </h3>
              <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan bisnis yang telah menggunakan ViuWi untuk
                transformasi digital mereka
              </p>
              <button className="btn bg-gradient-to-r from-brand-orange to-brand-orange-light hover:from-brand-orange-light hover:to-brand-orange text-white border-none rounded-2xl px-8 py-3 font-semibold">
                Mulai Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}