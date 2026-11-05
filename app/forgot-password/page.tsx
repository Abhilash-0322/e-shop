'use client';

import {useState} from 'react';
import toast from 'react-hot-toast';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/auth/forgot-password', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email})});
    const message = response.ok ? 'If the account exists, reset instructions are ready.' : 'Could not start reset';
    setError(response.ok ? '' : message);
    toast[response.ok ? 'success' : 'error'](message);
  }

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={submit} className="surface w-full max-w-md p-8" aria-labelledby="forgot-title">
        <p className="eyebrow">Account recovery</p>
        <h1 id="forgot-title" className="page-title mt-2">Reset your password</h1>
        {error && <p className="error-text mt-4 rounded-lg bg-red-50 p-3" role="alert">{error}</p>}
        <label htmlFor="forgot-email" className="sr-only">Email address</label>
        <input id="forgot-email" required type="email" autoComplete="email" className="input mt-6" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(error)} />
        <button type="submit" className="btn btn-primary mt-4 w-full">Send instructions</button>
      </form>
    </div>
  );
}
