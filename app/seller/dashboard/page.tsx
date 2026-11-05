'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Package, ShoppingBag, TrendingUp } from '@/lib/icons';

export default function Dashboard() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/analytics', { signal: controller.signal })
      .then((response) => response.json())
      .then(setData)
      .catch((error) => {
        if (error?.name !== 'AbortError') setData({});
      });
    return () => controller.abort();
  }, []);

  const metrics = [
    ['Revenue', data?.metrics?.revenue || 0, 'This period', TrendingUp],
    ['Orders', data?.metrics?.orders || 0, 'All fulfilled demand', ShoppingBag],
    ['Products', data?.metrics?.products || 0, 'Live in your catalog', Package],
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="eyebrow">Seller performance</p><h1 className="page-title mt-2">Good business starts with clarity.</h1><p className="muted mt-3">Your storefront, at a glance.</p></div>
        <Link href="/seller/analytics" className="btn btn-soft"><BarChart3 className="h-4 w-4" />Full analytics</Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {metrics.map(([label, value, note, Icon]) => {
          const Component = Icon as any;
          return <div className="dashboard-stat" key={label as string}><div className="flex items-center justify-between"><p className="muted text-sm">{label as string}</p><Component className="h-4 w-4 text-indigo-500" /></div><b className="mt-3 block text-3xl">{typeof value === 'number' && label === 'Revenue' ? `$${value.toFixed(2)}` : value as string}</b><small className="mt-2 block text-xs text-slate-400">{note as string}</small></div>;
        })}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="surface p-6 md:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow">Momentum</p><h2 className="mt-2 text-xl font-black">Keep the good signal moving.</h2></div><span className="pill bg-emerald-100 text-emerald-700">Live</span></div><div className="mt-8 flex h-36 items-end gap-2">{[42, 58, 48, 70, 62, 82, 91, 76, 98, 86, 100, 94].map((height, index) => <div key={index} className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-fuchsia-400" style={{ height: `${height}%` }} />)}</div><div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400"><span>12 weeks ago</span><span>Today</span></div></div>
        <div className="surface p-6 md:p-8"><p className="eyebrow">Next best actions</p><h2 className="mt-2 text-xl font-black">Small moves, visible impact.</h2><div className="mt-5 space-y-2"><Link className="card flex items-center justify-between p-4" href="/seller/products/new"><span><b>Add a product</b><span className="muted mt-1 block text-xs">Expand your catalog.</span></span><ArrowRight className="h-4 w-4 text-indigo-500" /></Link><Link className="card flex items-center justify-between p-4" href="/seller/orders"><span><b>Review orders</b><span className="muted mt-1 block text-xs">Stay ahead of fulfillment.</span></span><ArrowRight className="h-4 w-4 text-indigo-500" /></Link><Link className="card flex items-center justify-between p-4" href="/seller/store"><span><b>Shape your store</b><span className="muted mt-1 block text-xs">Make your point of view clear.</span></span><ArrowRight className="h-4 w-4 text-indigo-500" /></Link></div></div>
      </div>
    </div>
  );
}
