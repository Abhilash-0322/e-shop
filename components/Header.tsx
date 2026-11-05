'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ChevronDown, LogOut, Menu, Package, Search, ShoppingCart, User, X} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';

type UserData = {id: string; name: string; email: string; role: string} | null;
const fallbackCategories = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({user}: {user: UserData}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {count} = useCart();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);

  useEffect(() => {
    let alive = true;
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        if (alive && data.items?.length) setCategories(data.items.map((item: {name: string}) => item.name));
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  function categoryPath(category: string) {
    return `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', {method: 'POST'});
    setAccountOpen(false);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="border-b border-slate-100 bg-slate-950 text-xs text-slate-300">
        <div className="shell flex min-h-8 items-center justify-between gap-4">
          <span className="hidden sm:block">Thoughtful products. Trusted sellers. Clear choices.</span>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/help" className="hover:text-white">Help center</Link>
            <Link href="/seller/apply" className="hover:text-white">Sell on Halozon</Link>
          </div>
        </div>
      </div>
      <div className="shell flex items-center gap-3 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Halozon home">
          <span className="hz-logo-mark">H</span>
          <span className="hz-logo hidden sm:block">Halozon</span>
        </Link>
        <form onSubmit={submit} className="order-3 w-full md:order-none md:flex-1">
          <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 bg-slate-50 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
            <Search className="ml-3 h-5 w-5 shrink-0 text-brand-600" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search products, brands, and categories"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
              aria-label="Search products"
            />
            <button className="btn btn-primary hidden rounded-none sm:inline-flex" type="submit">Search</button>
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1">
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setAccountOpen(value => !value)}
              className="flex items-center gap-2 rounded-xl p-2 text-left hover:bg-brand-50"
              aria-expanded={accountOpen}
            >
              <User className="h-5 w-5 text-brand-600" />
              <span className="hidden lg:block">
                <small className="block text-slate-500">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small>
                <b className="text-sm">Account <ChevronDown className="ml-1 inline h-3 w-3" /></b>
              </span>
            </button>
            {accountOpen && (
              <div className="surface absolute right-0 top-full mt-2 w-72 p-4 animate-reveal">
                {user ? (
                  <>
                    <div className="mb-3 border-b border-slate-100 pb-3">
                      <b>{user.name}</b>
                      <p className="muted mt-1 text-xs">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Link className="amazon-link" href="/account">Dashboard</Link>
                      <Link className="amazon-link" href="/account/orders">Orders</Link>
                      <Link className="amazon-link" href="/account/wishlist">Wishlist</Link>
                      <Link className="amazon-link" href="/account/addresses">Addresses</Link>
                      {user.role === 'seller' && <Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}
                      {user.role === 'admin' && <Link className="amazon-link" href="/admin">Admin</Link>}
                    </div>
                    <button type="button" onClick={logout} className="btn btn-soft mt-4 w-full">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signin" className="btn btn-primary w-full">Sign in</Link>
                    <Link href="/register" className="amazon-link mt-3 block text-center text-sm">Create account</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <Link href="/account/orders" className="hidden rounded-xl p-2 hover:bg-brand-50 lg:flex" aria-label="Orders">
            <Package className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative rounded-xl p-2 hover:bg-brand-50" aria-label={`Cart${count ? `, ${count} items` : ''}`}>
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl p-2 hover:bg-brand-50 md:hidden" aria-label="Open navigation">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      <nav className="shell hidden gap-5 overflow-x-auto pb-3 text-sm md:flex" aria-label="Categories">
        {categories.map(category => (
          <Link
            className={`whitespace-nowrap font-semibold ${pathname === categoryPath(category) ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`}
            href={categoryPath(category)}
            key={category}
          >
            {category}
          </Link>
        ))}
        <Link className="whitespace-nowrap font-bold text-rose-600" href="/deals">Trending deals</Link>
        <Link className="whitespace-nowrap font-bold text-brand-700" href="/prime">Halozon Plus</Link>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button className="absolute inset-0 bg-slate-950/55" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside className="relative h-full w-full max-w-sm animate-reveal bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2"><span className="hz-logo-mark">H</span><span className="hz-logo">Halozon</span></Link>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-xl p-2 hover:bg-slate-100" aria-label="Close navigation"><X /></button>
            </div>
            <div className="mb-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <b className="block text-slate-900">Explore with intention</b>
              <span className="mt-1 block">Browse by department or jump into the latest drops.</span>
            </div>
            <nav className="space-y-1" aria-label="Mobile categories">
              {categories.map(category => <Link key={category} href={categoryPath(category)} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 font-semibold hover:bg-brand-50">{category}</Link>)}
              <Link href="/deals" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 font-bold text-rose-600 hover:bg-rose-50">Trending deals</Link>
              <Link href="/prime" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 font-bold text-brand-700 hover:bg-brand-50">Halozon Plus</Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
