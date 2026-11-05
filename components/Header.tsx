'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, MapPin, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

type User = { id: string; name: string; email: string; role: string } | null;

const FALLBACK_CATS = ['Discover', 'Electronics', 'Home', 'Fashion', 'Books', 'Wellness', 'Gifts'];

export default function Header({ user }: { user: User }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { count } = useCart();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [categories, setCategories] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/categories', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setCategories((data.items || []).map((item: { name: string }) => item.name)))
      .catch((error: unknown) => {
        if ((error as { name?: string })?.name !== 'AbortError') setCategories([]);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAccountOpen(false);
    router.refresh();
  }

  const cats = categories.length ? categories : FALLBACK_CATS;

  return (
    <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-header' : ''}`}>
      <div className="page-ribbon px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide">
        ✦ Independent makers, joyful finds, and free delivery over $35 ✦
      </div>
      <nav className="bg-amazon-navy text-white">
        <div className="mx-auto flex max-w-screen-xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            className="rounded-full p-2 hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open shop menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="shrink-0 leading-none" aria-label="halozon home">
            <span className="text-2xl font-black tracking-[-0.08em]">halo</span>
            <span className="text-2xl font-black tracking-[-0.08em] text-amazon-orange">zon</span>
            <span className="ml-1 text-[10px] font-bold text-amazon-orangelight">studio</span>
          </Link>
          <Link href="/account/addresses" className="hidden items-center gap-2 rounded-xl px-2 py-1 text-xs text-white/75 hover:bg-white/10 lg:flex">
            <MapPin className="h-4 w-4 text-amazon-orangelight" />
            <span><b className="block text-[10px] font-medium text-white/60">Delivering joy to</b>United States</span>
          </Link>
          <form onSubmit={submitSearch} className="min-w-0 flex-1">
            <div className="flex h-10 overflow-hidden rounded-full bg-white ring-2 ring-transparent focus-within:ring-amazon-prime/60">
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search your next little obsession..."
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-amazon-text outline-none"
              />
              <button type="submit" aria-label="Search" className="bg-amazon-orange px-4 text-white transition-colors hover:bg-amazon-orangelight">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
          <div className="relative hidden md:block" onMouseLeave={() => setAccountOpen(false)}>
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-white/10"
              aria-expanded={accountOpen}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-amazon-yellow text-amazon-text font-bold">
                {(user?.name || 'G')[0].toUpperCase()}
              </span>
              <span className="hidden text-xs leading-tight lg:block">
                <span className="block text-white/60">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome, friend'}</span>
                <span className="font-bold">Account <ChevronDown className="inline h-3 w-3" /></span>
              </span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-full w-72 pt-2">
                <div className="rounded-2xl border border-amazon-border bg-white p-4 text-amazon-text shadow-2xl">
                  {user ? (
                    <>
                      <div className="mb-3 border-b border-amazon-border pb-3">
                        <div className="font-bold">{user.name}</div>
                        <div className="text-xs text-amazon-textMuted">{user.email}</div>
                      </div>
                      {[
                        ['/account', 'Your account'],
                        ['/account/orders', 'Order constellation'],
                        ['/account/wishlist', 'Saved finds'],
                        ['/seller/dashboard', 'Seller studio'],
                      ].map(([href, label]) => <Link key={href} href={href} onClick={() => setAccountOpen(false)} className="block rounded-lg px-2 py-2 text-sm hover:bg-amazon-bg">{label}</Link>)}
                      <button type="button" onClick={logout} className="mt-2 w-full border-t border-amazon-border pt-3 text-left text-sm text-amazon-deal">Sign out</button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-2 h-6 w-6 text-amazon-orange" />
                      <p className="mb-3 text-sm text-amazon-textMuted">Save favorites and checkout faster.</p>
                      <Link href="/signin" onClick={() => setAccountOpen(false)} className="amazon-btn-primary inline-block">Sign in</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link href="/cart" className="relative flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-white/10" aria-label={`Cart with ${count} items`}>
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amazon-yellow px-1 text-[10px] font-black text-amazon-text">{count}</span>
            <span className="hidden text-xs font-bold lg:block">Bag</span>
          </Link>
        </div>
        <div className="border-t border-white/10 bg-amazon-navylight">
          <div className="mx-auto flex max-w-screen-xl items-center gap-1 overflow-x-auto px-4 py-2 text-xs font-semibold">
            <button type="button" onClick={() => setMenuOpen(true)} className="hidden items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 md:flex"><Menu className="h-3.5 w-3.5" /> Browse</button>
            {cats.slice(0, 8).map((cat) => <Link key={cat} href={`/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`} className="whitespace-nowrap rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white">{cat}</Link>)}
            <Link href="/deals" className="ml-auto whitespace-nowrap rounded-full bg-amazon-orange px-3 py-1.5 text-white">Fresh drops <ArrowRight className="ml-1 inline h-3 w-3" /></Link>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <button type="button" className="absolute inset-0 bg-amazon-navy/40" onClick={() => setMenuOpen(false)} aria-label="Close menu overlay" />
          <aside className="relative h-full w-80 max-w-[88vw] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-amazon-orange">Explore</div><h2 className="text-2xl font-black">Shop your mood</h2></div><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close shop menu"><X /></button></div>
            <div className="space-y-1">{cats.map((cat) => <Link key={cat} href={`/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))}`} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-amazon-bg">{cat}</Link>)}</div>
            <div className="mt-5 rounded-2xl bg-amazon-mint p-4"><div className="text-sm font-bold">Curated for curious people</div><p className="mt-1 text-xs text-amazon-textMuted">Meet small makers and discover pieces with a story.</p></div>
          </aside>
        </div>
      )}
    </header>
  );
}
