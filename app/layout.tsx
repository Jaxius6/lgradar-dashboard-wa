import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
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
      <head>
        <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}