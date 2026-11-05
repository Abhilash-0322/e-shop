'use client';

import {useState} from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {ArrowLeft, Lock} from '@/lib/icons';
import {FormField} from '@/components/ui';

export default function Forgot() {
  const [email, setEmail] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/auth/forgot-password', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email})});
    toast[response.ok ? 'success' : 'error'](response.ok ? 'If the account exists, reset instructions are ready.' : 'Could not start reset');
  }
  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><form onSubmit={submit} className="surface w-full max-w-md p-7 md:p-8"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Lock className="h-5 w-5" /></div><p className="eyebrow">Account recovery</p><h1 className="page-title mt-2">Reset your password</h1><p className="muted mt-3 text-sm">We will send a secure link if an account matches.</p><FormField label="Email address"><input required type="email" className="input mt-6" value={email} onChange={event => setEmail(event.target.value)} /></FormField><button className="btn btn-primary mt-5 w-full">Send instructions</button><Link href="/signin" className="amazon-link mt-5 inline-flex items-center gap-1 text-sm"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link></form></div>;
}
