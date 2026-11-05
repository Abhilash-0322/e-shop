'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import { Heart, Plus, RefreshCw, Search } from '@/lib/icons';

const listStorageKey = 'halozon_saved_lists';

function getProduct(item: any): Product | null {
  const product = item?.productId && typeof item.productId === 'object' ? item.productId : item?.product;
  return (product || item)?._id ? (product || item) : null;
}

export default function SavedLists() {
  const [items, setItems] = useState<Product[]>([]);
  const [membership, setMembership] = useState<Record<string, string>>({});
  const [lists, setLists] = useState(['Everything', 'For a future refresh', 'Gift ideas']);
  const [activeList, setActiveList] = useState('Everything');
  const [query, setQuery] = useState('');
  const [newList, setNewList] = useState('');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  async function load(signal?: AbortSignal) {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch('/api/wishlist', { signal });
      if (!response.ok) throw new Error('Unable to load saved items');
      const data = await response.json();
      if (signal?.aborted) return;
      setItems((data.items || []).map((item: any) => getProduct(item)).filter((product: Product | null): product is Product => Boolean(product)));
    } catch (error: any) {
      if (error?.name !== 'AbortError') setFailed(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    try {
      const stored = JSON.parse(localStorage.getItem(listStorageKey) || '{}');
      if (stored.membership) setMembership(stored.membership);
      if (Array.isArray(stored.lists) && stored.lists.length) setLists(Array.from(new Set(['Everything', ...stored.lists])));
    } catch {}
    load(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem(listStorageKey, JSON.stringify({ lists: lists.filter((list) => list !== 'Everything'), membership }));
  }, [lists, membership]);

  function move(productId: string, list: string) {
    setMembership((current) => ({ ...current, [productId]: list }));
  }

  function createList(event: React.FormEvent) {
    event.preventDefault();
    const label = newList.trim();
    if (!label || lists.includes(label)) return;
    setLists((current) => [...current, label]);
    setNewList('');
    setActiveList(label);
  }

  const visibleItems = useMemo(() => items.filter((item) => {
    const inList = activeList === 'Everything' || membership[item._id] === activeList;
    return inList && (!query || item.title.toLowerCase().includes(query.toLowerCase()));
  }), [activeList, items, membership, query]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow flex items-center gap-2"><Heart className="w-3.5 h-3.5" /> Your saved space</p><h1 className="page-title mt-2">Saved lists</h1><p className="muted mt-3">Keep a little intent behind the things you want to come back to.</p></div>
        <form className="flex gap-2" onSubmit={createList}><input className="input !w-44" value={newList} onChange={(event) => setNewList(event.target.value)} placeholder="New list name" aria-label="New list name" /><button className="btn btn-dark" type="submit"><Plus className="w-4 h-4" /> Add list</button></form>
      </div>
      <div className="flex flex-wrap gap-2 mt-8 border-b border-slate-200 pb-5" role="tablist" aria-label="Saved lists">{lists.map((list) => <button type="button" role="tab" aria-selected={activeList === list} onClick={() => setActiveList(list)} className={`intent-chip ${activeList === list ? 'bg-indigo-600 text-white' : ''}`} key={list}>{list}{list !== 'Everything' && <span className="opacity-70">{items.filter((item) => membership[item._id] === list).length}</span>}</button>)}</div>
      <div className="flex items-center gap-2 max-w-sm mt-6"><Search className="w-4 h-4 text-slate-400" /><input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved products" aria-label="Search saved products" /></div>
      {loading ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8"><div className="discovery-skeleton h-72" /><div className="discovery-skeleton h-72" /><div className="discovery-skeleton h-72" /></div> : failed ? <div className="state-card state-card-error mt-8"><span className="text-sm">Saved products could not load.</span><button type="button" className="btn btn-soft" onClick={() => load()}><RefreshCw className="w-4 h-4" /> Retry</button></div> : visibleItems.length ? <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">{visibleItems.map((product) => <div key={product._id}><ProductCard product={product} /><label className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-2 px-1"><span className="sr-only">Move {product.title} to list</span><select className="input !py-1.5 !text-xs" value={membership[product._id] || 'Everything'} onChange={(event) => move(product._id, event.target.value)}><option>Everything</option>{lists.filter((list) => list !== 'Everything').map((list) => <option key={list}>{list}</option>)}</select></label></div>)}</div> : <div className="state-card mt-8 p-10 flex-col text-center"><Heart className="w-8 h-8 text-rose-400" /><h2 className="text-xl font-black mt-4">{items.length ? 'Nothing in this list yet.' : 'Your saved space is waiting.'}</h2><p className="muted mt-2 max-w-md">{items.length ? 'Move a saved product into this list, or keep browsing.' : 'Tap the heart on a product to keep it close for later.'}</p><a href="/" className="btn btn-primary mt-5">Explore products</a></div>}
    </div>
  );
}
