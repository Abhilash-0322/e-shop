'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {EmptyState, PageHeader, SkeletonBlock, StatusBadge} from '@/components/ui';

export default function SellerProducts() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/seller/products').then(response => response.json()).then(data => setItems(data.items || [])).catch(() => undefined).finally(() => setLoading(false)); }, []);
  return (
    <div>
      <PageHeader eyebrow="Catalog" title="Products" description="Keep your assortment fresh, easy to understand, and ready to ship." actions={<Link href="/seller/products/new" className="btn btn-primary">Add product</Link>} />
      <div className="mt-8">
        {loading ? <div className="surface space-y-3 p-5">{[1, 2, 3].map(item => <SkeletonBlock key={item} className="h-14 w-full" />)}</div> : items.length ? (
          <div className="table-wrap"><table className="data-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead><tbody>{items.map(item => <tr key={item._id}><td><b>{item.title}</b><span className="muted mt-1 block text-xs">{item.brand || item.categorySlug || 'Marketplace listing'}</span></td><td>${Number(item.price || 0).toFixed(2)}</td><td>{item.stock}</td><td><StatusBadge value={item.stock > 0 ? 'Live' : 'Low stock'} /></td><td className="text-right"><Link className="btn btn-ghost !min-h-9 !px-3 text-xs" href={`/seller/products/${item._id}`}>Edit</Link></td></tr>)}</tbody></table></div>
        ) : <EmptyState title="No products yet" description="Add your first listing to start building your storefront." action={<Link href="/seller/products/new" className="btn btn-primary">Add product</Link>} />}
      </div>
    </div>
  );
}
