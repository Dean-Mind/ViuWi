'use client';

import React from 'react';
import ComingSoonPage from '@/components/ui/ComingSoonPage';

export default function BookingJadwalPage() {
  const features = [
    "Penjadwalan otomatis untuk layanan bisnis",
    "Ekspor data jadwal ke Google Calendar",
    "Notifikasi reminder untuk pelanggan",
    "Manajemen slot waktu yang fleksibel",
    "Konfirmasi booking via WhatsApp",
    "Dashboard analitik untuk booking trends"
  ];

  return (
    <ComingSoonPage
      title="Booking Jadwal"
      description="Sistem penjadwalan otomatis untuk bisnis Anda"
      features={features}
      estimatedDate="27 September 2025"
      contactInfo={{
        email: "support@viuwi.com",
        whatsapp: "https://wa.me/prasetya"
      }}
    />
  );
}
