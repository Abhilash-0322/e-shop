'use client';

import {useEffect, useState} from 'react';
import {Ban, Check, Trash2} from '@/lib/icons';
import toast from 'react-hot-toast';

export default function AdminList({title, endpoint}: {title: string; endpoint: string}) {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(endpoint, {signal: controller.signal}).then((response) => response.json()).then((data) => {
      if (!controller.signal.aborted) setItems(data.items || []);
    }).catch(() => {});
    return () => controller.abort();
  }, [endpoint]);

  const kind = endpoint.split('/').pop() || '';

  async function action(item: any) {
    let method = 'DELETE';
    let body: any = {};
    if (kind === 'users') { method = 'PATCH'; body = {userId: item._id, banned: !item.banned}; }
    else if (kind === 'sellers') { method = 'PATCH'; body = {userId: item._id, approved: !item.sellerProfile?.approved}; }
    else if (kind === 'reviews') body = {productId: item.productId, reviewId: item.reviewId};
    else body = {productId: item._id};
    const response = await fetch(endpoint, {method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
    if (response.ok) {
      setItems((current) => kind === 'users'
        ? current.map((entry) => entry._id === item._id ? {...entry, banned: !entry.banned} : entry)
        : kind === 'sellers'
          ? current.map((entry) => entry._id === item._id ? {...entry, sellerProfile: {...entry.sellerProfile, approved: !entry.sellerProfile?.approved}} : entry)
          : current.filter((entry) => entry._id !== item._id));
      setStatus('Action completed.');
      toast.success('Action completed');
    } else {
      setStatus('Action failed.');
      toast.error('Action failed');
    }
  }

  const actionLabel = kind === 'sellers' ? 'Approve seller' : kind === 'users' ? 'Ban or unban user' : `Remove ${kind.slice(0, -1)}`;

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1 className="page-title mt-2">{title}</h1>
      {status && <p className="mt-3 text-sm muted" role="status">{status}</p>}
      <div className="surface mt-8 divide-y" aria-label={title}>
        {items.map((item) => (
          <div className="flex items-center justify-between gap-4 p-4" key={item._id || item.reviewId}>
            <div>
              <b>{item.name || item.title || item.productTitle || item.email || item._id}</b>
              <span className="block mt-1 text-sm muted">{item.body || item.status || item.role || item.sellerProfile?.storeName || ''}</span>
            </div>
            {['users', 'products', 'sellers', 'reviews'].includes(kind) && <button type="button" onClick={() => action(item)} className="btn btn-soft !p-2" aria-label={`${actionLabel}: ${item.name || item.title || item.email || item._id}`}>{kind === 'sellers' ? <Check className="h-4 w-4" aria-hidden="true" /> : kind === 'users' ? <Ban className="h-4 w-4" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}</button>}
          </div>
        ))}
        {!items.length && <div className="p-8 muted" role="status">No records available.</div>}
      </div>
    </div>
  );
}
