'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RefreshCw } from '@/lib/icons';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="surface w-full max-w-xl p-8 text-center md:p-12">
        <div className="recovery-icon recovery-icon-error mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <p className="eyebrow mt-6">A temporary detour</p>
        <h1 className="page-title mt-3">That didn&apos;t load cleanly.</h1>
        <p className="muted mx-auto mt-4 max-w-md leading-relaxed">
          Your saved work is still safe. Try the page again, or take a fresh route to support if it keeps happening.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/help" className="btn btn-soft">
            Get support
          </Link>
          <Link href="/" className="btn btn-dark">
            <ArrowLeft className="h-4 w-4" />
            Go home
          </Link>
        </div>
        {error?.digest && <p className="mt-6 text-xs text-slate-400">Reference {error.digest}</p>}
      </div>
    </div>
  );
}

