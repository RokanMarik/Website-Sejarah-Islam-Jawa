import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - necessary for Next.js dev server cross-origin HMR
  allowedDevOrigins: ['192.168.1.10', 'localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
