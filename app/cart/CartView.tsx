'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

export default function CartView() {
  const { items, count, subtotal, update, remove, refresh, error } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [changing, setChanging] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    refresh().finally(() => { if (active) setHydrated(true); });
    return () => { active = false; };
  }, [refresh]);

  async function changeQuantity(productId: string, qty: number) {
    setChanging(productId);
    const ok = await update(productId, qty);
    if (!ok) toast.error('We could not update that item. Please try again.');
    setChanging(null);
  }

  async function removeItem(productId: string) {
    setChanging(productId);
    const ok = await remove(productId);
    if (!ok) toast.error('We could not remove that item. Please try again.');
    setChanging(null);
  }

  if (!hydrated) {
    return (
      <div className="confidence-shell py-8">
        <div className="skeleton h-8 w-52 mb-5" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="skeleton h-96" />
          <div className="skeleton h-64" />
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <main className="confidence-shell py-12">
        <div className="panel mx-auto max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold">Your cart could not load</h1>
          <p className="mt-2 text-sm text-amazon-textMuted">{error}</p>
          <button type="button" onClick={() => refresh()} className="amazon-btn-primary mt-5">Try again</button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <div className="confidence-shell py-12">
        <div className="panel mx-auto max-w-xl p-10 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amazon-orange/15 flex items-center justify-center text-amazon-orange">
            <ShoppingBagIcon />
          </div>
          <h1 className="text-3xl font-bold mb-2">Your cart is ready for something good</h1>
          <p className="text-sm text-amazon-textMuted mb-5">Items you add will stay here while you compare, decide, and check out.</p>
          <Link href="/" className="amazon-link text-sm">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 35 ? 0 : 5.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  return (
    <main className="confidence-shell py-5 sm:py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Your selections</p>
          <h1 className="mt-1 text-3xl font-bold">Shopping cart</h1>
        </div>
        <div className="hidden text-right text-sm text-amazon-textMuted sm:block">
          <div className="font-semibold text-amazon-text">Checkout when you’re ready</div>
          <div>Nothing is charged until you place your order.</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="panel divide-y divide-amazon-border">
            {items.map((it) => (
              <div key={it.productId} className={`p-4 sm:p-5 flex gap-4 ${changing === it.productId ? 'opacity-60' : ''}`}>
                <Link href={`/product/${it.productId}`} className="w-32 h-32 shrink-0 bg-white flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.title} className="max-w-full max-h-full object-contain" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${it.productId}`} className="text-base text-amazon-link hover:text-amazon-linkHover hover:underline line-clamp-2">
                    {it.title}
                  </Link>
                  {it.isPrime && (
                    <div className="text-xs text-amazon-link font-semibold mt-1">prime</div>
                  )}
                  <div className="text-xs text-amazon-greenDark font-medium mt-1">In Stock</div>
                  <div className="text-xs text-amazon-textMuted">Eligible for FREE Shipping</div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="inline-flex items-center border border-amazon-borderDark rounded-md">
                      <button type="button" disabled={changing === it.productId} aria-label={`Decrease quantity of ${it.title}`} onClick={() => changeQuantity(it.productId, Math.max(0, it.qty - 1))} className="px-2 py-1 hover:bg-amazon-bg disabled:cursor-wait">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm">{it.qty}</span>
                      <button type="button" disabled={changing === it.productId} aria-label={`Increase quantity of ${it.title}`} onClick={() => changeQuantity(it.productId, it.qty + 1)} className="px-2 py-1 hover:bg-amazon-bg disabled:cursor-wait">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button type="button" disabled={changing === it.productId} onClick={() => removeItem(it.productId)} className="text-xs text-amazon-link hover:text-amazon-linkHover flex items-center gap-1 disabled:opacity-50">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                    <button className="text-xs text-amazon-link hover:text-amazon-linkHover">Save for later</button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold">{formatPrice(it.price * it.qty)}</div>
                  {it.qty > 1 && <div className="text-xs text-amazon-textMuted">{formatPrice(it.price)} each</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="panel p-4 mt-3 text-right">
            <span className="text-lg">
              Subtotal ({count} item{count > 1 ? 's' : ''}):{' '}
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </span>
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 self-start space-y-3">
          <div className="panel p-5">
            <div className="mb-4 rounded-xl bg-amazon-green/10 p-3 text-sm text-amazon-greenDark">
              <b>Delivery promise:</b> Arrives in 2–5 business days
            </div>
            {shipping === 0 ? (
              <div className="text-sm text-amazon-greenDark mb-2">
                ✓ Your order qualifies for FREE shipping
              </div>
            ) : (
              <div className="text-sm mb-2">
                Spend <b>{formatPrice(35 - subtotal)}</b> more for FREE shipping
              </div>
            )}
            <div className="text-sm text-amazon-textMuted mb-2">
              Choose a payment method below to complete checkout.
            </div>
            <Link
              href="/checkout"
              className="amazon-btn-yellow w-full !text-base !py-3 block text-center"
            >
              Proceed to checkout ({count} item{count > 1 ? 's' : ''})
            </Link>
            <div className="text-center mt-3">
              <div className="text-xs text-amazon-textMuted mb-1">Subtotal: {formatPrice(subtotal)}</div>
              <Link href="/" className="amazon-link text-sm">Continue shopping</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ShoppingBagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}
