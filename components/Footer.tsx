'use client';
import Link from 'next/link';
import { ChevronUp, Globe, Sparkles } from 'lucide-react';

type Item = { label: string; href: string };

const COLS: { title: string; items: Item[] }[] = [
  {
    title: 'Get to Know Us',
    items: [
      { label: 'Careers', href: '/info/careers' },
      { label: 'Blog', href: '/info/blog' },
      { label: 'About Halozon', href: '/info/about' },
      { label: 'Sustainability', href: '/info/sustainability' },
      { label: 'Press Center', href: '/info/press' },
      { label: 'Investor Relations', href: '/info/investor-relations' },
      { label: 'Halozon Devices', href: '/info/devices' },
      { label: 'Halozon Science', href: '/info/science' },
    ],
  },
  {
    title: 'Make Money with Us',
    items: [
      { label: 'Sell on Halozon', href: '/seller/apply' },
      { label: 'Sell apps on Halozon', href: '/info/sell-apps' },
      { label: 'Become an Affiliate', href: '/info/affiliate' },
      { label: 'Advertise Your Products', href: '/info/advertise' },
      { label: 'Self-Publish with Us', href: '/info/publish' },
      { label: 'Host a Halozon Hub', href: '/info/hub' },
      { label: '› See More Ways to Make Money', href: '/info/make-money' },
    ],
  },
  {
    title: 'Payment Products',
    items: [
      { label: 'Halozon Business Card', href: '/info/business-card' },
      { label: 'Shop with Points', href: '/info/shop-points' },
      { label: 'Reload Your Balance', href: '/info/reload-balance' },
      { label: 'Currency Converter', href: '/currency-converter' },
    ],
  },
  {
    title: 'Let Us Help You',
    items: [
      { label: 'Your Account', href: '/account' },
      { label: 'Your Orders', href: '/account/orders' },
      { label: 'Shipping Rates & Policies', href: '/info/shipping-policies' },
      { label: 'Returns', href: '/account/returns' },
      { label: 'Manage Subscriptions', href: '/account/subscriptions' },
      { label: 'Help', href: '/help' },
      { label: 'Accessibility', href: '/info/accessibility' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16">
      <button
        type="button"
        onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-hz-gradient text-white text-sm py-3.5 transition-opacity hover:opacity-95 flex items-center justify-center gap-2 font-medium"
        aria-label="Back to top"
      >
        <ChevronUp className="w-4 h-4" /> Back to top
      </button>

      <div className="bg-slate-900 text-slate-300 text-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(236,72,153,0.2),transparent_45%)] pointer-events-none" />
        <div className="relative max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold mb-3 text-white">{col.title}</h3>
              <ul className="space-y-2">
                {col.items.map((it) => (
                  <li key={it.href + it.label}>
                    <Link href={it.href} className="hover:text-white hover:underline transition-colors">
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative border-t border-white/10 py-8 flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Halozon home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-hz-gradient text-white">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="text-2xl font-extrabold text-white">Halozon</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <button type="button" className="border border-white/25 rounded-full px-4 py-2 hover:border-white/60 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> English
            </button>
            <button type="button" className="border border-white/25 rounded-full px-4 py-2 hover:border-white/60">
              $ USD
            </button>
            <button type="button" className="border border-white/25 rounded-full px-4 py-2 hover:border-white/60">
              United States
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
            <li><Link href="/conditions" className="hover:text-slate-300">Conditions of Use</Link></li>
            <li><Link href="/privacy" className="hover:text-slate-300">Privacy Notice</Link></li>
            <li><Link href="/interest-based-ads" className="hover:text-slate-300">Interest-Based Ads</Link></li>
            <li><Link href="/help" className="hover:text-slate-300">Help</Link></li>
          </ul>
          <div>© {new Date().getFullYear()} Halozon, Inc. A colorful marketplace — not your typical big-box clone.</div>
        </div>
      </div>
    </footer>
  );
}
