import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import CompareBar from '@/components/CompareBar';
import { getCurrentUser } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Halozon — your commerce command center',
  description: 'Search, compare, and manage every shopping task from one clear marketplace workspace.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen`}>
        <Providers>
          <Header user={user} />
          <main>{children}</main>
          <Footer />
          <CompareBar />
        </Providers>
      </body>
    </html>
  );
}
