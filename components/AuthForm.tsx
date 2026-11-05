'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowRight, Check, ShieldCheck } from '@/lib/icons';

export default function AuthForm({ mode }: { mode: 'signin' | 'register' }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mode === 'signin' ? { email, password } : { name, email, password }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      toast.success(mode === 'signin' ? 'Welcome back' : 'Account created');
      router.push(sp.get('redirect') || '/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface w-full max-w-md p-7 md:p-8">
      <div className="mb-7"><span className="hz-logo-mark">H</span><p className="eyebrow mt-6">Halozon account</p><h1 className="mt-2 text-3xl font-black tracking-tight">{mode === 'signin' ? 'Welcome back.' : 'Start your journey.'}</h1><p className="muted mt-2 text-sm">{mode === 'signin' ? 'Pick up where you left off.' : 'Save lists, track orders, and shop faster.'}</p></div>
      <div className="space-y-4">{mode === 'register' && <label className="block text-sm font-bold">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="input mt-2" /></label>}<label className="block text-sm font-bold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" /></label><label className="block text-sm font-bold">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2" /></label></div>
      {mode === 'signin' && <Link href="/forgot-password" className="amazon-link mt-4 block text-sm">Forgot password?</Link>}
      <button disabled={busy} className="btn btn-primary mt-6 w-full">{busy ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'}<ArrowRight className="h-4 w-4" /></button>
      <div className="mt-6 grid gap-2 border-t border-[#dfe5dc] pt-5 text-xs font-bold text-[#526259]"><span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#728749]" /> Protected account and order history</span><span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#728749]" /> Buyer protection included</span></div>
      <p className="muted mt-6 text-center text-sm">{mode === 'signin' ? <>New to Halozon? <Link className="amazon-link" href="/register">Create an account</Link></> : <>Already have an account? <Link className="amazon-link" href="/signin">Sign in</Link></>}</p>
    </form>
  );
}
