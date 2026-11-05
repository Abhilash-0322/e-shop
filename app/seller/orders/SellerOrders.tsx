'use client';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import SellerLayout from '../SellerLayout';
import { Search, PackageCheck, Clock3, Truck, CheckCircle2, Filter } from 'lucide-react';

export default function SellerOrders({ user }: { user: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/seller/orders')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter((o) => {
    const matchesQuery = !q || o.orderNumber.toLowerCase().includes(q.toLowerCase());
    return matchesQuery && (statusFilter === 'all' || o.status === statusFilter);
  });
  const counts = items.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <SellerLayout user={user}>
      <div className="ops-page">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="ops-kicker">Fulfillment workspace</div>
          <h1 className="ops-page-title mt-1">Orders</h1>
          <p className="mt-1 text-sm text-amazon-textMuted">{items.length} order{items.length !== 1 ? 's' : ''} containing your products</p>
        </div>
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-amazon-textMuted" />
          <input className="amazon-input pl-8 !py-2.5" placeholder="Search order #" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QueueCard icon={PackageCheck} label="All orders" value={items.length} tone="text-amazon-text" />
        <QueueCard icon={Clock3} label="To pack" value={counts.processing || 0} tone="text-amazon-orange" />
        <QueueCard icon={Truck} label="In transit" value={(counts.shipped || 0) + (counts.out_for_delivery || 0)} tone="text-amazon-prime" />
        <QueueCard icon={CheckCircle2} label="Delivered" value={counts.delivered || 0} tone="text-amazon-greenDark" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-amazon-textMuted" />
        {['all', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${statusFilter === status ? 'bg-amazon-navy text-white' : 'bg-white text-amazon-textMuted hover:bg-amazon-panel'}`}
          >
            {status === 'all' ? 'All' : status.replaceAll('_', ' ')} {status !== 'all' && <span className="ml-1 opacity-70">{counts[status] || 0}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="shimmer-bg h-56 rounded-2xl" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <PackageCheck className="mb-3 h-10 w-10 text-amazon-textMuted" />
          <h2 className="font-semibold">{items.length ? 'No orders match this view' : 'Your fulfillment queue is clear'}</h2>
          <p className="mt-1 max-w-sm text-sm text-amazon-textMuted">{items.length ? 'Try another status or search term.' : 'When a customer orders one of your products, the order and its items will appear here.'}</p>
          {items.length > 0 && <button onClick={() => { setQ(''); setStatusFilter('all'); }} className="amazon-btn-dark mt-4 !text-xs">Reset filters</button>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o._id} className="ops-card p-4 sm:p-5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs mb-3">
                <div>
                  <div className="text-amazon-textMuted">ORDER</div>
                  <div className="font-bold">{o.orderNumber}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">DATE</div>
                  <div>{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">YOUR ITEMS</div>
                  <div>{o.myItems?.length || 0}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">YOUR TOTAL</div>
                  <div className="font-bold text-amazon-orange">{formatPrice(o.myTotal || 0)}</div>
                </div>
                <div>
                  <div className="text-amazon-textMuted">FULFILLMENT</div>
                  <Status status={o.status} />
                </div>
              </div>
              <div className="space-y-1">
                {(o.myItems || []).map((it: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm border-t border-amazon-border pt-1 first:border-0 first:pt-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.image} alt={it.title} className="w-10 h-10 object-contain bg-white rounded" />
                    <div className="flex-1 min-w-0 line-clamp-1">{it.title}</div>
                    <div className="text-xs text-amazon-textMuted">×{it.qty}</div>
                    <div className="font-bold">{formatPrice(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </SellerLayout>
  );
}

function QueueCard({ icon: Icon, label, value, tone }: any) {
  return <div className="ops-card flex items-center gap-3 p-4"><Icon className={`h-5 w-5 ${tone}`} /><div><div className="text-xl font-bold">{value}</div><div className="text-xs text-amazon-textMuted">{label}</div></div></div>;
}

function Status({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: 'bg-amazon-orange/10 text-amazon-orangedark',
    shipped: 'bg-amazon-prime/10 text-amazon-prime',
    out_for_delivery: 'bg-amazon-prime/10 text-amazon-prime',
    delivered: 'bg-amazon-green/10 text-amazon-greenDark',
  };
  return <span className={`status-pill ${styles[status] || 'bg-amazon-panel text-amazon-textMuted'}`}>{status.replaceAll('_', ' ')}</span>;
}
