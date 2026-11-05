'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function Verify() {
  const searchParams = useSearchParams();
  const [state, setState] = useState('Verifying your email...');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: searchParams.get('token') }), signal: controller.signal })
      .then((response) => setState(response.ok ? 'Email verified successfully.' : 'Verification link is invalid or expired.'))
      .catch(() => { if (!controller.signal.aborted) setState('Verification failed.'); });
    return () => controller.abort();
  }, [searchParams]);
  const verified = state.includes('successfully');
  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><div className="surface w-full max-w-lg p-9 text-center"><div className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${verified ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>{verified ? <CheckCircle2 className="h-6 w-6" /> : <Loader2 className="h-6 w-6 animate-spin" />}</div><p className="eyebrow mt-6">Account security</p><h1 className="page-title mt-3">{state}</h1><Link href="/signin" className="btn btn-soft mt-7">Return to sign in</Link></div></div>;
}
