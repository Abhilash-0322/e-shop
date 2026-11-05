import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

export default function Register() {
  return <div className="shell grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-[1fr_440px]"><div className="hidden lg:block"><p className="eyebrow">Make room for more good things</p><h1 className="mt-4 max-w-xl text-6xl font-black tracking-[-.07em]">A better way to keep track of what you love.</h1><p className="muted mt-5 max-w-lg text-lg leading-relaxed">Create an account to save favorites, check out faster, and keep every order in view.</p><div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#d7f36b] p-5"><b className="text-3xl">01</b><p className="mt-8 text-sm font-bold">Save a shortlist</p></div><div className="rounded-2xl bg-[#ff765c] p-5 text-white"><b className="text-3xl">02</b><p className="mt-8 text-sm font-bold">Shop with confidence</p></div></div></div><Suspense fallback={<div className="surface p-8">Loading...</div>}><AuthForm mode="register" /></Suspense></div>;
}
