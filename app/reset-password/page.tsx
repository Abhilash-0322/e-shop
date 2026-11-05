'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowRight, Lock } from '@/lib/icons';

export default function Reset() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  async function submit(event: React.FormEvent) { event.preventDefault(); const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: searchParams.get('token'), password }) }); toast[response.ok ? 'success' : 'error'](response.ok ? 'Password updated' : 'Invalid or expired token'); }
  return <div className="shell grid min-h-[72vh] items-center justify-center py-12"><form onSubmit={submit} className="surface w-full max-w-md p-7 md:p-8"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d7f36b] text-[#405719]"><Lock className="h-5 w-5" /></div><p className="eyebrow mt-7">Account recovery</p><h1 className="page-title mt-2">Choose a new password.</h1><p className="muted mt-3 text-sm">Choose something unique so your account stays yours.</p><input required minLength={6} type="password" className="input mt-6" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} /><button className="btn btn-primary mt-4 w-full">Update password <ArrowRight className="h-4 w-4" /></button><Link href="/signin" className="amazon-link mt-5 block text-center text-sm">Back to sign in</Link></form></div>;
}
