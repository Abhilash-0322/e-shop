'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, LogOut, Menu, Package, Search, ShoppingCart, User, X } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

type UserData = { id: string; name: string; email: string; role: string } | null;
const defaults = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({ user }: { user: UserData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count } = useCart();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [categories, setCategories] = useState(defaults);

  useEffect(() => {
    let alive = true;
    fetch('/api/categories').then((r) => r.json()).then((d) => {
      if (alive && d.items?.length) setCategories(d.items.map((x: any) => x.name));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  }

  const cat = (x: string) => `/category/${x.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100/80 bg-[#f8f8fd]/90 backdrop-blur-2xl">
      <div className="shell flex items-center gap-3 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Halozon home">
          <span className="hz-logo-mark">H</span>
          <span className="hz-logo hidden sm:block">Halozon</span>
        </Link>
        <form onSubmit={submit} className="flex-1 max-w-3xl mx-auto">
          <div className="flex items-center rounded-2xl border border-indigo-100 bg-white/75 shadow-[0_8px_22px_rgba(61,49,150,.06)] focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100/70 overflow-hidden">
            <Search className="ml-3.5 w-5 h-5 text-indigo-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands, categories" className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm" />
            <button className="btn btn-primary !rounded-xl !m-1 !py-2">Search</button>
          </div>
        </form>
        <div className="flex items-center gap-1">
          <div className="relative hidden md:block">
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-50" aria-expanded={open}>
              <User className="w-5 h-5 text-indigo-600" />
              <span className="hidden lg:block text-left text-sm"><small className="block text-slate-500">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small><b>Account</b><ChevronDown className="inline w-3 h-3 ml-1" /></span>
            </button>
            {open && <div className="absolute right-0 top-full mt-2 w-72 surface p-4 animate-reveal">
              {user ? <><div className="border-b border-indigo-100 pb-3 mb-3"><b>{user.name}</b><p className="text-xs muted">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="amazon-link" href="/account">Dashboard</Link><Link className="amazon-link" href="/account/orders">Orders</Link><Link className="amazon-link" href="/account/wishlist">Wishlist</Link><Link className="amazon-link" href="/account/addresses">Addresses</Link>{user.role === 'seller' && <Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}{user.role === 'admin' && <Link className="amazon-link" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="w-4 h-4" />Sign out</button></> : <><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="block text-center amazon-link text-sm mt-3">Create account</Link></>}
            </div>}
          </div>
          <Link href="/account/orders" className="hidden lg:flex p-2 rounded-xl hover:bg-indigo-50" aria-label="Orders"><Package className="w-5 h-5" /></Link>
          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-indigo-50" aria-label="Cart"><ShoppingCart className="w-6 h-6" />{count > 0 && <span className="absolute -top-1 -right-1 bg-fuchsia-600 text-white rounded-full min-w-5 h-5 text-[10px] flex items-center justify-center font-bold">{count}</span>}</Link>
          <button onClick={() => setMobile(true)} className="md:hidden p-2" aria-label="Open navigation"><Menu /></button>
        </div>
      </div>
      <nav className="shell rail flex gap-5 overflow-x-auto pb-3 text-sm" aria-label="Departments">
        {categories.map((c) => <Link className={`whitespace-nowrap font-semibold ${pathname === cat(c) ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700'}`} href={cat(c)} key={c}>{c}</Link>)}
        <Link className="whitespace-nowrap font-bold text-fuchsia-600" href="/deals">Trending deals</Link>
        <Link className="whitespace-nowrap font-bold text-sky-600" href="/prime">Halozon Plus</Link>
      </nav>
      {mobile && <div className="fixed inset-0 z-[60]"><button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobile(false)} aria-label="Close navigation" /><aside className="relative w-full max-w-sm bg-white h-full p-5 animate-reveal"><div className="flex justify-between items-center mb-5"><b className="text-xl">Explore Halozon</b><button onClick={() => setMobile(false)} aria-label="Close"><X /></button></div>{categories.map((c) => <Link key={c} href={cat(c)} onClick={() => setMobile(false)} className="block rounded-xl p-3 hover:bg-indigo-50 font-semibold">{c}</Link>)}<Link href="/deals" onClick={() => setMobile(false)} className="block rounded-xl p-3 text-fuchsia-600 font-bold">Trending deals</Link></aside></div>}
    </header>
  );
}
