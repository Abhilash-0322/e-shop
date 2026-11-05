'use client';

import {useEffect, useState} from 'react';
import ProductGrid from '@/components/ProductGrid';
import {Heart} from '@/lib/icons';
import {EmptyState, PageHeader} from '@/components/ui';
import Link from 'next/link';

export default function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/wishlist').then(response => response.json()).then(data => setItems(data.items || [])).catch(() => undefined);
  }, []);
  const products = items.map(item => item.product || item);
  return (
    <div>
      <PageHeader eyebrow="Saved" title="Wishlist" description="Keep a short list of products you want to come back to." />
      <div className="mt-8">
        {products.length ? <ProductGrid products={products} title="Your saved products" /> : <EmptyState title="Your wishlist is waiting" description="Save products as you browse and they will show up here." action={<Link href="/search" className="btn btn-primary">Find something good</Link>} icon={<Heart className="h-8 w-8" />} />}
      </div>
    </div>
  );
}
