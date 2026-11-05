'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { Heart } from '@/lib/icons';

export default function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch('/api/wishlist').then((response) => response.json()).then((data) => setItems(data.items || [])).catch(() => {}); }, []);
  const products = items.map((item: any) => item.product || item);
  return <div><div className="rounded-[1.7rem] bg-[#ffeadf] p-7 md:p-9"><Heart className="h-7 w-7 text-[#ff765c]" /><p className="eyebrow mt-6">Saved</p><h1 className="page-title mt-2">Keep the good things close.</h1><p className="muted mt-3">Your shortlist is a place for maybes, future gifts, and the things you&apos;re not ready to let go of.</p></div><div className="mt-8"><ProductGrid products={products} title="Your saved products" subtitle={`${products.length} favorites`} /></div>{!products.length && <div className="surface mt-8 p-10 text-center"><p className="muted">Nothing saved yet.</p><Link href="/search" className="btn btn-primary mt-5">Find something good</Link></div>}</div>;
}
