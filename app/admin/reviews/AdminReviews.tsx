'use client';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import StarRating from '@/components/StarRating';
import AdminLayout from '../AdminLayout';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function AdminReviews() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  async function refresh(signal?: AbortSignal) {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/reviews', { signal });
      const d = await r.json();
      if (!signal?.aborted) setItems(d.items || []);
    } catch {
      if (!signal?.aborted) toast.error('Reviews could not be loaded');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, []);

  async function del(productId: string, reviewId: string) {
    const r = await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, reviewId }),
    });
    if (r.ok) {
      toast.success('Deleted');
      setDeleteTarget(null);
      refresh();
    } else toast.error('Failed');
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Review moderation</h1>
      <p className="text-sm text-amazon-textMuted mb-4">
        Delete inappropriate reviews. This updates product ratings automatically.
      </p>

      {loading ? (
        <div className="shimmer-bg h-40 rounded-md" />
      ) : items.length === 0 ? (
        <div className="panel p-10 text-center text-sm text-amazon-textMuted">No reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.reviewId} className="panel p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{r.userName}</span>
                    <StarRating rating={r.rating} showCount={false} size="sm" />
                    <span className="text-xs text-amazon-textMuted">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-amazon-link mb-1">on {r.productTitle}</div>
                  {r.title && <div className="text-sm font-bold">{r.title}</div>}
                  <p className="text-sm mt-1">{r.body}</p>
                </div>
                <button
                  onClick={() => setDeleteTarget(r)}
                  className="text-xs text-amazon-deal hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove this review?"
        description={deleteTarget ? `This removes the review by ${deleteTarget.userName} from “${deleteTarget.productTitle}” and recalculates its rating. This action cannot be undone.` : ''}
        confirmLabel="Remove review"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget ? del(deleteTarget.productId, deleteTarget.reviewId) : undefined}
      />
    </AdminLayout>
  );
}
