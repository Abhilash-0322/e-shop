'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { RecoveryState } from '@/components/RecoveryState';

export default function AuthForm({ mode }: { mode: 'signin' | 'register' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const draftKey = `halozon-auth-${mode}`;

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(draftKey);
      if (saved) {
        const draft = JSON.parse(saved);
        setName(draft.name || '');
        setEmail(draft.email || '');
      }
    } catch {
      // A stale draft should not prevent authentication.
    }
    return () => request.current?.abort();
  }, [draftKey]);

  useEffect(() => {
    if (email || name) window.sessionStorage.setItem(draftKey, JSON.stringify({ name, email }));
  }, [draftKey, email, name]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'signin' ? { email, password } : { name, email, password }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Authentication could not be completed.');
      window.sessionStorage.removeItem(draftKey);
      toast.success(mode === 'signin' ? 'Welcome back' : 'Account created');
      const requested = searchParams.get('redirect') || '/';
      const destination = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';
      router.push(destination);
      router.refresh();
    } catch (caught: any) {
      if (caught?.name !== 'AbortError') setError(caught?.message || 'Something went wrong. Your details are still here.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return (
    <form ref={form} onSubmit={submit} className="surface w-full max-w-md space-y-4 p-8 md:p-9">
      <div><p className="eyebrow">Halozon account</p><h1 className="mt-2 text-3xl font-black">{mode === 'signin' ? 'Welcome back' : 'Start your journey'}</h1><p className="muted mt-2 text-sm">{mode === 'signin' ? 'Pick up where you left off.' : 'Save lists, track orders, and shop faster.'}</p></div>
      {error && <RecoveryState title="We could not sign you in" description={`${error} Your form is still filled in, so you can retry without starting over.`} onRetry={() => form.current?.requestSubmit()} href="/help" hrefLabel="Get account help" compact />}
      <div data-auth-form>
        {mode === 'register' && <label className="block text-sm font-bold">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="input mt-2" autoComplete="name" /></label>}
        <label className="mt-4 block text-sm font-bold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" autoComplete="email" /></label>
        <label className="mt-4 block text-sm font-bold">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></label>
      </div>
      {mode === 'signin' && <Link href="/forgot-password" className="amazon-link block text-sm">Forgot password?</Link>}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      <p className="muted text-center text-sm">{mode === 'signin' ? <>New to Halozon? <Link className="amazon-link" href="/register">Create an account</Link></> : <>Already have an account? <Link className="amazon-link" href="/signin">Sign in</Link></>}</p>
    </form>
  );
}
