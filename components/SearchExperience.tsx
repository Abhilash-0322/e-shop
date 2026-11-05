'use client';

import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';
import { ArrowRight, Search, Sparkles } from '@/lib/icons';

const intents = [
  ['gift ideas', 'Gifts that feel personal'],
  ['work from home', 'Make your setup better'],
  ['home refresh', 'Small upgrades, big mood'],
  ['travel essentials', 'Ready for the next trip'],
];

export default function SearchExperience({ query, products }: { query?: string; products: Product[] }) {
  const hasQuery = Boolean(query);
  return (
    <div className="shell py-10 md:py-14">
      <div className="search-heading">
        <div>
          <p className="eyebrow flex items-center gap-2"><Search className="w-3.5 h-3.5" /> Intent-aware discovery</p>
          <h1 className="page-title mt-2">{hasQuery ? <>Results for <span className="text-gradient">“{query}”</span></> : 'Start with a feeling, find a product.'}</h1>
          <p className="muted mt-3 max-w-2xl">{hasQuery ? `${products.length} ${products.length === 1 ? 'match' : 'matches'} selected for your search. Refine the prompt or follow a lane below.` : 'Search by what you want to do, not just what the product is called.'}</p>
        </div>
        <div className="search-signal"><Sparkles className="w-5 h-5 text-fuchsia-500" /><span><b>Try natural language</b><small>“A calm desk setup under $100”</small></span></div>
      </div>

      <div className="flex flex-wrap gap-2 mt-8" aria-label="Search intents">
        {intents.map(([value, label]) => <Link href={`/search?q=${encodeURIComponent(value)}`} className="intent-chip intent-chip-action" key={value}>{label} <ArrowRight className="w-3.5 h-3.5" /></Link>)}
      </div>

      {products.length ? (
        <section className="mt-12" aria-labelledby="search-results-title">
          <div className="flex items-end justify-between gap-4 mb-5"><div><p className="eyebrow">Curated matches</p><h2 id="search-results-title" className="section-title mt-2">Available now</h2></div><span className="pill">{products.length} results</span></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
        </section>
      ) : (
        <section className="state-card mt-12 p-8 md:p-12 text-center flex-col" aria-live="polite">
          <div className="mx-auto rounded-2xl bg-indigo-50 p-4 text-indigo-600"><Search className="w-8 h-8" /></div>
          <h2 className="text-2xl font-black mt-5">Nothing matched that exact phrase.</h2>
          <p className="muted max-w-lg mt-2">Try a broader need, remove a word, or let us help you start with a popular direction.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">{intents.slice(0, 3).map(([value, label]) => <Link href={`/search?q=${encodeURIComponent(value)}`} className="btn btn-soft" key={value}>{label}</Link>)}</div>
          <Link href="/" className="amazon-link mt-6 inline-flex items-center gap-1">Back to your discovery feed <ArrowRight className="w-4 h-4" /></Link>
        </section>
      )}
    </div>
  );
}
