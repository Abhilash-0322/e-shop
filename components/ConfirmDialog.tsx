'use client';

import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, ShieldAlert, X } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = true,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  danger?: boolean;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  async function confirm() {
    if (busy) return;
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <button className="absolute inset-0 bg-amazon-navy/60" onClick={() => !busy && onCancel()} aria-label="Close dialog" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-amazon-border p-6 animate-scaleIn"
      >
        <button
          onClick={onCancel}
          disabled={busy}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-amazon-bg disabled:opacity-50"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
          danger ? 'bg-amazon-deal/10 text-amazon-deal' : 'bg-amazon-prime/10 text-amazon-link'
        }`}>
          <ShieldAlert className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 id="confirm-dialog-title" className="text-xl font-bold pr-6">{title}</h2>
        <p className="text-sm text-amazon-textMuted mt-2 leading-relaxed">{description}</p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
          <button ref={cancelRef} onClick={onCancel} disabled={busy} className="amazon-btn-dark !bg-white !text-amazon-text !border !border-amazon-border disabled:opacity-50">
            {cancelLabel}
          </button>
          <button onClick={confirm} disabled={busy} className={`${danger ? 'bg-amazon-deal hover:bg-amazon-red text-white' : 'amazon-btn-primary'} rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60`}>
            {busy && <LoaderCircle className="w-4 h-4 inline mr-1.5 animate-spin" aria-hidden="true" />}
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
