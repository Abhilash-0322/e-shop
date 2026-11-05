'use client';
import Link from 'next/link';
import { TrendingUp, Package, ShoppingBag, DollarSign, ArrowUpRight, Plus, Sparkles, AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import SellerLayout from '../SellerLayout';
import Sparkline from '@/components/Sparkline';

export default function SellerDashboard({
  user,
  metrics,
  series,
  recentOrders,
  topProducts,
  lowStock,
}: {
  user: any;
  metrics: { revenue: number; unitsSold: number; orderCount: number; productCount: number };
  series: { date: string; revenue: number; units: number }[];
  recentOrders: any[];
  topProducts: any[];
  lowStock?: any[];
}) {
  return (
    <SellerLayout user={user}>
      <div className="mb-6 flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.sellerProfile?.storeName || user.name}</h1>
          <p className="text-sm text-amazon-textMuted">Here&apos;s how your store is doing today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/seller/products/new" className="amazon-btn-yellow !text-sm">
            <Plus className="w-4 h-4 inline mr-1" /> Add product
          </Link>
          <Link href="/seller/analytics" className="amazon-btn-dark !text-sm">
            View analytics
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={formatPrice(metrics.revenue)}
          tone="orange"
        />
        <StatCard
          icon={TrendingUp}
          label="Units sold"
          value={metrics.unitsSold.toLocaleString()}
          tone="green"
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={metrics.orderCount.toLocaleString()}
          tone="navy"
        />
        <StatCard
          icon={Package}
          label="Active products"
          value={metrics.productCount.toLocaleString()}
          tone="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Sales chart */}
        <div className="panel p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold">Last 7 days</h2>
              <p className="text-xs text-amazon-textMuted">Revenue trend</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amazon-orange">{formatPrice(series.reduce((s, d) => s + d.revenue, 0))}</div>
              <div className="text-xs text-amazon-greenDark">+{metrics.unitsSold} units</div>
            </div>
          </div>
          <Sparkline data={series} />
        </div>

        {/* Inventory watch */}
        <div className="panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Inventory watch</h2>
              <p className="mt-1 text-xs text-amazon-textMuted">Products that need attention</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amazon-orange" />
          </div>
          {(lowStock || []).length === 0 ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-amazon-green/10 p-3 text-sm text-amazon-greenDark">
              <CheckCircle2 className="h-4 w-4" /> All products are well stocked.
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {(lowStock || []).slice(0, 4).map((p: any) => (
                <Link href={`/seller/products/${p._id}`} key={p._id} className="flex items-center gap-2 rounded-xl p-2 hover:bg-amazon-panel">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0]} alt="" className="h-9 w-9 rounded-lg border border-amazon-border bg-white object-contain" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">{p.title}</div>
                    <div className="mt-0.5 text-[11px] text-amazon-deal">Only {p.stock} left</div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-amazon-textMuted" />
                </Link>
              ))}
              <Link href="/seller/products" className="mt-2 block text-center text-xs font-semibold text-amazon-link hover:text-amazon-linkHover">
                Review inventory →
              </Link>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="panel p-4 lg:col-span-1">
          <h2 className="text-lg font-bold mb-3">Top sellers</h2>
          <div className="space-y-2">
            {topProducts.length === 0 ? (
              <p className="text-sm text-amazon-textMuted text-center py-4">No products yet</p>
            ) : (
              topProducts.map((p, i) => (
                <Link href={`/seller/products/${p._id}`} key={p._id} className="flex items-center gap-2 p-2 hover:bg-amazon-bg rounded">
                  <span className="text-sm font-bold text-amazon-textMuted w-5">{i + 1}.</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0]} alt={p.title} className="w-10 h-10 object-contain rounded bg-white border border-amazon-border" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm line-clamp-1">{p.title}</div>
                    <div className="text-xs text-amazon-textMuted">{p.sold} sold · {formatPrice(p.price)}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-amazon-textMuted" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="panel p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Recent orders</h2>
          <Link href="/seller/orders" className="text-sm text-amazon-link hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-sm text-amazon-textMuted">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-amazon-orange" />
            <p>No orders yet. Once customers buy your products, they&apos;ll appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-amazon-border text-left text-xs text-amazon-textMuted">
              <tr>
                <th className="py-2">Order</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => {
                const myItems = o.items.filter((it: any) => topProducts.some((p) => String(p._id) === String(it.productId)) || true);
                const myTotal = myItems.reduce((s: number, it: any) => s + it.price * it.qty, 0);
                return (
                  <tr key={o._id} className="border-b border-amazon-border">
                    <td className="py-2 font-bold">{o.orderNumber}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>{myItems.length} item{myItems.length !== 1 ? 's' : ''}</td>
                    <td>{formatPrice(myTotal)}</td>
                    <td>
                      <span className="chip">{o.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </SellerLayout>
  );
}

function StatCard({ icon: Icon, label, value, tone }: any) {
  const tones: Record<string, string> = {
    orange: 'bg-amazon-orange/10 text-amazon-orange',
    green: 'bg-amazon-green/10 text-amazon-greenDark',
    navy: 'bg-amazon-navylight/10 text-amazon-navylight',
    yellow: 'bg-amazon-yellow/20 text-amazon-text',
  };
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${tones[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-amazon-textMuted">{label}</div>
    </div>
  );
}
