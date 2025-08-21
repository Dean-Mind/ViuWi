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
        source: '/cs-handover/:path*',
        destination: '/cshandover/:path*',
        permanent: true,
      },
      {
        source: '/katalog-produk/:path*',
        destination: '/katalogproduk/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
