'use client';

import React from 'react';

const testimonials = [
  {
    name: 'Ahmad Santoso',
    role: 'Owner',
    business: 'Toko Elektronik Maju Jaya',
    avatar: '👨‍💼',
    content: 'ViuWi benar-benar mengubah cara kami melayani pelanggan. AI-nya sangat cerdas dan bisa menjawab pertanyaan kompleks tentang produk kami. Response time turun drastis!',
    rating: 5,
    metrics: ['75% pengurangan response time', '40% peningkatan customer satisfaction']
  },
  {
    name: 'Siti Rahayu',
    role: 'Manager',
    business: 'Klinik Sehat Sentosa',
    avatar: '👩‍⚕️',
    content: 'Sistem booking dan reminder dari ViuWi sangat membantu. Pasien jadi lebih tertib dengan jadwal, dan staff kami bisa fokus ke perawatan daripada telepon.',
    rating: 5,
    metrics: ['60% pengurangan no-show', '30% efisiensi operasional']
  },
  {
    name: 'Budi Setiawan',
    role: 'CEO',
    business: 'PT Digital Solutions',
    avatar: '👨‍💻',
    content: 'Integrasi dengan WhatsApp sangat smooth. Customer service 24/7 tanpa perlu hire staff tambahan. ROI-nya terlihat dalam 3 bulan pertama.',
    rating: 5,
    metrics: ['85% cost reduction', '200% increase in engagement']
  },
  {
    name: 'Maya Sari',
    role: 'Founder',
    business: 'Toko Fashion Modern',
    avatar: '👩‍💼',
    content: 'Fitur katalog produk dan order management sangat lengkap. Sekarang bisa handle order online dengan mudah, dan AI membantu dengan rekomendasi produk.',
    rating: 5,
    metrics: ['50% sales increase', '25% operational efficiency']
  },
  {
    name: 'Rudi Hartono',
    role: 'Direktur',
    business: 'Restoran Nusantara',
    avatar: '👨‍🍳',
    content: 'Dashboard analitiknya sangat insightful. Bisa lihat pola customer behavior dan optimize menu berdasarkan data. Customer service juga jadi lebih personal.',
    rating: 5,
    metrics: ['35% menu optimization', '45% customer retention']
  },
  {
    name: 'Linda Wijaya',
    role: 'Marketing Manager',
    business: 'Beauty Clinic Glow',
    avatar: '👩‍💄',
    content: 'WhatsApp integration dengan reminder treatment sangat efektif. Customer jadi lebih loyal dan repeat order meningkat signifikan.',
    rating: 5,
    metrics: ['55% repeat customer rate', '40% treatment booking increase']
  }
];

const stats = [
  { number: '5000+', label: 'Bisnis Terdaftar' },
  { number: '2M+', label: 'Pesan Ditangani AI' },
  { number: '98%', label: 'Customer Satisfaction' },
  { number: '24/7', label: 'Layanan Otomatis' }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-base-200/30 to-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content">
              Cerita Sukses{' '}
              <span className="text-brand-orange bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent">
                Pengguna ViuWi
              </span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Ribuan bisnis di Indonesia telah merasakan manfaat transformasi digital dengan ViuWi
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-base-100/80 backdrop-blur-sm rounded-3xl border border-base-300/50">
                <div className="text-3xl sm:text-4xl font-bold text-brand-orange mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-base-content/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-base-100 p-8 rounded-3xl border border-base-300/50 hover:border-brand-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/10 hover:-translate-y-1"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg" aria-hidden="true">⭐</span>
                  ))}
                </div>

                {/* Content */}
                <p className="text-base-content/80 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {testimonial.metrics.map((metric, metricIndex) => (
                    <span
                      key={metricIndex}
                      className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-medium rounded-full"
                    >
                      {metric}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-base-content">{testimonial.name}</div>
                    <div className="text-sm text-base-content/60">{testimonial.role}</div>
                    <div className="text-sm text-base-content/60">{testimonial.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-brand-orange/10 to-brand-orange-light/10 rounded-3xl p-8 border border-brand-orange/20">
              <h3 className="text-2xl font-bold text-base-content mb-4">
                Bergabunglah dengan Komunitas Sukses
              </h3>
              <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
                Jangan lewatkan kesempatan untuk transformasi bisnis Anda.
                Mulai sekarang dan rasakan perbedaannya!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn bg-gradient-to-r from-brand-orange to-brand-orange-light hover:from-brand-orange-light hover:to-brand-orange text-white border-none rounded-2xl px-8 py-3 font-semibold">
                  Mulai Trial Gratis
                </button>
                <button className="btn btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white rounded-2xl px-8 py-3 font-semibold">
                  Konsultasi Gratis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}