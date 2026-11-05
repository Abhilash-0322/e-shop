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
  const sp = useSearchParams();
  const { count, items } = useCart();
  const [q, setQ] = useState(sp.get('q') || '');
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    let alive = true;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (alive && d.items?.length) setCategories(d.items.map((x: { name: string }) => x.name));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!accountOpen && !cartOpen && !mobile) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setCartOpen(false);
        setMobile(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [accountOpen, cartOpen, mobile]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = q.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAccountOpen(false);
    router.refresh();
  }

  const categoryHref = (category: string) =>
    `/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe5dc] bg-[#f7f8f3]/95 backdrop-blur-xl">
      <div className="bg-[#17221c] text-[#d7f36b]">
        <div className="shell flex items-center justify-between gap-4 py-2 text-[11px] font-bold tracking-wide">
          <span>Thoughtful products. Clear value. Happier carts.</span>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/help" className="hover:text-white">Need help?</Link>
            <Link href="/seller/apply" className="hover:text-white">Sell with us</Link>
          </div>
        </div>
      </div>
      <div className="shell flex items-center gap-3 py-3 md:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Halozon home">
          <span className="hz-logo-mark">H</span>
          <span className="hz-logo hidden sm:block">Halozon</span>
        </Link>
        <form onSubmit={submit} className="flex-1">
          <div className="flex items-center overflow-hidden rounded-xl border border-[#cbd6ca] bg-white transition focus-within:border-[#9bb85c] focus-within:ring-4 focus-within:ring-[#d7f36b]/40">
            <Search className="ml-3 h-5 w-5 shrink-0 text-[#728749]" />
            <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search products, brands, categories" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" />
            <button className="btn btn-primary !rounded-none !px-4" aria-label="Submit search">Search</button>
          </div>
        </form>
        <div className="flex items-center gap-1">
          <div className="relative hidden md:block">
            <button onClick={() => { setAccountOpen((value) => !value); setCartOpen(false); }} className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#edf1e9]" aria-expanded={accountOpen}>
              <User className="h-5 w-5 text-[#728749]" />
              <span className="hidden text-left text-sm lg:block">
                <small className="block text-[#526259]">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</small>
                <b>Account</b><ChevronDown className="ml-1 inline h-3 w-3" />
              </span>
            </button>
            {accountOpen && (
              <div className="surface animate-reveal absolute right-0 top-full mt-2 w-72 p-4">
                {user ? (
                  <>
                    <div className="mb-3 border-b border-[#dfe5dc] pb-3"><b>{user.name}</b><p className="muted text-xs">{user.email}</p></div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Link className="amazon-link" href="/account">Dashboard</Link>
                      <Link className="amazon-link" href="/account/orders">Orders</Link>
                      <Link className="amazon-link" href="/account/wishlist">Wishlist</Link>
                      <Link className="amazon-link" href="/account/addresses">Addresses</Link>
                      {user.role === 'seller' && <Link className="amazon-link" href="/seller/dashboard">Seller hub</Link>}
                      {user.role === 'admin' && <Link className="amazon-link" href="/admin">Admin</Link>}
                    </div>
                    <button onClick={logout} className="btn btn-soft mt-4 w-full"><LogOut className="h-4 w-4" />Sign out</button>
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
          <Link href="/account/orders" className="hidden rounded-xl p-2 hover:bg-[#edf1e9] lg:flex" aria-label="Orders"><Package className="h-5 w-5" /></Link>
          <div className="relative">
            <button onClick={() => { setCartOpen((value) => !value); setAccountOpen(false); }} className="relative rounded-xl p-2 hover:bg-[#edf1e9]" aria-label="Open cart preview" aria-expanded={cartOpen}>
              <ShoppingCart className="h-6 w-6" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff765c] px-1 text-[10px] font-black text-white">{count}</span>}
            </button>
            {cartOpen && (
              <div className="surface animate-reveal absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] p-4">
                <div className="flex items-center justify-between"><div><p className="eyebrow">Your bag</p><b>{count ? `${count} item${count === 1 ? '' : 's'}` : 'Nothing here yet'}</b></div><span className="font-black">${cartTotal.toFixed(2)}</span></div>
                {items.length ? <div className="mt-3 max-h-64 space-y-3 overflow-auto">{items.slice(0, 3).map((item) => <div className="flex gap-3" key={String(item.productId)}><img src={item.image || '/placeholder-product.svg'} alt="" className="h-12 w-12 rounded-lg bg-[#edf1e9] object-contain" /><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold">{item.title}</p><small className="muted">Qty {item.qty}</small></div><b className="text-sm">${(item.price * item.qty).toFixed(2)}</b></div>)}</div> : <p className="muted mt-4 text-sm">Save a few favorites here when you find them.</p>}
                <div className="mt-4 flex gap-2"><Link onClick={() => setCartOpen(false)} href="/cart" className="btn btn-primary flex-1">View bag</Link><Link onClick={() => setCartOpen(false)} href="/checkout" className="btn btn-dark flex-1">Checkout</Link></div>
              </div>
            )}
          </div>
          <button onClick={() => setMobile(true)} className="p-2 md:hidden" aria-label="Open navigation"><Menu /></button>
        </div>
      </div>
      <nav className="shell flex gap-5 overflow-x-auto pb-3 text-sm">
        {categories.map((category) => <Link className={`whitespace-nowrap font-bold ${pathname === categoryHref(category) ? 'text-[#405719]' : 'text-[#526259] hover:text-[#405719]'}`} href={categoryHref(category)} key={category}>{category}</Link>)}
        <Link className="whitespace-nowrap font-black text-[#ff765c]" href="/deals">Trending deals</Link>
        <Link className="whitespace-nowrap font-black text-[#405719]" href="/prime">Halozon Plus</Link>
      </nav>
      {mobile && (
        <div className="fixed inset-0 z-[60]">
          <button className="absolute inset-0 bg-[#17221c]/60" onClick={() => setMobile(false)} aria-label="Close navigation" />
          <aside className="relative h-full w-full max-w-sm animate-reveal bg-[#f7f8f3] p-5">
            <div className="mb-5 flex items-center justify-between"><b className="text-xl">Explore Halozon</b><button onClick={() => setMobile(false)} aria-label="Close"><X /></button></div>
            <Link href="/search" onClick={() => setMobile(false)} className="mb-3 block rounded-xl bg-[#d7f36b] p-3 font-black">Browse everything</Link>
            {categories.map((category) => <Link key={category} href={categoryHref(category)} onClick={() => setMobile(false)} className="block rounded-xl p-3 font-semibold hover:bg-[#edf1e9]">{category}</Link>)}
            <Link href="/deals" onClick={() => setMobile(false)} className="block rounded-xl p-3 font-black text-[#ff765c]">Trending deals</Link>
            <Link href={user ? '/account' : '/signin'} onClick={() => setMobile(false)} className="mt-5 block rounded-xl border border-[#dfe5dc] p-3 font-bold">{user ? 'Your account' : 'Sign in'}</Link>
          </aside>
        </div>
      )}
    </header>
  );
}
