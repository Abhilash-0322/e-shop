'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, ShoppingCart, Menu, X, ChevronDown, Sparkles, UserRound } from 'lucide-react';
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [cats, setCats] = useState<string[]>([]);
  const { count } = useCart();

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => {
      setCats((d.items || []).map((c: { name: string }) => c.name));
    }).catch(() => {});
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
    <header className="sticky top-0 z-50 shadow-header">
      <nav className="bg-amazon-navy text-white">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 py-2.5 flex items-center gap-2">
          <Link href="/" className="flex items-end shrink-0 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors" aria-label="halozon home">
            <span className="text-2xl font-extrabold tracking-tight leading-none">halo</span>
            <span className="text-2xl font-extrabold tracking-tight leading-none text-amazon-orange">zon</span>
            <span className="text-amazon-orange text-xs ml-0.5 leading-none translate-y-[-2px]">.com</span>
          </Link>
          <Link href="/account/addresses" className="hidden lg:flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10">
            <MapPin className="w-5 h-5 text-amazon-orangedark" />
            <div className="leading-tight">
              <div className="text-[10px] text-white/60">Delivering to</div>
              <div className="font-bold text-xs">United States</div>
            </div>
          </Link>
          <form onSubmit={submitSearch} className={`${showMobileSearch ? 'flex' : 'hidden'} md:flex flex-1 mx-1 sm:mx-2`}>
            <div className="flex rounded-xl overflow-hidden h-10 bg-white w-full ring-1 ring-white/10">
              <select aria-label="Search category" className="hidden lg:block bg-amazon-bg text-amazon-text text-xs px-2 border-r border-amazon-border" defaultValue="">
                <option value="">All</option><option>Electronics</option><option>Books</option><option>Fashion</option><option>Home</option>
              </select>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands, and more" className="flex-1 px-3 text-amazon-text text-sm outline-none min-w-0" />
              <button type="submit" aria-label="Search" className="bg-amazon-orange hover:bg-amazon-orangelight px-3 sm:px-4 transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setShowMobileSearch((v) => !v)} aria-label="Toggle search"><Search className="w-5 h-5" /></button>
          <div className="relative shrink-0">
            <button onClick={() => setShowAcc((v) => !v)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10">
              <UserRound className="w-5 h-5 text-amazon-orangedark" />
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-[10px] text-white/60">{user ? 'Welcome back' : 'Welcome'}</span>
                <span className="font-bold text-xs">{user ? user.name.split(' ')[0] : 'Sign in'} <ChevronDown className="w-3 h-3 inline" /></span>
              </span>
            </button>
            {showAcc && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white text-amazon-text rounded-2xl shadow-2xl border border-amazon-border p-4 animate-slideDown">
                {user ? (
                  <>
                    <div className="flex items-center justify-between border-b border-amazon-border pb-3 mb-3">
                      <div><div className="font-bold">{user.name}</div><div className="text-xs text-amazon-textMuted">{user.email}</div></div>
                      <button onClick={logout} className="btn-secondary !text-xs !py-2">Sign out</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Link className="p-2 rounded-lg hover:bg-amazon-bg" href="/account">Account home</Link>
                      <Link className="p-2 rounded-lg hover:bg-amazon-bg" href="/account/orders">Orders</Link>
                      <Link className="p-2 rounded-lg hover:bg-amazon-bg" href="/account/wishlist">Wishlist</Link>
                      <Link className="p-2 rounded-lg hover:bg-amazon-bg" href="/account/recommendations">For you</Link>
                      <Link className="p-2 rounded-lg hover:bg-amazon-bg" href="/account/addresses">Addresses</Link>
                      <Link className="p-2 rounded-lg hover:bg-amazon-bg" href="/help">Help center</Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-amazon-orange/10 text-amazon-orange grid place-items-center mb-2"><Sparkles className="w-5 h-5" /></div>
                    <div className="font-bold">Make shopping feel like yours</div>
                    <p className="text-xs text-amazon-textMuted mt-1 mb-3">Save lists, track orders, and get picks for you.</p>
                    <Link href="/signin" className="btn-primary w-full">Sign in</Link>
                    <Link href="/register" className="btn-quiet mt-2">Create an account</Link>
                  </div>
                )}
              </div>
            )}
          </div>
          <Link href="/account/orders" className="hidden sm:block px-2 py-1.5 rounded-lg hover:bg-white/10 leading-tight shrink-0">
            <span className="block text-[10px] text-white/60">Your</span><span className="font-bold text-xs">Orders</span>
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/10 shrink-0">
            <div className="relative"><ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" /><span className="absolute -top-2 -right-1 bg-amazon-orange text-white rounded-full min-w-4 h-4 px-1 text-[10px] font-bold grid place-items-center">{count}</span></div>
            <span className="hidden sm:inline font-bold text-xs">Cart</span>
          </Link>
        </div>
      </nav>
      <div className="bg-amazon-navylight text-white text-xs sm:text-sm">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 py-1.5 flex items-center gap-1 overflow-x-auto">
          <button onClick={() => setShowCat(true)} className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 font-bold whitespace-nowrap"><Menu className="w-4 h-4" /> Browse</button>
          {(cats.length ? cats : CATS).slice(0, 9).map((c) => <Link key={c} href={`/category/${encodeURIComponent(c.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`} className="px-2 py-1 rounded-lg hover:bg-white/10 whitespace-nowrap">{c}</Link>)}
          <Link href="/deals" className="px-2 py-1 rounded-lg hover:bg-white/10 whitespace-nowrap font-bold text-amazon-orangedark">Today&apos;s Deals</Link>
          <Link href="/prime" className="px-2 py-1 rounded-lg hover:bg-white/10 whitespace-nowrap">Prime</Link>
        </div>
      </div>

      {/* Sidebar Categories */}
      {showCat && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCat(false)} />
          <aside className="relative bg-white w-[360px] max-w-[90vw] h-full overflow-y-auto animate-slideDown shadow-2xl">
            <div className="bg-amazon-navy text-white px-5 py-4 flex items-center justify-between">
              <div className="font-bold text-lg flex items-center gap-2">
                <Menu className="w-5 h-5" /> Shop by Category
              </div>
              <button onClick={() => setShowCat(false)} aria-label="Close menu"><X className="w-5 h-5" /></button>
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
