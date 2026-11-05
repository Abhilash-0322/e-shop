'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type CartItem = {
  productId: string;
  title: string;
  image?: string;
  price: number;
  qty: number;
  isPrime?: boolean;
};

export type CartError = {
  message: string;
  status?: number;
  conflict?: boolean;
};

type Ctx = {
  items: CartItem[];
  count: number;
  syncing: boolean;
  error: CartError | null;
  add: (id: string, qty?: number) => Promise<boolean>;
  update: (id: string, qty: number) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  clearError: () => void;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<CartError | null>(null);
  const mounted = useRef(true);
  const activeRequest = useRef<AbortController | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch('/api/cart', { signal });
      const data = await response.json();
      if (mounted.current && response.ok) setItems(data.items || []);
    } catch (caught: any) {
      if (caught?.name !== 'AbortError' && mounted.current) {
        setError({ message: 'Your cart could not be synced right now.' });
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    load(controller.signal);
    return () => {
      mounted.current = false;
      controller.abort();
      activeRequest.current?.abort();
    };
  }, [load]);

  const refresh = useCallback(() => load(), [load]);

  const mutate = useCallback(async (method: string, body: unknown) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setSyncing(true);
    setError(null);
    try {
      const response = await fetch('/api/cart', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw {
          message: data.error || 'Your cart changed elsewhere. Refresh and try again.',
          status: response.status,
          conflict: response.status === 409 || response.status >= 500,
        };
      }
      if (mounted.current) setItems(data.items || []);
      return true;
    } catch (caught: any) {
      if (caught?.name === 'AbortError' || !mounted.current) return false;
      setError({
        message: caught?.message || 'Your cart could not be updated.',
        status: caught?.status,
        conflict: caught?.conflict ?? true,
      });
      return false;
    } finally {
      if (mounted.current && activeRequest.current === controller) setSyncing(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.qty, 0),
      syncing,
      error,
      add: (id: string, qty = 1) => mutate('POST', { productId: id, qty }),
      update: (id: string, qty: number) => mutate('PATCH', { productId: id, qty }),
      remove: (id: string) => mutate('DELETE', { productId: id }),
      refresh,
      clearError: () => setError(null),
    }),
    [error, items, mutate, refresh, syncing],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
