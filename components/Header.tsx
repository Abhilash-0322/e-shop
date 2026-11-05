'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, LogOut, Menu, Package, Search, ShoppingCart, User, X } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

type UserData = { id: string; name: string; email: string; role: string } | null;
const fallbackCategories = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({ user }: { user: UserData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count, syncing } = useCart();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/categories', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Categories unavailable'))))
      .then((data) => {
        if (!controller.signal.aborted && data.items?.length) setCategories(data.items.map((item: any) => item.name));
      })
      .catch((caught: any) => {
        if (caught?.name !== 'AbortError') setCategories(fallbackCategories);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : '/search');
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setOpen(false);
      router.refresh();
    }
  }

  const categoryHref = (category: string) =>
    `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce4e5] bg-[#f6f7f3]/95 backdrop-blur-xl">
      <div className="shell flex items-center gap-3 py-3 md:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Halozon home">
          <span className="hz-logo-mark">H</span>
          <span className="hz-logo hidden sm:block">Halozon</span>
        </Link>
        <form onSubmit={submit} className="max-w-3xl flex-1">
          <div className="flex items-center overflow-hidden rounded-xl border border-[#c8d5d7] bg-white shadow-sm focus-within:border-[#e35d43] focus-within:ring-4 focus-within:ring-[#e35d43]/10">
            <Search className="ml-3 h-5 w-5 text-[#0f766e]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands, categories" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" aria-label="Search products" />
            <button className="btn btn-primary !rounded-none" type="submit">Search</button>
          </div>
        </form>
        <div className="flex items-center gap-1">
          <div className="relative hidden md:block">
            <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#e3f1ed]" aria-expanded={open} aria-label="Account menu">
              <User className="h-5 w-5 text-[#0f766e]" />
              <span className="hidden text-left text-sm lg:block"><small className="block text-slate-500">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small><b>Account</b><ChevronDown className="ml-1 inline h-3 w-3" /></span>
            </button>
            {open && <div className="surface absolute right-0 top-full mt-2 w-72 p-4 animate-reveal">{user ? <><div className="mb-3 border-b border-[#dce4e5] pb-3"><b>{user.name}</b><p className="muted text-xs">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="amazon-link" href="/account">Dashboard</Link><Link className="amazon-link" href="/account/orders">Orders</Link><Link className="amazon-link" href="/account/wishlist">Wishlist</Link><Link className="amazon-link" href="/account/addresses">Addresses</Link>{user.role === 'seller' && <Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}{user.role === 'admin' && <Link className="amazon-link" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="h-4 w-4" /> Sign out</button></> : <><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="amazon-link mt-3 block text-center text-sm">Create account</Link></>}</div>}
          </div>
          <Link href="/account/orders" className="hidden rounded-xl p-2 hover:bg-[#e3f1ed] lg:flex" aria-label="Orders"><Package className="h-5 w-5" /></Link>
          <Link href="/cart" className="relative rounded-xl p-2 hover:bg-[#e3f1ed]" aria-label="Cart"><ShoppingCart className="h-6 w-6" />{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e35d43] px-1 text-[10px] font-bold text-white">{count}</span>}{syncing && <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#0f766e]" aria-label="Cart syncing" />}</Link>
          <button onClick={() => setMobile(true)} className="p-2 md:hidden" aria-label="Open navigation"><Menu /></button>
        </div>
      </div>
      <nav className="shell flex gap-5 overflow-x-auto pb-3 text-sm" aria-label="Categories">{categories.map((category) => <Link className={`whitespace-nowrap font-bold ${pathname === categoryHref(category) ? 'text-[#bd4532]' : 'text-slate-600 hover:text-[#bd4532]'}`} href={categoryHref(category)} key={category}>{category}</Link>)}<Link className="whitespace-nowrap font-black text-[#bd4532]" href="/deals">Trending deals</Link><Link className="whitespace-nowrap font-black text-[#0f766e]" href="/prime">Halozon Plus</Link></nav>
      {mobile && <div className="fixed inset-0 z-[60]"><button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobile(false)} aria-label="Close navigation" /><aside className="relative h-full w-full max-w-sm animate-reveal bg-[#f6f7f3] p-5"><div className="mb-5 flex items-center justify-between"><b className="text-xl">Explore Halozon</b><button onClick={() => setMobile(false)} aria-label="Close"><X /></button></div>{categories.map((category) => <Link key={category} href={categoryHref(category)} onClick={() => setMobile(false)} className="block rounded-xl p-3 font-semibold hover:bg-[#e3f1ed]">{category}</Link>)}<Link href="/deals" onClick={() => setMobile(false)} className="block rounded-xl p-3 font-black text-[#bd4532]">Trending deals</Link><Link href="/prime" onClick={() => setMobile(false)} className="block rounded-xl p-3 font-black text-[#0f766e]">Halozon Plus</Link></aside></div>}
    </header>
  );
}
