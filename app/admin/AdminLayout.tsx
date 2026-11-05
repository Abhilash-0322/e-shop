'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, MessageSquare, Store, ArrowLeft, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-transparent">
      <div className="bg-[#11121a] text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-xs font-semibold text-white/60 transition-colors hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back to store
            </Link>
            <div className="h-5 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amazon-orange" />
              <div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amazon-orange">System control</div><span className="text-sm font-bold">Admin console</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-shell grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="panel h-fit space-y-1 p-3 lg:sticky lg:top-28">
          <div className="mb-3 rounded-xl bg-amazon-bg p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-amazon-textMuted">Overview</div>
            <div className="mt-1 text-sm font-bold">Platform health</div>
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
        <div>{children}</div>
      </div>
    </div>
  );
}
