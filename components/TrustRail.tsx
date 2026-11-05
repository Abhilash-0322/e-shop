import Link from 'next/link';
import { BadgeCheck, LockKeyhole, MessageCircle, RotateCcw, Truck } from 'lucide-react';

const ITEMS = [
  { icon: BadgeCheck, title: 'Verified sellers', detail: 'Know who fulfills your order', href: '/help#seller-safety' },
  { icon: LockKeyhole, title: 'Secure payments', detail: 'Protected checkout on every order', href: '/security' },
  { icon: Truck, title: 'Delivery visibility', detail: 'Clear estimates and tracking', href: '/info/shipping-policies' },
  { icon: RotateCcw, title: 'Straightforward returns', detail: 'See eligibility before you buy', href: '/account/returns' },
  { icon: MessageCircle, title: 'Human support', detail: 'Escalate concerns quickly', href: '/help#contact' },
];

export default function TrustRail() {
  return (
    <section className="bg-white border-y border-amazon-border" aria-label="Shopping with confidence">
      <div className="max-w-screen-xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-5 gap-3">
        {ITEMS.map(({ icon: Icon, title, detail, href }) => (
          <Link key={title} href={href} className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-amazon-bg focus-visible:ring-2 focus-visible:ring-amazon-orange">
            <Icon className="w-4 h-4 mt-0.5 text-amazon-orange shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-xs font-bold">{title}</span>
              <span className="block text-[11px] text-amazon-textMuted line-clamp-1">{detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
