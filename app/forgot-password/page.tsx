'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from '@/lib/icons';
import toast from 'react-hot-toast';

export default function Forgot() {
  const [email, setEmail] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    toast[response.ok ? 'success' : 'error'](response.ok ? 'If the account exists, reset instructions are ready.' : 'Could not start reset');
  }
  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><form onSubmit={submit} className="surface w-full max-w-md p-7"><div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-100 text-indigo-700"><Lock className="h-5 w-5" /></div><p className="eyebrow mt-6">Account recovery</p><h1 className="page-title mt-2">Reset your password</h1><p className="muted mt-3 text-sm">We&apos;ll send a secure link if we find an account for this email.</p><input required type="email" className="input mt-6" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button className="btn btn-primary mt-4 w-full">Send instructions</button><Link href="/signin" className="mt-5 flex items-center justify-center gap-1 text-xs font-bold text-slate-500"><ArrowLeft className="h-3.5 w-3.5" /> Back to sign in</Link></form></div>;
}
