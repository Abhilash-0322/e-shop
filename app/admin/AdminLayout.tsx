'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, MessageSquare, Store, ArrowLeft, Shield, Activity } from 'lucide-react';

const TABS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/sellers', label: 'Sellers', icon: Store },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="ops-shell">
      <header className="bg-amazon-navy text-white shadow-header">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1 text-sm text-white/70 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to store</Link>
            <span className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-amazon-orange" /><span className="font-bold">Admin Console</span></div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-white/60 sm:flex"><Activity className="h-4 w-4 text-amazon-green" /> Systems operational</div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="ops-card h-fit p-3 lg:sticky lg:top-6">
          <div className="mb-3 px-3 py-2"><div className="ops-kicker">Operations</div><div className="mt-1 text-sm font-semibold">Marketplace control</div></div>
          <nav className="space-y-1" aria-label="Admin navigation">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  active ? 'bg-amazon-orange/10 font-bold text-amazon-orangedark' : 'text-amazon-textMuted hover:bg-amazon-panel hover:text-amazon-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Link>
            );
          })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
