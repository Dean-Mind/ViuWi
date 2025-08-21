'use client';

import React from 'react';
import ComingSoonPage from '@/components/ui/ComingSoonPage';

export default function FormulirPage() {
  const features = [
    "Form builder drag-and-drop yang mudah",
    "Template formulir siap pakai",
    "Validasi data otomatis",
    "Integrasi dengan database pelanggan",
    "Export data ke Excel/CSV",
    "Notifikasi real-time untuk submission baru"
  ];

  return (
    <ComingSoonPage
      title="Formulir"
      description="Buat dan kelola formulir untuk bisnis Anda"
      features={features}
      estimatedDate="27 September 2025"
      contactInfo={{
        email: "support@viuwi.com",
        whatsapp: "https://wa.me/prasetya"
      }}
    />
  );
}
