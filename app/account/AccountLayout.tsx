'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  CreditCard,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';

const TABS = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard, group: 'Home' },
  { href: '/account/orders', label: 'Orders & tracking', icon: Truck, group: 'Activity' },
  { href: '/account/returns', label: 'Returns', icon: RotateCcw, group: 'Activity' },
  { href: '/account/subscriptions', label: 'Subscriptions', icon: Package, group: 'Activity' },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart, group: 'Discover' },
  { href: '/account/recommendations', label: 'For you', icon: Sparkles, group: 'Discover' },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin, group: 'Saved details' },
  { href: '/account/payment', label: 'Payment methods', icon: CreditCard, group: 'Saved details' },
  { href: '/account/security', label: 'Profile & security', icon: ShieldCheck, group: 'Saved details' },
];

export default function AccountLayout({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const activeHref = TABS.find((tab) => tab.href !== '/account' && pathname.startsWith(tab.href))?.href || pathname;
  return (
    <div className="account-frame">
      <aside className="account-sidebar">
        <div className="account-profile-card">
          <div className="avatar">{initials}</div>
          <div className="min-w-0">
            <div className="text-sm text-white/65">Your halozon account</div>
            <div className="font-bold truncate">{user.name}</div>
            <div className="text-xs text-white/65 truncate">{user.email}</div>
          </div>
        </div>
        <nav className="account-nav" aria-label="Account navigation">
          {['Home', 'Activity', 'Discover', 'Saved details'].map((group) => (
            <div key={group}>
              <div className="account-nav-label">{group}</div>
              {TABS.filter((tab) => tab.group === group).map((tab) => {
                const Icon = tab.icon;
                const active = tab.href === '/account' ? pathname === tab.href : activeHref === tab.href;
                return (
                  <Link key={tab.href} href={tab.href} className={`account-nav-link ${active ? 'active' : ''}`}>
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {active && <ArrowRight className="w-3.5 h-3.5 ml-auto" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <Link href="/help" className="account-help">
          Need a hand? Visit help <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </aside>
      <div className="account-content">{children}</div>
    </div>
  );
}
