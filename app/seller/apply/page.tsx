'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Check, Store } from '@/lib/icons';

export default function Apply() {
  const [form, setForm] = useState({ storeName: '', description: '', payoutEmail: '' });
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const response = await fetch('/api/seller/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    toast[response.ok ? 'success' : 'error'](response.ok ? 'Application submitted' : 'Please sign in first');
    setBusy(false);
  }
  return <div className="shell grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-[1fr_460px]"><div className="hidden lg:block"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d7f36b] text-[#405719]"><Store className="h-6 w-6" /></span><p className="eyebrow mt-8">Sell on Halozon</p><h1 className="mt-4 max-w-xl text-6xl font-black tracking-[-.07em]">Build a store people remember.</h1><p className="muted mt-5 max-w-lg text-lg leading-relaxed">Join a marketplace designed for thoughtful commerce, with tools that help the good work show through.</p><div className="mt-8 space-y-3 text-sm font-bold text-[#526259]"><p className="flex gap-2"><Check className="h-4 w-4 text-[#728749]" /> Clear product storytelling</p><p className="flex gap-2"><Check className="h-4 w-4 text-[#728749]" /> Transparent seller tools</p><p className="flex gap-2"><Check className="h-4 w-4 text-[#728749]" /> A marketplace built for trust</p></div></div><form onSubmit={submit} className="surface p-7 md:p-8"><p className="eyebrow">Seller application</p><h2 className="mt-2 text-3xl font-black">Tell us about your store.</h2><p className="muted mt-3 text-sm">We&apos;ll review the basics and get back to you with the next step.</p><label className="mt-6 block text-sm font-bold">Store name<input required className="input mt-2" placeholder="A name customers can remember" value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} /></label><label className="mt-4 block text-sm font-bold">Store description<textarea required className="input mt-2 min-h-28" placeholder="What do you make or curate?" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label className="mt-4 block text-sm font-bold">Payout email<input required type="email" className="input mt-2" placeholder="you@yourstore.com" value={form.payoutEmail} onChange={(event) => setForm({ ...form, payoutEmail: event.target.value })} /></label><button disabled={busy} className="btn btn-primary mt-6 w-full">{busy ? 'Sending...' : 'Apply to sell'}<ArrowRight className="h-4 w-4" /></button></form></div>;
}
