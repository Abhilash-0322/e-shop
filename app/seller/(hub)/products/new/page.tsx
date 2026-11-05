'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {FormField, PageHeader} from '@/components/ui';

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState<any>({title: '', price: '', listPrice: '', description: '', categorySlug: 'electronics', images: '', stock: '10'});
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/seller/products', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...form, images: form.images.split(',').map((image: string) => image.trim()).filter(Boolean)})});
    const data = await response.json();
    if (!response.ok) return toast.error(data.error);
    toast.success('Product created');
    router.push('/seller/products');
  }
  return (
    <div>
      <PageHeader eyebrow="Catalog" title="Add a product" description="Give shoppers the information they need to make a confident decision." />
      <form onSubmit={save} className="surface mt-8 max-w-3xl space-y-5 p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Product title"><input required value={form.title} onChange={event => setForm({...form, title: event.target.value})} className="input mt-2" /></FormField>
          <FormField label="Category slug"><input required value={form.categorySlug} onChange={event => setForm({...form, categorySlug: event.target.value})} className="input mt-2" /></FormField>
          <FormField label="Price"><input required type="number" min="0" step="0.01" value={form.price} onChange={event => setForm({...form, price: event.target.value})} className="input mt-2" /></FormField>
          <FormField label="List price"><input type="number" min="0" step="0.01" value={form.listPrice} onChange={event => setForm({...form, listPrice: event.target.value})} className="input mt-2" /></FormField>
          <FormField label="Stock"><input required type="number" min="0" value={form.stock} onChange={event => setForm({...form, stock: event.target.value})} className="input mt-2" /></FormField>
          <FormField label="Image URLs" hint="Separate multiple URLs with commas."><input required value={form.images} onChange={event => setForm({...form, images: event.target.value})} className="input mt-2" /></FormField>
        </div>
        <FormField label="Description"><textarea value={form.description} onChange={event => setForm({...form, description: event.target.value})} className="input mt-2 min-h-32" /></FormField>
        <div className="flex flex-wrap gap-2"><button className="btn btn-primary">Create product</button><button type="button" className="btn btn-ghost" onClick={() => router.push('/seller/products')}>Cancel</button></div>
      </form>
    </div>
  );
}
