'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      toast.success('Welcome back!');
      router.push(sp.get('redirect') || '/');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Sign-in failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="eyebrow mb-2">Welcome back</div>
      <h1 className="text-3xl font-black tracking-tight">Sign in to your halozon account</h1>
      <label className="block">
        <span className="text-sm font-bold block mb-1">Email or mobile phone number</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="amazon-input"
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold block mb-1">Password</span>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="amazon-input"
        />
        <Link href="/forgot-password" className="text-xs amazon-link mt-1 inline-block">Forgot your password?</Link>
      </label>
      <button type="submit" disabled={submitting} className="amazon-btn-yellow w-full !text-sm !py-2 disabled:opacity-60">
        {submitting ? 'Connecting...' : 'Continue securely'}
      </button>
      <p className="text-xs text-amazon-textMuted">
        By continuing, you agree to halozon&apos;s <span className="amazon-link">Conditions of Use</span> and{' '}
        <span className="amazon-link">Privacy Notice</span>.
      </p>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-amazon-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-amazon-textMuted">New to halozon?</span></div>
      </div>
      <Link href={`/register?${sp.toString()}`} className="amazon-btn-dark w-full !text-sm !py-2 block text-center">
        Create your halozon account
      </Link>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 px-4 bg-[radial-gradient(circle_at_top,#dceafe,transparent_48%)]">
      <Link href="/" className="flex items-center gap-2 text-xl font-black mb-6 text-amazon-navy">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amazon-orange to-amazon-prime flex items-center justify-center">h</span>
        halozon<span className="text-amazon-orange">.</span>
      </Link>
      <div className="w-full max-w-md bg-white border border-amazon-border rounded-3xl p-7 md:p-8 shadow-card">
        <Suspense fallback={<div>Loading…</div>}>
          <SignInForm />
        </Suspense>
      </div>
      <div className="w-full max-w-sm mt-6">
        <div className="bg-white border border-amazon-border rounded-md p-3 text-center text-xs text-amazon-textMuted">
          Buying for work? <span className="amazon-link">Create a free business account</span>
        </div>
      </div>
    </div>
  );
}
