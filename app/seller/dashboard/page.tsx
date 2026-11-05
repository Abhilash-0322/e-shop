'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Package, ShoppingBag } from '@/lib/icons';

export default function Dashboard() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/seller/analytics').then((response) => response.json()).then(setData).catch(() => {}); }, []);
  const metrics = [['Revenue', data?.metrics?.revenue || 0, BarChart3], ['Orders', data?.metrics?.orders || 0, ShoppingBag], ['Products', data?.metrics?.products || 0, Package]] as const;
  return <div><div className="rounded-[1.7rem] bg-[#17221c] p-7 text-white md:p-9"><p className="eyebrow !text-[#d7f36b]">Seller performance</p><h1 className="mt-2 text-4xl font-black tracking-tight">Good business starts with clarity.</h1><p className="mt-3 max-w-xl text-[#c5d0c4]">A focused view of what is moving, what needs attention, and what you can do next.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-3">{metrics.map(([label, value, Icon]) => <div className="surface p-6" key={label}><div className="flex items-center justify-between"><p className="muted text-sm">{label}</p><Icon className="h-4 w-4 text-[#728749]" /></div><b className="mt-3 block text-3xl">{typeof value === 'number' && label === 'Revenue' ? `$${value.toFixed(2)}` : value}</b><p className="mt-3 text-xs font-bold text-[#6d8735]">Updated just now</p></div>)}</div><div className="surface mt-6 p-6 md:p-8"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Next best actions</p><h2 className="mt-2 text-xl font-black">Keep the momentum visible.</h2></div><Link href="/seller/analytics" className="amazon-link text-sm">See analytics →</Link></div><div className="mt-5 grid gap-3 md:grid-cols-3"><Link className="card p-4" href="/seller/products/new"><b>Add a product</b><p className="muted mt-2 text-sm">Expand your catalog.</p><ArrowRight className="mt-5 h-4 w-4 text-[#728749]" /></Link><Link className="card p-4" href="/seller/orders"><b>Review orders</b><p className="muted mt-2 text-sm">Stay ahead of fulfillment.</p><ArrowRight className="mt-5 h-4 w-4 text-[#728749]" /></Link><Link className="card p-4" href="/seller/store"><b>Improve your store</b><p className="muted mt-2 text-sm">Give buyers a reason to remember you.</p><ArrowRight className="mt-5 h-4 w-4 text-[#728749]" /></Link></div></div></div>;
}
