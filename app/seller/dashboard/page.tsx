'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/analytics', {signal: controller.signal})
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
    ['Revenue', data?.metrics?.revenue || 0],
    ['Orders', data?.metrics?.orders || 0],
    ['Products', data?.metrics?.products || 0],
  ];

  return (
    <div>
      <p className="eyebrow">Seller performance</p>
      <h1 className="page-title mt-2">Good business starts with clarity.</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div className="surface p-6" key={label as string}>
            <p className="muted text-sm">{label}</p>
            {loading ? <div className="skeleton mt-3 h-9 w-24" /> : <b className="mt-2 block text-3xl">{typeof value === 'number' && label === 'Revenue' ? `$${value.toFixed(2)}` : value}</b>}
          </div>
        ))}
      </div>
      <div className="surface mt-6 p-8">
        <h2 className="text-xl font-black">Next best actions</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Link className="card p-4" href="/seller/products/new"><b>Add a product</b><p className="muted mt-2 text-sm">Expand your catalog.</p></Link>
          <Link className="card p-4" href="/seller/orders"><b>Review orders</b><p className="muted mt-2 text-sm">Stay ahead of fulfillment.</p></Link>
          <Link className="card p-4" href="/seller/analytics"><b>View analytics</b><p className="muted mt-2 text-sm">Understand what is moving.</p></Link>
        </div>
      </div>
    </div>
  );
}
