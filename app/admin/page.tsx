'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, BarChart3, Package, ShoppingBag, Store, Users } from '@/lib/icons';

export default function Admin() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/stats', { signal: controller.signal })
      .then((response) => response.json())
      .then(setData)
      .catch((error) => {
        if (error?.name !== 'AbortError') setData({});
      });
    return () => controller.abort();
  }, []);

  const stats = [
    ['Users', data?.users, Users, 'People with an account'],
    ['Products', data?.products, Package, 'Live catalog items'],
    ['Orders', data?.orders, ShoppingBag, 'Orders in motion'],
    ['Revenue', data?.revenue, BarChart3, 'Gross order value'],
    ['Pending sellers', data?.pendingSellers, Store, 'Applications to review'],
    ['Low stock', data?.lowStock, AlertTriangle, 'Needs attention'],
  ];

  return (
    <div>
      <div className="surface bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-7 text-white md:p-9"><p className="eyebrow !text-indigo-200">Operations room</p><h1 className="page-title mt-2">Platform overview</h1><p className="mt-3 max-w-xl text-indigo-100">The health of Halozon in one calm, actionable view.</p></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value, Icon, note]) => { const Component = Icon as any; return <div className="dashboard-stat" key={label as string}><div className="flex items-center justify-between"><p className="muted text-sm">{label as string}</p><Component className={`h-4 w-4 ${label === 'Low stock' ? 'text-amber-500' : 'text-indigo-500'}`} /></div><b className="mt-3 block text-2xl">{label === 'Revenue' ? `$${Number(value || 0).toFixed(2)}` : value ?? '—'}</b><small className="muted mt-2 block">{note as string}</small></div>; })}
      </div>
      <div className="surface mt-6 p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Operator shortcuts</p><h2 className="mt-2 text-xl font-black">Keep the marketplace moving.</h2></div><span className="pill">Today</span></div><div className="mt-5 grid gap-3 md:grid-cols-3"><a href="/admin/sellers" className="card p-4"><b>Review sellers</b><p className="muted mt-2 text-sm">Keep quality high as the catalog grows.</p></a><a href="/admin/products" className="card p-4"><b>Audit products</b><p className="muted mt-2 text-sm">Catch low stock and listing issues early.</p></a><a href="/admin/reviews" className="card p-4"><b>Moderate reviews</b><p className="muted mt-2 text-sm">Protect trust in every decision.</p></a></div></div>
    </div>
  );
}
