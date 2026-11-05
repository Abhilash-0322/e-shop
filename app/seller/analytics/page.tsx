'use client';

import {useEffect, useState} from 'react';

export default function Analytics() {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/seller/analytics', {signal: controller.signal})
      .then((response) => response.json())
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div>
      <p className="eyebrow">Performance</p>
      <h1 className="page-title mt-2">Analytics</h1>
      <div className="surface mt-8 p-8">
        <p className="muted">Your sales intelligence</p>
        {loading ? <div className="skeleton mt-5 h-32 w-full" /> : <pre className="mt-5 overflow-auto text-xs">{JSON.stringify(data?.metrics || {}, null, 2)}</pre>}
      </div>
    </div>
  );
}
