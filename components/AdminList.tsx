'use client';

import { useEffect, useState } from 'react';
import { Ban, Check, Trash2 } from '@/lib/icons';
import toast from 'react-hot-toast';

export default function AdminList({ title, endpoint }: { title: string; endpoint: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(endpoint, { signal: controller.signal }).then((response) => response.json()).then((data) => { if (!controller.signal.aborted) setItems(data.items || []); }).catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, [endpoint]);
  const kind = endpoint.split('/').pop() || '';
  async function action(item: any) {
    let method = 'DELETE';
    let body: any = {};
    if (kind === 'users') { method = 'PATCH'; body = { userId: item._id, banned: !item.banned }; } else if (kind === 'sellers') { method = 'PATCH'; body = { userId: item._id, approved: !item.sellerProfile?.approved }; } else if (kind === 'reviews') body = { productId: item.productId, reviewId: item.reviewId }; else body = { productId: item._id };
    const response = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (response.ok) { setItems((current) => kind === 'users' ? current.map((value) => value._id === item._id ? { ...value, banned: !value.banned } : value) : kind === 'sellers' ? current.map((value) => value._id === item._id ? { ...value, sellerProfile: { ...value.sellerProfile, approved: !value.sellerProfile?.approved } } : value) : current.filter((value) => value._id !== item._id)); toast.success('Action completed'); } else toast.error('Action failed');
  }
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Admin / {kind}</p><h1 className="page-title mt-2">{title}</h1><p className="muted mt-3">Keep the marketplace healthy with clear, reversible actions.</p></div><span className="pill">{items.length} records</span></div><div className="surface mt-8 overflow-hidden">{loading ? <div className="space-y-3 p-6">{[1, 2, 3].map((value) => <div className="h-14 animate-pulse rounded-xl bg-[#edf1e9]" key={value} />)}</div> : <div className="divide-y divide-[#dfe5dc]">{items.map((item) => <div className="flex items-center justify-between gap-4 p-4 md:p-5" key={item._id || item.reviewId}><div className="min-w-0"><b className="block truncate">{item.name || item.title || item.productTitle || item.email || item._id}</b><span className="muted mt-1 block truncate text-sm">{item.body || item.status || item.role || item.sellerProfile?.storeName || ''}</span></div>{['users', 'products', 'sellers', 'reviews'].includes(kind) && <button onClick={() => action(item)} className="btn btn-soft !p-2" aria-label="Moderate record">{kind === 'sellers' ? <Check className="h-4 w-4" /> : kind === 'users' ? <Ban className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}</button>}</div>)}{!items.length && <div className="p-10 text-center"><p className="muted">No records available.</p></div>}</div>}</div></div>;
}
