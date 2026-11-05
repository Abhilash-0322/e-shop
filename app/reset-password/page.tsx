'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import toast from 'react-hot-toast';

export default function Reset() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/auth/reset-password', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token: searchParams.get('token'), password})});
    const message = response.ok ? 'Password updated' : 'Invalid or expired token';
    setError(response.ok ? '' : message);
    toast[response.ok ? 'success' : 'error'](message);
  }

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={submit} className="surface w-full max-w-md p-8" aria-labelledby="reset-title">
        <p className="eyebrow">Account recovery</p>
        <h1 id="reset-title" className="page-title mt-2">Choose a new password</h1>
        {error && <p className="error-text mt-4 rounded-lg bg-red-50 p-3" role="alert">{error}</p>}
        <label htmlFor="new-password" className="sr-only">New password</label>
        <input id="new-password" required minLength={6} autoComplete="new-password" type="password" className="input mt-6" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-help" aria-invalid={Boolean(error)} />
        <p id="password-help" className="mt-1 text-xs muted">Use at least 6 characters.</p>
        <button type="submit" className="btn btn-primary mt-4 w-full">Update password</button>
      </form>
    </div>
  );
}
