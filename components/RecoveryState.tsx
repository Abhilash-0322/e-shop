'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Inbox, RefreshCw, WifiOff } from '@/lib/icons';

type RecoveryStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  href?: string;
  hrefLabel?: string;
  compact?: boolean;
};

export function RecoveryState({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  href,
  hrefLabel = 'Get help',
  compact = false,
}: RecoveryStateProps) {
  return (
    <div className={`recovery-state ${compact ? 'recovery-state-compact' : ''}`} role="status">
      <div className="recovery-icon recovery-icon-error">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h2 className="font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {onRetry && (
            <button type="button" onClick={onRetry} className="btn btn-primary btn-sm">
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </button>
          )}
          {href && (
            <Link href={href} className="btn btn-soft btn-sm">
              {hrefLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  href = '/search',
  hrefLabel = 'Explore products',
}: {
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="recovery-state" role="status">
      <div className="recovery-icon recovery-icon-empty">
        <Inbox className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
        <Link href={href} className="btn btn-dark btn-sm mt-4">
          {hrefLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function OfflineNotice() {
  return (
    <div className="offline-notice" role="status">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You&apos;re offline. Saved drafts stay on this device and will be ready when you reconnect.</span>
    </div>
  );
}

