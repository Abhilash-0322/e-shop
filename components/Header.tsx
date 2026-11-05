'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LayoutDashboard, Menu, Package, ShoppingCart, Store, User, X, Zap } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';
import CommandPalette from './CommandPalette';

type UserData = { id: string; name: string; email: string; role: string } | null;

const DEFAULT_CATEGORIES = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({ user }: { user: UserData }) {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/categories', { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted && data.items?.length) setCategories(data.items.map((item: { name: string }) => item.name));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  }

  const categoryHref = (category: string) => `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return (
    <header className="command-header">
      <div className="shell command-topbar">
        <Link href="/" className="command-brand" aria-label="Halozon home">
          <span className="command-brand-mark">H</span>
          <span className="hidden sm:inline">Halozon</span>
        </Link>
        <span className="command-status hidden lg:flex">Live workspace</span>
        <CommandPalette userRole={user?.role} />
        <Link href="/deals" className="command-quick-action hidden md:inline-flex">
          <Zap className="h-3.5 w-3.5" /> Quick deals
        </Link>
        <div className="relative">
          <button type="button" className="command-icon-button" onClick={() => setAccountOpen((value) => !value)} aria-label="Open account menu">
            <User className="h-4 w-4" />
          </button>
          {accountOpen && (
            <div className="surface absolute right-0 top-full z-50 mt-2 w-72 p-4 animate-reveal">
              {user ? (
                <>
                  <div className="mb-3 border-b border-slate-100 pb-3">
                    <b className="block text-sm">{user.name}</b>
                    <span className="text-xs muted">{user.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <Link className="rounded-md p-2 hover:bg-indigo-50" href="/account">Account</Link>
                    <Link className="rounded-md p-2 hover:bg-indigo-50" href="/account/orders">Orders</Link>
                    <Link className="rounded-md p-2 hover:bg-indigo-50" href="/account/wishlist">Wishlist</Link>
                    <Link className="rounded-md p-2 hover:bg-indigo-50" href="/account/addresses">Addresses</Link>
                    {(user.role === 'seller' || user.role === 'admin') && <Link className="rounded-md p-2 hover:bg-indigo-50" href="/seller/dashboard">Seller hub</Link>}
                    {user.role === 'admin' && <Link className="rounded-md p-2 hover:bg-indigo-50" href="/admin">Admin</Link>}
                  </div>
                  <button type="button" onClick={logout} className="btn btn-soft mt-4 w-full">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="btn btn-primary w-full">Sign in</Link>
                  <Link href="/register" className="mt-3 block text-center text-xs font-bold text-indigo-600">Create an account</Link>
                </>
              )}
            </div>
          )}
        </div>
        <Link href="/account/orders" className="command-icon-button hidden sm:inline-grid" aria-label="Orders">
          <Package className="h-4 w-4" />
        </Link>
        <Link href="/cart" className="command-icon-button relative" aria-label={`Cart with ${count} items`}>
          <ShoppingCart className="h-4 w-4" />
          {count > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-[#f5b544] px-1 text-center text-[9px] font-black text-slate-950">{count}</span>}
        </Link>
        <button type="button" className="command-icon-button md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </button>
      </div>
      <div className="command-subnav">
        <nav className="shell flex items-center gap-5 overflow-x-auto" aria-label="Primary navigation">
          <span className="command-nav-label hidden md:inline">Workspace</span>
          <Link href="/search" className="command-nav-link" data-active={pathname === '/search'}><LayoutDashboard className="h-3.5 w-3.5" /> Discover</Link>
          {categories.slice(0, 5).map((category) => (
            <Link key={category} href={categoryHref(category)} className="command-nav-link" data-active={pathname === categoryHref(category)}>{category}</Link>
          ))}
          <span className="command-divider hidden md:block" />
          <Link href="/deals" className="command-nav-link" data-active={pathname === '/deals'}><Zap className="h-3.5 w-3.5 text-[#f5b544]" /> Deals</Link>
          <Link href="/seller/apply" className="command-nav-link hidden lg:inline-flex" data-active={pathname.startsWith('/seller')}><Store className="h-3.5 w-3.5" /> Sell</Link>
        </nav>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/60" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside className="relative h-full w-[min(88vw,22rem)] bg-white p-5 text-slate-900 shadow-2xl animate-reveal">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-black">Workspace navigation</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button>
            </div>
            <Link href="/search" onClick={() => setMobileOpen(false)} className="mb-2 flex items-center gap-3 rounded-lg bg-indigo-50 p-3 text-sm font-bold text-indigo-700"><LayoutDashboard className="h-4 w-4" /> Discover</Link>
            {categories.map((category) => (
              <Link key={category} href={categoryHref(category)} onClick={() => setMobileOpen(false)} className="block rounded-lg p-3 text-sm font-bold hover:bg-slate-50">{category}</Link>
            ))}
            <Link href="/deals" onClick={() => setMobileOpen(false)} className="mt-2 flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-amber-600 hover:bg-amber-50"><Zap className="h-4 w-4" /> Deals</Link>
            <Link href="/help" onClick={() => setMobileOpen(false)} className="block rounded-lg p-3 text-sm font-bold hover:bg-slate-50">Help center</Link>
          </aside>
        </div>
      )}
    </header>
  );
}
