'use client';

import {useEffect, useState} from 'react';
import {EmptyState, PageHeader, SkeletonBlock, StatusBadge} from '@/components/ui';
import {ShoppingBag} from '@/lib/icons';

export default function SellerOrders() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/seller/orders').then(response => response.json()).then(data => setItems(data.items || [])).catch(() => undefined).finally(() => setLoading(false)); }, []);
  return (
    <div>
      <PageHeader eyebrow="Fulfillment" title="Orders" description="Stay ahead of what needs to be packed, shipped, and supported." />
      <div className="mt-8">
        {loading ? <div className="surface space-y-3 p-5">{[1, 2, 3].map(item => <SkeletonBlock key={item} className="h-14 w-full" />)}</div> : items.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Order</th><th>Items</th><th>Value</th><th>Status</th></tr></thead><tbody>{items.map(item => <tr key={item._id}><td><b>{item.orderNumber || item._id}</b><span className="muted mt-1 block text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent order'}</span></td><td>{item.items?.length || 0}</td><td>${Number(item.total || 0).toFixed(2)}</td><td><StatusBadge value={item.status || 'Pending'} /></td></tr>)}</tbody></table></div> : <EmptyState title="No seller orders yet" description="Orders will appear here as customers purchase from your storefront." icon={<ShoppingBag className="h-8 w-8" />} />}
      </div>
    </div>
  );
}
