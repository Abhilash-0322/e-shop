'use client';

import Link from 'next/link';
import { X, ArrowRight } from '@/lib/icons';
import { useCompare } from '@/hooks/useCompare';

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  if (!ids.length) return null;
  return (
    <div className="surface fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-center gap-3 px-4 py-3 shadow-xl">
      <div className="min-w-0 flex-1"><span className="block text-sm font-bold">{ids.length} selected</span><span className="hidden text-[10px] text-slate-500 sm:block">Compare up to four products side by side.</span></div>
      <div className="hidden gap-1 sm:flex">{ids.map((id, index) => <span className="pill" key={id}>#{index + 1}<button onClick={() => remove(id)} aria-label="Remove"><X className="h-3 w-3" /></button></span>)}</div>
      <Link href={`/compare?ids=${ids.join(',')}`} className="btn btn-primary !px-3 !py-2 text-xs">Compare <ArrowRight className="h-3 w-3" /></Link>
      <button onClick={clear} className="text-xs muted hover:text-indigo-600">Clear</button>
    </div>
  );
}
