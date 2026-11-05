'use client';

import Link from 'next/link';
import {ArrowRight, X} from '@/lib/icons';
import {useCompare} from '@/hooks/useCompare';

export default function CompareBar() {
  const {ids, remove, clear} = useCompare();
  if (!ids.length) return null;
  return (
    <div className="surface fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 items-center gap-3 px-3 py-3 shadow-float sm:px-4">
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-slate-500">{ids.length} product{ids.length === 1 ? '' : 's'} selected</span>
        <div className="mt-1 flex gap-1 overflow-hidden">
          {ids.map((id, index) => (
            <span className="pill shrink-0" key={id}>
              #{index + 1}
              <button type="button" onClick={() => remove(id)} aria-label={`Remove product ${index + 1}`}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      </div>
      <Link href={`/compare?ids=${ids.join(',')}`} className="btn btn-primary shrink-0 !px-3 text-xs">Compare <ArrowRight className="h-3 w-3" /></Link>
      <button type="button" onClick={clear} className="hidden text-xs font-semibold text-slate-500 hover:text-slate-900 sm:block">Clear</button>
    </div>
  );
}
