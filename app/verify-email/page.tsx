'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, RefreshCw } from '@/lib/icons';

export default function Verify() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: searchParams.get('token') }), signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('This verification link is invalid or expired.');
        setState('success');
        setMessage('Email verified successfully.');
      })
      .catch((caught: any) => {
        if (caught?.name !== 'AbortError') {
          setState('error');
          setMessage(caught?.message || 'Verification failed. Please request a fresh link.');
        }
      });
    return () => controller.abort();
  }, [searchParams]);

  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><div className="surface w-full max-w-lg p-10 text-center"><div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${state === 'success' ? 'bg-[#e3f1ed] text-[#0f766e]' : state === 'error' ? 'bg-[#fff0e9] text-[#bd4532]' : 'bg-slate-100 text-slate-500'}`}>{state === 'loading' ? <RefreshCw className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-6 w-6" />}</div><p className="eyebrow mt-6">Account security</p><h1 className="page-title mt-3">{message}</h1>{state === 'error' ? <><p className="muted mt-4 text-sm">You can request another email and keep your account recovery moving.</p><Link href="/forgot-password" className="btn btn-primary mt-6">Request a new link</Link></> : state === 'success' ? <Link href="/signin" className="btn btn-primary mt-6">Continue to sign in</Link> : <p className="muted mt-4 text-sm">This should only take a moment.</p>}</div></div>;
}
