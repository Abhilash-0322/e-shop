'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail } from '@/lib/icons';

export default function Forgot() {
  const [email, setEmail] = useState('');
  async function submit(event: React.FormEvent) { event.preventDefault(); const response = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); toast[response.ok ? 'success' : 'error'](response.ok ? 'If the account exists, reset instructions are ready.' : 'Could not start reset'); }
  return <div className="shell grid min-h-[72vh] items-center justify-center py-12"><form onSubmit={submit} className="surface w-full max-w-md p-7 md:p-8"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d7f36b] text-[#405719]"><Mail className="h-5 w-5" /></div><p className="eyebrow mt-7">Account recovery</p><h1 className="page-title mt-2">Reset your password.</h1><p className="muted mt-3 text-sm">We&apos;ll send a secure link if an account exists for that email.</p><input required type="email" className="input mt-6" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button className="btn btn-primary mt-4 w-full">Send instructions</button><Link href="/signin" className="amazon-link mt-5 flex items-center justify-center gap-2 text-sm"><ArrowLeft className="h-3.5 w-3.5" /> Back to sign in</Link></form></div>;
}
