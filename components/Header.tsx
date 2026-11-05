'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, LogOut, Menu, Package, Search, ShoppingCart, User, X } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

type UserData = { id: string; name: string; email: string; role: string } | null;
const defaultCategories = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({ user }: { user: UserData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count } = useCart();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    let alive = true;
    fetch('/api/categories').then((r) => r.json()).then((data) => {
      if (alive && data.items?.length) setCategories(data.items.map((item: any) => item.name));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAccountOpen(false);
    router.refresh();
  }

  const categoryUrl = (category: string) => `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;
  const isCurrent = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="shell py-2.5 md:py-3">
          <div className="flex items-center gap-2.5 md:gap-4">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Halozon home">
              <span className="hz-logo-mark">H</span>
              <span className="hz-logo hidden sm:block">Halozon</span>
            </Link>
            <form onSubmit={submit} className="order-3 w-full md:order-none md:flex-1 md:max-w-3xl">
              <div className="flex min-h-11 items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                <Search className="ml-3 h-5 w-5 shrink-0 text-violet-500" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, or categories" aria-label="Search products" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" />
                <button className="hidden min-h-11 bg-violet-600 px-4 text-sm font-extrabold text-white transition hover:bg-violet-700 md:block">Search</button>
              </div>
            </form>
            <div className="ml-auto flex items-center gap-0.5">
              <div className="relative hidden md:block">
                <button onClick={() => setAccountOpen((value) => !value)} className="flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-left transition hover:bg-violet-50" aria-expanded={accountOpen} aria-haspopup="menu">
                  <User className="h-5 w-5 text-violet-600" aria-hidden="true" />
                  <span className="hidden text-sm lg:block"><small className="block text-slate-500">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small><b>Account</b></span>
                  <ChevronDown className="hidden h-3.5 w-3.5 lg:block" aria-hidden="true" />
                </button>
                {accountOpen && <div className="surface absolute right-0 top-full mt-2 w-72 p-4 animate-reveal" role="menu">
                  {user ? <>
                    <div className="mb-3 border-b border-slate-100 pb-3"><b>{user.name}</b><p className="text-xs muted">{user.email}</p></div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Link role="menuitem" className="amazon-link rounded-lg p-2 hover:bg-violet-50" href="/account">Dashboard</Link>
                      <Link role="menuitem" className="amazon-link rounded-lg p-2 hover:bg-violet-50" href="/account/orders">Orders</Link>
                      <Link role="menuitem" className="amazon-link rounded-lg p-2 hover:bg-violet-50" href="/account/wishlist">Wishlist</Link>
                      <Link role="menuitem" className="amazon-link rounded-lg p-2 hover:bg-violet-50" href="/account/addresses">Addresses</Link>
                      {user.role === 'seller' && <Link role="menuitem" className="amazon-link rounded-lg p-2 hover:bg-violet-50" href="/seller/dashboard">Seller hub</Link>}
                      {user.role === 'admin' && <Link role="menuitem" className="amazon-link rounded-lg p-2 hover:bg-violet-50" href="/admin">Admin</Link>}
                    </div>
                    <button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="h-4 w-4" /> Sign out</button>
                  </> : <>
                    <Link href="/signin" className="btn btn-primary w-full">Sign in</Link>
                    <Link href="/register" className="mt-3 block text-center text-sm amazon-link">Create account</Link>
                  </>}
                </div>}
              </div>
              <Link href="/account/orders" className="tap-target hidden rounded-xl hover:bg-violet-50 lg:inline-flex" aria-label="Your orders"><Package className="h-5 w-5" /></Link>
              <Link href="/cart" className="tap-target relative rounded-xl hover:bg-violet-50" aria-label={`Cart${count ? `, ${count} items` : ''}`}>
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {count > 0 && <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-black text-white">{count}</span>}
              </Link>
              <button onClick={() => setMobileOpen(true)} className="tap-target rounded-xl hover:bg-violet-50 md:hidden" aria-label="Open navigation" aria-expanded={mobileOpen}><Menu className="h-5 w-5" /></button>
            </div>
          </div>
          <nav className="rail mt-2 gap-5 pb-0 text-sm md:mt-3" aria-label="Shop by category">
            {categories.map((category) => <Link className={`whitespace-nowrap font-bold ${pathname === categoryUrl(category) ? 'text-violet-700' : 'text-slate-600 hover:text-violet-700'}`} href={categoryUrl(category)} key={category}>{category}</Link>)}
            <Link className="whitespace-nowrap font-black text-pink-600" href="/deals">Trending deals</Link>
            <Link className="whitespace-nowrap font-black text-sky-600" href="/prime">Halozon Plus</Link>
          </nav>
        </div>
      </header>

      {mobileOpen && <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
        <aside className="relative h-full w-[min(88vw,23rem)] overflow-y-auto bg-white p-5 shadow-2xl animate-reveal">
          <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2"><span className="hz-logo-mark">H</span><b className="text-xl tracking-tight">Explore Halozon</b></div><button onClick={() => setMobileOpen(false)} className="tap-target rounded-xl hover:bg-slate-100" aria-label="Close navigation"><X /></button></div>
          {user ? <div className="mb-4 rounded-2xl bg-violet-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-violet-600">Signed in as</p><b className="mt-1 block">{user.name}</b><Link href="/account" onClick={() => setMobileOpen(false)} className="mt-2 inline-block text-sm amazon-link">Open account →</Link></div> : <div className="mb-4 grid grid-cols-2 gap-2"><Link href="/signin" onClick={() => setMobileOpen(false)} className="btn btn-primary">Sign in</Link><Link href="/register" onClick={() => setMobileOpen(false)} className="btn btn-soft">Register</Link></div>}
          <p className="eyebrow mb-2">Shop departments</p>
          <nav className="space-y-1">{categories.map((category) => <Link key={category} href={categoryUrl(category)} onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-bold hover:bg-violet-50">{category}</Link>)}</nav>
          <div className="mt-4 border-t border-slate-100 pt-4"><Link href="/deals" onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-black text-pink-600 hover:bg-pink-50">Trending deals</Link><Link href="/prime" onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-black text-sky-600 hover:bg-sky-50">Halozon Plus</Link></div>
        </aside>
      </div>}

      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        <Link href="/" aria-current={isCurrent('/') ? 'page' : undefined}><span aria-hidden="true">⌂</span><span>Home</span></Link>
        <Link href="/search" aria-current={isCurrent('/search') ? 'page' : undefined}><Search className="h-4 w-4" /><span>Discover</span></Link>
        <Link href={user ? '/account/orders' : '/signin'} aria-current={isCurrent('/account/orders') ? 'page' : undefined}><Package className="h-4 w-4" /><span>Orders</span></Link>
        <Link href="/cart" aria-current={isCurrent('/cart') ? 'page' : undefined}><ShoppingCart className="h-4 w-4" /><span>Cart{count > 0 ? ` · ${count}` : ''}</span></Link>
      </nav>
    </>
  );
}
