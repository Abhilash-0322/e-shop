import Link from 'next/link';
import { Clock, Headphones, Sparkles } from '@/lib/icons';

export default function Plus() {
  const benefits = [[Clock, 'Fast delivery', 'Priority shipping on qualifying products.'], [Sparkles, 'Member drops', 'Early access to limited collections.'], [Headphones, 'Premium support', 'A faster path through order questions.']] as const;
  return <div className="shell py-8 md:py-10"><div className="command-board p-8 text-center md:p-16"><div className="relative z-10"><p className="eyebrow !text-[#9af3e4]">Membership layer</p><h1 className="mt-3 text-5xl font-black tracking-[-.06em] md:text-7xl">Halozon Plus</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">Priority delivery, exclusive drops, and premium support for people who shop with intention.</p><Link className="btn mt-8 bg-white text-slate-900" href="/register">Start your free trial</Link></div></div><div className="mt-7 grid gap-4 md:grid-cols-3">{benefits.map(([Icon, title, detail]) => <div className="surface p-6" key={title}><Icon className="h-6 w-6 text-indigo-600" /><h2 className="mt-5 text-lg font-black">{title}</h2><p className="muted mt-2 text-sm leading-relaxed">{detail}</p></div>)}</div></div>;
}
