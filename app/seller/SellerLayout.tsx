'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Store, ArrowLeft } from 'lucide-react';

const TABS = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/seller/store', label: 'Store Profile', icon: Store },
];

export default function SellerLayout({ user, children }: { user: any; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-transparent">
      {/* Sub-header */}
      <div className="bg-[#11121a] text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-xs font-semibold text-white/60 transition-colors hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back to store
            </Link>
            <div className="hidden h-5 w-px bg-white/15 sm:block" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amazon-orange">Seller command</div>
              <div className="text-sm font-bold">{user.sellerProfile?.storeName || user.name}</div>
            </div>
          </div>
          <Link href="/seller/store" className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white">
            View public store
          </Link>
        </div>
      </div>

      <div className="page-shell grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="panel h-fit space-y-1 p-3 lg:sticky lg:top-28">
          <div className="mb-3 rounded-xl bg-amazon-bg p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-amazon-textMuted">Workspace</div>
            <div className="mt-1 text-sm font-bold">Store operations</div>
          </div>
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active ? 'bg-amazon-navy text-white font-bold shadow-lg' : 'text-amazon-textMuted hover:bg-amazon-bg hover:text-amazon-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Link>
            );
          })}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
