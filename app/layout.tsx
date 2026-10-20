import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Newsreader, Public_Sans } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: false,
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Furrow — Your first home harvest, planned around your week',
  description:
    'Furrow helps busy Nigerian households grow vegetables at home: a weekly plan that fits your time, safe setups from what you already own, low-effort watering for days away, a farming-only assistant, and invite-only grower circles. Join the pilot waitlist.',
  openGraph: {
    title: 'Furrow — Your first home harvest, planned around your week',
    description: 'Home growing for busy Nigerian households. Join the pilot waitlist.',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#f4f3e9' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
