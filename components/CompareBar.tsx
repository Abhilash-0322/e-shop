'use client';
import Link from 'next/link';
import { X, GitCompare } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  if (ids.length === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg text-white shadow-2xl border-t border-violet-500/40 animate-slideDown">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <GitCompare className="w-5 h-5 text-cyan-400 shrink-0" />
        <div className="flex-1 min-w-[200px]">
          <div className="text-sm font-semibold">
            {ids.length} item{ids.length !== 1 ? 's' : ''} ready to compare
          </div>
          <div className="flex gap-2 mt-1 flex-wrap">
            {ids.map((id, i) => (
              <span key={id} className="chip !bg-white/10 !text-white !border-white/25 flex items-center gap-1">
                Item {i + 1}
                <button type="button" onClick={() => remove(id)} className="ml-1 hover:text-cyan-300" aria-label="Remove from compare">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <Link href={`/compare?ids=${ids.join(',')}`} className="amazon-btn-yellow !text-sm shrink-0">
          Compare now
        </Link>
        <button type="button" onClick={clear} className="text-xs text-white/70 hover:text-white shrink-0">
          Clear all
        </button>
      </div>
    </div>
  );
}
