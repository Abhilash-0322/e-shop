'use client';
import { useEffect, useState, useCallback } from 'react';

export type CartItem = {
  productId: string;
  title: string;
  image?: string;
  price: number;
  qty: number;
  isPrime?: boolean;
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError('');
      const r = await fetch('/api/cart', { cache: 'no-store', signal });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not load your cart');
      if (!signal?.aborted) setItems(d.items || []);
    } catch (e: any) {
      if (e?.name !== 'AbortError' && !signal?.aborted) setError(e.message || 'Could not load your cart');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    const onUpdate = () => refresh();
    window.addEventListener('cart:update', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      controller.abort();
      window.removeEventListener('cart:update', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [refresh]);

  const add = useCallback(async (productId: string, qty: number = 1) => {
    const r = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty }),
    });
    const d = await r.json();
    if (r.ok) {
      setItems(d.items || []);
      window.dispatchEvent(new Event('cart:update'));
    }
    return r.ok;
  }, []);

  const update = useCallback(async (productId: string, qty: number) => {
    const r = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qty }),
    });
    const d = await r.json();
    if (r.ok) {
      setItems(d.items || []);
      window.dispatchEvent(new Event('cart:update'));
    }
    return r.ok;
  }, []);

  const remove = useCallback(async (productId: string) => {
    const r = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const d = await r.json();
    if (r.ok) {
      setItems(d.items || []);
      window.dispatchEvent(new Event('cart:update'));
    }
    return r.ok;
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = +items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

  return { items, loading, error, count, subtotal, add, update, remove, refresh };
}
