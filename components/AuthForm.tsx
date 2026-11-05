'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, Sparkles } from '@/lib/icons';
import toast from 'react-hot-toast';

export default function AuthForm({ mode }: { mode: 'signin' | 'register' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      router.push(searchParams.get('redirect') || '/');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface w-full max-w-md p-6 md:p-8">
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-indigo-600"><Sparkles className="h-3.5 w-3.5" /> Halozon identity</div>
        <h1 className="text-3xl font-black tracking-[-.05em]">{mode === 'signin' ? 'Welcome back' : 'Start your journey'}</h1>
        <p className="muted mt-2 text-sm">{mode === 'signin' ? 'Pick up where you left off.' : 'Save lists, track orders, and shop with more control.'}</p>
      </div>
      <div className="mb-5 space-y-2 text-xs text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Faster checkout and order visibility</span><span className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-emerald-600" /> Protected account session</span></div>
      <div className="space-y-4">
        {mode === 'register' && <label className="block text-xs font-bold">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="input mt-2" /></label>}
        <label className="block text-xs font-bold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" /></label>
        <label className="block text-xs font-bold">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2" /></label>
      </div>
      {mode === 'signin' && <Link href="/forgot-password" className="mt-3 inline-block text-xs font-bold text-indigo-600">Forgot password?</Link>}
      <button disabled={busy} className="btn btn-primary mt-5 w-full">{busy ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'}<ArrowRight className="h-4 w-4" /></button>
      <p className="muted mt-5 text-center text-xs">{mode === 'signin' ? <>New to Halozon? <Link className="font-bold text-indigo-600" href="/register">Create an account</Link></> : <>Already have an account? <Link className="font-bold text-indigo-600" href="/signin">Sign in</Link></>}</p>
    </form>
  );
}
