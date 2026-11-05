'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

export default function SellerProducts() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/products', {signal: controller.signal})
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted) setItems(data.items || []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setItems([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title mt-2">Products</h1>
        </div>
        <Link href="/seller/products/new" className="btn btn-primary">Add product</Link>
      </div>
      <div className="surface mt-8 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((row) => <div className="skeleton h-12 w-full" key={row} />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item._id}>
                  <td className="p-4 font-bold">{item.title}</td>
                  <td className="p-4">${item.price}</td>
                  <td className="p-4">{item.stock}</td>
                  <td className="p-4"><span className="pill">Live</span> <Link className="amazon-link ml-2" href={`/seller/products/${item._id}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !items.length && <p className="muted p-8">No products yet.</p>}
      </div>
    </div>
  );
}
