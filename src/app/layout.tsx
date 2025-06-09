import '@/app/globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QR Code Generator | Create Custom QR Codes Online',
  description:
    'Free online QR code generator. Create custom QR codes for URLs, text, vCards, and more. Easy to use, instant download, high-quality QR codes.',
  keywords: [
    'QR code generator',
    'create QR code',
    'custom QR codes',
    'free QR code maker',
    'QR code creator',
    'generate QR code online',
  ],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name/Company',
  publisher: 'Your Name/Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qr-code-4dbel2v8m-log1326s-projects.vercel.app',
    title: 'QR Code Generator | Create Custom QR Codes Online',
    description:
      'Free online QR code generator. Create custom QR codes for URLs, text, vCards, and more.',
    siteName: 'QR Code Generator',
    images: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
        width: 1200,
        height: 630,
        alt: 'QR Code Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator | Create Custom QR Codes Online',
    description:
      'Free online QR code generator. Create custom QR codes for URLs, text, vCards, and more.',
    creator: '@yourtwitter',
    images: ['https://your-domain.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              <div className="flex justify-center">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
