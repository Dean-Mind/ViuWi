// Mock data for onboarding flow
export const mockOnboardingData = {
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
    {
      id: "cs_handover",
      title: "CS Handover (Fallback ke Admin)",
      description: "Chatbot otomatis alihkan ke CS manusia jika tidak bisa menjawab.",
      benefits: [
        "Meningkatkan kepercayaan pengguna",
        "Dukung topik sensitif (refund, komplain)",
        "Sistem hybrid: bot dulu → CS jika perlu"
      ],
      enabled: true,
      expanded: true
    },
    {
      id: "product_catalog",
      title: "Katalog Produk / Layanan",
      description: "Tampilkan produk atau layanan dengan foto dan deskripsi langsung di chat.",
      enabled: false,
      expanded: false
    },
    {
      id: "booking_system",
      title: "Booking Jadwal / Waiting List", 
      description: "Izinkan user memilih slot layanan secara otomatis. Cocok untuk salon, klinik, konsultasi.",
      enabled: false,
      expanded: false
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