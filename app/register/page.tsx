import {Suspense} from 'react';
import AuthForm from '@/components/AuthForm';
import {Sparkles} from '@/lib/icons';

export default function Register() {
  return <div className="shell grid min-h-[70vh] items-center gap-10 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-16"><div className="hidden rounded-[2rem] bg-gradient-to-br from-brand-700 to-emerald-700 p-10 text-white lg:block"><p className="eyebrow !text-brand-100">Start your journey</p><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">Make more room for things worth finding.</h2><p className="mt-5 leading-relaxed text-brand-100">Save lists, follow orders, and discover sellers who care about the details.</p><div className="mt-10 flex items-center gap-3 text-sm text-emerald-100"><Sparkles className="h-5 w-5" /> A more considered marketplace</div></div><div className="flex justify-center"><Suspense fallback={<div className="surface p-8">Loading...</div>}><AuthForm mode="register" /></Suspense></div></div>;
}
