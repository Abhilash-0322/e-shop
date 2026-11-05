'use client';
import Link from 'next/link';
import { ChevronUp, Globe } from 'lucide-react';

type Item = { label: string; href: string };

const COLS: { title: string; items: Item[] }[] = [
  {
    title: 'Get to Know Us',
    items: [
      { label: 'Careers', href: '/info/careers' },
      { label: 'Blog', href: '/info/blog' },
      { label: 'About halozon', href: '/info/about' },
      { label: 'Sustainability', href: '/info/sustainability' },
      { label: 'Press Center', href: '/info/press' },
      { label: 'Investor Relations', href: '/info/investor-relations' },
      { label: 'halozon Devices', href: '/info/devices' },
      { label: 'halozon Science', href: '/info/science' },
    ],
  },
  {
    title: 'Make Money with Us',
    items: [
      { label: 'Sell on halozon', href: '/seller/apply' },
      { label: 'Sell apps on halozon', href: '/info/sell-apps' },
      { label: 'Become an Affiliate', href: '/info/affiliate' },
      { label: 'Advertise Your Products', href: '/info/advertise' },
      { label: 'Self-Publish with Us', href: '/info/publish' },
      { label: 'Host a halozon Hub', href: '/info/hub' },
      { label: '› See More Ways to Make Money', href: '/info/make-money' },
    ],
  },
  {
    title: 'Payment Products',
    items: [
      { label: 'halozon Business Card', href: '/info/business-card' },
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
      {/* Back to top */}
      <button
        onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex w-full items-center justify-center gap-2 border-y border-white/10 bg-[#1a1b29] py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:bg-[#24263a] hover:text-white"
        aria-label="Back to top"
      >
        <ChevronUp className="h-4 w-4 text-amazon-orange" /> Back to top
      </button>

      {/* Main 4-col */}
      <div className="bg-amazon-navy text-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 text-sm md:grid-cols-4">
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-amazon-orange" />{col.title}
              </h3>
              <ul className="space-y-2 text-white/55">
                {col.items.map((it) => (
                  <li key={it.href + it.label}>
                    <Link
                      href={it.href}
                      className="transition-colors hover:text-amazon-orange"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo divider */}
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-5 border-t border-white/10 px-6 py-8">
          <Link href="/" className="flex items-end" aria-label="halozon home">
            <span className="text-3xl font-black leading-none tracking-[-0.08em]">halo</span>
            <span className="text-3xl font-black leading-none tracking-[-0.08em] text-amazon-orange">zon</span>
            <span className="text-amazon-orange text-xs ml-0.5 leading-none translate-y-[-2px]">.com</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <button className="flex items-center gap-1 rounded-full border border-white/20 px-4 py-2 text-white/70 transition-colors hover:border-white/60 hover:text-white">
              <Globe className="w-3 h-3" /> English
            </button>
            <button className="rounded-full border border-white/20 px-4 py-2 text-white/70 transition-colors hover:border-white/60 hover:text-white">$ USD · U.S. Dollar</button>
            <button className="rounded-full border border-white/20 px-4 py-2 text-white/70 transition-colors hover:border-white/60 hover:text-white">United States</button>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-[#0b0c11] text-xs text-white/45">
        <div className="mx-auto max-w-[1440px] px-6 py-6">
          <ul className="mb-3 flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/conditions" className="hover:underline">Conditions of Use</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Notice</Link></li>
            <li><Link href="/interest-based-ads" className="hover:underline">Interest-Based Ads</Link></li>
            <li><Link href="/help" className="hover:underline">Help</Link></li>
          </ul>
          <div>© 1996-2026, halozon.com, Inc. or its affiliates. Built with care for a beautiful shopping experience.</div>
        </div>
      </div>
    </footer>
  );
}
