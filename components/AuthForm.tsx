'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AuthForm({mode}: {mode: 'signin' | 'register'}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const request = useRef<AbortController | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => () => request.current?.abort(), []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(mode === 'signin' ? {email, password} : {name, email, password}),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      toast.success(mode === 'signin' ? 'Welcome back' : 'Account created');
      router.push(searchParams.get('redirect') || '/');
      router.refresh();
    } catch (error: any) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) toast.error(error.message || 'Something went wrong');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface w-full max-w-md space-y-4 p-8">
      <div>
        <p className="eyebrow">Halozon account</p>
        <h1 className="mt-2 text-3xl font-black">{mode === 'signin' ? 'Welcome back' : 'Start your journey'}</h1>
        <p className="muted mt-2 text-sm">{mode === 'signin' ? 'Pick up where you left off.' : 'Save lists, track orders, and shop faster.'}</p>
      </div>
      {mode === 'register' && <label className="block text-sm font-bold">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="input mt-2" /></label>}
      <label className="block text-sm font-bold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" /></label>
      <label className="block text-sm font-bold">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2" /></label>
      {mode === 'signin' && <Link href="/forgot-password" className="amazon-link text-sm">Forgot password?</Link>}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      <p className="muted text-center text-sm">
        {mode === 'signin' ? <>New to Halozon? <Link className="amazon-link" href="/register">Create an account</Link></> : <>Already have an account? <Link className="amazon-link" href="/signin">Sign in</Link></>}
      </p>
    </form>
  );
}
