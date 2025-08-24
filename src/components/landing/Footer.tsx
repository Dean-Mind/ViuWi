'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';




export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">

          {/* Company Info */}
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-2xl font-bold text-brand-orange">ViuWi</h3>
            </div>
            <p className="text-base-content/70 leading-relaxed">
              Platform AI cerdas untuk transformasi customer service bisnis di Indonesia.
              Otomatisasi layanan pelanggan dengan teknologi terdepan.
            </p>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-base-300/50">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-base-content/60">
              <div className="flex items-center gap-3">
                <p>© 2025 PT. Dean Mind Technology</p>
                <span
                  className="text-xs opacity-100 cursor-help transition-opacity duration-300"
                  title="Built in just 10 days! 🚀"
                >
                  ⚡
                </span>
                <a
                  href="https://wa.me/prasetya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-lg text-xs font-medium transition-colors duration-300"
                  title="Hubungi via WhatsApp"
                >
                  <MessageCircle size={12} />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-base-content/60">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Versi Alpha
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