'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Mail, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import SafetyNotice from '@/components/SafetyNotice';

const TOPICS = [
  { t: 'Shipping & Delivery', d: 'Track packages, shipping rates, delivery estimates, and delays.', href: '/info/shipping-policies' },
  { t: 'Returns & Refunds', d: 'Check eligibility, start a return, and understand refund timing.', href: '/account/returns' },
  { t: 'Manage Your Account', d: 'Update your information, sign-in details, or saved preferences.', href: '/account' },
  { t: 'Payment, Pricing & Promotions', d: 'Manage payment methods, totals, gift cards, and promo codes.', href: '/account/payment' },
  { t: 'halozon Prime', d: 'Manage membership, benefits, and delivery promises.', href: '/prime' },
  { t: 'Security & Privacy', d: 'Protect your account, manage data choices, and report fraud.', href: '/security' },
  { t: 'Seller safety', d: 'Understand verification and report suspicious store activity.', href: '#seller-safety' },
  { t: 'Accessibility', d: 'Find accessible shopping features and request assistance.', href: '/info/accessibility' },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => TOPICS.filter((topic) => `${topic.t} ${topic.d}`.toLowerCase().includes(query.toLowerCase().trim())),
    [query],
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <span className="mx-1">›</span>
        <span>Customer Service</span>
      </div>
      <div className="bg-gradient-to-br from-amazon-navy via-amazon-navylight to-amazon-orange text-white rounded-2xl p-6 md:p-10 mb-5">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-white/70 font-bold mb-2">Support that stays with you</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">How can we help?</h1>
          <p className="text-white/80 mb-5">Start with a topic or contact a person when you need a clear next step.</p>
          <label className="relative block max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amazon-textMuted w-5 h-5" aria-hidden="true" />
            <input
              aria-label="Search help topics"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search delivery, returns, payments, or safety"
              className="amazon-input pl-10 !py-3"
            />
          </label>
          <div className="text-xs text-white/70 mt-2" aria-live="polite">{filtered.length} help topic{filtered.length === 1 ? '' : 's'} found</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((topic) => (
          <Link key={topic.t} href={topic.href} className="panel p-4 hover:shadow-cardHover hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold mb-1 group-hover:text-amazon-linkHover">{topic.t}</h2>
                <p className="text-sm text-amazon-textMuted">{topic.d}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-amazon-textMuted mt-1 shrink-0" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="panel p-8 text-center mt-3">
          <p className="font-bold mb-1">We couldn’t find that topic</p>
          <p className="text-sm text-amazon-textMuted mb-3">Try a broader search or contact support below.</p>
          <button onClick={() => setQuery('')} className="amazon-btn-dark !text-xs">Clear search</button>
        </div>
      )}

      <section id="contact" className="mt-8 scroll-mt-24">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-amazon-orange font-bold">Need a person?</div>
            <h2 className="text-2xl font-bold">Choose the right escalation</h2>
          </div>
          <span className="text-xs text-amazon-textMuted">Have your order number ready</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="mailto:support@halozon.com" className="panel p-4 hover:shadow-cardHover">
            <Mail className="w-5 h-5 text-amazon-orange mb-3" aria-hidden="true" />
            <h3 className="font-bold">Email support</h3>
            <p className="text-sm text-amazon-textMuted mt-1">For account, payment, and order questions.</p>
            <span className="text-xs amazon-link mt-3 inline-block">support@halozon.com</span>
          </a>
          <a href="mailto:safety@halozon.com?subject=Safety%20concern" className="panel p-4 hover:shadow-cardHover">
            <ShieldCheck className="w-5 h-5 text-amazon-greenDark mb-3" aria-hidden="true" />
            <h3 className="font-bold">Safety team</h3>
            <p className="text-sm text-amazon-textMuted mt-1">Report fraud, unsafe items, or suspicious seller behavior.</p>
            <span className="text-xs amazon-link mt-3 inline-block">Report privately</span>
          </a>
          <a href="mailto:accessibility@halozon.com" className="panel p-4 hover:shadow-cardHover">
            <MessageCircle className="w-5 h-5 text-amazon-prime mb-3" aria-hidden="true" />
            <h3 className="font-bold">Accessibility help</h3>
            <p className="text-sm text-amazon-textMuted mt-1">Tell us what would make your shopping experience work better.</p>
            <span className="text-xs amazon-link mt-3 inline-block">Request assistance</span>
          </a>
        </div>
      </section>

      <section id="seller-safety" className="mt-6 scroll-mt-24">
        <SafetyNotice title="Keep payments and conversations on halozon" href="/security" linkLabel="Open the security center">
          Never share your password, one-time code, or card details with a seller. We can only investigate activity that stays on our platform.
        </SafetyNotice>
      </section>

      <section id="report" className="mt-4 scroll-mt-24">
        <SafetyNotice title="If something feels wrong, pause first" tone="warning">
          Stop payment, save the order or message details, and contact the safety team. If you are in immediate danger, contact local emergency services.
        </SafetyNotice>
      </section>
    </div>
  );
}
