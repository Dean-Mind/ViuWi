'use client';

import React from 'react';
import ComingSoonPage from '@/components/ui/ComingSoonPage';

export default function LaporanAnalitikPage() {
  const features = [
    "Dashboard analitik real-time",
    "Laporan penjualan dan revenue",
    "Analisis perilaku pelanggan",
    "Grafik dan chart interaktif",
    "Export laporan ke PDF/Excel",
    "Prediksi tren bisnis dengan AI"
  ];

  return (
    <ComingSoonPage
      title="Laporan & Analitik"
      description="Analisis mendalam untuk pertumbuhan bisnis Anda"
      features={features}
      estimatedDate="27 September 2025"
      contactInfo={{
        email: "support@viuwi.com",
        whatsapp: "https://wa.me/prasetya"
      }}
    />
  );
}
