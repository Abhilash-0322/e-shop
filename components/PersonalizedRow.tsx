'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Skeleton } from './AccountPrimitives';

export default function PersonalizedRow() {
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch('/api/me/recommendations')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);
  if (!loaded) {
    return (
      <section className="mb-8">
        <div className="flex items-end justify-between mb-3 px-1"><div><div className="eyebrow mb-1">For your next chapter</div><h2 className="text-2xl font-bold tracking-tight">Finding your next favorite</h2><p className="text-sm text-muted mt-1">Personalized picks are loading.</p></div></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-72" />)}</div>
      </section>
    );
  }
  if (!items.length) return null;
  return (
    <section className="mb-6">
      <div className="mb-3 px-1">
        <div className="eyebrow mb-1">For your next chapter</div>
        <h2 className="text-2xl font-bold tracking-tight text-amazon-text">Inspired by your browsing</h2>
        <p className="text-sm text-muted mt-1">Personalized picks based on what you&apos;ve viewed.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.slice(0, 10).map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
