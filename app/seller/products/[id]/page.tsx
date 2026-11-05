'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditProduct({params}: {params: {id: string}}) {
  const router = useRouter();
  const [fields, setFields] = useState<any>();
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/products/${params.id}`, {signal: controller.signal}).then((response) => response.json()).then((data) => {
      if (!controller.signal.aborted) setFields(data.product);
    }).catch(() => {});
    return () => controller.abort();
  }, [params.id]);

  if (!fields) return <div className="surface p-8" role="status">Loading product…</div>;

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch(`/api/seller/products/${params.id}`, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(fields)});
    toast[response.ok ? 'success' : 'error'](response.ok ? 'Product updated' : 'Update failed');
    if (response.ok) router.push('/seller/products');
    else setError('We could not update this product. Check the fields and try again.');
  }

  async function remove() {
    if (!confirm('Delete this product?')) return;
    const response = await fetch(`/api/seller/products/${params.id}`, {method: 'DELETE'});
    if (response.ok) router.push('/seller/products');
    else toast.error('Delete failed');
  }

  return (
    <form onSubmit={save} className="surface max-w-3xl p-8" aria-labelledby="edit-product-title">
      <p className="eyebrow">Catalog</p>
      <h1 id="edit-product-title" className="page-title mt-2">Edit product</h1>
      {error && <p className="error-text mt-4 rounded-lg bg-red-50 p-3" role="alert">{error}</p>}
      <div className="mt-8 space-y-4">
        <div><label htmlFor="edit-title" className="text-sm font-bold">Title</label><input id="edit-title" required className="input mt-2" value={fields.title || ''} onChange={(event) => setFields({...fields, title: event.target.value})} /></div>
        <div><label htmlFor="edit-price" className="text-sm font-bold">Price</label><input id="edit-price" required className="input mt-2" type="number" min="0" step="0.01" value={fields.price || 0} onChange={(event) => setFields({...fields, price: Number(event.target.value)})} /></div>
        <div><label htmlFor="edit-description" className="text-sm font-bold">Description</label><textarea id="edit-description" className="input min-h-32 mt-2" value={fields.description || ''} onChange={(event) => setFields({...fields, description: event.target.value})} /></div>
        <div><label htmlFor="edit-stock" className="text-sm font-bold">Stock</label><input id="edit-stock" required className="input mt-2" type="number" min="0" value={fields.stock || 0} onChange={(event) => setFields({...fields, stock: Number(event.target.value)})} /></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary">Save changes</button>
        <button type="button" onClick={remove} className="btn btn-soft text-rose-700">Delete product</button>
      </div>
    </form>
  );
}
