'use client';

import {useEffect, useState} from 'react';
import {BarChart2} from '@/lib/icons';
import {EmptyState, PageHeader, SkeletonBlock, StatCard} from '@/components/ui';

export default function Analytics() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/seller/analytics').then(response => response.json()).then(setData).catch(() => undefined); }, []);
  const metrics = data?.metrics;
  const entries = metrics ? Object.entries(metrics) : [];
  return (
    <div>
      <PageHeader eyebrow="Performance" title="Analytics" description="See the signals behind your catalog and make the next decision with context." />
      {!metrics ? <div className="surface mt-8 space-y-3 p-7"><SkeletonBlock className="h-5 w-40" /><SkeletonBlock className="h-28 w-full" /></div> : entries.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{entries.map(([label, value]) => <StatCard key={label} label={label.replace(/([A-Z])/g, ' $1')} value={typeof value === 'number' && label.toLowerCase().includes('revenue') ? `$${value.toFixed(2)}` : String(value ?? '—')} />)}</div> : <div className="mt-8"><EmptyState title="Analytics are warming up" description="Once your storefront has activity, useful sales signals will appear here." icon={<BarChart2 className="h-8 w-8" />} /></div>}
      <div className="surface mt-6 flex items-center gap-3 p-5 text-sm text-slate-600"><BarChart2 className="h-5 w-5 text-brand-600" />Metrics update from your seller activity and order history.</div>
    </div>
  );
}
