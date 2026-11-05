'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

export default function Verify() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState('Verifying your email...');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token}),
      signal: controller.signal,
    })
      .then((response) => {
        if (!controller.signal.aborted) setState(response.ok ? 'Email verified successfully.' : 'Verification link is invalid or expired.');
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setState('Verification failed.');
      });
    return () => controller.abort();
  }, [token]);

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center">
      <div className="surface p-10 text-center">
        <p className="eyebrow">Account security</p>
        <h1 className="page-title mt-3">{state}</h1>
      </div>
    </div>
  );
}
