'use client';

import Link from 'next/link';
import { ArrowUp, Globe, Instagram, Sparkles, Twitter } from 'lucide-react';

const COLS = [
  { title: 'Discover', items: [['Fresh drops', '/deals'], ['Shop categories', '/search'], ['Gift ideas', '/search?q=gifts'], ['halo+ delivery', '/prime']] },
  { title: 'For makers', items: [['Open a studio', '/seller/apply'], ['Seller dashboard', '/seller/dashboard'], ['Maker stories', '/info/blog'], ['Seller help', '/help']] },
  { title: 'Good to know', items: [['About halozon', '/info/about'], ['Shipping & returns', '/info/shipping-policies'], ['Accessibility', '/info/accessibility'], ['Contact support', '/help']] },
];

export default function Footer() {
  return (
    <footer className="mt-16">
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex w-full items-center justify-center gap-2 bg-amazon-navyxlight py-3 text-xs font-bold text-white transition-colors hover:bg-amazon-navylight"><ArrowUp className="h-4 w-4" /> Back to the top</button>
      <div className="bg-amazon-navy text-white">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-block text-3xl font-black tracking-[-.08em]">halo<span className="text-amazon-orange">zon</span><span className="ml-1 text-xs tracking-normal text-amazon-orangelight">studio</span></Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">A softer way to shop — full of curious things, independent voices, and everyday delight.</p>
            <div className="mt-6 flex gap-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Instagram className="h-4 w-4" /></span><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Twitter className="h-4 w-4" /></span><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Sparkles className="h-4 w-4" /></span></div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((column) => <div key={column.title}><h3 className="mb-4 text-sm font-black">{column.title}</h3><ul className="space-y-2.5 text-sm text-white/60">{column.items.map(([label, href]) => <li key={href}><Link href={href} className="transition-colors hover:text-white">{label}</Link></li>)}</ul></div>)}
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-4 px-6 py-5 text-xs text-white/50">
            <div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/conditions">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/interest-based-ads">Your choices</Link><Link href="/help">Help center</Link></div>
            <button type="button" className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 hover:border-white/50"><Globe className="h-3.5 w-3.5" /> English · USD</button>
            <span>© 2026 halozon studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
