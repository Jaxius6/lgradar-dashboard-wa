import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LG Radar Dashboard',
  description: 'Real-time legislative tracking for WA councils - never miss a Gazette again.',
  keywords: ['legislative tracking', 'WA councils', 'gazette', 'government'],
  authors: [{ name: 'LG Radar' }],
  creator: 'LG Radar',
  publisher: 'LG Radar',
  robots: 'noindex, nofollow', // Private dashboard
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}