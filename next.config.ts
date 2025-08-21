import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/cs-handover',
        destination: '/cshandover',
        permanent: true,
      },
      {
        source: '/katalog-produk',
        destination: '/katalogproduk',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
