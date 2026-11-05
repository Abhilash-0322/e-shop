'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<any>();
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setState('loading');
    try {
      const response = await fetch('/api/seller/analytics');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load seller analytics');
      setData(result);
      setState('ready');
    } catch (err: any) {
      setError(err.message || 'Could not load seller analytics');
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <p className="eyebrow">Seller performance</p>
      <h1 className="page-title mt-2">Good business starts with clarity.</h1>
      {state === 'loading' && (
        <div className="grid sm:grid-cols-3 gap-4 mt-8 animate-pulse">
          {[1, 2, 3].map((item) => (
            <div className="surface p-6" key={item}>
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-8 w-16 rounded bg-slate-200 mt-3" />
            </div>
          ))}
        </div>
      )}
      {state === 'error' && (
        <div className="surface border-rose-200 bg-rose-50 p-8 mt-8 text-center" role="alert">
          <p className="font-bold text-rose-900">Seller analytics are unavailable.</p>
          <p className="text-sm text-rose-800/75 mt-2">{error}</p>
          <button type="button" onClick={load} className="btn btn-soft mt-5">
            Try again
          </button>
        </div>
      )}
      {state === 'ready' && (
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            ['Revenue', data?.metrics?.revenue || 0],
            ['Orders', data?.metrics?.orders || 0],
            ['Products', data?.metrics?.products || 0],
          ].map(([label, value]) => (
            <div className="surface p-6" key={label as string}>
              <p className="muted text-sm">{label as string}</p>
              <b className="text-3xl block mt-2">
                {typeof value === 'number' && label === 'Revenue' ? `$${value.toFixed(2)}` : value as any}
              </b>
            </div>
          ))}
        </div>
      )}
      <div className="surface p-8 mt-6">
        <h2 className="text-xl font-black">Next best actions</h2>
        <div className="grid md:grid-cols-3 gap-3 mt-5">
          <Link className="card p-4" href="/seller/products/new">
            <b>Add a product</b>
            <p className="muted text-sm mt-2">Expand your catalog.</p>
          </Link>
          <Link className="card p-4" href="/seller/orders">
            <b>Review orders</b>
            <p className="muted text-sm mt-2">Stay ahead of fulfillment.</p>
          </Link>
          <Link className="card p-4" href="/seller/analytics">
            <b>View analytics</b>
            <p className="muted text-sm mt-2">Understand what is moving.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
