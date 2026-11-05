'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RecoveryState } from '@/components/RecoveryState';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }), signal: controller.signal });
      if (!response.ok) throw new Error('We could not start the reset flow.');
      setSent(true);
    } catch (caught: any) {
      if (caught?.name !== 'AbortError') setError(caught?.message || 'Could not start reset.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><form onSubmit={submit} className="surface w-full max-w-md space-y-4 p-8"><p className="eyebrow">Account recovery</p><h1 className="page-title mt-2">Reset your password</h1><p className="muted mt-3 text-sm">We&apos;ll send instructions if an account matches that email.</p>{sent ? <div className="rounded-xl border border-[#cde6e0] bg-[#e3f1ed] p-4 text-sm font-bold text-[#0f766e]">If the account exists, reset instructions are ready. Check your inbox and spam folder.</div> : <><label className="block text-sm font-bold">Email address<input required type="email" className="input mt-2" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>{error && <RecoveryState title="Reset link not sent" description={error} onRetry={() => document.querySelector<HTMLFormElement>('form')?.requestSubmit()} href="/help" hrefLabel="Get help" compact />}<button disabled={busy} className="btn btn-primary mt-2 w-full">{busy ? 'Sending…' : 'Send instructions'}</button></>}<Link href="/signin" className="amazon-link block text-center text-sm">Back to sign in</Link></form></div>;
}
