'use client';

import { useCallback, useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { EmptyState, RecoveryState } from '@/components/RecoveryState';

export default function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/wishlist', { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Saved items could not be loaded.');
      if (!signal?.aborted) setItems(data.items || []);
      setError('');
    } catch (caught: any) {
      if (caught?.name !== 'AbortError') setError(caught?.message || 'Saved items could not be loaded.');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <div>
      <p className="eyebrow">Saved</p>
      <h1 className="page-title mt-2">Wishlist</h1>
      <p className="muted mt-3">Keep your next good find close, even when you are not ready to buy.</p>
      <div className="mt-8">
        {error ? <RecoveryState title="Your saved items are unavailable" description={error} onRetry={() => load()} href="/help" hrefLabel="Get help" /> : items.length ? <ProductGrid products={items.map((item: any) => item.product || item)} title="Your saved products" /> : <EmptyState title="Your wishlist is waiting" description="Tap the heart on any product to save it here for later." />}
      </div>
    </div>
  );
}
