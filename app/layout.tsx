import type {Metadata} from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import CompareBar from '@/components/CompareBar';
import {getCurrentUser} from '@/lib/auth';
export const metadata:Metadata={title:'Halozon — commerce, reimagined',description:'A modern marketplace for discovering products from trusted sellers.'};
export default async function RootLayout({children}:{children:React.ReactNode}){const user=await getCurrentUser();return <html lang="en"><body><Providers><Header user={user}/><main>{children}</main><Footer/><CompareBar/></Providers></body></html>}
