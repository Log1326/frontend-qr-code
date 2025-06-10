import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/i18n.ts');

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

export default withNextIntl(nextConfig);
