'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, Package, DollarSign, AlertTriangle, BarChart3 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import SellerLayout from '../SellerLayout';
import Sparkline from '@/components/Sparkline';

export default function SellerAnalytics({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/seller/analytics')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <SellerLayout user={user}>
        <div className="shimmer-bg h-40 rounded-md" />
      </SellerLayout>
    );
  }

  return (
    <SellerLayout user={user}>
      <div className="ops-page">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="ops-kicker">Performance workspace</div>
          <h1 className="ops-page-title mt-1">Analytics</h1>
          <p className="mt-1 text-sm text-amazon-textMuted">A practical view of revenue, demand, and inventory health.</p>
        </div>
        <span className="chip bg-amazon-panel">Last 14 days · updated live</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Kpi icon={DollarSign} label="Revenue" value={formatPrice(data.metrics.revenue)} color="text-amazon-orange" />
        <Kpi icon={TrendingUp} label="Units sold" value={data.metrics.unitsSold} color="text-amazon-greenDark" />
        <Kpi icon={BarChart3} label="Avg. order" value={formatPrice(data.metrics.avgOrderValue)} color="text-amazon-prime" />
        <Kpi icon={Package} label="Orders" value={data.metrics.orderCount} color="text-amazon-navylight" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-bold">Revenue trend</h2>
              <p className="mt-1 text-xs text-amazon-textMuted">Gross sales from your catalog</p>
            </div>
            <div className="text-right text-xs text-amazon-textMuted">14 days</div>
          </div>
          <Sparkline data={data.series} />
          <div className="grid grid-cols-7 gap-1 mt-3 text-center text-[10px] text-amazon-textMuted">
            {data.series.slice(-7).map((d: any) => (
              <div key={d.date}>
                <div className="font-bold text-amazon-text">{formatPrice(d.revenue)}</div>
                <div>{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amazon-deal" /> Low stock alerts
          </h2>
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-amazon-textMuted">All products are well-stocked.</p>
          ) : (
            <div className="space-y-2">
              {data.lowStock.map((p: any) => (
                <div key={p._id} className="flex items-center gap-2 rounded-xl border border-amazon-deal/20 bg-amazon-deal/5 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="w-10 h-10 object-contain bg-white rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm line-clamp-1">{p.title}</div>
                    <div className="text-xs text-amazon-deal font-bold">Only {p.stock} left</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="font-bold mb-3">Top revenue products</h2>
        <table className="w-full text-sm">
          <thead className="border-b border-amazon-border text-left text-xs text-amazon-textMuted">
            <tr>
              <th className="py-2">Product</th>
              <th>Price</th>
              <th>Units sold</th>
              <th>Stock</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.topProducts.map((p: any) => (
              <tr key={p._id} className="border-b border-amazon-border">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} className="w-10 h-10 object-contain rounded border border-amazon-border" />
                    <div className="line-clamp-1 font-medium">{p.title}</div>
                  </div>
                </td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.totalSold}</td>
                <td>{p.stock}</td>
                <td className="font-bold text-amazon-orange">{formatPrice(p.revenue)}</td>
              </tr>
            ))}
            {data.topProducts.length === 0 && (
              <tr><td colSpan={5} className="text-center py-4 text-sm text-amazon-textMuted">No data yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </SellerLayout>
  );
}

function Kpi({ icon: Icon, label, value, color }: any) {
  return (
    <div className="panel p-4">
      <Icon className={`w-6 h-6 ${color} mb-2`} />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-amazon-textMuted">{label}</div>
    </div>
  );
}
