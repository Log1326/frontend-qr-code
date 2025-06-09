import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wjrxb4aenfqqvyu7.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
