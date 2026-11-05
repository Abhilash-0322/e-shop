'use client';
import {Toaster} from 'react-hot-toast';
import {CartProvider} from '@/hooks/useCart';
import NetworkStatus from '@/components/NetworkStatus';
export default function Providers({children}:{children:React.ReactNode}){return <CartProvider><NetworkStatus/>{children}<Toaster position="bottom-right" toastOptions={{className:'hz-toast'}}/></CartProvider>}
