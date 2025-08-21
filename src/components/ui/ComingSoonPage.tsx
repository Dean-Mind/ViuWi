'use client';

import React from 'react';
import { Calendar, MessageCircle } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
  features?: string[];
  estimatedDate?: string;
  contactInfo?: {
    email?: string;
    whatsapp?: string;
  };
}

export default function ComingSoonPage({
  title,
  description,
  features = [],
  estimatedDate = "27 September 2025",
  contactInfo = {
    email: "support@viuwi.com",
    whatsapp: "https://wa.me/prasetya"
  }
}: ComingSoonPageProps) {
  const handleWhatsAppClick = () => {
    if (contactInfo.whatsapp) {
      const newWin = window.open(contactInfo.whatsapp, '_blank', 'noopener,noreferrer');
      if (newWin) newWin.opener = null;
    }
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-orange">{title}</h1>
              <p className="text-base-content/70 mt-1">
                {description}
              </p>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-xl mx-auto text-center space-y-4">
              {/* Main Coming Soon Message */}
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-brand-orange" />
                </div>

                <h2 className="text-2xl font-bold text-base-content">
                  Segera Hadir
                </h2>

                <p className="text-base text-base-content/70">
                  Kami sedang mengembangkan fitur luar biasa ini. Peluncuran: <span className="font-semibold text-brand-orange">{estimatedDate}</span>
                </p>
              </div>

              {/* Features Preview */}
              {features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-base-content">
                    Yang Dapat Diharapkan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-base-200 rounded-lg text-left"
                      >
                        <div className="w-1.5 h-1.5 bg-brand-orange rounded-full flex-shrink-0" />
                        <span className="text-base-content/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="pt-2">
                <p className="text-sm text-base-content/60 mb-3">
                  Ingin akses awal atau ada pertanyaan?
                </p>

                {contactInfo.whatsapp && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white transition-all duration-200 rounded-2xl btn-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Hubungi via WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
