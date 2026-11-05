'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AdminLayout from '../AdminLayout';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function AdminProducts() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  async function refresh(signal?: AbortSignal) {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/products?q=${encodeURIComponent(q)}`, { signal });
      const d = await r.json();
      if (!signal?.aborted) setItems(d.items || []);
    } catch {
      if (!signal?.aborted) toast.error('Products could not be loaded');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, []);

  async function del(id: string, title: string) {
    const r = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id }),
    });
    if (r.ok) {
      toast.success('Deleted');
      setDeleteTarget(null);
      refresh();
    } else toast.error('Failed');
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <div className="relative mb-3 max-w-md">
        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-amazon-textMuted" />
        <input
          className="amazon-input pl-8"
          placeholder="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && refresh()}
        />
      </div>
      <button onClick={() => refresh()} className="amazon-btn-dark !text-xs mb-4">Search</button>

      <div className="bg-white border border-amazon-border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-amazon-bg text-xs text-amazon-textMuted">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="p-6 text-center">Loading…</td></tr>}
            {!loading && items.map((p) => (
              <tr key={p._id} className="border-t border-amazon-border">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0]} alt={p.title} className="w-10 h-10 object-contain rounded border border-amazon-border" />
                    <div className="min-w-0">
                      <div className="line-clamp-1 font-medium">{p.title}</div>
                      <Link href={`/product/${p._id}`} className="text-xs text-amazon-link hover:underline">View →</Link>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-xs">{p.sellerName || p.seller}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <button onClick={() => setDeleteTarget(p)} className="text-xs text-amazon-deal hover:underline flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-sm text-amazon-textMuted">No products</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this product?"
        description={deleteTarget ? `“${deleteTarget.title}” will be removed from the catalog and will no longer be available to shoppers. This action cannot be undone.` : ''}
        confirmLabel="Delete product"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget ? del(deleteTarget._id, deleteTarget.title) : undefined}
      />
    </AdminLayout>
  );
}
