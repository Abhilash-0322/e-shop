import Link from 'next/link';
import { AlertTriangle, BadgeCheck, KeyRound, LockKeyhole, MessageCircle, ShieldCheck } from 'lucide-react';
import SafetyNotice from '@/components/SafetyNotice';

const PRINCIPLES = [
  { icon: LockKeyhole, title: 'Pay inside checkout', body: 'Use halozon checkout for every purchase. Never send card details, gift cards, or one-time codes to a seller.' },
  { icon: KeyRound, title: 'Protect your sign-in', body: 'Use a unique password and sign out on shared devices. halozon support will never ask for your password.' },
  { icon: BadgeCheck, title: 'Check seller signals', body: 'Look for the Verified seller badge, an approved storefront, clear reviews, and a delivery estimate.' },
  { icon: MessageCircle, title: 'Keep a record', body: 'Keep messages and order details on halozon so support can investigate and help resolve a concern.' },
];

export default function SecurityPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link><span className="mx-1">›</span><span>Security Center</span>
      </div>
      <div className="bg-gradient-to-br from-amazon-navy via-amazon-navylight to-amazon-greenDark text-white rounded-2xl p-7 md:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-amazon-orange text-sm font-bold mb-3"><ShieldCheck className="w-5 h-5" /> halozon Security Center</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Stay in control of every order</h1>
          <p className="text-lg text-white/85 leading-relaxed">A few simple habits help protect your account, your payment information, and your conversations with sellers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {PRINCIPLES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="panel p-5">
            <div className="w-10 h-10 rounded-full bg-amazon-orange/10 text-amazon-orange flex items-center justify-center mb-3">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="font-bold text-lg mb-1">{title}</h2>
            <p className="text-sm text-amazon-textMuted leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        <SafetyNotice title="How to spot a suspicious request" tone="warning">
          Urgency, requests to move off-platform, unusual payment instructions, or a request for your password or one-time code are warning signs. Stop and contact support.
        </SafetyNotice>
        <SafetyNotice title="Something happened? We can help" href="/help#report" linkLabel="Report a safety concern">
          Save the seller name, order number, messages, and screenshots. Do not delete evidence before contacting the safety team.
        </SafetyNotice>
      </div>

      <section className="panel p-6 mt-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amazon-orange shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="font-bold text-lg">Account recovery</h2>
            <p className="text-sm text-amazon-textMuted mt-1">If you think someone accessed your account, reset your password immediately, review recent orders, and contact support.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/account/security" className="amazon-btn-dark !text-xs">Review login & security</Link>
              <Link href="/help#contact" className="amazon-btn-primary !text-xs">Contact support</Link>
              <Link href="/privacy" className="text-xs amazon-link self-center">Read privacy choices</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
