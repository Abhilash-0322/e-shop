'use client';

import {Toaster} from 'react-hot-toast';
import {CartProvider} from '@/hooks/useCart';
import {WishlistProvider} from '@/hooks/useWishlist';

type SessionUser = {id: string} | null;

export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser;
}) {
  const signedIn = Boolean(user);

  return (
    <CartProvider enabled={signedIn}>
      <WishlistProvider enabled={signedIn}>
        {children}
        <Toaster position="bottom-right" toastOptions={{duration: 2400}} />
      </WishlistProvider>
    </CartProvider>
  );
}
