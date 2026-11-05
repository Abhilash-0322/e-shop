'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AccountError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="empty-icon mx-auto"><AlertTriangle className="w-6 h-6" /></div>
      <h1 className="text-2xl font-bold mt-4">We couldn&apos;t load your account</h1>
      <p className="text-sm text-muted mt-2">Your saved details are safe. Try again, or return to the store while we reconnect.</p>
      <button onClick={reset} className="btn-primary mt-5"><RefreshCw className="w-4 h-4" /> Try again</button>
    </div>
  );
}
