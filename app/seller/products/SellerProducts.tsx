'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, CheckSquare, Square, AlertTriangle, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import SellerLayout from '../SellerLayout';
import toast from 'react-hot-toast';

export default function SellerProducts({ user, products }: { user: any; products: any[] }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = products.filter((p) => {
    const matchesQuery = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.sku?.toLowerCase?.().includes(q.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'low' && p.stock <= 5) ||
      (filter === 'out' && p.stock <= 0) ||
      (filter === 'healthy' && p.stock > 5);
    return matchesQuery && matchesFilter;
  });

  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selected.includes(p._id));

  function toggleAll() {
    setSelected(allVisibleSelected ? selected.filter((id) => !filtered.some((p) => p._id === id)) : Array.from(new Set([...selected, ...filtered.map((p) => p._id)])));
  }

  function toggleOne(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const r = await fetch(`/api/seller/products/${id}`, { method: 'DELETE' });
    if (r.ok) {
      toast.success('Product deleted');
      window.location.reload();
    } else {
      toast.error('Failed to delete');
    }
  }

  async function deleteSelected() {
    if (!selected.length) return;
    if (!confirm(`Delete ${selected.length} selected product${selected.length === 1 ? '' : 's'}? This cannot be undone.`)) return;
    const results = await Promise.all(selected.map((id) => fetch(`/api/seller/products/${id}`, { method: 'DELETE' })));
    if (results.every((r) => r.ok)) {
      toast.success(`${selected.length} product${selected.length === 1 ? '' : 's'} deleted`);
      window.location.reload();
    } else {
      toast.error('Some products could not be deleted');
    }
  }

  return (
    <SellerLayout user={user}>
      <div className="ops-page">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="ops-kicker">Catalog workspace</div>
          <h1 className="ops-page-title mt-1">Products</h1>
          <p className="mt-1 text-sm text-amazon-textMuted">{products.length} listings · keep your catalog accurate and in stock</p>
        </div>
        <Link href="/seller/products/new" className="amazon-btn-yellow !text-sm whitespace-nowrap">
          <Plus className="mr-1 inline h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Summary label="All listings" value={products.length} tone="neutral" />
        <Summary label="Healthy stock" value={products.filter((p) => p.stock > 5).length} tone="good" />
        <Summary label="Low stock" value={products.filter((p) => p.stock > 0 && p.stock <= 5).length} tone="warn" />
        <Summary label="Out of stock" value={products.filter((p) => p.stock <= 0).length} tone="danger" />
      </div>

      <div className="ops-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-amazon-border p-4">
          <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-amazon-textMuted" />
            <input
              className="amazon-input pl-8 !py-2"
              placeholder="Search title or SKU"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-amazon-textMuted" />
            <select className="amazon-input !w-auto !py-2 text-xs" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter products">
              <option value="all">All stock</option>
              <option value="healthy">Healthy stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
          {selected.length > 0 && (
            <button onClick={deleteSelected} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-amazon-deal/30 px-3 py-2 text-xs font-semibold text-amazon-deal hover:bg-amazon-deal/5">
              <Trash2 className="h-3.5 w-3.5" /> Delete {selected.length}
            </button>
          )}
        </div>

      {filtered.length === 0 ? (
        <div className="empty-state m-4">
          <Package className="mb-3 h-10 w-10 text-amazon-textMuted" />
          <h3 className="text-lg font-bold">{products.length ? 'No listings match your filters' : 'Your catalog is ready for its first listing'}</h3>
          <p className="mb-4 mt-1 max-w-sm text-sm text-amazon-textMuted">{products.length ? 'Try another search or reset the stock filter.' : 'Add a product with clear photos, a confident title, and accurate inventory.'}</p>
          {products.length ? <button onClick={() => { setQ(''); setFilter('all'); }} className="amazon-btn-dark inline-block">Reset filters</button> : <Link href="/seller/products/new" className="amazon-btn-yellow inline-block">Add product</Link>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-10">
                  <button onClick={toggleAll} aria-label={allVisibleSelected ? 'Deselect visible products' : 'Select visible products'}>
                    {allVisibleSelected ? <CheckSquare className="h-4 w-4 text-amazon-orange" /> : <Square className="h-4 w-4" />}
                  </button>
                </th>
                <th>Product</th>
                <th>Price</th>
                <th>Stock signal</th>
                <th>Sold</th>
                <th>Rating</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <button onClick={() => toggleOne(p._id)} aria-label={`Select ${p.title}`}>
                      {selected.includes(p._id) ? <CheckSquare className="h-4 w-4 text-amazon-orange" /> : <Square className="h-4 w-4 text-amazon-textMuted" />}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images?.[0]} alt={p.title} className="h-12 w-12 rounded-xl border border-amazon-border object-contain" />
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-medium">{p.title}</div>
                        <Link href={`/product/${p._id}`} className="text-xs text-amazon-link hover:underline">View live →</Link>
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    <StockSignal stock={p.stock} />
                  </td>
                  <td>{p.sold || 0}</td>
                  <td>{p.rating?.toFixed(1) || '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/seller/products/${p._id}`} className="text-xs text-amazon-link hover:underline flex items-center gap-1">
                        <Edit className="w-3 h-3" /> Edit
                      </Link>
                      <button onClick={() => del(p._id, p.title)} className="text-xs text-amazon-deal hover:underline flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
      </div>
    </SellerLayout>
  );
}

function Summary({ label, value, tone }: { label: string; value: number; tone: string }) {
  const tones: Record<string, string> = {
    neutral: 'text-amazon-text',
    good: 'text-amazon-greenDark',
    warn: 'text-amazon-orange',
    danger: 'text-amazon-deal',
  };
  return <div className="ops-card p-4"><div className="text-2xl font-bold">{value}</div><div className={`mt-1 text-xs font-semibold ${tones[tone]}`}>{label}</div></div>;
}

function StockSignal({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="status-pill bg-amazon-deal/10 text-amazon-deal"><AlertTriangle className="h-3 w-3" /> Out of stock</span>;
  if (stock <= 5) return <span className="status-pill bg-amazon-orange/10 text-amazon-orangedark"><AlertTriangle className="h-3 w-3" /> {stock} left</span>;
  return <span className="status-pill bg-amazon-green/10 text-amazon-greenDark"><span className="h-1.5 w-1.5 rounded-full bg-current" /> {stock} in stock</span>;
}
