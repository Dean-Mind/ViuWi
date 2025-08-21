/**
 * Localization constants for ViuWi Dashboard
 * Provides Indonesian translations for all dashboard text
 */

export const DASHBOARD_LABELS = {
  // Header
  welcome: "Selamat Datang di Dashboard ViuWi",
  subtitle: "Pusat kendali untuk mengelola semua operasi ViuWi Anda",
  lastUpdated: "Terakhir diperbarui",
  refresh: "Perbarui",
  refreshing: "Memperbarui...",
  autoRefresh: "Perbarui Otomatis",

  // Sections
  keyMetrics: "Metrik Utama",
  orderStatus: "Status Pesanan", 
  businessOverview: "Ringkasan Bisnis",
  recentActivity: "Aktivitas Terbaru",
  quickActions: "Aksi Cepat",
  systemStatus: "Status Sistem",

  // Metrics
  totalOrders: "Total Pesanan",
  totalRevenue: "Total Pendapatan",
  activeCustomers: "Pelanggan Aktif", 
  totalProducts: "Total Produk",
  activeChats: "Chat Aktif",
  pendingOrders: "Tertunda",
  confirmedOrders: "Dikonfirmasi",
  shippedOrders: "Dikirim",
  deliveredOrders: "Terkirim",
  newCustomers: "Pelanggan Baru",
  resellers: "Reseller",
  outOfStock: "Stok Habis",
  unreadMessages: "Pesan Belum Dibaca",

  // Order Status Labels
  pending: "Tertunda",
  confirmed: "Dikonfirmasi", 
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Terkirim",

  // Trends
  vsLastWeek: "vs minggu lalu",
  vsLastMonth: "vs bulan lalu",

  // Quick Actions
  viewPendingOrders: "Lihat {count} Pesanan Tertunda",
  reviewProcessPendingOrders: "Tinjau dan proses pesanan tertunda",
  checkUnreadMessages: "Periksa {count} Pesan Belum Dibaca", 
  respondCustomerInquiries: "Tanggapi pertanyaan pelanggan",
  restockProducts: "Isi Ulang {count} Produk Stok Habis",
  restockLowInventory: "Isi ulang inventori yang rendah",
  configurePaymentProvider: "Konfigurasi Payment Provider",
  setupPaymentProcessing: "Siapkan pemrosesan pembayaran",
  addNewProduct: "Tambah Produk Baru",
  addProductsToCatalog: "Tambahkan produk ke katalog Anda",
  addNewCustomer: "Tambah Pelanggan Baru",
  registerNewCustomer: "Daftarkan pelanggan baru",

  // System Status
  paymentHealth: "Kesehatan Pembayaran",
  featuresActive: "Fitur Aktif",
  systemHealth: "Kesehatan Sistem",
  healthy: "Sehat",

  // Activity
  recentOrders: "Pesanan Terbaru",
  recentCustomers: "Pelanggan Terbaru",

  // Status badges
  processingBadge: "diproses",
  confirmedBadge: "dikonfirmasi",
  newCustomer: "pelanggan baru"
} as const;

/**
 * Helper function to replace placeholders in localized strings
 * @param template - Template string with {placeholder} syntax
 * @param values - Object with placeholder values
 * @returns Formatted string with placeholders replaced
 */
export const formatMessage = (template: string, values: Record<string, string | number> = {}): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
};

/**
 * Currency formatter for Indonesian Rupiah
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Date formatter for Indonesian locale
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Time formatter for Indonesian locale
 * @param date - Date to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};
