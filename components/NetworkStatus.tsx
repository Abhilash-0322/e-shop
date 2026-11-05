'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from '@/lib/icons';

export default function NetworkStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="network-banner" role="status">
      <div className="shell flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>You&apos;re offline. We&apos;ll keep your cart and drafts safe on this device.</span>
      </div>
    </div>
  );
}

