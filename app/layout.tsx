import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import CompareBar from '@/components/CompareBar';
import Seo from '@/components/Seo';
import { getCurrentUser } from '@/lib/auth';
import { organizationJsonLd, SITE_URL, SITE_NAME } from '@/lib/seo';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Halozon — Colorful marketplace for everything you love',
  description:
    'Discover deals, trusted sellers, and fast delivery — a vibrant shopping experience built for you.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Halozon — Modern marketplace',
    description: 'Shop electronics, fashion, home, and more with a fresh, colorful experience.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halozon',
    description: 'A modern, colorful marketplace.',
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <Providers>
          <Suspense fallback={<div className="h-[120px] bg-white/90 border-b border-slate-200" />}>
            <Header user={user} />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
        </Providers>
        <Seo jsonLd={organizationJsonLd()} />
      </body>
    </html>
  );
}
