'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const mounted = useRef(true);
  const activeRequest = useRef<AbortController | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/wishlist', { signal });
      const data = await response.json();
      if (mounted.current && response.ok) setIds((data.items || []).map((item: any) => String(item.productId || item._id)));
    } catch (caught: any) {
      if (caught?.name !== 'AbortError' && mounted.current) setError('Saved items could not be loaded.');
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    refresh(controller.signal);
    return () => {
      mounted.current = false;
      controller.abort();
      activeRequest.current?.abort();
    };
  }, [refresh]);

  const toggle = useCallback(async (id: string) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const saved = ids.includes(id);
    setError('');
    try {
      const response = await fetch('/api/wishlist', {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Could not update saved items.');
      if (mounted.current) setIds((current) => saved ? current.filter((item) => item !== id) : [...current, id]);
      return true;
    } catch (caught: any) {
      if (caught?.name !== 'AbortError' && mounted.current) setError(caught?.message || 'Could not update saved items.');
      return false;
    }
  }, [ids]);

  return { ids, error, has: (id: string) => ids.includes(id), toggle, refresh: () => refresh() };
}
