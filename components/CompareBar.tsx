'use client';

import Link from 'next/link';
import { ArrowRight, GitCompare, X } from '@/lib/icons';
import { useCompare } from '@/hooks/useCompare';

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  if (!ids.length) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex w-[min(94vw,34rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-indigo-200 bg-white px-3 py-2.5 shadow-2xl">
      <span className="flex items-center gap-1.5 text-xs font-extrabold"><GitCompare className="h-4 w-4 text-indigo-600" /> {ids.length}/4</span>
      <div className="flex min-w-0 flex-1 gap-1 overflow-hidden">
        {ids.map((id, index) => <span className="pill shrink-0" key={id}>#{index + 1}<button type="button" onClick={() => remove(id)} aria-label={`Remove product ${index + 1}`}><X className="h-3 w-3" /></button></span>)}
      </div>
      <Link href={`/compare?ids=${ids.join(',')}`} className="btn btn-primary !px-3 !py-2 text-xs">Compare <ArrowRight className="h-3 w-3" /></Link>
      <button type="button" onClick={clear} className="text-[11px] font-bold text-slate-400 hover:text-slate-700">Clear</button>
    </div>
  );
}
