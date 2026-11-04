'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  User,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

type User = { id: string; name: string; email: string; role: string } | null;

const CATS = [
  'Electronics',
  'Computers',
  'Smart Home',
  'Books',
  'Fashion',
  'Home & Kitchen',
  'Games',
  'Music',
];

export default function Header({ user }: { user: User }) {
  const router = useRouter();
  const sp = useSearchParams();
  const initialQ = sp.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [showCat, setShowCat] = useState(false);
  const [showAcc, setShowAcc] = useState(false);
  const [cats, setCats] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        setCats((d.items || []).map((c: { name: string }) => c.name));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    router.push(`/search?${params.toString()}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
  }

  const categoryList = cats.length ? cats : CATS;

  function catHref(name: string) {
    return `/category/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'shadow-header' : 'shadow-sm'
      )}
    >
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-screen-2xl mx-auto px-3 md:px-6 py-3 flex items-center gap-3 md:gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Halozon home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-hz-gradient text-white shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="hidden sm:block text-xl font-extrabold tracking-tight">
              <span className="hz-logo">Halozon</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="flex-1 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 rounded-full bg-slate-100/90 border border-slate-200/80 pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-violet-300 focus-within:bg-white transition-all">
              <Search className="w-5 h-5 text-violet-500 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none min-w-0"
              />
              <button type="submit" className="amazon-btn-primary !py-2 !px-4 !text-xs shrink-0">
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setShowAcc(true)}
              onMouseLeave={() => setShowAcc(false)}
            >
              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-violet-50 transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <User className="w-4 h-4" />
                </span>
                <span className="text-left hidden lg:block">
                  <span className="block text-[11px] text-slate-500 leading-none">
                    {user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}
                  </span>
                  <span className="flex items-center gap-0.5 text-sm font-semibold text-slate-800">
                    Account <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </span>
              </button>
              {showAcc && (
                <div className="absolute right-0 top-full pt-2 w-[440px] z-50 animate-slideDown">
                  <div className="bg-white text-amazon-text rounded-2xl shadow-2xl border border-slate-100 p-5 grid grid-cols-2 gap-5">
                    {user ? (
                      <>
                        <div className="col-span-2 flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <div className="font-bold">{user.name}</div>
                            <div className="text-xs text-amazon-textMuted">{user.email}</div>
                          </div>
                          <button type="button" onClick={logout} className="amazon-btn-yellow !text-xs">
                            Sign out
                          </button>
                        </div>
                        <div>
                          <div className="font-bold mb-2 text-violet-700">Your space</div>
                          <ul className="space-y-1.5 text-sm">
                            <li><Link className="amazon-link" href="/account">Dashboard</Link></li>
                            <li><Link className="amazon-link" href="/account/orders">Orders</Link></li>
                            <li><Link className="amazon-link" href="/account/wishlist">Wishlist</Link></li>
                            <li><Link className="amazon-link" href="/account/payment">Payments</Link></li>
                            <li><Link className="amazon-link" href="/account/addresses">Addresses</Link></li>
                          </ul>
                        </div>
                        <div>
                          <div className="font-bold mb-2 text-fuchsia-600">Explore</div>
                          <ul className="space-y-1.5 text-sm">
                            <li><Link className="amazon-link" href="/deals">Flash deals</Link></li>
                            <li><Link className="amazon-link" href="/category/electronics">Electronics</Link></li>
                            <li><Link className="amazon-link" href="/help">Help center</Link></li>
                            <li><Link className="amazon-link" href="/prime">Halozon Plus</Link></li>
                            {user.role === 'seller' && (
                              <li><Link className="amazon-link" href="/seller/dashboard">Seller hub</Link></li>
                            )}
                            {user.role === 'admin' && (
                              <li><Link className="amazon-link" href="/admin">Admin</Link></li>
                            )}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2 flex flex-col items-center gap-3 border-b border-slate-100 pb-4">
                          <Link href="/signin" className="amazon-btn-primary w-full text-center">
                            Sign in
                          </Link>
                          <Link href="/register" className="text-sm amazon-link">
                            New here? Create an account
                          </Link>
                        </div>
                        <div>
                          <div className="font-bold mb-2">Lists</div>
                          <ul className="space-y-1.5 text-sm">
                            <li><Link className="amazon-link" href="/signin">Wishlist</Link></li>
                            <li><Link className="amazon-link" href="/signin">Saved for later</Link></li>
                          </ul>
                        </div>
                        <div>
                          <div className="font-bold mb-2">Orders</div>
                          <ul className="space-y-1.5 text-sm">
                            <li><Link className="amazon-link" href="/signin">Track packages</Link></li>
                            <li><Link className="amazon-link" href="/signin">Returns</Link></li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/account/orders"
              className="hidden md:flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-cyan-50 transition-colors"
            >
              <Package className="w-5 h-5 text-cyan-600" />
              <span className="text-sm font-semibold text-slate-700">Orders</span>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-pink-50 transition-colors"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-md">
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-cyan-400 text-[11px] font-bold text-slate-900 flex items-center justify-center border-2 border-white">
                    {count}
                  </span>
                )}
              </span>
              <span className="hidden lg:inline text-sm font-semibold text-slate-700">Cart</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowCat(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
              aria-label="Open categories"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-3 md:px-6 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <button
            type="button"
            onClick={() => setShowCat(true)}
            className="hidden md:inline-flex items-center gap-1.5 hz-nav-pill hz-nav-pill-active shrink-0"
          >
            <Menu className="w-4 h-4" /> Categories
          </button>
          {categoryList.slice(0, 12).map((c) => (
            <Link key={c} href={catHref(c)} className="hz-nav-pill shrink-0">
              {c}
            </Link>
          ))}
          <Link href="/deals" className="hz-nav-pill shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold">
            Flash deals
          </Link>
          <Link href="/seller/apply" className="hz-nav-pill shrink-0 text-violet-700 font-semibold">
            Sell on Halozon
          </Link>
          <Link href="/prime" className="hz-nav-pill shrink-0 text-sky-600 hover:bg-sky-50">
            Plus membership
          </Link>
        </div>
      </div>

      {showCat && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCat(false)} />
          <aside className="relative bg-white w-[360px] max-w-[90vw] h-full overflow-y-auto animate-slideDown shadow-2xl rounded-r-3xl">
            <div className="bg-hz-gradient text-white px-5 py-5 flex items-center justify-between">
              <div className="font-bold text-lg flex items-center gap-2">
                <Menu className="w-5 h-5" /> Browse
              </div>
              <button type="button" onClick={() => setShowCat(false)} aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3">
              {categoryList.map((c) => (
                <Link
                  key={c}
                  href={catHref(c)}
                  className="block px-4 py-3 hover:bg-violet-50 rounded-xl text-sm font-medium text-slate-700"
                  onClick={() => setShowCat(false)}
                >
                  {c}
                </Link>
              ))}
              <div className="border-t my-3 border-slate-100" />
              <Link
                href="/deals"
                className="block px-4 py-3 hover:bg-rose-50 rounded-xl font-semibold text-rose-600"
                onClick={() => setShowCat(false)}
              >
                Flash deals
              </Link>
              <Link href="/prime" className="block px-4 py-3 hover:bg-sky-50 rounded-xl text-sky-700" onClick={() => setShowCat(false)}>
                Halozon Plus
              </Link>
              <Link href="/help" className="block px-4 py-3 hover:bg-slate-50 rounded-xl" onClick={() => setShowCat(false)}>
                Help center
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
