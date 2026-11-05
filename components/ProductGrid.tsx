'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ComponentProps } from 'react';

type Product = ComponentProps<typeof ProductCard>['product'];

export default function ProductGrid({ products, title, subtitle, showMore, moreHref }: {
  products: Product[];
  title?: string;
  subtitle?: string;
  showMore?: boolean;
  moreHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  if (!products?.length) return null;

  function scroll(direction: 'left' | 'right') {
    ref.current?.scrollBy({ left: direction === 'left' ? -620 : 620, behavior: 'smooth' });
  }

  return (
    <section className="mb-8">
      {title && (
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-amazon-orange"><Sparkles className="h-3 w-3" /> Curated for you</div>
            <h2 className="text-2xl font-black tracking-tight text-amazon-text md:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-amazon-textMuted">{subtitle}</p>}
          </div>
          {showMore && moreHref && <a href={moreHref} className="amazon-link whitespace-nowrap text-sm font-bold">See the full edit →</a>}
        </div>
      )}
      <div className="relative">
        <button type="button" onClick={() => scroll('left')} aria-label="Scroll products left" className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-amazon-bg md:block"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={() => scroll('right')} aria-label="Scroll products right" className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-amazon-bg md:block"><ChevronRight className="h-5 w-5" /></button>
        <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.slice(0, 10).map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
