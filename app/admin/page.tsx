'use client';

import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, BarChart3, Users } from '@/lib/icons';

export default function Admin() {
  const [data, setData] = useState<any>();
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/stats', { signal: controller.signal }).then((response) => response.json()).then((value) => { if (!controller.signal.aborted) setData(value); }).catch(() => {});
    return () => controller.abort();
  }, []);
  const metrics = [['Users', data?.users], ['Products', data?.products], ['Orders', data?.orders], ['Revenue', data?.revenue], ['Pending sellers', data?.pendingSellers], ['Low stock', data?.lowStock]] as const;
  return (
    <div>
      <div className="workspace-toolbar"><div><p className="eyebrow">Operations</p><h1 className="page-title mt-2">Platform overview</h1><p className="muted mt-3 text-sm">A live read on marketplace health and the work waiting for review.</p></div><span className="hidden items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 sm:flex"><Activity className="h-4 w-4" /> Monitor online</span></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(([label, value]) => <div className="metric-card" key={label}><span className="metric-card-label">{label}</span><b className="metric-card-value">{label === 'Revenue' ? `$${Number(value || 0).toFixed(2)}` : value ?? '—'}</b></div>)}</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="surface p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Attention queue</p><h2 className="mt-2 text-xl font-black">Keep the marketplace clean.</h2></div><AlertTriangle className="h-5 w-5 text-amber-500" /></div><div className="mt-5 space-y-2 text-xs font-semibold"><a className="flex items-center justify-between rounded-lg bg-amber-50 p-3 text-amber-800" href="/admin/sellers">Review pending sellers <ArrowUpRight className="h-3.5 w-3.5" /></a><a className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-slate-700" href="/admin/reviews">Moderate recent reviews <ArrowUpRight className="h-3.5 w-3.5" /></a></div></div><div className="command-board p-6"><BarChart3 className="h-5 w-5 text-[#9af3e4]" /><p className="eyebrow mt-5 !text-[#9af3e4]">Signal quality</p><h2 className="mt-2 text-2xl font-black">Healthy, visible, actionable.</h2><p className="mt-3 text-xs leading-relaxed text-slate-300">Use the left rail to inspect the underlying users, listings, sellers, and reviews.</p><div className="mt-5 flex items-center gap-2 text-xs text-slate-300"><Users className="h-4 w-4 text-[#9af3e4]" /> Operational clarity is the feature.</div></div></div>
    </div>
  );
}
