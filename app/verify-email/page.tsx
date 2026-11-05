'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {CheckCircle2, Lock} from '@/lib/icons';

export default function Verify() {
  const searchParams = useSearchParams();
  const [state, setState] = useState('Verifying your email...');
  useEffect(() => {
    fetch('/api/auth/verify-email', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token: searchParams.get('token')})})
      .then(response => setState(response.ok ? 'Email verified successfully.' : 'Verification link is invalid or expired.'))
      .catch(() => setState('Verification failed.'));
  }, [searchParams]);
  const success = state.includes('successfully');
  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><div className="surface w-full max-w-lg p-8 text-center md:p-10"><div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${success ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'}`}>{success ? <CheckCircle2 className="h-7 w-7" /> : <Lock className="h-6 w-6" />}</div><p className="eyebrow mt-6">Account security</p><h1 className="page-title mt-3">{state}</h1><p className="muted mt-4 text-sm">You can return to your account once verification is complete.</p></div></div>;
}
