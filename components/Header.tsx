'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, ShoppingCart, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

type User = { id: string; name: string; email: string; role: string } | null;

const CATS = ['Discover', 'For you', 'Home studio', 'Wearables', 'Prints', 'Books', 'Gifts'];

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
    fetch('/api/categories').then((r) => r.json()).then((d) => {
      setCats((d.items || []).map((c: { name: string }) => c.name));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
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

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-amazon-navy text-white text-sm shadow-header">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-amazon-yellow text-amazon-navy font-black">h</span>
            <span className="text-xl font-black tracking-tight">halozon<span className="text-amazon-orange">.</span></span>
          </Link>

          <Link
            href="/account/addresses"
            className="hidden lg:flex items-center gap-2 text-white/75 hover:text-white ml-4"
          >
            <MapPin className="w-4 h-4 text-amazon-yellow" />
            <span className="text-xs">Delivering to<br /><b className="text-white">United States</b></span>
          </Link>

          {/* Search */}
          <form onSubmit={submitSearch} className="flex-1 max-w-2xl ml-auto">
            <div className="flex rounded-full overflow-hidden h-11 bg-white ring-2 ring-transparent focus-within:ring-amazon-yellow">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, creators, collections..."
                className="flex-1 px-4 text-amazon-text text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-amazon-yellow hover:bg-amazon-yellowHover px-5 transition-colors"
              >
                <Search className="w-5 h-5 text-amazon-navy" />
              </button>
            </div>
          </form>

          <Link href="/seller/apply" className="hidden xl:flex items-center gap-2 px-2 text-xs text-white/80 hover:text-white">
            <Sparkles className="w-4 h-4 text-amazon-yellow" /> Become a creator
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowAcc(true)}
            onMouseLeave={() => setShowAcc(false)}
          >
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-amazon-orange text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || '·'}
              </span>
              <span className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-[10px] text-white/65">{user ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome'}</span>
                <span className="font-bold text-xs flex items-center gap-0.5">Account <ChevronDown className="w-3 h-3" /></span>
              </span>
            </button>
            {showAcc && (
              <div className="absolute right-0 top-full pt-2 w-[360px] z-50 animate-slideDown">
                <div className="bg-amazon-panel text-amazon-text rounded-2xl shadow-2xl border border-amazon-border p-5 grid grid-cols-2 gap-4">
                  {user ? (
                    <>
                      <div className="col-span-2 flex items-center justify-between border-b border-amazon-border pb-3">
                        <div>
                          <div className="font-bold">Hello, {user.name}</div>
                          <div className="text-xs text-amazon-textMuted">{user.email}</div>
                        </div>
                        <button onClick={logout} className="amazon-btn-yellow !text-xs">
                          Sign out
                        </button>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your space</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/account">Your Account</Link></li>
                          <li><Link className="amazon-link" href="/account/orders">Your Orders</Link></li>
                          <li><Link className="amazon-link" href="/account/wishlist">Saved collections</Link></li>
                          <li><Link className="amazon-link" href="/account/payment">Payment options</Link></li>
                          <li><Link className="amazon-link" href="/account/addresses">Addresses</Link></li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Explore</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/deals">Fresh drops</Link></li>
                          <li><Link className="amazon-link" href="/category/electronics">Tech & studio</Link></li>
                          <li><Link className="amazon-link" href="/category/books">Books & zines</Link></li>
                          <li><Link className="amazon-link" href="/help">Community help</Link></li>
                          <li><Link className="amazon-link" href="/prime">Halo+ perks</Link></li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2 flex justify-center border-b border-amazon-border pb-3">
                        <Link href="/signin" className="amazon-btn-primary !text-sm">
                          Sign in to continue
                        </Link>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your lists</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/signin">Create a List</Link></li>
                          <li><Link className="amazon-link" href="/signin">Find a creator</Link></li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your account</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/signin">Account</Link></li>
                          <li><Link className="amazon-link" href="/signin">Orders</Link></li>
                          <li><Link className="amazon-link" href="/signin">Wish List</Link></li>
                          <li><Link className="amazon-link" href="/signin">Recommendations</Link></li>
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
            className="hidden md:flex flex-col items-start px-2 py-1.5 rounded-xl hover:bg-white/10"
          >
            <span className="text-[10px] text-white/65">Your</span>
            <span className="font-bold text-xs">orders</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-end px-2 py-1.5 rounded-xl hover:bg-white/10"
          >
            <div className="relative">
              <ShoppingCart className="w-8 h-8" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-amazon-orange font-bold text-sm">
                {count}
              </span>
            </div>
            <span className="hidden md:inline font-bold text-xs ml-1 mb-0.5">Bag</span>
          </Link>
        </div>

        {/* Sub-nav */}
        <div className={cn("bg-amazon-navylight text-white text-sm transition-shadow", scrolled && "shadow-header")}>
          <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setShowCat(true)}
              className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 font-bold whitespace-nowrap"
            >
              <Menu className="w-4 h-4" /> All
            </button>
            {(cats.length ? cats : CATS).slice(0, 14).map((c) => (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`}
                className="rounded-full border border-transparent hover:border-white/40 px-3 py-1.5 whitespace-nowrap"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/deals"
              className="rounded-full border border-transparent hover:border-white/40 px-3 py-1.5 whitespace-nowrap font-bold text-amazon-yellow"
            >
              Today's Deals
            </Link>
            <Link
              href="/prime"
              className="rounded-full border border-transparent hover:border-white/40 px-3 py-1.5 whitespace-nowrap"
            >
              Prime
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar Categories */}
      {showCat && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCat(false)} />
          <aside className="relative bg-white w-[360px] max-w-[90vw] h-full overflow-y-auto animate-slideDown shadow-2xl">
            <div className="bg-amazon-navylight text-white px-5 py-4 flex items-center justify-between">
              <div className="font-bold text-xl flex items-center gap-2">
                <Menu className="w-5 h-5" /> Shop by Category
              </div>
              <button onClick={() => setShowCat(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-2">
              {(cats.length ? cats : CATS).map((c) => (
                <Link
                  key={c}
                  href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`}
                  className="block px-3 py-2.5 hover:bg-amazon-bg rounded text-sm"
                  onClick={() => setShowCat(false)}
                >
                  {c}
                </Link>
              ))}
              <div className="border-t my-2" />
              <Link href="/deals" className="block px-3 py-2.5 hover:bg-amazon-bg rounded font-bold text-amazon-deal">Today's Deals</Link>
              <Link href="/prime" className="block px-3 py-2.5 hover:bg-amazon-bg rounded">Prime</Link>
              <Link href="/help" className="block px-3 py-2.5 hover:bg-amazon-bg rounded">Customer Service</Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
