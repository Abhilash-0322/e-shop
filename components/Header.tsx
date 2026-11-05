'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, ShoppingCart, Menu, X, ChevronDown, Sparkles, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

type User = { id: string; name: string; email: string; role: string } | null;

const CATS = [
  'Electronics', 'Computers', 'Smart Home', 'Arts & Crafts',
  'See all', 'Books', 'Movies', 'Music', 'Games', 'Home & Kitchen', 'Fashion',
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
      <div className="hidden md:flex items-center justify-between bg-[#0b0c11] px-6 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/55">
        <div className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-kinetic-lime" /> The marketplace for curious people</div>
        <div className="flex items-center gap-5">
          <span>Free shipping over $50</span>
          <Link href="/seller/apply" className="text-white/80 hover:text-kinetic-lime transition-colors">Sell on halozon</Link>
        </div>
      </div>
      <nav className="bg-amazon-navy text-white">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-3 py-3 lg:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-end rounded-xl border border-transparent px-2 py-2 transition-all hover:border-white/30"
          >
            <span className="text-2xl font-black tracking-[-0.08em] leading-none text-white">
              halo
            </span>
            <span className="text-2xl font-black tracking-[-0.08em] leading-none text-amazon-orange">
              zon
            </span>
            <span className="ml-0.5 translate-y-[-2px] text-[10px] font-bold leading-none text-amazon-orange">.com</span>
          </Link>

          {/* Deliver to */}
          <Link
            href="/account/addresses"
            className="hidden items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-white/75 transition-colors hover:border-white/30 hover:text-white lg:flex"
          >
            <MapPin className="h-4 w-4 text-amazon-orange" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-wider text-white/45">Deliver to</div>
              <div className="text-xs font-semibold">United States</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={submitSearch} className="mx-1 flex-1">
            <div className="flex h-11 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-glow">
              <select
                aria-label="Search category"
                className="hidden border-r border-amazon-border bg-amazon-bg px-3 text-xs text-amazon-text outline-none md:block"
                defaultValue=""
              >
                <option value="">All</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Deals">Deals</option>
              </select>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the halozon universe"
                className="min-w-0 flex-1 px-4 text-sm text-amazon-text outline-none"
              />
              <span className="hidden items-center gap-1 px-2 text-[10px] text-amazon-textMuted sm:flex"><Command className="h-3 w-3" /> K</span>
              <button
                type="submit"
                aria-label="Search"
                className="bg-amazon-orange px-4 text-amazon-navy transition-colors hover:bg-amazon-orangelight"
              >
                <Search className="w-5 h-5 text-amazon-navy" />
              </button>
            </div>
          </form>

          {/* Account */}
          <div
            className="relative"
            onMouseEnter={() => setShowAcc(true)}
            onMouseLeave={() => setShowAcc(false)}
          >
            <button aria-expanded={showAcc} className="hidden flex-col items-start rounded-xl border border-transparent px-3 py-2 text-left transition-colors hover:border-white/30 md:flex">
              <span className="text-[10px] uppercase tracking-wider text-white/45">
                {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
              </span>
              <span className="flex items-center gap-0.5 text-xs font-semibold leading-tight">
                Account & Lists <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            {showAcc && (
              <div className="absolute right-0 top-full z-50 w-[min(480px,calc(100vw-2rem))] pt-2 animate-slideDown">
                <div className="grid grid-cols-2 gap-5 rounded-2xl border border-amazon-border bg-white p-5 text-amazon-text shadow-2xl">
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
                        <div className="font-bold mb-2">Your Account</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/account">Your Account</Link></li>
                          <li><Link className="amazon-link" href="/account/orders">Your Orders</Link></li>
                          <li><Link className="amazon-link" href="/account/wishlist">Your Wish List</Link></li>
                          <li><Link className="amazon-link" href="/account/payment">Payment options</Link></li>
                          <li><Link className="amazon-link" href="/account/addresses">Addresses</Link></li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Shop & Browse</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/deals">Today's Deals</Link></li>
                          <li><Link className="amazon-link" href="/category/electronics">Electronics</Link></li>
                          <li><Link className="amazon-link" href="/category/books">Books</Link></li>
                          <li><Link className="amazon-link" href="/help">Customer Service</Link></li>
                          <li><Link className="amazon-link" href="/prime">Prime</Link></li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2 flex justify-center border-b border-amazon-border pb-3">
                        <Link href="/signin" className="amazon-btn-primary !text-sm">
                          Sign in to your account
                        </Link>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your Lists</div>
                        <ul className="space-y-1.5 text-sm">
                          <li><Link className="amazon-link" href="/signin">Create a List</Link></li>
                          <li><Link className="amazon-link" href="/signin">Find a List or Registry</Link></li>
                        </ul>
                      </div>
                      <div>
                        <div className="font-bold mb-2">Your Account</div>
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

          {/* Returns */}
          <Link
            href="/account/orders"
            className="hidden flex-col items-start rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-white/30 md:flex"
          >
            <span className="text-[10px] uppercase tracking-wider text-white/45">Returns</span>
            <span className="text-xs font-semibold">& Orders</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-end rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-white/30"
          >
            <div className="relative">
              <ShoppingCart className="h-7 w-7" />
              <span className="absolute -top-2 left-1/2 min-w-4 -translate-x-1/2 rounded-full bg-amazon-orange px-1 text-center text-[10px] font-black text-amazon-navy">
                {count}
              </span>
            </div>
            <span className="ml-1 hidden text-xs font-semibold md:inline">Cart</span>
          </Link>
        </div>

        {/* Sub-nav */}
        <div className={cn(
          "border-t border-white/10 bg-amazon-navylight text-sm text-white transition-shadow",
          scrolled && "shadow-header"
        )}>
          <div className="mx-auto flex max-w-[1440px] items-center gap-1 overflow-x-auto px-3 py-1.5 lg:px-6">
            <button
              onClick={() => setShowCat(true)}
              aria-label="Open categories"
              className="flex shrink-0 items-center gap-1 rounded-lg border border-transparent px-3 py-1.5 font-bold whitespace-nowrap transition-colors hover:border-white/30"
            >
              <Menu className="w-4 h-4" /> All
            </button>
            {(cats.length ? cats : CATS).slice(0, 14).map((c) => (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`}
                className="shrink-0 rounded-lg border border-transparent px-3 py-1.5 text-xs text-white/75 whitespace-nowrap transition-colors hover:border-white/30 hover:text-white"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/deals"
              className="shrink-0 rounded-lg border border-transparent px-3 py-1.5 text-xs font-bold text-amazon-orange whitespace-nowrap hover:border-white/30"
            >
              Today's Deals
            </Link>
            <Link
              href="/prime"
              className="shrink-0 rounded-lg border border-transparent px-3 py-1.5 text-xs text-white/75 whitespace-nowrap hover:border-white/30 hover:text-white"
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
          <aside className="relative h-full w-[360px] max-w-[90vw] overflow-y-auto bg-white shadow-2xl animate-slideDown">
            <div className="flex items-center justify-between bg-amazon-navylight px-5 py-4 text-white">
              <div className="flex items-center gap-2 text-lg font-bold">
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
