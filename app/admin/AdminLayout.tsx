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
    <div className="min-h-screen bg-amazon-bg">
      <div className="bg-amazon-navy text-white border-b border-amazon-border scanline">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-white/80 hover:text-white text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to store
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amazon-orange" />
              <span className="status-kicker">admin console · restricted</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        <aside className="panel p-3 self-start space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
                  active ? 'bg-amazon-orange/10 text-amazon-orange font-bold border-l-2 border-amazon-orange' : 'text-amazon-textMuted hover:bg-amazon-bg hover:text-white'
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
