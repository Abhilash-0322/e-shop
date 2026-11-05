'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ComponentProps } from 'react';

type Product = ComponentProps<typeof ProductCard>['product'];

export default function ProductGrid({
  products,
  title,
  subtitle,
  showMore,
  moreHref,
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
  showMore?: boolean;
  moreHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  function scroll(dir: 'l' | 'r') {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === 'l' ? -800 : 800, behavior: 'smooth' });
  }
  if (!products?.length) return null;
  return (
    <section className="mb-8">
      {title && (
        <div className="mb-3 flex items-end justify-between rounded-2xl border border-white/80 bg-white/55 p-4 backdrop-blur">
          <div>
            <div className="section-kicker">Curated signal</div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-amazon-text">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-amazon-textMuted">{subtitle}</p>}
          </div>
          {showMore && moreHref && (
            <a href={moreHref} className="amazon-link rounded-full border border-amazon-border px-3 py-1.5 text-xs font-semibold">See all offers</a>
          )}
        </div>
      )}
      <div className="panel relative p-3 md:p-4">
        <button
          onClick={() => scroll('l')}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-105 md:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('r')}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-transform hover:scale-105 md:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div
          ref={ref}
          className="flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.slice(0, 10).map((p) => (
            <div key={p._id} className="w-[min(72vw,220px)] shrink-0 snap-start md:w-[220px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
