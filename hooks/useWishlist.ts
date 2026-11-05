'use client';

import {createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';

type WishlistContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const idsRef = useRef(ids);
  const mounted = useRef(true);
  const mutation = useRef<AbortController | null>(null);

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (!enabled) {
      setIds([]);
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {signal});
      const data = await response.json();
      if (mounted.current && response.ok) {
        setIds((data.items || []).map((item: any) => String(item.productId || item._id)));
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        // Wishlist state is optional and should never block the storefront.
      }
    }
  }, [enabled]);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    refresh(controller.signal);

    return () => {
      mounted.current = false;
      controller.abort();
      mutation.current?.abort();
    };
  }, [refresh]);

  const toggle = useCallback(async (id: string) => {
    if (!enabled) return false;

    mutation.current?.abort();
    const controller = new AbortController();
    mutation.current = controller;
    const saved = idsRef.current.includes(id);

    try {
      const response = await fetch('/api/wishlist', {
        method: saved ? 'DELETE' : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({productId: id}),
        signal: controller.signal,
      });

      if (!response.ok || !mounted.current) return false;
      setIds((current) => {
        const next = saved ? current.filter((item) => item !== id) : [...current, id];
        idsRef.current = next;
        return next;
      });
      return true;
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        // The card keeps its previous state when the request fails.
      }
      return false;
    }
  }, [enabled]);

  const value = useMemo(
    () => ({ids, has: (id: string) => ids.includes(id), toggle, refresh: () => refresh()}),
    [ids, refresh, toggle],
  );

  return createElement(WishlistContext.Provider, {value}, children);
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
