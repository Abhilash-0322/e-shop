'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SellerApply({ user }: { user: any }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    storeName: '',
    description: '',
    country: 'United States',
    payoutEmail: user.email,
    payoutMethod: 'bank',
    logo: '',
    autoApprove: true,
  });

  async function submit() {
    setSubmitting(true);
    try {
      const r = await fetch('/api/seller/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Application failed');
      toast.success(d.profile?.approved ? 'Welcome to halozon Seller Central!' : 'Application submitted');
      router.push('/seller/dashboard');
    } catch (e: any) {
      toast.error(e.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-amazon-bg">
      {/* Hero */}
      <div className="overflow-hidden bg-amazon-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-amazon-orangelight"><Sparkles className="h-4 w-4" /> Seller onboarding</div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Build a store customers come back to.</h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">List your products, reach new customers, and manage fulfillment from one calm, focused workspace.</p>
          </div>
          <div className="mt-8 grid max-w-sm grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-0 lg:w-[420px]">
            <Benefit icon={Store} label="Create your storefront" />
            <Benefit icon={ShieldCheck} label="Protected payouts" />
            <Benefit icon={Sparkles} label="Seller insights" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-screen-md px-6 py-8">
        <div className="rounded-2xl border border-amazon-border bg-white p-6 shadow-card sm:p-8">
          {/* Stepper */}
          <div className="mb-8 flex items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center flex-1 last:flex-initial">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    step >= n ? 'bg-amazon-orange text-white' : 'bg-amazon-bg text-amazon-textMuted'
                  }`}
                >
                  {step > n ? <Check className="w-4 h-4" /> : n}
                </div>
                {n < 3 && <div className={`mx-2 h-1 flex-1 rounded-full ${step > n ? 'bg-amazon-orange' : 'bg-amazon-bg'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Tell us about your store</h2>
              <label className="block">
                <span className="text-sm font-bold block mb-1">Store name *</span>
                <input
                  className="amazon-input"
                  value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  placeholder="e.g. AuraCraft Studio"
                />
                <span className="text-xs text-amazon-textMuted mt-1 inline-block">
                  This is what customers will see. Can be changed later.
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-bold block mb-1">Store description</span>
                <textarea
                  className="amazon-input min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What do you sell? What makes your store special?"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold block mb-1">Country *</span>
                <select className="amazon-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>Japan</option>
                </select>
              </label>
              <div className="flex justify-end">
                <button
                  onClick={() => form.storeName.trim().length >= 3 ? setStep(2) : toast.error('Store name too short')}
                  className="amazon-btn-primary"
                >
                  Continue <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Set up payouts</h2>
              <p className="text-sm text-amazon-textMuted">
                Where should we send your earnings? (Demo: this is mocked — no real payouts will be made.)
              </p>
              <label className="block">
                <span className="text-sm font-bold block mb-1">Payout method</span>
                <select className="amazon-input" value={form.payoutMethod} onChange={(e) => setForm({ ...form, payoutMethod: e.target.value })}>
                  <option value="bank">Bank transfer (US)</option>
                  <option value="paypal">PayPal</option>
                  <option value="check">Check by mail</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold block mb-1">Payout email</span>
                <input
                  className="amazon-input"
                  type="email"
                  value={form.payoutEmail}
                  onChange={(e) => setForm({ ...form, payoutEmail: e.target.value })}
                />
              </label>
              <div className="bg-amazon-yellow/20 border border-amazon-yellow rounded-md p-3 text-xs">
                <b>Demo mode:</b> For this preview, your seller account will be auto-approved so you can explore the dashboard immediately.
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.autoApprove} onChange={(e) => setForm({ ...form, autoApprove: e.target.checked })} />
                Auto-approve for demo (skip admin review)
              </label>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-amazon-link hover:underline">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="amazon-btn-primary">
                  Continue <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Review and submit</h2>
              <div className="bg-amazon-bg border border-amazon-border rounded-md p-4 space-y-2 text-sm">
                <div><b>Store name:</b> {form.storeName}</div>
                <div><b>Country:</b> {form.country}</div>
                <div><b>Description:</b> {form.description || '(none)'}</div>
                <div><b>Payout:</b> {form.payoutMethod} → {form.payoutEmail}</div>
              </div>
              <p className="text-xs text-amazon-textMuted">
                By submitting, you agree to halozon&apos;s seller terms. (Mock agreement for this demo.)
              </p>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-amazon-link hover:underline">
                  ← Back
                </button>
                <button onClick={submit} disabled={submitting} className="amazon-btn-orange disabled:opacity-60">
                  {submitting ? 'Submitting…' : 'Submit application'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-amazon-link">
            ← Back to shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Benefit({ icon: Icon, label }: { icon: any; label: string }) {
  return <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center"><Icon className="mx-auto mb-2 h-5 w-5 text-amazon-orangelight" /><div className="text-xs font-semibold text-white/80">{label}</div></div>;
}
