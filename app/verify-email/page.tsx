'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck } from '@/lib/icons';

export default function Verify() {
  const searchParams = useSearchParams();
  const [state, setState] = useState('Verifying your email...');
  useEffect(() => { fetch('/api/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: searchParams.get('token') }) }).then((response) => setState(response.ok ? 'Email verified successfully.' : 'Verification link is invalid or expired.')).catch(() => setState('Verification failed.')); }, [searchParams]);
  const success = state.includes('successfully');
  return <div className="shell grid min-h-[72vh] items-center justify-center py-12"><div className="surface w-full max-w-xl p-8 text-center md:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d7f36b] text-[#405719]">{success ? <CheckCircle2 className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}</div><p className="eyebrow mt-7">Account security</p><h1 className="page-title mt-3">{state}</h1><p className="muted mt-4">Your account is the key to saved products, faster checkout, and clear order history.</p><Link href="/signin" className="btn btn-primary mt-7">Continue to Halozon <ArrowRight className="h-4 w-4" /></Link></div></div>;
}
