'use client';

import {useEffect, useState} from 'react';

export default function SellerOrders() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/orders', {signal: controller.signal})
      .then((response) => response.json())
      .then((data) => {
        if (!controller.signal.aborted) setItems(data.items || []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setItems([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div>
      <p className="eyebrow">Fulfillment</p>
      <h1 className="page-title mt-2">Orders</h1>
      <div className="mt-8 space-y-3">
        {loading
          ? [1, 2, 3].map((row) => <div className="skeleton h-20 w-full" key={row} />)
          : items.map((item) => (
            <div className="surface p-5" key={item._id}>
              <b>{item.orderNumber || item._id}</b>
              <span className="pill ml-3">{item.status}</span>
            </div>
          ))}
        {!loading && !items.length && <div className="surface muted p-8">No seller orders yet.</div>}
      </div>
    </div>
  );
}
