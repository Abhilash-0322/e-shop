'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {ChevronDown, LogOut, Menu, Package, Search, ShoppingCart, User, X} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';

export type UserData = {id: string; name: string; email: string; role: string} | null;

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
  const searchKey = searchParams.toString();

  useEffect(() => {
    setQuery(new URLSearchParams(searchKey).get('q') || '');
  }, [searchKey]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/categories', {signal: controller.signal})
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted && data.items?.length) {
          setCategories(data.items.map((item: {name: string}) => item.name));
        }
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          // Keep the static navigation available if categories are unavailable.
        }
      });

    return () => controller.abort();
  }, []);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', {method: 'POST'});
    setAccountOpen(false);
    router.refresh();
  }

  const categoryHref = (category: string) =>
    `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="shell flex items-center gap-3 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Halozon home">
          <span className="hz-logo-mark">H</span>
          <span className="hz-logo hidden sm:block">Halozon</span>
        </Link>
        <form onSubmit={submit} className="flex-1">
          <div className="flex min-w-0 items-center overflow-hidden rounded-xl border border-slate-300 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
            <Search className="ml-3 h-5 w-5 shrink-0 text-indigo-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands, categories"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
              aria-label="Search products"
            />
            <button className="btn btn-primary !rounded-none" type="submit">Search</button>
          </div>
        </form>
        <div className="flex items-center gap-1">
          <div className="relative hidden md:block">
            <button
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl p-2 hover:bg-indigo-50"
              aria-expanded={accountOpen}
              aria-haspopup="menu"
            >
              <User className="h-5 w-5 text-indigo-600" />
              <span className="hidden text-left text-sm lg:block">
                <small className="block text-slate-500">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small>
                <b>Account</b>
                <ChevronDown className="ml-1 inline h-3 w-3" />
              </span>
            </button>
            {accountOpen && (
              <div className="surface animate-reveal absolute right-0 top-full mt-2 w-72 p-4" role="menu">
                {user ? (
                  <>
                    <div className="mb-3 border-b pb-3">
                      <b>{user.name}</b>
                      <p className="muted text-xs">{user.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Link className="amazon-link" href="/account">Dashboard</Link>
                      <Link className="amazon-link" href="/account/orders">Orders</Link>
                      <Link className="amazon-link" href="/account/wishlist">Wishlist</Link>
                      <Link className="amazon-link" href="/account/addresses">Addresses</Link>
                      {user.role === 'seller' && <Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}
                      {user.role === 'admin' && <Link className="amazon-link" href="/admin">Admin</Link>}
                    </div>
                    <button onClick={logout} className="btn btn-soft mt-4 w-full">
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
          <Link href="/account/orders" className="hidden rounded-xl p-2 hover:bg-indigo-50 lg:flex" aria-label="Orders">
            <Package className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative rounded-xl p-2 hover:bg-indigo-50" aria-label={`Cart${count ? `, ${count} items` : ''}`}>
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-600 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          <button onClick={() => setMobileOpen(true)} className="p-2 md:hidden" aria-label="Open navigation">
            <Menu />
          </button>
        </div>
      </div>
      <nav className="shell flex gap-5 overflow-x-auto pb-3 text-sm" aria-label="Categories">
        {categories.map((category) => (
          <Link
            className={`whitespace-nowrap font-medium ${pathname === categoryHref(category) ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700'}`}
            href={categoryHref(category)}
            key={category}
          >
            {category}
          </Link>
        ))}
        <Link className="whitespace-nowrap font-bold text-fuchsia-600" href="/deals">Trending deals</Link>
        <Link className="whitespace-nowrap font-bold text-sky-600" href="/prime">Halozon Plus</Link>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          <button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside className="animate-reveal relative h-full w-full max-w-sm bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <b className="text-xl">Explore Halozon</b>
              <button onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button>
            </div>
            {categories.map((category) => (
              <Link key={category} href={categoryHref(category)} onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-semibold hover:bg-indigo-50">
                {category}
              </Link>
            ))}
            <Link href="/deals" onClick={() => setMobileOpen(false)} className="block rounded-xl p-3 font-bold text-fuchsia-600">Trending deals</Link>
          </aside>
        </div>
      )}
    </header>
  );
}
