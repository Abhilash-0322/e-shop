'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Store } from '@/lib/icons';
import toast from 'react-hot-toast';

export default function Apply() {
  const [form, setForm] = useState({ storeName: '', description: '', payoutEmail: '' });
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/seller/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    toast[response.ok ? 'success' : 'error'](response.ok ? 'Application submitted' : 'Please sign in first');
  }
  return <div className="shell grid min-h-[72vh] items-center gap-8 py-12 lg:grid-cols-[1fr_1.1fr]"><div className="command-board p-8"><Store className="h-7 w-7 text-[#9af3e4]" /><p className="eyebrow mt-8 !text-[#9af3e4]">Seller onboarding</p><h1 className="mt-3 text-4xl font-black tracking-[-.05em]">Build a store people remember.</h1><p className="mt-4 text-sm leading-relaxed text-slate-300">Halozon gives independent sellers the same clear command center shoppers use.</p><div className="mt-8 space-y-3 text-xs text-slate-300"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#9af3e4]" /> Manage products and inventory</span><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#9af3e4]" /> Keep fulfillment visible</span></div></div><form onSubmit={submit} className="surface p-6 md:p-8"><p className="eyebrow">Application</p><h2 className="mt-2 text-2xl font-black">Tell us about your store.</h2><p className="muted mt-2 text-sm">You can refine the details after approval.</p><div className="mt-6 space-y-4"><label className="block text-xs font-bold">Store name<input required className="input mt-2" value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} /></label><label className="block text-xs font-bold">Store description<textarea required className="input mt-2 min-h-28" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label className="block text-xs font-bold">Payout email<input required type="email" className="input mt-2" value={form.payoutEmail} onChange={(event) => setForm({ ...form, payoutEmail: event.target.value })} /></label></div><button className="btn btn-primary mt-6 w-full">Apply to sell <ArrowRight className="h-4 w-4" /></button></form></div>;
}
