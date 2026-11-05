'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Ban, Check, Trash2 } from '@/lib/icons';

type RequestState = 'loading' | 'ready' | 'error';

export default function AdminList({ title, endpoint }: { title: string; endpoint: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [state, setState] = useState<RequestState>('loading');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const kind = endpoint.split('/').pop() || '';

  const load = useCallback(async (signal?: AbortSignal) => {
    setState('loading');
    try {
      const response = await fetch(endpoint, { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load records');
      setItems(Array.isArray(data.items) ? data.items : []);
      setState('ready');
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setError(err.message || 'Could not load records');
      setState('error');
    }
  }, [endpoint]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function action(item: any) {
    setBusyId(item._id || item.reviewId);
    let method = 'DELETE';
    let body: any = {};
    if (kind === 'users') {
      method = 'PATCH';
      body = { userId: item._id, banned: !item.banned };
    } else if (kind === 'sellers') {
      method = 'PATCH';
      body = { userId: item._id, approved: !item.sellerProfile?.approved };
    } else if (kind === 'reviews') {
      body = { productId: item.productId, reviewId: item.reviewId };
    } else {
      body = { productId: item._id };
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Action failed');
      setItems((current) =>
        kind === 'users'
          ? current.map((value) => (value._id === item._id ? { ...value, banned: !value.banned } : value))
          : kind === 'sellers'
            ? current.map((value) =>
                value._id === item._id
                  ? { ...value, sellerProfile: { ...value.sellerProfile, approved: !value.sellerProfile?.approved } }
                  : value,
              )
            : current.filter((value) => value._id !== item._id),
      );
      toast.success('Action completed');
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1 className="page-title mt-2">{title}</h1>
      {state === 'loading' && (
        <div className="surface mt-8 p-8 animate-pulse">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-4 w-2/3 rounded bg-slate-100 mt-4" />
          <div className="h-4 w-1/2 rounded bg-slate-100 mt-3" />
        </div>
      )}
      {state === 'error' && (
        <div className="surface border-rose-200 bg-rose-50 mt-8 p-8 text-center" role="alert">
          <p className="font-bold text-rose-900">We couldn&apos;t load this list.</p>
          <p className="text-sm text-rose-800/75 mt-2">{error}</p>
          <button type="button" onClick={() => load()} className="btn btn-soft mt-5">
            Try again
          </button>
        </div>
      )}
      {state === 'ready' && (
        <div className="surface mt-8 divide-y">
          {items.map((item) => {
            const id = item._id || item.reviewId;
            return (
              <div className="p-4 flex items-center justify-between gap-4" key={id}>
                <div>
                  <b>{item.name || item.title || item.productTitle || item.email || id}</b>
                  <span className="muted text-sm block mt-1">
                    {item.body || item.status || item.role || item.sellerProfile?.storeName || ''}
                  </span>
                </div>
                {['users', 'products', 'sellers', 'reviews'].includes(kind) && (
                  <button
                    onClick={() => action(item)}
                    disabled={busyId === id}
                    className="btn btn-soft !p-2"
                    aria-label="Moderate"
                  >
                    {kind === 'sellers' ? (
                      <Check className="w-4 h-4" />
                    ) : kind === 'users' ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
          {!items.length && <div className="p-8 text-center muted">No records available.</div>}
        </div>
      )}
    </div>
  );
}
