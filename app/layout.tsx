import type {Metadata} from 'next';
import {DM_Sans, Space_Grotesk} from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import CompareBar from '@/components/CompareBar';
import {getCurrentUser} from '@/lib/auth';
const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans',display:'swap'});
const spaceGrotesk = Space_Grotesk({subsets:['latin'],variable:'--font-display',display:'swap'});
export const metadata:Metadata={title:'Halozon — products worth keeping',description:'A visual marketplace for discovering products from trusted sellers.'};
export default async function RootLayout({children}:{children:React.ReactNode}){const user=await getCurrentUser();return <html lang="en"><body className={`${dmSans.variable} ${spaceGrotesk.variable}`}><Providers><Header user={user}/><main>{children}</main><Footer/><CompareBar/></Providers></body></html>}
