'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { AccountPageHeader, EmptyState, Skeleton } from '@/components/AccountPrimitives';

export default function RecommendationsView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  async function load() {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch('/api/me/recommendations');
      if (!response.ok) throw new Error('Could not load recommendations');
      const data = await response.json();
      setItems(data.items || []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <>
      <AccountPageHeader eyebrow="Made for you" title="Picked for your next chapter" description="A considered mix of products based on what you browse, save, and shop." />
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((item) => <Skeleton key={item} className="h-80" />)}
        </div>
      ) : failed ? (
        <div className="empty-state panel">
          <div className="empty-icon"><AlertTriangle className="w-6 h-6" /></div>
          <h2 className="text-lg font-bold">Your picks are taking a moment</h2>
          <p className="text-sm text-muted">We couldn&apos;t connect to your recommendation shelf.</p>
          <button onClick={load} className="btn-secondary mt-2"><RefreshCw className="w-4 h-4" /> Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div className="panel"><EmptyState icon={Sparkles} title="Your shelf is still taking shape" description="Browse a few products and we&apos;ll start finding thoughtful matches for you." action={{ href: '/', label: 'Explore the store' }} /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </>
  );
}
