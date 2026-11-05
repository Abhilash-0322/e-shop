'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/admin/stats').then((response) => response.json()).then(setData).catch(() => {}); }, []);
  const metrics = [['Users', data?.users], ['Products', data?.products], ['Orders', data?.orders], ['Revenue', data?.revenue], ['Pending sellers', data?.pendingSellers], ['Low stock', data?.lowStock]];
  return <div><p className="eyebrow">Operations</p><h1 className="page-title mt-2">Platform overview</h1><p className="mt-3 max-w-2xl muted">A compact view of marketplace health. Select a section to make changes with context.</p><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">{metrics.map(([label, value]) => <div className="surface p-4 sm:p-5" key={label as string}><p className="text-sm font-bold text-slate-500">{label}</p><b className="mt-2 block text-2xl sm:text-3xl">{label === 'Revenue' ? `$${Number(value || 0).toFixed(2)}` : value ?? '—'}</b></div>)}</div></div>;
}
