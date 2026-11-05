'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Lock } from '@/lib/icons';
import toast from 'react-hot-toast';

export default function Reset() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: searchParams.get('token'), password }) });
    toast[response.ok ? 'success' : 'error'](response.ok ? 'Password updated' : 'Invalid or expired token');
  }
  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><form onSubmit={submit} className="surface w-full max-w-md p-7"><div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><Lock className="h-5 w-5" /></div><p className="eyebrow mt-6">Account recovery</p><h1 className="page-title mt-2">Choose a new password</h1><p className="muted mt-3 text-sm">Use at least six characters, then return to your workspace.</p><input required minLength={6} type="password" className="input mt-6" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} /><button className="btn btn-primary mt-4 w-full">Update password</button><p className="mt-4 flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Your session stays protected.</p></form></div>;
}
