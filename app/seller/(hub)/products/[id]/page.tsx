'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {FormField, PageHeader, SkeletonBlock} from '@/components/ui';

export default function EditProduct({params}: {params: {id: string}}) {
  const router = useRouter();
  const [form, setForm] = useState<any>();
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/products/${params.id}`, {signal: controller.signal}).then(response => response.json()).then(data => { if (!controller.signal.aborted) setForm(data.product); }).catch(() => undefined);
    return () => controller.abort();
  }, [params.id]);
  if (!form) return <div className="surface p-7"><SkeletonBlock className="h-8 w-48" /><SkeletonBlock className="mt-5 h-12 w-full" /><SkeletonBlock className="mt-3 h-32 w-full" /></div>;
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/seller/products/${params.id}`, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form)});
    toast[response.ok ? 'success' : 'error'](response.ok ? 'Product updated' : 'Update failed');
    if (response.ok) router.push('/seller/products');
  }
  async function remove() {
    if (!confirm('Delete this product?')) return;
    const response = await fetch(`/api/seller/products/${params.id}`, {method: 'DELETE'});
    if (response.ok) router.push('/seller/products'); else toast.error('Delete failed');
  }
  return (
    <div>
      <PageHeader eyebrow="Catalog" title="Edit product" description="Keep this listing accurate so shoppers know what to expect." />
      <form onSubmit={save} className="surface mt-8 max-w-3xl space-y-5 p-6 md:p-8">
        <FormField label="Product title"><input required className="input mt-2" value={form.title || ''} onChange={event => setForm({...form, title: event.target.value})} /></FormField>
        <div className="grid gap-4 sm:grid-cols-2"><FormField label="Price"><input className="input mt-2" type="number" value={form.price || 0} onChange={event => setForm({...form, price: Number(event.target.value)})} /></FormField><FormField label="Stock"><input className="input mt-2" type="number" value={form.stock || 0} onChange={event => setForm({...form, stock: Number(event.target.value)})} /></FormField></div>
        <FormField label="Description"><textarea className="input mt-2 min-h-32" value={form.description || ''} onChange={event => setForm({...form, description: event.target.value})} /></FormField>
        <div className="flex flex-wrap gap-3"><button className="btn btn-primary">Save changes</button><button type="button" onClick={remove} className="btn btn-soft text-rose-600">Delete</button></div>
      </form>
    </div>
  );
}
