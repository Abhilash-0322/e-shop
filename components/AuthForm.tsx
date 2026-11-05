'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import FormField, {fieldA11y} from './FormField';

export default function AuthForm({mode}: {mode: 'signin' | 'register'}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (mode === 'register' && name.trim().length < 2) nextErrors.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (password.length < 6) nextErrors.password = 'Use at least 6 characters.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(mode === 'signin' ? {email, password} : {name, email, password})});
      const data = await response.json();
      if (!response.ok) {
        setErrors({form: data.error || 'We could not complete that request.'});
        return;
      }
      toast.success(mode === 'signin' ? 'Welcome back' : 'Account created');
      router.push(sp.get('redirect') || '/');
      router.refresh();
    } catch {
      setErrors({form: 'The service is unavailable. Try again in a moment.'});
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} noValidate className="surface w-full max-w-md space-y-4 p-6 sm:p-8" aria-labelledby="auth-title">
    <div><p className="eyebrow">Halozon account</p><h1 id="auth-title" className="mt-2 text-3xl font-black">{mode === 'signin' ? 'Welcome back' : 'Start your journey'}</h1><p className="mt-2 text-sm muted">{mode === 'signin' ? 'Pick up where you left off.' : 'Save lists, track orders, and shop faster.'}</p></div>
    {errors.form && <p className="error-text rounded-lg bg-rose-50 p-3" role="alert">{errors.form}</p>}
    {mode === 'register' && <FormField id="auth-name" label="Full name" error={errors.name}><input {...fieldA11y('auth-name', errors.name)} required value={name} onChange={(event) => {setName(event.target.value); setErrors((current) => ({...current, name: ''}))}} className="input"/></FormField>}
    <FormField id="auth-email" label="Email" error={errors.email}><input {...fieldA11y('auth-email', errors.email)} required type="email" value={email} onChange={(event) => {setEmail(event.target.value); setErrors((current) => ({...current, email: ''}))}} className="input"/></FormField>
    <FormField id="auth-password" label="Password" error={errors.password} hint={mode === 'register' ? 'At least 6 characters.' : undefined}><input {...fieldA11y('auth-password', errors.password, mode === 'register' ? 'auth-password-description' : undefined)} required minLength={6} type="password" value={password} onChange={(event) => {setPassword(event.target.value); setErrors((current) => ({...current, password: ''}))}} className="input"/></FormField>
    {mode === 'signin' && <Link href="/forgot-password" className="amazon-link text-sm">Forgot password?</Link>}
    <button disabled={busy} className="btn btn-primary w-full">{busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
    <p className="text-center text-sm muted">{mode === 'signin' ? <>New to Halozon? <Link className="amazon-link" href="/register">Create an account</Link></> : <>Already have an account? <Link className="amazon-link" href="/signin">Sign in</Link></>}</p>
  </form>;
}
