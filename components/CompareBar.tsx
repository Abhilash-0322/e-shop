'use client';
import Link from 'next/link';
import { ArrowRight, X } from '@/lib/icons';
import { useCompare } from '@/hooks/useCompare';

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  if (!ids.length) return null;
  return (
    <div className="surface fixed bottom-4 left-1/2 z-40 flex w-[min(42rem,calc(100vw-1.5rem))] -translate-x-1/2 items-center gap-3 border-[#c3d39d] bg-[#f7f8f3]/95 px-3 py-3 shadow-xl backdrop-blur-xl sm:px-4">
      <div className="min-w-0 flex-1"><p className="eyebrow">Decision tool</p><b className="text-sm">{ids.length} of 4 selected</b></div>
      <div className="hidden gap-1 sm:flex">{ids.map((id, index) => <span className="pill" key={id}>Item {index + 1}<button onClick={() => remove(id)} aria-label={`Remove item ${index + 1}`}><X className="h-3 w-3" /></button></span>)}</div>
      <Link href={`/compare?ids=${ids.join(',')}`} className="btn btn-primary !px-3 !py-2 text-xs">Compare <ArrowRight className="h-3 w-3" /></Link>
      <button onClick={clear} className="text-xs font-bold text-[#526259] hover:text-[#17221c]">Clear</button>
    </div>
  );
}
