'use client';

import Link from 'next/link';
import {ArrowRight, X} from '@/lib/icons';
import {useCompare} from '@/hooks/useCompare';

export default function CompareBar() {
  const {ids, remove, clear} = useCompare();
  if (!ids.length) return null;

  return (
    <section className="surface fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 overflow-x-auto px-4 py-3 shadow-xl" aria-label="Product comparison">
      <span className="whitespace-nowrap text-sm font-bold" aria-live="polite">{ids.length} selected</span>
      <div className="flex gap-1">
        {ids.map((id, index) => (
          <span className="pill" key={id}>
            #{index + 1}
            <button type="button" onClick={() => remove(id)} className="flex min-h-6 min-w-6 items-center justify-center rounded" aria-label={`Remove product ${index + 1} from comparison`}>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <Link href={`/compare?ids=${ids.join(',')}`} className="btn btn-primary whitespace-nowrap !px-3 text-xs">Compare <ArrowRight className="h-3 w-3" aria-hidden="true" /></Link>
      <button type="button" onClick={clear} className="min-h-11 whitespace-nowrap text-xs underline underline-offset-2 muted">Clear comparison</button>
    </section>
  );
}
