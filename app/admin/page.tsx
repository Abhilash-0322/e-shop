'use client';

import { useCallback, useEffect, useState } from 'react';

export default function Admin() {
  const [data, setData] = useState<any>();
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setState('loading');
    try {
      const response = await fetch('/api/admin/stats');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load platform stats');
      setData(result);
      setState('ready');
    } catch (err: any) {
      setError(err.message || 'Could not load platform stats');
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <p className="eyebrow">Operations</p>
      <h1 className="page-title mt-2">Platform overview</h1>
      {state === 'loading' && (
        <div className="grid sm:grid-cols-3 gap-4 mt-8 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="surface p-5" key={item}>
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-8 w-16 rounded bg-slate-200 mt-3" />
            </div>
          ))}
        </div>
      )}
      {state === 'error' && (
        <div className="surface border-rose-200 bg-rose-50 p-8 mt-8 text-center" role="alert">
          <p className="font-bold text-rose-900">Platform stats are unavailable.</p>
          <p className="text-sm text-rose-800/75 mt-2">{error}</p>
          <button type="button" onClick={load} className="btn btn-soft mt-5">
            Try again
          </button>
        </div>
      )}
      {state === 'ready' && (
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            ['Users', data?.users],
            ['Products', data?.products],
            ['Orders', data?.orders],
            ['Revenue', data?.revenue],
            ['Pending sellers', data?.pendingSellers],
            ['Low stock', data?.lowStock],
          ].map(([label, value]) => (
            <div className="surface p-5" key={label as string}>
              <p className="muted text-sm">{label as string}</p>
              <b className="text-2xl mt-2 block">
                {label === 'Revenue' ? `$${Number(value || 0).toFixed(2)}` : value ?? '—'}
              </b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
