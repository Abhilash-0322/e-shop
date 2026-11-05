'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/seller/analytics').then((response) => response.json()).then(setData).catch(() => {}); }, []);
  const metrics = [['Revenue', data?.metrics?.revenue || 0], ['Orders', data?.metrics?.orders || 0], ['Products', data?.metrics?.products || 0]];
  return <div><p className="eyebrow">Seller performance</p><h1 className="page-title mt-2">Good business starts with clarity.</h1><p className="mt-3 max-w-2xl muted">A quick read on your store today, with the next useful action close at hand.</p><div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4">{metrics.map(([label, value]) => <div className="surface p-3 sm:p-6" key={label as string}><p className="text-xs font-bold text-slate-500 sm:text-sm">{label}</p><b className="mt-1 block text-xl sm:mt-2 sm:text-3xl">{typeof value === 'number' && label === 'Revenue' ? `$${value.toFixed(2)}` : value}</b></div>)}</div><div className="surface mt-5 p-4 sm:mt-6 sm:p-8"><div className="flex items-end justify-between gap-3"><div><p className="eyebrow">Keep moving</p><h2 className="mt-1 text-xl font-black">Next best actions</h2></div><Link href="/seller/analytics" className="hidden text-sm amazon-link sm:block">Full analytics →</Link></div><div className="mt-5 grid gap-3 md:grid-cols-3"><Link className="card p-4" href="/seller/products/new"><b>Add a product</b><p className="mt-2 text-sm muted">Expand your catalog.</p></Link><Link className="card p-4" href="/seller/orders"><b>Review orders</b><p className="mt-2 text-sm muted">Stay ahead of fulfillment.</p></Link><Link className="card p-4" href="/seller/analytics"><b>View analytics</b><p className="mt-2 text-sm muted">Understand what is moving.</p></Link></div></div></div>;
}
