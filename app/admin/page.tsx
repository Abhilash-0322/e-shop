'use client';

import {useEffect, useState} from 'react';
import {PageHeader, SkeletonBlock, StatCard} from '@/components/ui';

export default function Admin() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/admin/stats').then(response => response.json()).then(setData).catch(() => undefined); }, []);
  const stats = [['Users', data?.users], ['Products', data?.products], ['Orders', data?.orders], ['Revenue', data?.revenue !== undefined ? `$${Number(data.revenue || 0).toFixed(2)}` : undefined], ['Pending sellers', data?.pendingSellers], ['Low stock', data?.lowStock]];
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Platform overview" description="A quick read on the marketplace and the work that needs attention." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([label, value]) => value === undefined ? <div className="stat-card" key={label as string}><SkeletonBlock className="h-4 w-24" /><SkeletonBlock className="mt-3 h-8 w-20" /></div> : <StatCard key={label as string} label={label as string} value={value as string | number} />)}
      </div>
    </div>
  );
}
