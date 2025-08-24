'use client';

import React from 'react';
import { Globe, MessageCircle, Users, Camera } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Fitur', href: '#features' },
    { name: 'Harga', href: '#pricing' },
    { name: 'Demo', href: '#demo' },
    { name: 'API Docs', href: '#api' }
  ],
  company: [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Karir', href: '#careers' },
    { name: 'Blog', href: '#blog' },
    { name: 'Kontak', href: '#contact' }
  ],
  support: [
    { name: 'Help Center', href: '#help' },
    { name: 'Community', href: '#community' },
    { name: 'Status', href: '#status' },
    { name: 'Security', href: '#security' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR', href: '#gdpr' }
  ]
};

const socialLinks = [
  { name: 'LinkedIn', href: '#', icon: Globe },
  { name: 'Twitter', href: '#', icon: MessageCircle },
  { name: 'Facebook', href: '#', icon: Users },
  { name: 'Instagram', href: '#', icon: Camera }
];

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">

            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🤖</div>
                <h3 className="text-2xl font-bold text-brand-orange">ViuWi</h3>
              </div>
              <p className="text-base-content/70 leading-relaxed max-w-md">
                Platform AI cerdas untuk transformasi customer service bisnis di Indonesia.
                Otomatisasi layanan pelanggan dengan teknologi terdepan.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-base-100 hover:bg-brand-orange hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-base-content mb-4">Produk</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href || link.name}>
                    <a
                      href={link.href}
                      className="text-base-content/70 hover:text-brand-orange transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base-content mb-4">Perusahaan</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href || link.name}>
                    <a
                      href={link.href}
                      className="text-base-content/70 hover:text-brand-orange transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base-content mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href || link.name}>
                    <a
                      href={link.href}
                      className="text-base-content/70 hover:text-brand-orange transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-base-300/30 to-base-100/50 rounded-3xl p-8 mb-8 border border-base-300/50">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-2xl font-bold text-base-content">
                Tetap Update dengan ViuWi
              </h3>
              <p className="text-base-content/70">
                Dapatkan tips, update fitur terbaru, dan berita terbaru seputar AI untuk bisnis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1 px-4 py-3 rounded-2xl border border-base-300 bg-base-100 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                />
                <button className="btn bg-gradient-to-r from-brand-orange to-brand-orange-light hover:from-brand-orange-light hover:to-brand-orange text-white border-none rounded-2xl px-6 py-3 font-semibold whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-base-300/50">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-base-content/60">
              <p>© 2024 ViuWi. All rights reserved.</p>
              <div className="flex gap-6">
                {footerLinks.legal.map((link) => (
                  <a
                    key={link.href || link.name}
                    href={link.href}
                    className="hover:text-brand-orange transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-base-content/60">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Semua sistem berjalan normal
              </span>
              <span>•</span>
              <span>🇮🇩 Made in Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}