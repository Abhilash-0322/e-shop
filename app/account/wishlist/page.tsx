'use client';

import {useEffect, useState} from 'react';
import ProductGrid from '@/components/ProductGrid';

export default function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/wishlist', {signal: controller.signal})
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted) setItems(data.items || []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setItems([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div>
      <p className="eyebrow">Saved</p>
      <h1 className="page-title mt-2">Wishlist</h1>
      <div className="mt-8">
        {loading ? <div className="skeleton h-64 w-full" /> : <ProductGrid products={items.map((item: any) => item.product || item)} title="Your saved products" />}
        {!loading && !items.length && <div className="surface muted mt-4 p-8">Nothing saved yet. Your next favorite could be here.</div>}
      </div>
    </div>
  );
}
