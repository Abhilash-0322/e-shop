import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, CheckCircle2, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function AccountPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn-secondary shrink-0">
          {action.label} <ArrowUpRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export function StatusBadge({
  status,
  tone = 'neutral',
}: {
  status: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  return <span className={`status-badge status-${tone}`}>{status.replace(/_/g, ' ')}</span>;
}

export function ProgressBar({
  value,
  label,
  detail,
}: {
  value: number;
  label?: string;
  detail?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div>
      {(label || detail) && (
        <div className="flex justify-between gap-3 text-sm mb-2">
          <span className="font-semibold">{label}</span>
          <span className="text-muted">{detail || `${safeValue}%`}</span>
        </div>
      )}
      <div className="progress-track" aria-label={`${safeValue}% complete`}>
        <div className="progress-value" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = 'orange',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  tone?: 'orange' | 'blue' | 'green' | 'purple';
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold tracking-tight mt-4">{value}</div>
      <div className="text-sm font-semibold mt-1">{label}</div>
      {detail && <div className="text-xs text-muted mt-1">{detail}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon className="w-6 h-6" /></div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-muted max-w-md">{description}</p>
      {action && <Link href={action.href} className="btn-primary mt-2">{action.label}</Link>}
    </div>
  );
}

export function Notice({
  icon: Icon = CheckCircle2,
  children,
  tone = 'info',
}: {
  icon?: LucideIcon;
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning';
}) {
  return (
    <div className={`notice notice-${tone}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}
