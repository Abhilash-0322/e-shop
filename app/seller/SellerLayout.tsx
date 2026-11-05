'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Store, ArrowLeft, Menu, X, Plus, ExternalLink, Bell } from 'lucide-react';

const TABS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/seller/store', label: 'Store Profile', icon: Store },
];

export default function SellerLayout({ user, children }: { user: any; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const storeName = user.sellerProfile?.storeName || user.name;

  return (
    <div className="ops-shell">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-amazon-navy text-white shadow-header">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded-lg p-2 text-white/80 hover:bg-white/10 lg:hidden"
              aria-label="Toggle seller navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/seller/dashboard" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amazon-orange text-sm font-black text-white">hz</span>
              <span className="hidden text-sm font-bold tracking-tight sm:block">Seller Central</span>
            </Link>
            <span className="hidden h-5 w-px bg-white/20 sm:block" />
            <span className="hidden max-w-[220px] truncate text-sm text-white/65 sm:block">{storeName}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/seller/store" className="hidden items-center gap-1.5 text-xs text-white/70 hover:text-white sm:flex">
              <ExternalLink className="h-3.5 w-3.5" /> View store
            </Link>
            <button className="rounded-lg p-2 text-white/70 hover:bg-white/10" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 border-l border-white/15 pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                {String(user.name || 'S').slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden leading-tight sm:block">
                <div className="text-xs font-semibold">{user.name}</div>
                <div className="text-[10px] text-white/55">Seller account</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[232px_1fr]">
        <aside className={`${mobileOpen ? 'block' : 'hidden'} border-b border-amazon-border bg-white lg:block lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r`}>
          <div className="sticky top-16 p-4">
            <div className="mb-5 rounded-2xl bg-amazon-panel p-3">
              <div className="ops-kicker">Store workspace</div>
              <div className="mt-1 truncate text-sm font-semibold">{storeName}</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-amazon-greenDark">
                <span className="h-1.5 w-1.5 rounded-full bg-amazon-greenDark" /> Account active
              </div>
            </div>
            <nav className="space-y-1" aria-label="Seller navigation">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = pathname === t.href || (t.href !== '/seller/dashboard' && pathname.startsWith(t.href + '/'));
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      active ? 'bg-amazon-orange/10 font-semibold text-amazon-orangedark' : 'text-amazon-textMuted hover:bg-amazon-panel hover:text-amazon-text'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-amazon-orange' : 'text-amazon-textMuted group-hover:text-amazon-text'}`} />
                    {t.label}
                  </Link>
                );
              })}
            </nav>
            <div className="my-5 border-t border-amazon-border" />
            <div className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.14em] text-amazon-textMuted">Shortcuts</div>
              <Link href="/seller/products/new" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-amazon-textMuted hover:bg-amazon-panel hover:text-amazon-text">
                <Plus className="h-4 w-4" /> Add product
              </Link>
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-amazon-textMuted hover:bg-amazon-panel hover:text-amazon-text">
                <ArrowLeft className="h-4 w-4" /> Back to shopping
              </Link>
            </div>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
