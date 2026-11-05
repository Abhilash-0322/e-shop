'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, SlidersHorizontal, Sparkles, Upload, X } from '@/lib/icons';

type SearchControlsProps = {
  brands?: string[];
  categories?: { name: string; slug: string }[];
  resultCount?: number;
};

const sortOptions = [
  ['relevance', 'Recommended'],
  ['best-sellers', 'Best sellers'],
  ['rating', 'Top rated'],
  ['newest', 'Newest'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
];

export default function SearchControls({
  brands = [],
  categories = [],
  resultCount,
}: SearchControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const queryKey = params.toString();
  const [query, setQuery] = useState(params.get('q') || '');
  const [minPrice, setMinPrice] = useState(params.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('max') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [visualFile, setVisualFile] = useState('');
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  const selectedBrands = useMemo(() => params.getAll('brand'), [queryKey, params]);
  const activeFilters = useMemo(
    () =>
      Array.from(params.entries()).filter(
        ([key, value]) => value && !['q', 'sort', 'visual'].includes(key),
      ),
    [queryKey, params],
  );

  useEffect(() => {
    setQuery(params.get('q') || '');
    setMinPrice(params.get('min') || '');
    setMaxPrice(params.get('max') || '');
  }, [queryKey, params]);

  useEffect(() => {
    let active = true;
    try {
      const stored = JSON.parse(localStorage.getItem('hz_saved_searches') || '[]');
      if (active && Array.isArray(stored)) setSavedSearches(stored.filter((item) => typeof item === 'string'));
    } catch {
      // Local storage can be unavailable in privacy-restricted browsers.
    }
    return () => {
      active = false;
    };
  }, []);

  function navigate(next: URLSearchParams) {
    const nextQuery = next.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }

  function updateParam(key: string, value?: string) {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    if (value) next.set(key, value);
    navigate(next);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params.toString());
    next.delete('q');
    if (query.trim()) next.set('q', query.trim());
    navigate(next);
  }

  function toggleBrand(brand: string) {
    const next = new URLSearchParams(params.toString());
    const nextBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((item) => item !== brand)
      : [...selectedBrands, brand];
    next.delete('brand');
    nextBrands.forEach((item) => next.append('brand', item));
    navigate(next);
  }

  function applyPrice() {
    const next = new URLSearchParams(params.toString());
    next.delete('min');
    next.delete('max');
    if (minPrice) next.set('min', minPrice);
    if (maxPrice) next.set('max', maxPrice);
    navigate(next);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    if (params.get('q')) next.set('q', params.get('q') as string);
    navigate(next);
  }

  function saveSearch() {
    const saved = params.toString() || (query.trim() ? `q=${encodeURIComponent(query.trim())}` : '');
    if (!saved) return;
    const next = [saved, ...savedSearches.filter((item) => item !== saved)].slice(0, 5);
    setSavedSearches(next);
    try {
      localStorage.setItem('hz_saved_searches', JSON.stringify(next));
    } catch {
      // Saving is best effort and never blocks browsing.
    }
  }

  function restoreSearch(search: string) {
    router.push(`${pathname}?${search}`);
  }

  return (
    <section className="space-y-4" aria-label="Search controls">
      <form onSubmit={submit} className="surface flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
          <Search className="h-5 w-5 shrink-0 text-indigo-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “linen shirt”, “desk setup”, or a brand"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            aria-label="Search products"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="rounded-full p-1 text-slate-400 hover:bg-slate-200" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="submit" className="btn btn-primary md:px-6">Search</button>
        <label className="btn btn-soft cursor-pointer whitespace-nowrap">
          <Upload className="h-4 w-4" />
          <span>{visualFile ? 'Image added' : 'Search by image'}</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setVisualFile(file.name);
                updateParam('visual', '1');
              }
            }}
          />
        </label>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-soft !py-2 !px-3" onClick={() => setShowFilters((value) => !value)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilters.length > 0 && <span className="rounded-full bg-indigo-600 px-1.5 text-[10px] text-white">{activeFilters.length}</span>}
        </button>
        <select
          value={params.get('sort') || 'relevance'}
          onChange={(event) => updateParam('sort', event.target.value === 'relevance' ? undefined : event.target.value)}
          className="input !w-auto !py-2 text-xs font-bold"
          aria-label="Sort products"
        >
          {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="button" className="btn btn-soft !py-2 !px-3" onClick={saveSearch} disabled={!query.trim() && !activeFilters.length}>
          <Sparkles className="h-4 w-4" />
          Save search
        </button>
        {resultCount !== undefined && <span className="ml-auto text-xs font-semibold text-slate-500">{resultCount} finds</span>}
      </div>

      {params.get('visual') === '1' && (
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <Sparkles className="h-4 w-4 shrink-0 text-indigo-600" />
          <span><b>Visual inspiration is on.</b> Browse these results as a starting point for your uploaded look{visualFile ? ` · ${visualFile}` : ''}.</span>
          <button type="button" className="ml-auto text-xs font-bold text-indigo-600" onClick={() => updateParam('visual')}>Remove</button>
        </div>
      )}

      {savedSearches.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="eyebrow shrink-0 !text-slate-400">Saved</span>
          {savedSearches.map((search) => (
            <button type="button" key={search} onClick={() => restoreSearch(search)} className="pill shrink-0 hover:bg-indigo-200">
              {new URLSearchParams(search).get('q') || 'Filtered edit'}
            </button>
          ))}
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map(([key, value], index) => (
            <button
              type="button"
              key={`${key}-${value}-${index}`}
              onClick={() => {
                const next = new URLSearchParams(params.toString());
                next.delete(key);
                navigate(next);
              }}
              className="filter-chip"
            >
              {key === 'minRating' ? `${value}+ stars` : key === 'min' ? `From $${value}` : key === 'max' ? `Up to $${value}` : value}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button type="button" onClick={clearFilters} className="text-xs font-bold text-slate-500 hover:text-indigo-600">Clear all</button>
        </div>
      )}

      {showFilters && (
        <div className="surface grid gap-6 p-5 md:grid-cols-3 animate-reveal">
          {categories.length > 0 && (
            <label className="space-y-2 text-sm font-bold">
              Category
              <span className="relative block">
                <select value={params.get('category') || ''} onChange={(event) => updateParam('category', event.target.value || undefined)} className="input appearance-none pr-9">
                  <option value="">All categories</option>
                  {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </span>
            </label>
          )}
          <div className="space-y-2 text-sm font-bold">
            Brand
            <div className="grid max-h-32 gap-2 overflow-y-auto pr-2">
              {brands.length > 0 ? brands.slice(0, 12).map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  {brand}
                </label>
              )) : <span className="text-xs font-medium text-slate-400">No brand facets yet.</span>}
            </div>
          </div>
          <div className="space-y-2 text-sm font-bold">
            Price range
            <div className="grid grid-cols-2 gap-2">
              <input className="input" inputMode="decimal" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min $" aria-label="Minimum price" />
              <input className="input" inputMode="decimal" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max $" aria-label="Maximum price" />
            </div>
            <button type="button" onClick={applyPrice} className="btn btn-dark !mt-2 !w-full !py-2">Apply price</button>
          </div>
          <div className="space-y-2 text-sm font-bold">
            Rating
            <div className="flex flex-wrap gap-2">
              {['4', '3', '2'].map((rating) => (
                <button type="button" key={rating} onClick={() => updateParam('minRating', params.get('minRating') === rating ? undefined : rating)} className={`rounded-lg border px-3 py-2 text-xs ${params.get('minRating') === rating ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600'}`}>
                  {rating}+ stars
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
