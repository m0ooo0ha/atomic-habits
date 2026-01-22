import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'متابع انتقالات اللاعبين',
  description: 'تتبع انتقالات اللاعبين والأندية بالذكاء الاصطناعي',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'متابع الانتقالات',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192x192.svg',
    apple: '/icon-192x192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.svg" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="متابع الانتقالات" />
      </head>
      <body>{children}</body>
    </html>
  );
}
