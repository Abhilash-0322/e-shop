import { Calendar, CheckCircle2, Clock, Package, Truck } from '@/lib/icons';

const labels: Record<string, string> = {
  ordered: 'Order placed',
  processing: 'Being prepared',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const icons: Record<string, any> = {
  ordered: Calendar,
  processing: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
  cancelled: Clock,
};

function formatDate(value?: string | Date) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default function DeliveryTimeline({
  status,
  events,
  eta,
}: {
  status: string;
  events?: { status?: string; label?: string; location?: string; at?: string | Date }[];
  eta?: string | Date;
}) {
  const timeline = events?.length ? events : [];

  return (
    <section className="surface p-6 mt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Delivery timeline</p>
          <h2 className="text-xl font-black mt-2">Track every handoff.</h2>
        </div>
        {eta && (
          <div className="text-right">
            <p className="text-xs muted">Estimated arrival</p>
            <p className="font-bold mt-1">{formatDate(eta).split(',')[0]}</p>
          </div>
        )}
      </div>

      {timeline.length > 0 ? (
        <ol className="mt-6 space-y-5">
          {timeline.map((event, index) => {
            const key = event.status || 'processing';
            const Icon = icons[key] || Package;
            const isCurrent = index === timeline.length - 1;
            return (
              <li key={`${key}-${event.at || index}`} className="relative flex gap-3">
                {index < timeline.length - 1 && <span className="absolute left-2 top-7 bottom-[-1.25rem] w-px bg-indigo-100" />}
                <span
                  className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full ${
                    isCurrent ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </span>
                <div className="flex-1 -mt-0.5">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                    <p className="font-bold text-sm">{event.label || labels[key] || 'Order update'}</p>
                    <time className="muted text-xs">{formatDate(event.at)}</time>
                  </div>
                  {event.location && <p className="muted text-xs mt-1">{event.location}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 mt-6">
          <p className="font-bold text-sm">Tracking will appear after the first handoff.</p>
          <p className="muted text-sm mt-1">
            This order is currently {labels[status] || status}. There are no carrier events to show yet.
          </p>
        </div>
      )}
    </section>
  );
}
