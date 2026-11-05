'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Trash2, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { AccountPageHeader, EmptyState, Notice } from '@/components/AccountPrimitives';
import { CheckCircle2, Sparkles } from 'lucide-react';

const FREQ_LABELS: Record<number, string> = {
  1: 'Monthly',
  2: 'Every 2 months',
  3: 'Every 3 months',
  6: 'Every 6 months',
};

export default function SubscriptionsView({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial);

  async function cancel(id: string) {
    if (!confirm('Cancel this subscription?')) return;
    try {
      const r = await fetch('/api/subscriptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: id }),
      });
      if (r.ok) {
        toast.success('Subscription cancelled');
        setItems((prev) => prev.filter((i) => i._id !== id));
      } else toast.error('Failed to cancel');
    } catch { toast.error('Could not update subscription. Try again.'); }
  }

  return (
    <div>
      <AccountPageHeader eyebrow="Activity" title="Subscriptions" description="Keep the essentials coming on your schedule, with savings built in." action={{ href: '/', label: 'Find something new' }} />
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-5">
          <div><h2 className="text-lg font-bold">Subscribe & save</h2><p className="text-sm text-muted">Cancel, pause, or change a delivery any time.</p></div>
          <div className="w-10 h-10 rounded-xl bg-amazon-green/10 text-amazon-green grid place-items-center"><CheckCircle2 className="w-5 h-5" /></div>
        </div>

      {items.length === 0 ? (
        <EmptyState icon={Calendar} title="No subscriptions yet" description="Subscribe to frequently used products and save up to 15% on the deliveries you choose." action={{ href: '/', label: 'Browse products' }} />
      ) : (
        <div className="space-y-3">
          {items.map((s) => {
            const nextDate = s.nextDeliveryAt ? new Date(s.nextDeliveryAt) : null;
            const discounted = s.price * (1 - (s.discountPercent || 0) / 100);
            return (
              <div key={s._id} className="border border-amazon-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="w-24 h-24 object-contain bg-white rounded border border-amazon-border" />
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${s.productId}`} className="text-base font-bold text-amazon-link hover:underline line-clamp-2">
                    {s.title}
                  </Link>
                  <div className="text-sm text-amazon-textMuted mt-1 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {FREQ_LABELS[s.frequencyMonths] || `Every ${s.frequencyMonths} mo`}
                    </span>
                    {nextDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Next: {nextDate.toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-amazon-greenDark font-medium">Save {s.discountPercent}%</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-bold text-amazon-orange">{formatPrice(discounted)}</span>
                    <span className="text-amazon-textMuted line-through ml-2">{formatPrice(s.price)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <Link href={`/product/${s.productId}`} className="amazon-btn-dark !text-xs">
                    View product
                  </Link>
                  <button
                    onClick={() => cancel(s._id)}
                    className="text-xs text-amazon-deal hover:underline flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
      <Notice tone="success" icon={Sparkles}>Your discount is applied automatically to each scheduled delivery. There are no long-term commitments.</Notice>
    </div>
  );
}
