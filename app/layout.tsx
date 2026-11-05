import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import CompareBar from '@/components/CompareBar';
import Seo from '@/components/Seo';
import { getCurrentUser } from '@/lib/auth';
import { organizationJsonLd, SITE_URL, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'halozon — Find your next everyday essential',
  description:
    'A calmer way to shop across independent makers, considered tech, and things built to last.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'halozon — Find your next everyday essential',
    description:
      'Curated goods, thoughtful sellers, and a calmer way to shop.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'halozon',
    description: 'Curated goods, thoughtful sellers, and a calmer way to shop.',
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
        </Providers>
        <Seo jsonLd={organizationJsonLd()} />
      </body>
    </html>
  );
}
