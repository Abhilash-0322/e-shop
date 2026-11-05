'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import toast from 'react-hot-toast';
import {Lock} from '@/lib/icons';
import {FormField} from '@/components/ui';

export default function Reset() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/auth/reset-password', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token: searchParams.get('token'), password})});
    toast[response.ok ? 'success' : 'error'](response.ok ? 'Password updated' : 'Invalid or expired token');
  }
  return <div className="shell flex min-h-[70vh] items-center justify-center py-16"><form onSubmit={submit} className="surface w-full max-w-md p-7 md:p-8"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Lock className="h-5 w-5" /></div><p className="eyebrow">Account recovery</p><h1 className="page-title mt-2">Choose a new password</h1><p className="muted mt-3 text-sm">Use a strong password you do not use elsewhere.</p><FormField label="New password"><input required minLength={6} type="password" className="input mt-6" value={password} onChange={event => setPassword(event.target.value)} /></FormField><button className="btn btn-primary mt-5 w-full">Update password</button></form></div>;
}
