import { Suspense } from 'react';
import { ArrowUpRight, Boxes, Store } from '@/lib/icons';
import AuthForm from '@/components/AuthForm';

export default function Register() {
  return (
    <div className="shell grid min-h-[72vh] items-center gap-10 py-12 lg:grid-cols-[1.1fr_.9fr]">
      <div className="order-2 flex justify-center lg:order-1"><Suspense fallback={<div className="surface p-8">Loading...</div>}><AuthForm mode="register" /></Suspense></div>
      <div className="order-1 lg:order-2">
        <p className="eyebrow">Build your command center</p>
        <h1 className="page-title mt-3">A calmer way to keep commerce moving.</h1>
        <p className="muted mt-4 max-w-md text-sm leading-relaxed">Create a free Halozon account to save products, compare options, and keep every order on one clear timeline.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="surface p-4"><Boxes className="h-5 w-5 text-indigo-600" /><b className="mt-4 block text-sm">One clear board</b><p className="muted mt-1 text-xs">Tasks and products, organized.</p></div>
          <div className="surface p-4"><Store className="h-5 w-5 text-indigo-600" /><b className="mt-4 block text-sm">Room to grow</b><p className="muted mt-1 text-xs">Switch to seller mode anytime.</p></div>
        </div>
        <a href="/help" className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600">Learn how it works <ArrowUpRight className="h-3.5 w-3.5" /></a>
      </div>
    </div>
  );
}
