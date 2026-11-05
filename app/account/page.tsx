import Link from 'next/link';
import {ArrowRight, Heart, Lock, MapPin, Package, Sparkles, WalletCards} from '@/lib/icons';
import {PageHeader} from '@/components/ui';

const cards = [
  ['Orders', 'Track, review, and manage purchases.', '/account/orders', Package],
  ['Wishlist', 'Keep the things you love close.', '/account/wishlist', Heart],
  ['Addresses', 'Manage delivery destinations.', '/account/addresses', MapPin],
  ['Payment', 'Manage saved payment methods.', '/account/payment', WalletCards],
  ['Halozon Plus', 'Priority delivery and member drops.', '/prime', Sparkles],
  ['Security', 'Keep your account protected.', '/account/security', Lock],
] as const;

export default function Account() {
  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Your account" description="Everything you need to manage your Halozon experience." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map(([title, description, href, Icon]) => (
          <Link key={href} href={href} className="card-interactive card group p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><Icon className="h-5 w-5" /></div>
            <h2 className="mt-5 text-lg font-black tracking-tight group-hover:text-brand-700">{title}</h2>
            <p className="muted mt-2 text-sm">{description}</p>
            <span className="amazon-link mt-5 inline-flex items-center gap-1 text-sm">Open <ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
