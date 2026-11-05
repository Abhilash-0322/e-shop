'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Menu, Package, Search, ShoppingCart, User, X } from '@/lib/icons';
import { useCart } from '@/hooks/useCart';

type UserData = { id: string; name: string; email: string; role: string } | null;
const defaults = ['Electronics', 'Computers', 'Smart Home', 'Books', 'Fashion', 'Home & Kitchen', 'Games'];

export default function Header({ user }: { user: UserData }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { count } = useCart();
  const [q, setQ] = useState(sp.get('q') || '');
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [categories, setCategories] = useState(defaults);

  useEffect(() => {
    let alive = true;
    fetch('/api/categories').then((r) => r.json()).then((d) => {
      if (alive && d.items?.length) setCategories(d.items.map((x: { name: string }) => x.name));
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
    <header className="sticky top-0 z-50 border-b-2 border-black bg-[#f4f1e8]">
      <div className="bg-black text-white">
        <div className="shell flex items-center gap-3 py-2 text-[11px] font-black uppercase tracking-widest">
          <span className="text-[#d7ff3f]">HZN / 2026</span>
          <span className="hidden sm:block text-white/60">Independent marketplace protocol</span>
          <span className="ml-auto text-[#d7ff3f]">Online / 24:7</span>
        </div>
      </div>
      <div className="shell flex items-center gap-3 py-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Halozon home">
          <span className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#d7ff3f] text-xl font-black shadow-[3px_3px_0_#ff5c35]">H</span>
          <span className="hidden sm:block text-xl font-black uppercase tracking-[-.08em]">Halozon</span>
        </Link>
        <form onSubmit={submit} className="flex-1">
          <div className="flex items-center border-2 border-black bg-white">
            <Search className="ml-3 h-5 w-5" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the marketplace" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" />
            <button className="border-l-2 border-black bg-[#d7ff3f] px-4 py-3 text-xs font-black uppercase hover:bg-[#ff5c35]" type="submit">Search</button>
          </div>
        </form>
        <div className="flex items-center gap-1">
          <div className="relative hidden md:block">
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 border-2 border-transparent p-2 text-left hover:border-black" aria-expanded={open}>
              <User className="h-5 w-5" />
              <span className="hidden lg:block text-xs"><small className="block text-gray-600">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small><b>Account</b><ChevronDown className="ml-1 inline h-3 w-3" /></span>
            </button>
            {open && <div className="surface absolute right-0 top-full z-50 mt-2 w-72 p-4 animate-reveal">
              {user ? <><div className="mb-3 border-b-2 border-black pb-3"><b>{user.name}</b><p className="text-xs muted">{user.email}</p></div><div className="grid grid-cols-2 gap-2 text-sm"><Link className="amazon-link" href="/account">Dashboard</Link><Link className="amazon-link" href="/account/orders">Orders</Link><Link className="amazon-link" href="/account/wishlist">Wishlist</Link><Link className="amazon-link" href="/account/addresses">Addresses</Link>{user.role === 'seller' && <Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}{user.role === 'admin' && <Link className="amazon-link" href="/admin">Admin</Link>}</div><button onClick={logout} className="btn btn-soft mt-4 w-full">Sign out</button></> : <><Link href="/signin" className="btn btn-primary w-full">Sign in</Link><Link href="/register" className="mt-3 block text-center amazon-link text-sm">Create account</Link></>}
            </div>}
          </div>
          <Link href="/account/orders" className="hidden border-2 border-transparent p-2 hover:border-black lg:flex" aria-label="Orders"><Package className="h-5 w-5" /></Link>
          <Link href="/cart" className="relative border-2 border-transparent p-2 hover:border-black" aria-label="Cart"><ShoppingCart className="h-6 w-6" />{count > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center border-2 border-black bg-[#ff5c35] px-1 text-[10px] font-black">{count}</span>}</Link>
          <button onClick={() => setMobile(true)} className="border-2 border-transparent p-2 hover:border-black md:hidden" aria-label="Open navigation"><Menu /></button>
        </div>
      </div>
      <nav className="shell flex gap-5 overflow-x-auto border-t-2 border-black py-2 text-xs font-black uppercase tracking-wide">
        {categories.map((c) => <Link className={`whitespace-nowrap ${pathname === cat(c) ? 'text-[#ff5c35] underline decoration-2 underline-offset-4' : 'hover:text-[#ff5c35]'}`} href={cat(c)} key={c}>{c}</Link>)}
        <Link className="whitespace-nowrap text-[#ff5c35]" href="/deals">Deals ↗</Link>
        <Link className="whitespace-nowrap text-[#16803c]" href="/prime">Plus ↗</Link>
      </nav>
      {mobile && <div className="fixed inset-0 z-[60]"><button className="absolute inset-0 bg-black/60" onClick={() => setMobile(false)} aria-label="Close navigation" /><aside className="relative h-full w-full max-w-sm border-r-2 border-black bg-[#f4f1e8] p-5 animate-reveal"><div className="mb-5 flex items-center justify-between"><b className="text-xl uppercase">Explore HZN</b><button onClick={() => setMobile(false)} aria-label="Close"><X /></button></div>{categories.map((c) => <Link key={c} href={cat(c)} onClick={() => setMobile(false)} className="block border-b-2 border-black py-3 font-black uppercase">{c}</Link>)}<Link href="/deals" onClick={() => setMobile(false)} className="block py-3 font-black uppercase text-[#ff5c35]">Trending deals ↗</Link></aside></div>}
    </header>
  );
}
