'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Search, ShoppingCart, Menu, X, ChevronDown, User, Package, LogOut} from '@/lib/icons';
import {useCart} from '@/hooks/useCart';
import LocaleSelector from './LocaleSelector';

type UserData = {id: string; name: string; email: string; role: string} | null;
const defaultCategories = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({user}: {user: UserData}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const {count} = useCart();
  const [q, setQ] = useState(sp.get('q') || '');
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [categories, setCategories] = useState<string[]>(defaultCategories);

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

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = q.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  }

  async function logout() {
    await fetch('/api/auth/logout', {method: 'POST'});
    router.refresh();
  }

  const categoryHref = (value: string) => `/category/${value.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="shell flex flex-wrap items-center gap-3 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Halozon home">
          <span className="hz-logo-mark">H</span>
          <span className="hz-logo hidden sm:block">Halozon</span>
        </Link>
        <form onSubmit={submit} className="order-3 basis-full md:order-none md:min-w-0 md:flex-1">
          <div className="flex min-w-0 items-center overflow-hidden rounded-xl border border-slate-300 bg-slate-50 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
            <Search className="ml-3 h-5 w-5 shrink-0 text-indigo-500" aria-hidden="true"/>
            <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search products, brands, categories" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" aria-label="Search products"/>
            <button className="btn btn-primary shrink-0 !rounded-none">Search</button>
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1">
          <div className="hidden xl:block"><LocaleSelector compact idPrefix="header-locale"/></div>
          <div className="relative hidden md:block">
            <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-xl p-2 hover:bg-indigo-50" aria-haspopup="menu" aria-expanded={open}>
              <User className="h-5 w-5 text-indigo-600" aria-hidden="true"/>
              <span className="hidden text-left text-sm lg:block"><small className="block text-slate-500">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small><b>Account</b><ChevronDown className="ml-1 inline h-3 w-3" aria-hidden="true"/></span>
            </button>
            {open && <div className="surface absolute right-0 top-full mt-2 w-[min(18rem,calc(100vw-2rem))] p-4 animate-reveal" role="menu">
              {user ? <><div className="mb-3 border-b pb-3"><b className="text-wrap">{user.name}</b><p className="muted text-xs text-wrap">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="amazon-link text-wrap" href="/account">Dashboard</Link><Link className="amazon-link text-wrap" href="/account/orders">Orders</Link><Link className="amazon-link text-wrap" href="/account/wishlist">Wishlist</Link><Link className="amazon-link text-wrap" href="/account/addresses">Addresses</Link>{user.role === 'seller' && <Link className="amazon-link text-wrap" href="/seller/dashboard">Seller hub</Link>}{user.role === 'admin' && <Link className="amazon-link text-wrap" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="h-4 w-4" aria-hidden="true"/>Sign out</button></> : <><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="amazon-link mt-3 block text-center text-sm">Create account</Link></>}
            </div>}
          </div>
          <Link href="/account/orders" className="hidden rounded-xl p-2 hover:bg-indigo-50 lg:flex" aria-label="Orders"><Package className="h-5 w-5" aria-hidden="true"/></Link>
          <Link href="/cart" className="relative rounded-xl p-2 hover:bg-indigo-50" aria-label={`Cart, ${count} items`}><ShoppingCart className="h-6 w-6" aria-hidden="true"/>{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[10px] font-bold text-white">{count}</span>}</Link>
          <button onClick={() => setMobile(true)} className="p-2 md:hidden" aria-label="Open navigation"><Menu aria-hidden="true"/></button>
        </div>
      </div>
      <nav className="shell flex gap-5 overflow-x-auto pb-3 text-sm" aria-label="Primary">
        {categories.map((category) => <Link className={`whitespace-nowrap font-medium ${pathname === categoryHref(category) ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700'}`} href={categoryHref(category)} key={category}>{category}</Link>)}
        <Link className="whitespace-nowrap font-bold text-fuchsia-600" href="/deals">Trending deals</Link>
        <Link className="whitespace-nowrap font-bold text-sky-600" href="/prime">Halozon Plus</Link>
      </nav>
      {mobile && <div className="fixed inset-0 z-[60]">
        <button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobile(false)} aria-label="Close navigation"/>
        <aside className="relative h-full w-full max-w-sm overflow-y-auto bg-white p-5 animate-reveal" aria-label="Mobile navigation">
          <div className="mb-5 flex items-center justify-between"><b className="text-xl">Explore Halozon</b><button onClick={() => setMobile(false)} aria-label="Close"><X aria-hidden="true"/></button></div>
          <div className="mb-5 rounded-xl bg-slate-50 p-3"><LocaleSelector compact idPrefix="mobile-locale"/></div>
          {categories.map((category) => <Link key={category} href={categoryHref(category)} onClick={() => setMobile(false)} className="text-wrap block rounded-xl p-3 font-semibold hover:bg-indigo-50">{category}</Link>)}
          <Link href="/deals" onClick={() => setMobile(false)} className="block rounded-xl p-3 font-bold text-fuchsia-600">Trending deals</Link>
        </aside>
      </div>}
    </header>
  );
}
