import {Suspense} from 'react';
import AuthForm from '@/components/AuthForm';
import {ShieldCheck} from '@/lib/icons';

export default function SignIn() {
  return <div className="shell grid min-h-[70vh] items-center gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-16"><div className="hidden rounded-[2rem] bg-slate-950 p-10 text-white lg:block"><p className="eyebrow !text-brand-100">Welcome back</p><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">Pick up where good shopping left off.</h2><p className="mt-5 leading-relaxed text-slate-300">Your saved products, orders, and preferences are waiting in one calm workspace.</p><div className="mt-10 flex items-center gap-3 text-sm text-emerald-300"><ShieldCheck className="h-5 w-5" /> Secure by default</div></div><div className="flex justify-center"><Suspense fallback={<div className="surface p-8">Loading...</div>}><AuthForm mode="signin" /></Suspense></div></div>;
}
