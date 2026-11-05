'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<any>();
  useEffect(() => { const controller = new AbortController(); fetch(`/api/products/${params.id}`, { signal: controller.signal }).then((response) => response.json()).then((data) => { if (!controller.signal.aborted) setForm(data.product); }).catch(() => {}); return () => controller.abort(); }, [params.id]);
  if (!form) return <div className="surface animate-pulse p-8">Loading product...</div>;
  async function save(event: React.FormEvent) { event.preventDefault(); const response = await fetch(`/api/seller/products/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); toast[response.ok ? 'success' : 'error'](response.ok ? 'Product updated' : 'Update failed'); if (response.ok) router.push('/seller/products'); }
  async function remove() { if (!confirm('Delete this product?')) return; const response = await fetch(`/api/seller/products/${params.id}`, { method: 'DELETE' }); if (response.ok) router.push('/seller/products'); else toast.error('Delete failed'); }
  return <form onSubmit={save} className="surface max-w-3xl p-7 md:p-9"><button type="button" onClick={() => router.push('/seller/products')} className="amazon-link flex items-center gap-2 text-sm"><ArrowLeft className="h-3.5 w-3.5" /> Back to products</button><p className="eyebrow mt-8">Catalog / edit</p><h1 className="page-title mt-2">Keep the details sharp.</h1><div className="mt-8 space-y-4"><label className="block text-sm font-bold">Title<input className="input mt-2" value={form.title || ''} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Price<input className="input mt-2" type="number" value={form.price || 0} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} /></label><label className="block text-sm font-bold">Stock<input className="input mt-2" type="number" value={form.stock || 0} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} /></label></div><label className="block text-sm font-bold">Description<textarea className="input mt-2 min-h-32" value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label></div><div className="mt-7 flex flex-wrap gap-3"><button className="btn btn-primary"><Save className="h-4 w-4" /> Save changes</button><button type="button" onClick={remove} className="btn btn-soft text-[#ff765c]"><Trash2 className="h-4 w-4" /> Delete</button></div></form>;
}
