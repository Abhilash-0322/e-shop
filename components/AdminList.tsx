'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Ban, Check, Trash2 } from '@/lib/icons';

export default function AdminList({ title, endpoint }: { title: string; endpoint: string }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal }).then((response) => response.json()).then((data) => {
      if (!controller.signal.aborted) setItems(data.items || []);
    }).catch(() => {});
    return () => controller.abort();
  }, [endpoint]);

  const kind = endpoint.split('/').pop() || '';
  async function action(item: any) {
    let method = 'DELETE';
    let body: any = {};
    if (kind === 'users') { method = 'PATCH'; body = { userId: item._id, banned: !item.banned }; }
    else if (kind === 'sellers') { method = 'PATCH'; body = { userId: item._id, approved: !item.sellerProfile?.approved }; }
    else if (kind === 'reviews') body = { productId: item.productId, reviewId: item.reviewId };
    else body = { productId: item._id };
    const response = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (response.ok) {
      setItems((current) => kind === 'users'
        ? current.map((entry) => entry._id === item._id ? { ...entry, banned: !entry.banned } : entry)
        : kind === 'sellers'
          ? current.map((entry) => entry._id === item._id ? { ...entry, sellerProfile: { ...entry.sellerProfile, approved: !entry.sellerProfile?.approved } } : entry)
          : current.filter((entry) => entry._id !== item._id));
      toast.success('Action completed');
    } else toast.error('Action failed');
  }

  return <div><p className="eyebrow">Admin console</p><div className="flex items-end justify-between gap-4"><div><h1 className="page-title mt-2">{title}</h1><p className="mt-2 text-sm muted">{items.length} record{items.length === 1 ? '' : 's'} · Review carefully before changing access.</p></div></div><div className="surface mt-6 divide-y divide-slate-100 overflow-hidden">{items.map((item) => <div className="flex items-center justify-between gap-4 p-4 sm:p-5" key={item._id || item.reviewId}><div className="min-w-0"><b className="block truncate">{item.name || item.title || item.productTitle || item.email || item._id}</b><span className="mt-1 block truncate text-sm muted">{item.body || item.status || item.role || item.sellerProfile?.storeName || ''}</span></div>{['users', 'products', 'sellers', 'reviews'].includes(kind) && <button onClick={() => action(item)} className="btn btn-soft min-h-11 min-w-11 shrink-0 px-3" aria-label={kind === 'sellers' ? 'Approve or revoke seller' : kind === 'users' ? 'Ban or unban user' : 'Remove record'}>{kind === 'sellers' ? <Check className="h-4 w-4" /> : kind === 'users' ? <Ban className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}</button>}</div>)}{!items.length && <div className="p-8 muted">No records available.</div>}</div></div>;
}
