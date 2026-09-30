import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Newsreader, Public_Sans } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
  title: 'Furrow — Grow what you know',
  description:
    'Meet Furrow, a growing companion in the making. Practical local knowledge, a farming assistant, and grower circles. Join the pilot waitlist.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
