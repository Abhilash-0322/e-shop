'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  ShieldAlert,
  Star,
  Store,
  TrendingUp,
  Users,
} from '@/lib/icons';

type LowStockItem = {
  _id: string;
  title: string;
  stock: number;
  lowStockThreshold?: number;
  price: number;
  seller?: string;
  sellerName?: string;
};

type SellerItem = {
  _id: string;
  name: string;
  email: string;
  sellerProfile?: {
    storeName?: string;
    country?: string;
    appliedAt?: string;
    approved?: boolean;
  };
};

type ReviewItem = {
  reviewId: string;
  productId: string;
  productTitle: string;
  userName?: string;
  rating: number;
  body?: string;
  createdAt?: string;
};

type Stats = {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  pendingSellers: number;
  lowStock: number;
  lowStockItems: LowStockItem[];
};

const number = new Intl.NumberFormat('en-US');
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function timeAgo(value?: string) {
  if (!value) return 'Recently';
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h ago`;
  return `${Math.round(seconds / 86400)}d ago`;
}

function Initials({ name }: { name?: string }) {
  return (
    <span className="admin-avatar" aria-hidden="true">
      {(name || 'H')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()}
    </span>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Activity;
  tone: 'indigo' | 'emerald' | 'amber' | 'rose';
}) {
  return (
    <div className="admin-metric">
      <div className={`admin-metric-icon admin-metric-${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="admin-kicker">{label}</p>
        <p className="admin-metric-value">{value}</p>
        <p className="admin-metric-hint">{hint}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sellers, setSellers] = useState<SellerItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const responses = await Promise.all([
        fetch('/api/admin/stats', { cache: 'no-store' }),
        fetch('/api/admin/sellers?limit=4', { cache: 'no-store' }),
        fetch('/api/admin/reviews?limit=4', { cache: 'no-store' }),
      ]);
      const [statsResponse, sellersResponse, reviewsResponse] = responses;
      if (!statsResponse.ok) throw new Error('Unable to load platform metrics.');
      const [statsData, sellersData, reviewsData] = await Promise.all(
        responses.map((response) => response.json()),
      );
      setStats(statsData);
      setSellers(sellersData.items || []);
      setReviews(reviewsData.items || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load platform metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function refresh() {
    await load();
    toast.success('Operations data refreshed');
  }

  const pendingSellers = sellers.filter((seller) => !seller.sellerProfile?.approved);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Command center / Thursday, Nov 5</p>
          <h1 className="admin-title">Good afternoon, operator.</h1>
          <p className="admin-subtitle">
            Keep the marketplace healthy with a quick read of today&apos;s signals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="admin-live">
            <span className="admin-live-dot" />
            Live data
          </span>
          <button type="button" className="admin-button admin-button-quiet" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <div>
            <b>Metrics unavailable</b>
            <p>{error} Try refreshing in a moment.</p>
          </div>
          <button type="button" className="admin-button admin-button-quiet ml-auto" onClick={refresh}>
            Retry
          </button>
        </div>
      )}

      <section className="admin-metric-grid" aria-label="Platform metrics">
        <MetricCard
          label="Gross merchandise value"
          value={loading ? '—' : currency.format(stats?.revenue || 0)}
          hint="All-time order value"
          icon={TrendingUp}
          tone="indigo"
        />
        <MetricCard
          label="Orders processed"
          value={loading ? '—' : number.format(stats?.orders || 0)}
          hint="Across every storefront"
          icon={Package}
          tone="emerald"
        />
        <MetricCard
          label="Active customers"
          value={loading ? '—' : number.format(stats?.users || 0)}
          hint="Registered accounts"
          icon={Users}
          tone="amber"
        />
        <MetricCard
          label="Needs attention"
          value={loading ? '—' : number.format((stats?.lowStock || 0) + (stats?.pendingSellers || 0))}
          hint={`${stats?.lowStock || 0} stock · ${stats?.pendingSellers || 0} sellers`}
          icon={AlertTriangle}
          tone="rose"
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <section className="admin-card">
          <div className="admin-card-heading">
            <div>
              <div className="admin-heading-with-icon">
                <span className="admin-heading-icon admin-heading-amber">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <h2>Low-stock alerts</h2>
              </div>
              <p>Items most likely to impact conversion next.</p>
            </div>
            <Link href="/admin/products" className="admin-link">
              View inventory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="admin-list">
            {loading &&
              [1, 2, 3].map((item) => <div className="admin-skeleton-row" key={item} />)}
            {!loading && !stats?.lowStockItems?.length && (
              <div className="admin-empty admin-empty-compact">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <div>
                  <b>Inventory is in good shape</b>
                  <p>No products are below their alert threshold.</p>
                </div>
              </div>
            )}
            {!loading &&
              stats?.lowStockItems?.map((item) => {
                const out = item.stock <= 0;
                return (
                  <div className="admin-list-row" key={item._id}>
                    <div className="admin-product-mark">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${item._id}`} className="admin-row-title admin-truncate">
                        {item.title}
                      </Link>
                      <p className="admin-row-meta">{item.sellerName || item.seller || 'Halozon direct'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`admin-status ${out ? 'admin-status-danger' : 'admin-status-warning'}`}>
                        {out ? 'Out of stock' : `${item.stock} left`}
                      </span>
                      <p className="admin-row-meta mt-1">{currency.format(item.price || 0)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-heading">
            <div>
              <div className="admin-heading-with-icon">
                <span className="admin-heading-icon admin-heading-indigo">
                  <Store className="h-4 w-4" />
                </span>
                <h2>Seller approvals</h2>
              </div>
              <p>Review new marketplace applications.</p>
            </div>
            <Link href="/admin/sellers" className="admin-link">
              Open queue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="admin-list">
            {loading &&
              [1, 2, 3].map((item) => <div className="admin-skeleton-row" key={item} />)}
            {!loading && !pendingSellers.length && (
              <div className="admin-empty admin-empty-compact">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <div>
                  <b>Queue is clear</b>
                  <p>No seller applications are waiting.</p>
                </div>
              </div>
            )}
            {!loading &&
              pendingSellers.slice(0, 4).map((seller) => (
                <Link href="/admin/sellers" className="admin-list-row" key={seller._id}>
                  <Initials name={seller.sellerProfile?.storeName || seller.name} />
                  <div className="min-w-0 flex-1">
                    <p className="admin-row-title admin-truncate">
                      {seller.sellerProfile?.storeName || 'Unnamed storefront'}
                    </p>
                    <p className="admin-row-meta admin-truncate">{seller.name} · {seller.email}</p>
                  </div>
                  <span className="admin-status admin-status-info">Review</span>
                </Link>
              ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <section className="admin-card">
          <div className="admin-card-heading">
            <div>
              <div className="admin-heading-with-icon">
                <span className="admin-heading-icon admin-heading-rose">
                  <Star className="h-4 w-4" />
                </span>
                <h2>Moderation queue</h2>
              </div>
              <p>Recent reviews ready for a quality check.</p>
            </div>
            <Link href="/admin/reviews" className="admin-link">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="admin-list">
            {loading &&
              [1, 2].map((item) => <div className="admin-skeleton-row" key={item} />)}
            {!loading && !reviews.length && (
              <div className="admin-empty admin-empty-compact">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <div>
                  <b>No reviews to moderate</b>
                  <p>New customer feedback will appear here.</p>
                </div>
              </div>
            )}
            {!loading &&
              reviews.slice(0, 3).map((review) => (
                <Link href="/admin/reviews" className="admin-list-row" key={review.reviewId}>
                  <div className="admin-review-score">{review.rating.toFixed(1)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="admin-row-title admin-truncate">{review.productTitle}</p>
                    <p className="admin-row-meta admin-truncate">
                      {review.userName || 'Customer'} · {review.body || 'No written comment'}
                    </p>
                  </div>
                  <span className="admin-row-meta whitespace-nowrap">{timeAgo(review.createdAt)}</span>
                </Link>
              ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-heading">
            <div>
              <div className="admin-heading-with-icon">
                <span className="admin-heading-icon admin-heading-emerald">
                  <Activity className="h-4 w-4" />
                </span>
                <h2>Operator snapshot</h2>
              </div>
              <p>A calm view of the work that matters now.</p>
            </div>
            <span className="admin-status admin-status-success">Healthy</span>
          </div>
          <div className="admin-snapshot-grid">
            <div className="admin-snapshot-item">
              <div className="flex items-center justify-between">
                <span>Catalog coverage</span>
                <b>{loading ? '—' : `${stats?.products ? 100 : 0}%`}</b>
              </div>
              <div className="admin-progress"><span style={{ width: stats?.products ? '86%' : '0%' }} /></div>
              <small>Listings are available for discovery</small>
            </div>
            <div className="admin-snapshot-item">
              <div className="flex items-center justify-between">
                <span>Seller response</span>
                <b>{loading ? '—' : pendingSellers.length ? 'Review' : 'Clear'}</b>
              </div>
              <div className="admin-progress admin-progress-violet"><span style={{ width: pendingSellers.length ? '52%' : '100%' }} /></div>
              <small>{pendingSellers.length ? `${pendingSellers.length} applications need a decision` : 'All applications are up to date'}</small>
            </div>
            <div className="admin-snapshot-actions">
              <Link href="/admin/users" className="admin-quick-action">
                <Users className="h-4 w-4" />
                User controls
                <ArrowUpRight className="ml-auto h-3.5 w-3.5" />
              </Link>
              <Link href="/admin/products" className="admin-quick-action">
                <Package className="h-4 w-4" />
                Catalog actions
                <ArrowUpRight className="ml-auto h-3.5 w-3.5" />
              </Link>
              <div className="admin-quick-action admin-quick-action-muted">
                <Clock3 className="h-4 w-4" />
                Last sync {loading ? '—' : 'just now'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
