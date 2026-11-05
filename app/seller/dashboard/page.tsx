'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowUpRight, BarChart3, Package, Plus, ShoppingBag, TrendingUp } from '@/lib/icons';

export default function Dashboard() {
  const [data, setData] = useState<any>();
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/analytics', { signal: controller.signal }).then((response) => response.json()).then((value) => { if (!controller.signal.aborted) setData(value); }).catch(() => {});
    return () => controller.abort();
  }, []);
  const metrics = [['Revenue', data?.metrics?.revenue || 0], ['Orders', data?.metrics?.orders || 0], ['Products', data?.metrics?.products || 0]] as const;
  return (
    <div>
      <div className="workspace-toolbar"><div><p className="eyebrow">Seller performance</p><h1 className="page-title mt-2">Good business starts with clarity.</h1><p className="muted mt-3 text-sm">Your storefront signal, condensed into the next best move.</p></div><span className="hidden items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 sm:flex"><Activity className="h-4 w-4" /> Live metrics</span></div>
      <div className="grid gap-3 sm:grid-cols-3">{metrics.map(([label, value]) => <div className="metric-card" key={label}><span className="metric-card-label">{label}</span><b className="metric-card-value">{label === 'Revenue' ? `$${Number(value).toFixed(2)}` : value}</b><span className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-700"><TrendingUp className="h-3 w-3" /> Tracking well</span></div>)}</div>
      <div className="surface mt-6 p-5 md:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Operator queue</p><h2 className="mt-2 text-xl font-black">Next best actions</h2></div><BarChart3 className="h-5 w-5 text-indigo-600" /></div><div className="mt-5 grid gap-3 md:grid-cols-3"><Link className="action-tile" href="/seller/products/new"><span className="action-tile-icon"><Plus className="h-4 w-4" /></span><b className="mt-3 text-sm">Add a product</b><span className="muted text-xs">Expand your catalog <ArrowUpRight className="ml-1 inline h-3 w-3" /></span></Link><Link className="action-tile" href="/seller/orders"><span className="action-tile-icon"><ShoppingBag className="h-4 w-4" /></span><b className="mt-3 text-sm">Review orders</b><span className="muted text-xs">Stay ahead of fulfillment <ArrowUpRight className="ml-1 inline h-3 w-3" /></span></Link><Link className="action-tile" href="/seller/analytics"><span className="action-tile-icon"><Package className="h-4 w-4" /></span><b className="mt-3 text-sm">View analytics</b><span className="muted text-xs">Understand what is moving <ArrowUpRight className="ml-1 inline h-3 w-3" /></span></Link></div></div>
    </div>
  );
}
