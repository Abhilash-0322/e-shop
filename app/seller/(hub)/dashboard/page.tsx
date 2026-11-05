'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {ArrowRight, BarChart3, Package, ShoppingBag} from '@/lib/icons';
import {PageHeader, SkeletonBlock, StatCard} from '@/components/ui';

export default function Dashboard() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/seller/analytics').then(response => response.json()).then(setData).catch(() => undefined); }, []);
  const metrics = data?.metrics;
  return (
    <div>
      <PageHeader eyebrow="Seller performance" title="Good business starts with clarity." description="Keep the catalog focused, fulfillment moving, and the next opportunity visible." actions={<Link href="/seller/products/new" className="btn btn-primary">Add product</Link>} />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[['Revenue', metrics?.revenue !== undefined ? `$${Number(metrics.revenue).toFixed(2)}` : undefined], ['Orders', metrics?.orders], ['Products', metrics?.products]].map(([label, value]) => value === undefined ? <div className="stat-card" key={label as string}><SkeletonBlock className="h-4 w-24" /><SkeletonBlock className="mt-3 h-8 w-20" /></div> : <StatCard key={label as string} label={label as string} value={value as string | number} />)}
      </div>
      <section className="surface mt-6 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Workspace shortcuts</p><h2 className="mt-2 text-xl font-black">Next best actions</h2></div><BarChart3 className="h-6 w-6 text-brand-500" /></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[[Package, 'Add a product', 'Expand your catalog.', '/seller/products/new'], [ShoppingBag, 'Review orders', 'Stay ahead of fulfillment.', '/seller/orders'], [BarChart3, 'View analytics', 'Understand what is moving.', '/seller/analytics']].map(([Icon, title, description, href]) => { const Glyph = Icon as typeof Package; return <Link className="card-interactive card p-4" href={href as string} key={href as string}><Glyph className="h-5 w-5 text-brand-600" /><b className="mt-4 block">{title as string}</b><p className="muted mt-2 text-sm">{description as string}</p><span className="amazon-link mt-4 inline-flex items-center gap-1 text-xs">Open <ArrowRight className="h-3 w-3" /></span></Link>; })}
        </div>
      </section>
    </div>
  );
}
