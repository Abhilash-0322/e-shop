'use client';

import Link from 'next/link';
import { Activity, ArrowRight, CheckCircle2, Clock, Package, Search, ShieldCheck, Sparkles, Store, Zap } from '@/lib/icons';

const actions = [
  { href: '/search', label: 'Find something', detail: 'Search the catalog', icon: Search },
  { href: '/account/orders', label: 'Track an order', detail: 'See delivery status', icon: Package },
  { href: '/deals', label: 'Browse drops', detail: 'Fresh value, daily', icon: Zap },
];

export default function Hero() {
  return (
    <section className="command-board">
      <div className="shell relative grid gap-8 py-10 md:py-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div className="relative z-10 animate-reveal">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#9af3e4]">
            <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Marketplace command center</span>
            <span className="rounded-full border border-white/15 px-2 py-1 text-slate-300">v2.4 live</span>
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-[.98] tracking-[-.055em] md:text-6xl">
            Your next move starts here.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            Search, decide, and keep every shopping task moving from one calm command center.
          </p>
          <div className="mt-7 grid max-w-2xl gap-2 sm:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className="group rounded-lg border border-white/10 bg-white/[.06] p-3 transition hover:-translate-y-0.5 hover:border-[#8df5e7]/40 hover:bg-white/[.1]">
                  <Icon className="h-4 w-4 text-[#8df5e7]" />
                  <b className="mt-3 block text-xs">{action.label}</b>
                  <span className="mt-1 block text-[10px] text-slate-400">{action.detail}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="relative z-10 rounded-xl border border-white/10 bg-white/[.06] p-4 backdrop-blur-sm animate-float">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">System pulse</span>
              <h2 className="mt-1 text-lg font-black">Everything in motion</h2>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#9af3e4]"><span className="h-1.5 w-1.5 rounded-full bg-[#32d583]" /> Healthy</span>
          </div>
          <div className="board-grid">
            <div className="board-stat"><Clock className="h-4 w-4 text-[#9af3e4]" /><strong>48h</strong><small>average dispatch</small></div>
            <div className="board-stat"><ShieldCheck className="h-4 w-4 text-[#9af3e4]" /><strong>100%</strong><small>buyer protection</small></div>
            <div className="board-stat"><Store className="h-4 w-4 text-[#f5b544]" /><strong>2.4k</strong><small>active sellers</small></div>
            <div className="board-stat"><Sparkles className="h-4 w-4 text-[#f5b544]" /><strong>4.9 / 5</strong><small>shopper signal</small></div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-[#32d583]" /> Clear actions, fewer dead ends.
            <ArrowRight className="ml-auto h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
