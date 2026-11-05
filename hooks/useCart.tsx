'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';

export type CartItem = {
  productId: string;
  title: string;
  image?: string;
  price: number;
  qty: number;
  isPrime?: boolean;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  loading: boolean;
  add: (id: string, qty?: number) => Promise<boolean>;
  update: (id: string, qty: number) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(enabled);
  const mounted = useRef(true);
  const requests = useRef(new Set<AbortController>());

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = signal ? null : new AbortController();
    const requestSignal = signal || controller!.signal;
    if (controller) requests.current.add(controller);

    try {
      const response = await fetch('/api/cart', {signal: requestSignal});
      const data = await response.json();
      if (mounted.current && response.ok) setItems(data.items || []);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        // A cart is an enhancement; keep the shell usable when it is unavailable.
      }
    } finally {
      if (controller) requests.current.delete(controller);
      if (mounted.current) setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    requests.current.add(controller);
    load(controller.signal).finally(() => requests.current.delete(controller));

    return () => {
      mounted.current = false;
      requests.current.forEach((request) => request.abort());
      requests.current.clear();
    };
  }, [load]);

  const refresh = useCallback(() => load(), [load]);

  const mutate = useCallback(async (method: string, body: unknown) => {
    if (!enabled) return false;
    const controller = new AbortController();
    requests.current.add(controller);

    try {
      const response = await fetch('/api/cart', {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await response.json();
      if (response.ok && mounted.current) {
        setItems(data.items || []);
        return true;
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        // Keep the current cart visible when a mutation fails.
      }
    } finally {
      requests.current.delete(controller);
    }
    return false;
  }, [enabled]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.qty, 0),
      loading,
      add: (id: string, qty = 1) => mutate('POST', {productId: id, qty}),
      update: (id: string, qty: number) => mutate('PATCH', {productId: id, qty}),
      remove: (id: string) => mutate('DELETE', {productId: id}),
      refresh,
    }),
    [items, loading, mutate, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
