// Mock data for onboarding flow
export const mockOnboardingData = {
  // Step 0 - Business Profile Setup (handled by businessProfileMockData.ts)

  // Step 1 - Knowledge Base
  knowledgeBaseOptions: {
    documentUpload: {
      supportedFormats: ["PDF", "DOC", "DOCX"],
      maxFileSize: "10MB"
    },
    textInput: {
      placeholder: "Masukkan teks FAQ, prosedur, atau informasi layanan.",
      examples: [
        "Jam operasional kami adalah Senin–Jumat, pukul 09.00–17.00",
        "Anda dapat mengajukan refund maksimal 7 hari setelah pembelian."
      ]
    },
    websiteLink: {
      placeholder: "https://www.namadomainanda.com/faq"
    }
  },
  
  // Step 2 - Feature Selection
  features: [
    // Basic Features (Always Enabled)
    {
      id: "cshandover",
      title: "CS Handover (Fallback ke Admin)",
      description: "Chatbot otomatis alihkan ke CS manusia jika tidak bisa menjawab.",
      benefits: [
        "Meningkatkan kepercayaan pengguna",
        "Dukung topik sensitif (refund, komplain)",
        "Sistem hybrid: bot dulu → CS jika perlu"
      ],
      enabled: true,
      expanded: true,
      isBasic: true,
      category: "basic"
    },
    {
      id: "customer_management",
      title: "Manajemen Pelanggan",
      description: "Kelola data pelanggan, riwayat chat, dan informasi kontak secara terpusat.",
      benefits: [
        "Database pelanggan terintegrasi",
        "Riwayat percakapan tersimpan",
        "Segmentasi pelanggan otomatis",
        "Analisis perilaku pelanggan"
      ],
      enabled: true,
      expanded: false,
      isBasic: true,
      category: "basic"
    },
    {
      id: "knowledge_base_management",
      title: "Manajemen Knowledge Base",
      description: "Kelola basis pengetahuan untuk chatbot AI Anda dengan dokumen, teks, dan konten website.",
      benefits: [
        "Upload multiple dokumen (PDF, DOC, DOCX)",
        "Input teks manual untuk informasi bisnis",
        "Ekstrak konten dari website/FAQ",
        "Generate dan edit AI Guidelines"
      ],
      enabled: true,
      expanded: false,
      isBasic: true,
      category: "basic"
    },

    // Optional Features (User Selectable)
    {
      id: "product_catalog",
      title: "Katalog Produk / Layanan",
      description: "Tampilkan produk atau layanan dengan foto dan deskripsi langsung di chat.",
      benefits: [
        "Showcase produk interaktif",
        "Informasi lengkap dengan gambar",
        "Update katalog real-time",
        "Integrasi dengan inventory"
      ],
      enabled: false,
      expanded: false,
      isBasic: false,
      category: "optional"
    },
    {
      id: "order_management",
      title: "Kelola Pesanan",
      description: "Kelola pesanan pelanggan, status pengiriman, dan riwayat transaksi secara terpusat.",
      benefits: [
        "Tracking pesanan real-time",
        "Update status otomatis",
        "Riwayat transaksi lengkap",
        "Notifikasi pengiriman"
      ],
      enabled: false,
      expanded: false,
      isBasic: false,
      category: "optional"
    },
    {
      id: "payment_system",
      title: "Sistem Pembayaran",
      description: "Integrasi pembayaran digital untuk transaksi langsung di chat.",
      benefits: [
        "Pembayaran seamless di chat",
        "Multiple payment gateway",
        "Invoice otomatis",
        "Tracking transaksi real-time"
      ],
      enabled: false,
      expanded: false,
      isBasic: false,
      category: "optional"
    },

    // Future Development (Coming Soon)
    {
      id: "dynamic_forms",
      title: "Formulir Dinamis",
      description: "Buat formulir otomatis dan percakapan untuk survey, pendaftaran, dan lainnya.",
      benefits: [
        "Otomatisasi pengumpulan data",
        "Survey kepuasan pelanggan",
        "Formulir pendaftaran layanan",
        "Kustomisasi pertanyaan sesuai kebutuhan"
      ],
      enabled: false,
      expanded: false,
      isBasic: false,
      isComingSoon: true,
      category: "future"
    },
    {
      id: "feedback_rating",
      title: "Feedback & Rating System",
      description: "Kumpulkan penilaian user setelah layanan selesai. Penting untuk evaluasi.",
      benefits: [
        "Tingkatkan kualitas layanan",
        "Dapatkan insight dari pelanggan",
        "Rating otomatis setelah chat selesai",
        "Laporan feedback terstruktur"
      ],
      enabled: false,
      expanded: false,
      isBasic: false,
      isComingSoon: true,
      category: "future"
    },
    {
      id: "booking_system",
      title: "Booking Jadwal / Waiting List",
      description: "Izinkan user memilih slot layanan secara otomatis. Cocok untuk salon, klinik, konsultasi.",
      benefits: [
        "Penjadwalan otomatis",
        "Manajemen antrian digital",
        "Reminder appointment",
        "Integrasi kalender"
      ],
      enabled: false,
      expanded: false,
      isBasic: false,
      isComingSoon: true,
      category: "future"
    },
    {
      id: "reports_analytics",
      title: "Laporan & Analitik",
      description: "Lihat data interaksi, pertanyaan populer, performa fitur, dan feedback.",
      benefits: [
        "Dashboard analitik lengkap",
        "Insight perilaku pelanggan",
        "Laporan performa chatbot",
        "Trend dan pattern analysis"
      ],
      enabled: false,
      expanded: false,
      isBasic: false,
      isComingSoon: true,
      category: "future"
    },
    {
      id: "payment_integration",
      title: "Integrasi Pembayaran",
      description: "Terima pembayaran langsung lewat chatbot via QRIS, transfer, e-wallet.",
      enabled: false,
      expanded: false
    }
  ],
  
  // Step 3 - WhatsApp Connection
  whatsappConnection: {
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=sample-whatsapp-connection",
    instructions: [
      "Buka WhatsApp > Setelan > Perangkat Tertaut",
      "Scan QR di atas"
    ]
  }
};