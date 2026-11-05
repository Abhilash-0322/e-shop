'use client';

import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {Ban, Check, Trash2} from '@/lib/icons';
import {Dialog, EmptyState, PageHeader, SkeletonBlock, StatusBadge} from './ui';

export default function AdminList({title, endpoint}: {title: string; endpoint: string}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<any>();
  const kind = endpoint.split('/').pop() || '';

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(endpoint, {signal: controller.signal})
      .then(response => response.json())
      .then(data => { if (!controller.signal.aborted) setItems(data.items || []); })
      .catch(() => undefined)
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [endpoint]);

  async function action(item: any) {
    let method = 'DELETE';
    let body: any = {};
    if (kind === 'users') { method = 'PATCH'; body = {userId: item._id, banned: !item.banned}; }
    else if (kind === 'sellers') { method = 'PATCH'; body = {userId: item._id, approved: !item.sellerProfile?.approved}; }
    else if (kind === 'reviews') body = {productId: item.productId, reviewId: item.reviewId};
    else body = {productId: item._id};
    const response = await fetch(endpoint, {method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
    if (response.ok) {
      setItems(value => kind === 'users'
        ? value.map(entry => entry._id === item._id ? {...entry, banned: !entry.banned} : entry)
        : kind === 'sellers'
          ? value.map(entry => entry._id === item._id ? {...entry, sellerProfile: {...entry.sellerProfile, approved: !entry.sellerProfile?.approved}} : entry)
          : value.filter(entry => entry._id !== item._id));
      toast.success('Action completed');
    } else toast.error('Action failed');
    setPending(undefined);
  }

  const actionButton = (item: any) => kind === 'sellers'
    ? <Check className="h-4 w-4" />
    : kind === 'users' ? <Ban className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />;

  return (
    <div>
      <PageHeader eyebrow="Admin" title={title} description="Review records, keep standards high, and make changes with context." />
      <div className="mt-8">
        {loading ? (
          <div className="surface space-y-3 p-5">{[1, 2, 3, 4].map(item => <SkeletonBlock key={item} className="h-14 w-full" />)}</div>
        ) : items.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Record</th><th>Context</th><th>Status</th><th className="text-right">Action</th></tr></thead>
              <tbody>
                {items.map(item => {
                  const name = item.name || item.title || item.productTitle || item.email || item._id;
                  const detail = item.body || item.role || item.sellerProfile?.storeName || item.email || '';
                  const status = kind === 'users' ? (item.banned ? 'Banned' : 'Active') : kind === 'sellers' ? (item.sellerProfile?.approved ? 'Approved' : 'Pending') : item.status || 'Live';
                  return <tr key={item._id || item.reviewId}><td><b>{name}</b></td><td className="max-w-sm truncate text-slate-500">{detail}</td><td><StatusBadge value={status} /></td><td><div className="flex justify-end"><button type="button" onClick={() => setPending(item)} className="btn btn-ghost !min-h-9 !p-2" aria-label="Moderate record">{actionButton(item)}</button></div></td></tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="No records available" description="There is nothing waiting for review right now." />}
      </div>
      <Dialog open={Boolean(pending)} title={kind === 'users' ? 'Change account access?' : kind === 'sellers' ? 'Change seller approval?' : 'Remove this record?'} description="This action updates marketplace data and may affect what other people see." onClose={() => setPending(undefined)}>
        <div className="flex justify-end gap-2"><button type="button" className="btn btn-ghost" onClick={() => setPending(undefined)}>Cancel</button><button type="button" className="btn btn-primary" onClick={() => pending && action(pending)}>Confirm action</button></div>
      </Dialog>
    </div>
  );
}
