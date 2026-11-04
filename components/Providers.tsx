'use client';
import {Toaster} from 'react-hot-toast';
import {CartProvider} from '@/hooks/useCart';
export default function Providers({children}:{children:React.ReactNode}){return <CartProvider>{children}<Toaster position="bottom-right"/></CartProvider>}
