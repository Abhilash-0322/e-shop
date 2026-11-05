'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AuthForm({ mode }: { mode: 'signin' | 'register' }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      const r = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mode === 'signin' ? { email, password } : { name, email, password }) });
      const d = await r.json(); if (!r.ok) throw Error(d.error);
      toast.success(mode === 'signin' ? 'Welcome back' : 'Account created'); router.push(sp.get('redirect') || '/'); router.refresh();
    } catch (e: any) { toast.error(e.message || 'Something went wrong'); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="surface w-full max-w-md space-y-4 p-8"><div><p className="eyebrow">Halozon account / auth</p><h1 className="mt-2 text-3xl font-black uppercase">{mode === 'signin' ? 'Welcome back' : 'Start your journey'}</h1><p className="muted mt-2 text-sm">{mode === 'signin' ? 'Pick up where you left off.' : 'Save lists, track orders, and shop faster.'}</p></div>{mode === 'register' && <label className="block text-sm font-black uppercase">Full name<input required value={name} onChange={(e) => setName(e.target.value)} className="input mt-2" /></label>}<label className="block text-sm font-black uppercase">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-2" /></label><label className="block text-sm font-black uppercase">Password<input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-2" /></label>{mode === 'signin' && <Link href="/forgot-password" className="amazon-link text-sm">Forgot password?</Link>}<button disabled={busy} className="btn btn-primary w-full">{busy ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'}</button><p className="muted text-center text-sm">{mode === 'signin' ? <>New to Halozon? <Link className="amazon-link" href="/register">Create an account</Link></> : <>Already have an account? <Link className="amazon-link" href="/signin">Sign in</Link></>}</p></form>;
}
