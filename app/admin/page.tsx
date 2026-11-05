'use client';

import {useEffect, useState} from 'react';

export default function Admin() {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/stats', {signal: controller.signal})
      .then((response) => response.json())
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const metrics = [
    ['Users', data?.users],
    ['Products', data?.products],
    ['Orders', data?.orders],
    ['Revenue', data?.revenue],
    ['Pending sellers', data?.pendingSellers],
    ['Low stock', data?.lowStock],
  ];

  return (
    <div>
      <p className="eyebrow">Operations</p>
      <h1 className="page-title mt-2">Platform overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div className="surface p-5" key={label as string}>
            <p className="muted text-sm">{label}</p>
            {loading ? <div className="skeleton mt-3 h-8 w-20" /> : <b className="mt-2 block text-2xl">{label === 'Revenue' ? `$${Number(value || 0).toFixed(2)}` : value ?? '—'}</b>}
          </div>
        ))}
      </div>
    </div>
  );
}
