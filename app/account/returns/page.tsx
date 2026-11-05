import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import AccountLayout from '../AccountLayout';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { AccountPageHeader, EmptyState, StatusBadge } from '@/components/AccountPrimitives';
import { PackageCheck, RotateCcw } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ReturnsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/returns');
  await connectDB();
  const items = JSON.parse(JSON.stringify(
    await ReturnRequest.find({ userId: user.id }).sort({ createdAt: -1 }).lean()
  ));

  return (
    <AccountLayout user={user}>
      <AccountPageHeader eyebrow="Activity" title="Returns & refunds" description="See the progress of every return and keep your next step clear." action={{ href: '/account/orders', label: 'View orders' }} />
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-bold">Your return activity</h2><p className="text-sm text-muted">{items.length} return{items.length !== 1 ? 's' : ''} in progress or complete</p></div><RotateCcw className="w-6 h-6 text-amazon-orange" /></div>

        {items.length === 0 ? (
          <EmptyState icon={PackageCheck} title="No returns to manage" description="If something does not work out, start a return from a delivered order and we&apos;ll guide you through it." action={{ href: '/account/orders', label: 'View delivered orders' }} />
        ) : (
          <div className="space-y-3">
            {items.map((r: any) => (
              <div key={r._id} className="border border-amazon-border rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <div>
                    <div className="font-bold">RMA: {r.rma}</div>
                    <div className="text-xs text-amazon-textMuted">
                      Order {r.orderNumber} · Filed {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <StatusBadge status={r.status} tone={r.status === 'refunded' ? 'success' : r.status === 'rejected' ? 'danger' : r.status === 'requested' ? 'warning' : 'info'} />
                </div>
                <div className="text-sm text-amazon-textMuted">
                  Reason: {r.reason}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {r.items.map((it: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 border border-amazon-border rounded-md p-2 text-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.title} className="w-10 h-10 object-contain" />
                      <div>
                        <div className="line-clamp-1 max-w-[150px]">{it.title}</div>
                        <div className="text-amazon-textMuted">×{it.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {r.refundAmount && (
                  <div className="mt-3 text-sm">
                    Refund: <b className="text-amazon-greenDark">{formatPrice(r.refundAmount)}</b>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
