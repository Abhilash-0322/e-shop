'use client';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#11121A',
            color: '#fff',
            border: '1px solid rgba(216, 255, 62, .22)',
            borderRadius: 16,
            fontSize: 14,
          },
        }}
      />
    </>
  );
}
