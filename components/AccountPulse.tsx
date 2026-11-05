'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Heart, RefreshCw } from '@/lib/icons';

type PulseState = { recent: any[]; saved: any[]; loading: boolean; failed: boolean };

export default function AccountPulse() {
  const [state, setState] = useState<PulseState>({ recent: [], saved: [], loading: true, failed: false });

  async function load(signal?: AbortSignal) {
    setState((current) => ({ ...current, loading: true, failed: false }));
    try {
      const [recentResponse, wishlistResponse] = await Promise.all([
        fetch('/api/me/recently-viewed', { signal }),
        fetch('/api/wishlist', { signal }),
      ]);
      if (!recentResponse.ok || !wishlistResponse.ok) throw new Error('Unable to load account pulse');
      const [recent, saved] = await Promise.all([recentResponse.json(), wishlistResponse.json()]);
      if (signal?.aborted) return;
      setState({ recent: recent.items || [], saved: saved.items || [], loading: false, failed: false });
    } catch (error: any) {
      if (error?.name !== 'AbortError') setState((current) => ({ ...current, loading: false, failed: true }));
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  if (state.loading) return <div className="grid sm:grid-cols-2 gap-4 mt-8"><div className="discovery-skeleton h-32" /><div className="discovery-skeleton h-32" /></div>;
  if (state.failed) return <div className="state-card state-card-error mt-8"><span className="text-sm">Your activity could not load right now.</span><button type="button" className="btn btn-soft" onClick={() => load()}><RefreshCw className="w-4 h-4" /> Retry</button></div>;

  return (
    <div className="grid sm:grid-cols-2 gap-4 mt-8">
      <Link href="/account/wishlist" className="pulse-card group">
        <span className="pulse-icon bg-rose-50 text-rose-500"><Heart className="w-5 h-5" /></span>
        <span><small className="muted">Saved for later</small><b className="block text-xl mt-1">{state.saved.length || 'Start a list'}</b><span className="text-sm text-slate-500 mt-1 block">{state.saved.length ? 'saved products ready when you are' : 'keep your next yes close'}</span></span>
        <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-indigo-600" />
      </Link>
      <Link href="/" className="pulse-card group">
        <span className="pulse-icon bg-indigo-50 text-indigo-600"><Clock className="w-5 h-5" /></span>
        <span><small className="muted">Recent signal</small><b className="block text-xl mt-1">{state.recent.length || 'Fresh start'}</b><span className="text-sm text-slate-500 mt-1 block">{state.recent.length ? 'ideas from your recent browsing' : 'browse to shape your feed'}</span></span>
        <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-indigo-600" />
      </Link>
    </div>
  );
}
