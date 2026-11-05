'use client';

import {ReactNode, useEffect} from 'react';
import {X} from '@/lib/icons';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  inverse?: boolean;
};

export function PageHeader({eyebrow, title, description, actions, inverse = false}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className={inverse ? 'eyebrow !text-brand-100' : 'eyebrow'}>{eyebrow}</p>}
        <h1 className={`page-title mt-2 ${inverse ? '!text-white' : ''}`}>{title}</h1>
        {description && <p className={`${inverse ? 'text-slate-300' : 'muted'} mt-3 max-w-2xl leading-relaxed`}>{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHeading({eyebrow, title, action}: {eyebrow?: string; title: string; action?: ReactNode}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className={eyebrow ? 'mt-2' : ''}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({value}: {value: string}) {
  const normalized = value.toLowerCase();
  const tone = normalized.includes('cancel') || normalized.includes('reject') || normalized.includes('ban')
    ? 'pill-danger'
    : normalized.includes('pending') || normalized.includes('review') || normalized.includes('low')
      ? 'pill-warning'
      : normalized.includes('deliver') || normalized.includes('active') || normalized.includes('live') || normalized.includes('approv')
        ? 'pill-success'
        : '';
  return <span className={`pill ${tone}`}>{value}</span>;
}

export function StatCard({label, value, hint}: {label: string; value: ReactNode; hint?: string}) {
  return (
    <div className="stat-card">
      <p className="muted text-sm">{label}</p>
      <strong>{value}</strong>
      {hint && <p className="muted mt-1 text-xs">{hint}</p>}
    </div>
  );
}

export function EmptyState({title, description, action, icon}: {title: string; description?: string; action?: ReactNode; icon?: ReactNode}) {
  return (
    <div className="empty-state">
      {icon && <div className="mb-4 flex justify-center text-brand-500">{icon}</div>}
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      {description && <p className="muted mx-auto mt-2 max-w-md text-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SkeletonBlock({className = ''}: {className?: string}) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

export function FormField({label, hint, children}: {label: string; hint?: string; children: ReactNode}) {
  return (
    <label className="block text-sm font-bold">
      <span>{label}</span>
      {children}
      {hint && <small className="muted mt-1 block font-normal">{hint}</small>}
    </label>
  );
}

export function Dialog({open, title, description, onClose, children}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} aria-label="Close dialog" />
      <div className="surface relative z-10 w-full max-w-lg p-6 animate-reveal">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 id="dialog-title" className="text-xl font-extrabold tracking-tight">{title}</h2>
            {description && <p className="muted mt-2 text-sm leading-relaxed">{description}</p>}
          </div>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
