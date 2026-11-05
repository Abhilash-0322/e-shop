'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';

export default function SellerProducts() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/seller/products').then((response) => response.json()).then((data) => setItems(data.items || []));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Catalog</p><h1 className="page-title mt-2">Products</h1></div>
        <Link href="/seller/products/new" className="btn btn-primary">Add product</Link>
      </div>
      <div className="surface table-wrap mt-8">
        <table className="w-full text-sm">
          <caption className="sr-only">Seller product catalog</caption>
          <thead className="bg-slate-50 text-left">
            <tr><th scope="col" className="p-4">Product</th><th scope="col" className="p-4">Price</th><th scope="col" className="p-4">Stock</th><th scope="col" className="p-4">Status</th><th scope="col" className="p-4"><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody>
            {items.map((item) => <tr className="border-t" key={item._id}><th scope="row" className="p-4 text-left font-bold">{item.title}</th><td className="p-4">${item.price}</td><td className="p-4">{item.stock}</td><td className="p-4"><span className="pill">Live</span></td><td className="p-4"><Link className="amazon-link rounded" href={`/seller/products/${item._id}`}>Edit <span className="sr-only">{item.title}</span></Link></td></tr>)}
          </tbody>
        </table>
        {!items.length && <p className="p-8 muted" role="status">No products yet.</p>}
      </div>
    </div>
  );
}
