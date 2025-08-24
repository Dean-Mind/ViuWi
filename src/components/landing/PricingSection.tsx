'use client';

import React, { useState } from 'react';

const pricingPlans = [
  {
    name: 'Gratis',
    price: '0',
    period: '/bulan',
    description: 'Perfect untuk bisnis kecil yang baru mulai',
    features: [
      'Chatbot AI basic',
      '100 pesan/bulan',
      'WhatsApp integration',
      'Dashboard basic',
      'Email support',
      '1 user account'
    ],
    limitations: [
      'Limited AI responses',
      'Basic analytics',
      'No custom training'
    ],
    popular: false,
    buttonText: 'Mulai Gratis',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Pro',
    price: '99.000',
    period: '/bulan',
    description: 'Solusi lengkap untuk bisnis yang berkembang',
    features: [
      'AI chatbot canggih',
      'Unlimited pesan',
      'Custom knowledge base',
      'Advanced analytics',
      'CRM integration',
      'Multi-user (5 users)',
      'Priority support',
      'API access'
    ],
    limitations: [],
    popular: true,
    buttonText: 'Pilih Pro',
    buttonVariant: 'primary' as const
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Solusi enterprise untuk kebutuhan khusus',
    features: [
      'Semua fitur Pro',
      'Unlimited users',
      'Custom AI training',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'Advanced security',
      'White-label option'
    ],
    limitations: [],
    popular: false,
    buttonText: 'Hubungi Sales',
    buttonVariant: 'outline' as const
  }
];

const faqs = [
  {
    question: 'Apakah ada trial period?',
    answer: 'Ya, kami menyediakan trial 14 hari untuk paket Pro tanpa perlu kartu kredit.'
  },
  {
    question: 'Bisakah saya upgrade/downgrade kapan saja?',
    answer: 'Tentu! Anda bisa upgrade atau downgrade paket kapan saja. Perubahan akan berlaku di billing cycle berikutnya.'
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, kami menggunakan enkripsi end-to-end dan server yang aman. Data Anda dilindungi dengan standar keamanan tertinggi.'
  },
  {
    question: 'Apakah ada setup fee?',
    answer: 'Tidak ada setup fee untuk semua paket. Anda hanya perlu membayar biaya bulanan sesuai paket yang dipilih.'
  },
  {
    question: 'Bagaimana cara pembayaran?',
    answer: 'Kami menerima pembayaran via transfer bank, kartu kredit, dan e-wallet. Invoice dikirim otomatis setiap bulan.'
  }
];

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content">
              Harga{' '}
              <span className="text-brand-orange bg-gradient-to-r from-brand-orange to-brand-orange-light bg-clip-text text-transparent">
                Terjangkau
              </span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Mulai gratis dan scale up kapan saja
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 bg-base-200/50 p-1 rounded-2xl max-w-xs mx-auto">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-brand-orange text-white shadow-lg'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                Tahunan
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Hemat 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-base-100 p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/10 hover:-translate-y-1 ${
                  plan.popular
                    ? 'border-brand-orange shadow-lg shadow-brand-orange/20'
                    : 'border-base-300/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brand-orange to-brand-orange-light text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Paling Populer
                    </span>
                  </div>
                )}

                <div className="text-center space-y-6">
                  {/* Plan Header */}
                  <div>
                    <h3 className="text-2xl font-bold text-base-content mb-2">{plan.name}</h3>
                    <p className="text-base-content/60">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div>
                    {plan.price === 'Custom' ? (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold text-base-content">Custom</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-base-content">Rp</span>
                          <span className="text-5xl font-bold text-base-content">
                            {(() => {
                              // Parse numeric value safely by removing dots/commas
                              const monthlyNumber = parseInt(plan.price.replace(/[.,]/g, ''));

                              if (billingPeriod === 'yearly') {
                                // Apply 20% discount for yearly billing
                                const yearlyPrice = monthlyNumber * 12 * 0.8;
                                return new Intl.NumberFormat('id-ID').format(yearlyPrice);
                              } else {
                                return new Intl.NumberFormat('id-ID').format(monthlyNumber);
                              }
                            })()}
                          </span>
                          <span className="text-base-content/60">
                            {billingPeriod === 'yearly' ? '/tahun' : '/bulan'}
                          </span>
                        </div>
                        {billingPeriod === 'yearly' && (
                          <p className="text-sm text-green-600 font-medium">
                            Hemat Rp {(() => {
                              const monthlyNumber = parseInt(plan.price.replace(/[.,]/g, ''));
                              const savings = monthlyNumber * 12 * 0.2;
                              return new Intl.NumberFormat('id-ID').format(savings);
                            })()} per tahun
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <h4 className="font-semibold text-base-content">Fitur:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3 text-base-content/80">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                      plan.buttonVariant === 'primary'
                        ? 'bg-gradient-to-r from-brand-orange to-brand-orange-light hover:from-brand-orange-light hover:to-brand-orange text-white shadow-lg hover:shadow-xl'
                        : 'border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-base-content mb-8">
              Pertanyaan Umum
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-base-200/50 rounded-2xl border border-base-300/50 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-base-300/30 transition-colors duration-300"
                  >
                    <span className="font-semibold text-base-content">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-base-content/60 transition-transform duration-300 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-base-content/70">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}