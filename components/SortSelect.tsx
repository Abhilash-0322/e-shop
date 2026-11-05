'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const params = useSearchParams();

  function change(next: string) {
    const query = new URLSearchParams(params.toString());
    if (next === 'popular') query.delete('sort');
    else query.set('sort', next);
    const search = query.toString();
    router.push(search ? `?${search}` : window.location.pathname);
  }

  return (
    <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
      Sort by
      <select value={value} onChange={(event) => change(event.target.value)} className="input !w-auto" aria-label="Sort products">
        <option value="popular">Most popular</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </label>
  );
}

