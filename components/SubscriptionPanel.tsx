'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Calendar, CheckCircle2, RefreshCw, ShieldCheck, Sparkles } from '@/lib/icons';

const CADENCES = [
  { months: 1, label: 'Every month', detail: '5% off', discount: 5 },
  { months: 2, label: 'Every 2 months', detail: '8% off', discount: 8 },
  { months: 3, label: 'Every 3 months', detail: '10% off', discount: 10 },
  { months: 6, label: 'Every 6 months', detail: '15% off', discount: 15 },
];

function formatDate(value?: string | Date) {
  if (!value) return 'Your next delivery date will appear here';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  );
}

export default function SubscriptionPanel({
  productId,
  price,
}: {
  productId: string;
  price: number;
}) {
  const [cadence, setCadence] = useState(1);
  const [busy, setBusy] = useState(false);
  const [subscription, setSubscription] = useState<any>();
  const [error, setError] = useState('');
  const selected = CADENCES.find((option) => option.months === cadence) || CADENCES[0];
  const savings = (price * selected.discount) / 100;

  async function subscribe() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, frequencyMonths: cadence }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not start subscription');
      setSubscription(data.subscription);
      if (data.subscription?.frequencyMonths) setCadence(data.subscription.frequencyMonths);
      toast.success('Subscription ready');
    } catch (err: any) {
      const message = err.message || 'Could not start subscription';
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  if (subscription) {
    return (
      <section className="surface border-emerald-200 bg-emerald-50/70 p-5 mt-7" aria-live="polite">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p className="eyebrow !text-emerald-700">Subscription active</p>
            <h2 className="font-black text-xl mt-1">You&apos;re set for replenishment.</h2>
            <p className="text-sm text-emerald-900/75 mt-2">
              Every {subscription.frequencyMonths} month{subscription.frequencyMonths === 1 ? '' : 's'} ·{' '}
              {subscription.discountPercent}% off each delivery.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          <div className="rounded-xl bg-white/80 border border-emerald-100 p-3">
            <p className="text-xs text-emerald-800/70">Next delivery</p>
            <p className="font-bold text-emerald-950 mt-1">{formatDate(subscription.nextDeliveryAt)}</p>
          </div>
          <div className="rounded-xl bg-white/80 border border-emerald-100 p-3">
            <p className="text-xs text-emerald-800/70">Saved per delivery</p>
            <p className="font-bold text-emerald-950 mt-1">
              ${(Number(subscription.price || price) * Number(subscription.discountPercent || 0) / 100).toFixed(2)}
            </p>
          </div>
        </div>
        <Link href="/account/subscriptions" className="amazon-link inline-flex items-center mt-4 text-sm">
          Manage in your account →
        </Link>
      </section>
    );
  }

  return (
    <section className="surface border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-5 mt-7">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-indigo-600 text-white p-2.5">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div>
          <p className="eyebrow">Replenishment</p>
          <h2 className="font-black text-xl mt-1">Make repeat purchases effortless.</h2>
          <p className="muted text-sm mt-2">
            Pick a cadence, save on every delivery, and see the next date before you commit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-5" role="radiogroup" aria-label="Delivery cadence">
        {CADENCES.map((option) => (
          <button
            key={option.months}
            type="button"
            role="radio"
            aria-checked={cadence === option.months}
            onClick={() => setCadence(option.months)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              cadence === option.months
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            <span className="block text-sm font-bold">{option.label}</span>
            <span className={`block text-xs mt-1 ${cadence === option.months ? 'text-indigo-100' : 'muted'}`}>
              {option.detail}
            </span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-5 text-sm">
        <div className="flex gap-2">
          <Sparkles className="w-4 h-4 text-fuchsia-600 shrink-0 mt-0.5" />
          <span>
            Save <b>${savings.toFixed(2)}</b> per delivery
          </span>
        </div>
        <div className="flex gap-2">
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <span>Next date shown after signup</span>
        </div>
        <div className="flex gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Separate from one-time checkout</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 mt-5 text-sm text-rose-800" role="alert">
          <p>{error}</p>
          {error.toLowerCase().includes('sign in') && (
            <Link
              className="font-bold underline mt-1 inline-block"
              href={`/signin?redirect=${encodeURIComponent(`/product/${productId}`)}`}
            >
              Sign in to continue
            </Link>
          )}
        </div>
      )}

      <button type="button" onClick={subscribe} disabled={busy} className="btn btn-primary w-full mt-5">
        {busy ? 'Starting subscription…' : `Subscribe & save ${selected.discount}%`}
      </button>
      <p className="text-xs muted text-center mt-3">You can cancel from Subscriptions in your account.</p>
    </section>
  );
}
