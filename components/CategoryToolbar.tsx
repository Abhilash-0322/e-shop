'use client';

import { useRouter } from 'next/navigation';
import { SlidersHorizontal } from '@/lib/icons';

export default function CategoryToolbar({ value }: { value?: string }) {
  const router = useRouter();
  function update(next: string) {
    router.push(next === 'popular' ? window.location.pathname : `${window.location.pathname}?sort=${next}`);
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2 text-sm muted"><SlidersHorizontal className="w-4 h-4" /> Tune this collection</div>
      <label className="flex items-center gap-2 text-sm font-bold">
        <span className="sr-only">Sort products</span>
        <select value={value || 'popular'} onChange={(event) => update(event.target.value)} className="input !w-auto !py-2">
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>
    </div>
  );
}
