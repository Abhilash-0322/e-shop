'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SellerAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isApplication = pathname === '/seller/apply';

  useEffect(() => {
    if (!isApplication) router.replace(`/seller/apply?redirect=${encodeURIComponent(pathname)}`);
  }, [isApplication, pathname, router]);

  if (isApplication) return <>{children}</>;
  return <div className="shell py-20 text-center text-sm text-slate-500">Opening seller application...</div>;
}
