import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'متابع انتقالات اللاعبين',
  description: 'تتبع انتقالات اللاعبين والأندية بالذكاء الاصطناعي',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
