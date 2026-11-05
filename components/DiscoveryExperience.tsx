'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProductCard, { Product } from './ProductCard';
import { ArrowRight, Check, Clock, RefreshCw, Sparkles, X } from '@/lib/icons';

type Preference = {
  id: string;
  label: string;
  description: string;
};

const preferences: Preference[] = [
  { id: 'tech', label: 'Design-led tech', description: 'Smart upgrades and useful gear' },
  { id: 'home', label: 'Comfort & home', description: 'Pieces that make a space feel yours' },
  { id: 'style', label: 'Style & self-expression', description: 'Wearable finds with personality' },
  { id: 'play', label: 'Games & entertainment', description: 'Ways to switch off and have fun' },
  { id: 'everyday', label: 'Everyday essentials', description: 'Reliable things for daily life' },
];

const preferenceStorageKey = 'halozon_discovery_preferences';

function RailSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" aria-label="Loading recommendations">
      {[1, 2, 3, 4, 5].map((item) => (
        <div className="discovery-skeleton" key={item}>
          <div className="h-40 rounded-2xl bg-slate-200/70" />
          <div className="h-3 w-2/3 rounded bg-slate-200 mt-4" />
          <div className="h-3 w-1/2 rounded bg-slate-200 mt-2" />
        </div>
      ))}
    </div>
  );
}

function DiscoveryRail({
  eyebrow,
  title,
  products,
  href,
  emptyMessage,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  href?: string;
  emptyMessage?: string;
}) {
  return (
    <section className="discovery-section" aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="eyebrow flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" />{eyebrow}</p>
          <h2 id={`${title.replace(/\s+/g, '-').toLowerCase()}-title`} className="section-title mt-2">{title}</h2>
        </div>
        {href && <Link href={href} className="text-sm font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 shrink-0">See all <ArrowRight className="w-4 h-4" /></Link>}
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <div className="soft-empty">
          <Clock className="w-5 h-5 text-indigo-500" />
          <p>{emptyMessage || 'Your next great find will appear here.'}</p>
        </div>
      )}
    </section>
  );
}

export default function DiscoveryExperience() {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [recent, setRecent] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

  const selectedLabels = useMemo(
    () => preferences.filter((preference) => selected.includes(preference.id)).map((preference) => preference.label),
    [selected],
  );

  async function loadDiscovery(signal?: AbortSignal) {
    setLoading(true);
    setFailed(false);
    try {
      const [recommendationResponse, recentResponse] = await Promise.all([
        fetch('/api/me/recommendations', { signal }),
        fetch('/api/me/recently-viewed', { signal }),
      ]);
      if (!recommendationResponse.ok || !recentResponse.ok) throw new Error('Unable to load discovery');
      const recommendationData = await recommendationResponse.json();
      const recentData = await recentResponse.json();
      if (signal?.aborted) return;
      setRecommended(recommendationData.items || []);
      setRecent(recentData.items || []);
    } catch (error: any) {
      if (error?.name !== 'AbortError') setFailed(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    try {
      const stored = JSON.parse(localStorage.getItem(preferenceStorageKey) || '[]');
      if (Array.isArray(stored) && stored.length) {
        setSelected(stored);
        setHasPreferences(true);
      } else {
        setOnboardingOpen(true);
      }
    } catch {
      setOnboardingOpen(true);
    }
    loadDiscovery(controller.signal);
    return () => controller.abort();
  }, []);

  function savePreferences() {
    const next = selected.length ? selected : ['everyday'];
    localStorage.setItem(preferenceStorageKey, JSON.stringify(next));
    setSelected(next);
    setHasPreferences(true);
    setOnboardingOpen(false);
  }

  return (
    <>
      <section className="shell discovery-intro" aria-labelledby="discovery-title">
        <div className="discovery-intro-copy">
          <div className="flex items-center gap-2 text-indigo-700 text-sm font-bold">
            <span className="discovery-spark"><Sparkles className="w-4 h-4" /></span>
            {hasPreferences ? 'A feed shaped around you' : 'Make Halozon yours'}
          </div>
          <h2 id="discovery-title" className="text-3xl md:text-4xl font-black tracking-tight mt-3">
            Find your next <span className="text-gradient">yes.</span>
          </h2>
          <p className="muted mt-3 max-w-2xl">
            {hasPreferences && selectedLabels.length
              ? `Curated from ${selectedLabels.slice(0, 2).join(' and ').toLowerCase()} plus what shoppers are loving now.`
              : 'Tell us what you care about and we’ll make the first scroll feel personal.'}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {(selectedLabels.length ? selectedLabels : ['Choose your interests']).map((label) => (
              <span className="intent-chip" key={label}>{label}</span>
            ))}
            <button type="button" className="intent-chip intent-chip-action" onClick={() => setOnboardingOpen(true)}>
              {hasPreferences ? 'Tune preferences' : 'Set preferences'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="discovery-intro-aside">
          <span className="text-xs font-bold uppercase tracking-[.16em] text-indigo-700">Your signal</span>
          <b className="text-2xl block mt-3">{recent.length ? `${recent.length} recent picks` : 'Fresh start'}</b>
          <p className="text-sm muted mt-2">{recent.length ? 'We used your recent browsing to find nearby ideas.' : 'Start exploring and your recent finds will live here.'}</p>
        </div>
      </section>

      <div className="shell space-y-12 mt-10">
        {loading ? <section className="discovery-section"><RailSkeleton /></section> : failed ? (
          <div className="state-card state-card-error" role="alert">
            <div><b>Discovery took a wrong turn.</b><p className="muted text-sm mt-1">Your storefront is still ready. Try refreshing these picks.</p></div>
            <button type="button" className="btn btn-soft" onClick={() => loadDiscovery()}><RefreshCw className="w-4 h-4" /> Try again</button>
          </div>
        ) : (
          <>
            <DiscoveryRail
              eyebrow="Picked for your next move"
              title={hasPreferences ? 'Because you like thoughtful finds' : 'Popular while you explore'}
              products={recommended}
              href="/search"
              emptyMessage="Explore a few products and we’ll start learning your taste."
            />
            {recent.length > 0 && (
              <DiscoveryRail eyebrow="Keep the thread going" title="Recently viewed" products={recent} href="/account/wishlist" />
            )}
          </>
        )}
      </div>

      {onboardingOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="preferences-title">
          <button type="button" className="absolute inset-0 bg-slate-950/55" aria-label="Close preferences" onClick={() => setOnboardingOpen(false)} />
          <div className="relative w-full max-w-xl rounded-[2rem] bg-white shadow-2xl p-6 sm:p-8 animate-reveal">
            <button type="button" onClick={() => setOnboardingOpen(false)} aria-label="Close preferences" className="absolute right-5 top-5 rounded-full p-2 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            <p className="eyebrow">A little signal, a lot less scrolling</p>
            <h2 id="preferences-title" className="text-3xl font-black tracking-tight mt-3">What are you into?</h2>
            <p className="muted mt-2 max-w-md">Pick a few lanes. You can change these anytime, and we’ll keep your choices on this device.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {preferences.map((preference) => {
                const active = selected.includes(preference.id);
                return (
                  <button
                    key={preference.id}
                    type="button"
                    onClick={() => setSelected((current) => active ? current.filter((id) => id !== preference.id) : [...current, preference.id])}
                    className={`preference-option ${active ? 'preference-option-active' : ''}`}
                    aria-pressed={active}
                  >
                    <span className={`preference-check ${active ? 'bg-indigo-600 text-white' : ''}`}>{active && <Check className="w-3.5 h-3.5" />}</span>
                    <span className="text-left"><b className="block">{preference.label}</b><small className="muted">{preference.description}</small></span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="btn btn-primary w-full mt-6" onClick={savePreferences}>Shape my discovery <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
}
