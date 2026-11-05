import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import CompareBar from '@/components/CompareBar';
import {getCurrentUser} from '@/lib/auth';

const inter=Inter({subsets:['latin'],variable:'--font-sans',display:'swap'});
export const metadata:Metadata={title:'Halozon — things worth making room for',description:'A considered marketplace for products with personality and sellers with a point of view.'};

export default async function RootLayout({children}:{children:React.ReactNode}){
  const user=await getCurrentUser();
  return <html lang="en"><body className={`${inter.variable}`}><Providers><Header user={user}/><main>{children}</main><Footer/><CompareBar/></Providers></body></html>
}
