'use client';

import Link from 'next/link';
import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import toast from 'react-hot-toast';

export default function AuthForm({mode}: {mode: 'signin' | 'register'}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(mode === 'signin' ? {email, password} : {name, email, password}),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      toast.success(mode === 'signin' ? 'Welcome back' : 'Account created');
      router.push(searchParams.get('redirect') || '/');
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Something went wrong';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  const title = mode === 'signin' ? 'Welcome back' : 'Start your journey';

  return (
    <form onSubmit={submit} className="surface w-full max-w-md space-y-4 p-8" aria-labelledby="auth-title">
      <div>
        <p className="eyebrow">Halozon account</p>
        <h1 id="auth-title" className="mt-2 text-3xl font-black">{title}</h1>
        <p className="mt-2 text-sm muted">{mode === 'signin' ? 'Pick up where you left off.' : 'Save lists, track orders, and shop faster.'}</p>
      </div>
      {error && <p className="error-text rounded-lg bg-red-50 p-3" role="alert">{error}</p>}
      {mode === 'register' && (
        <div>
          <label htmlFor="auth-name" className="block text-sm font-bold">Full name</label>
          <input id="auth-name" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="input mt-2" />
        </div>
      )}
      <div>
        <label htmlFor="auth-email" className="block text-sm font-bold">Email</label>
        <input id="auth-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2" aria-invalid={Boolean(error)} />
      </div>
      <div>
        <label htmlFor="auth-password" className="block text-sm font-bold">Password</label>
        <input id="auth-password" required minLength={6} type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2" aria-invalid={Boolean(error)} />
        {mode === 'register' && <p className="mt-1 text-xs muted">Use at least 6 characters.</p>}
      </div>
      {mode === 'signin' && <Link href="/forgot-password" className="amazon-link text-sm">Forgot password?</Link>}
      <button type="submit" disabled={busy} className="btn btn-primary w-full" aria-busy={busy}>{busy ? 'Working…' : title}</button>
      <p className="text-center text-sm muted">
        {mode === 'signin'
          ? <>New to Halozon? <Link className="amazon-link" href="/register">Create an account</Link></>
          : <>Already have an account? <Link className="amazon-link" href="/signin">Sign in</Link></>}
      </p>
    </form>
  );
}
