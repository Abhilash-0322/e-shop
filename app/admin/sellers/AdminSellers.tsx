'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, X, ExternalLink } from 'lucide-react';
import AdminLayout from '../AdminLayout';
import toast from 'react-hot-toast';

export default function AdminSellers() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const r = await fetch('/api/admin/sellers');
    const d = await r.json();
    setItems(d.items || []);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function setApproved(userId: string, approved: boolean) {
    const r = await fetch('/api/admin/sellers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, approved }),
    });
    if (r.ok) {
      toast.success(approved ? 'Approved' : 'Revoked');
      refresh();
    } else toast.error('Failed');
  }

  return (
    <AdminLayout>
      <div className="ops-page !px-0 !py-0">
      <div className="mb-6"><div className="ops-kicker">Partner operations</div><h1 className="ops-page-title mt-1">Seller applications</h1><p className="mt-1 text-sm text-amazon-textMuted">Review seller identity, payouts, and storefront readiness.</p></div>

      {loading ? (
        <div className="shimmer-bg h-40 rounded-md" />
      ) : items.length === 0 ? (
        <div className="empty-state">No seller applications yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((u) => {
            const sp = u.sellerProfile || {};
            return (
              <div key={u._id} className="ops-card p-5">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{sp.storeName || u.name}</h3>
                      {sp.approved ? (
                        <span className="chip !bg-amazon-greenDark/10 !text-amazon-greenDark">Approved</span>
                      ) : (
                        <span className="chip !bg-amazon-yellow/30">Pending</span>
                      )}
                      <span className="text-xs text-amazon-textMuted">{u.role}</span>
                    </div>
                    <div className="text-xs text-amazon-textMuted mb-2">
                      {u.email} · Applied {new Date(sp.appliedAt).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-amazon-text mb-2">{sp.description}</p>
                    <div className="text-xs text-amazon-textMuted">
                      Country: {sp.country} · Payout: {sp.payoutMethod} → {sp.payoutEmail}
                    </div>
                    {sp.approved && (
                      <Link href={`/store/${sp.slug}`} className="text-xs text-amazon-link hover:underline inline-flex items-center gap-1 mt-1">
                        Visit store <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {sp.approved ? (
                      <button
                        onClick={() => setApproved(u._id, false)}
                        className="amazon-btn-dark !text-xs"
                      >
                        <X className="w-3 h-3 inline mr-1" /> Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => setApproved(u._id, true)}
                        className="amazon-btn-orange !text-xs"
                      >
                        <Check className="w-3 h-3 inline mr-1" /> Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
