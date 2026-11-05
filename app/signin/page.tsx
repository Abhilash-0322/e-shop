import { Suspense } from 'react';
import { Activity, ShieldCheck, Sparkles } from '@/lib/icons';
import AuthForm from '@/components/AuthForm';

export default function SignIn() {
  return (
    <div className="shell grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-[.9fr_1.1fr]">
      <div className="hidden lg:block">
        <div className="command-board p-9">
          <Sparkles className="h-6 w-6 text-[#9af3e4]" />
          <p className="eyebrow mt-8 !text-[#9af3e4]">Return to your workspace</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.055em]">Pick up exactly where you left off.</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">Your orders, saved products, addresses, and next best actions are waiting in one place.</p>
          <div className="mt-8 space-y-3 text-xs text-slate-300"><span className="flex items-center gap-2"><Activity className="h-4 w-4 text-[#9af3e4]" /> See order status at a glance</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#9af3e4]" /> Shop with protected checkout</span></div>
        </div>
      </div>
      <div className="flex justify-center"><Suspense fallback={<div className="surface p-8">Loading...</div>}><AuthForm mode="signin" /></Suspense></div>
    </div>
  );
}
