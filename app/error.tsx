'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from '@/lib/icons';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="shell py-24">
      <div className="state-card state-card-error max-w-2xl mx-auto p-8 md:p-10 flex-col text-center">
        <span className="rounded-2xl bg-rose-100 text-rose-600 p-4"><AlertTriangle className="w-8 h-8" /></span>
        <h1 className="text-3xl font-black mt-5">That page needs a reset.</h1>
        <p className="muted mt-2 max-w-md">Something interrupted the experience. Your account and cart are safe.</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button type="button" onClick={() => reset()} className="btn btn-primary"><RefreshCw className="w-4 h-4" /> Try again</button>
          <Link href="/" className="btn btn-soft">Return to discovery</Link>
        </div>
      </div>
    </div>
  );
}
