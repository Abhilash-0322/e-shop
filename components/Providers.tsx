'use client';
import {Toaster} from 'react-hot-toast';
import {CartProvider} from '@/hooks/useCart';
import LocaleProvider from './LocaleProvider';
export default function Providers({children}:{children:React.ReactNode}){return <LocaleProvider><CartProvider>{children}<Toaster position="bottom-right"/></CartProvider></LocaleProvider>}
