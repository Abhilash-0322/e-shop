import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

export default function SignIn() {
  return <div className="shell grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-[1fr_440px]"><div className="hidden lg:block"><p className="eyebrow">Come back to the good stuff</p><h1 className="mt-4 max-w-xl text-6xl font-black tracking-[-.07em]">Your next favorite is still waiting.</h1><p className="muted mt-5 max-w-lg text-lg leading-relaxed">Keep your saved products, order details, and discovery trail close by.</p><div className="mt-8 overflow-hidden rounded-[1.7rem] bg-[#dcecff]"><img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1000&q=80" alt="Calm home objects" className="h-56 w-full object-cover mix-blend-multiply" /></div></div><Suspense fallback={<div className="surface p-8">Loading...</div>}><AuthForm mode="signin" /></Suspense></div>;
}
