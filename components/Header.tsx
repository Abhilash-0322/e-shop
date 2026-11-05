'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ChevronDown, LogOut, Menu, Package, Search, ShoppingCart, User, X} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';

type UserData = {id: string; name: string; email: string; role: string} | null;
const fallbackCategories = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({user}: {user: UserData}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const {count} = useCart();
  const [q, setQ] = useState(sp.get('q') || '');
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const closeMobileRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setQ(sp.get('q') || '');
  }, [sp]);

  useEffect(() => {
    let alive = true;
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => {
        if (alive && data.items?.length) setCategories(data.items.map((item: {name: string}) => item.name));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', closeMenus);
    return () => window.removeEventListener('keydown', closeMenus);
  }, []);

  useEffect(() => {
    if (mobileOpen) closeMobileRef.current?.focus();
  }, [mobileOpen]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', {method: 'POST'});
    setAccountOpen(false);
    router.refresh();
  }

  const categoryHref = (category: string) => `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="shell flex items-center gap-3 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-lg" aria-label="Halozon home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-700 font-black text-white" aria-hidden="true">H</span>
          <span className="hidden text-xl font-black tracking-tight sm:block">Halozon</span>
        </Link>

        <form onSubmit={submit} className="order-3 w-full md:order-none md:max-w-3xl md:flex-1" role="search">
          <label htmlFor="site-search" className="sr-only">Search products, brands, and categories</label>
          <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-slate-50 focus-within:border-cyan-700 focus-within:bg-white">
            <Search className="ml-3 mt-3 h-5 w-5 shrink-0 text-indigo-700" aria-hidden="true" />
            <input
              id="site-search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search products, brands, categories"
              className="min-h-11 flex-1 bg-transparent px-3 text-sm outline-none"
            />
            <button className="btn btn-primary rounded-none" type="submit">Search</button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setAccountOpen((value) => !value)}
              className="flex min-h-11 items-center gap-2 rounded-xl p-2 hover:bg-indigo-50"
              aria-expanded={accountOpen}
              aria-controls="account-menu"
              aria-haspopup="menu"
            >
              <User className="h-5 w-5 text-indigo-700" aria-hidden="true" />
              <span className="hidden text-left text-sm lg:block">
                <small className="block text-slate-600">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small>
                <b>Account</b>
                <ChevronDown className="ml-1 inline h-3 w-3" aria-hidden="true" />
              </span>
              <span className="sr-only">{accountOpen ? 'Close account menu' : 'Open account menu'}</span>
            </button>
            {accountOpen && (
              <div id="account-menu" className="surface absolute right-0 top-full mt-2 w-72 p-4 animate-reveal" role="menu" aria-label="Account menu">
                {user ? (
                  <>
                    <div className="mb-3 border-b border-slate-200 pb-3">
                      <b>{user.name}</b>
                      <p className="text-xs muted">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Link role="menuitem" className="amazon-link rounded p-1" href="/account" onClick={() => setAccountOpen(false)}>Dashboard</Link>
                      <Link role="menuitem" className="amazon-link rounded p-1" href="/account/orders" onClick={() => setAccountOpen(false)}>Orders</Link>
                      <Link role="menuitem" className="amazon-link rounded p-1" href="/account/wishlist" onClick={() => setAccountOpen(false)}>Wishlist</Link>
                      <Link role="menuitem" className="amazon-link rounded p-1" href="/account/addresses" onClick={() => setAccountOpen(false)}>Addresses</Link>
                      {user.role === 'seller' && <Link role="menuitem" className="amazon-link rounded p-1" href="/seller/dashboard" onClick={() => setAccountOpen(false)}>Seller hub</Link>}
                      {user.role === 'admin' && <Link role="menuitem" className="amazon-link rounded p-1" href="/admin" onClick={() => setAccountOpen(false)}>Admin</Link>}
                    </div>
                    <button type="button" onClick={logout} className="btn btn-soft mt-4 w-full">
                      <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signin" className="btn btn-primary w-full" onClick={() => setAccountOpen(false)}>Sign in</Link>
                    <Link href="/register" className="amazon-link mt-3 block text-center text-sm" onClick={() => setAccountOpen(false)}>Create account</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <Link href="/account/orders" className="hidden min-h-11 items-center rounded-xl p-2 hover:bg-indigo-50 lg:flex" aria-label="View orders">
            <Package className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link href="/cart" className="relative flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 hover:bg-indigo-50" aria-label={`Cart${count ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}>
            <ShoppingCart className="h-6 w-6" aria-hidden="true" />
            {count > 0 && <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-700 px-1 text-[10px] font-bold text-white" aria-hidden="true">{count}</span>}
          </Link>
          <button type="button" onClick={() => setMobileOpen(true)} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-indigo-50 md:hidden" aria-label="Open navigation menu" aria-expanded={mobileOpen} aria-controls="mobile-navigation">
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav className="shell overflow-x-auto pb-3" aria-label="Primary navigation">
        <ul className="flex gap-5 text-sm">
          {categories.map((category) => <li key={category}><Link className={`whitespace-nowrap font-semibold ${pathname === categoryHref(category) ? 'text-indigo-800' : 'text-slate-700 hover:text-indigo-800'}`} href={categoryHref(category)}>{category}</Link></li>)}
          <li><Link className="whitespace-nowrap font-black text-fuchsia-700" href="/deals">Trending deals</Link></li>
          <li><Link className="whitespace-nowrap font-black text-sky-700" href="/prime">Halozon Plus</Link></li>
        </ul>
      </nav>

      {mobileOpen && (
        <div className="dialog-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') setMobileOpen(false); }}>
          <button className="absolute inset-0 bg-transparent" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu" />
          <aside id="mobile-navigation" className="relative h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl animate-reveal" role="dialog" aria-modal="true" aria-labelledby="mobile-navigation-title">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="mobile-navigation-title" className="text-xl font-black">Explore Halozon</h2>
              <button ref={closeMobileRef} type="button" onClick={() => setMobileOpen(false)} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-indigo-50" aria-label="Close navigation menu">
                <X aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile categories">
              <ul>
                {categories.map((category) => <li key={category}><Link href={categoryHref(category)} onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-semibold hover:bg-indigo-50">{category}</Link></li>)}
                <li><Link href="/deals" onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-bold text-fuchsia-700">Trending deals</Link></li>
                <li><Link href="/prime" onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-bold text-sky-700">Halozon Plus</Link></li>
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
