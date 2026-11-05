'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RecoveryState } from '@/components/RecoveryState';

export default function Reset() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
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
      const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: searchParams.get('token'), password }), signal: controller.signal });
      if (!response.ok) throw new Error('This reset link is invalid or expired.');
      setDone(true);
    } catch (caught: any) {
      if (caught?.name !== 'AbortError') setError(caught?.message || 'Could not update your password.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><form onSubmit={submit} className="surface w-full max-w-md space-y-4 p-8"><p className="eyebrow">Account recovery</p><h1 className="page-title mt-2">Choose a new password</h1>{done ? <><div className="rounded-xl border border-[#cde6e0] bg-[#e3f1ed] p-4 text-sm font-bold text-[#0f766e]">Password updated. You can sign in with your new password now.</div><Link href="/signin" className="btn btn-primary w-full">Continue to sign in</Link></> : <><label className="block text-sm font-bold">New password<input required minLength={6} type="password" className="input mt-2" placeholder="At least 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label>{error && <RecoveryState title="Password not updated" description={error} onRetry={() => document.querySelector<HTMLFormElement>('form')?.requestSubmit()} href="/forgot-password" hrefLabel="Request a new link" compact />}<button disabled={busy} className="btn btn-primary w-full">{busy ? 'Updating…' : 'Update password'}</button></>}</form></div>;
}
