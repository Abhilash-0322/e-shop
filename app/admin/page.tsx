'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Package, Users } from '@/lib/icons';

export default function Admin() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/admin/stats').then((response) => response.json()).then(setData).catch(() => {}); }, []);
  const metrics = [['Users', data?.users, Users], ['Products', data?.products, Package], ['Orders', data?.orders, BarChart3], ['Revenue', data?.revenue, BarChart3], ['Pending sellers', data?.pendingSellers, Users], ['Low stock', data?.lowStock, Package]] as const;
  return <div><div className="rounded-[1.7rem] bg-[#d7f36b] p-7 md:p-9"><p className="eyebrow !text-[#405719]">Operations / signal</p><h1 className="mt-2 text-4xl font-black tracking-tight">Platform overview.</h1><p className="mt-3 max-w-xl text-[#526239]">The high-level picture of marketplace health, ready for the next good decision.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(([label, value, Icon]) => <div className="surface p-5" key={label}><div className="flex items-center justify-between"><p className="muted text-sm font-bold">{label}</p><Icon className="h-4 w-4 text-[#728749]" /></div><b className="mt-3 block text-3xl">{label === 'Revenue' ? `$${Number(value || 0).toFixed(2)}` : value ?? '—'}</b><div className="mt-4 h-1.5 rounded-full bg-[#edf1e9]"><div className="h-full w-2/3 rounded-full bg-[#d7f36b]" /></div></div>)}</div><div className="surface mt-6 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow">Keep moving</p><h2 className="mt-2 text-xl font-black">Review the places where the signal needs attention.</h2></div><div className="flex flex-wrap gap-2"><Link href="/admin/sellers" className="btn btn-soft">Seller applications <ArrowRight className="h-4 w-4" /></Link><Link href="/admin/products" className="btn btn-primary">Catalog health <ArrowRight className="h-4 w-4" /></Link></div></div></div>;
}
