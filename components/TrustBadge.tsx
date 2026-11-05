import { BadgeCheck, LockKeyhole, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

type TrustKind = 'verified' | 'secure' | 'delivery' | 'returns' | 'moderated';

const CONFIG: Record<TrustKind, { label: string; detail: string; tone: string; icon: typeof BadgeCheck }> = {
  verified: {
    label: 'Verified seller',
    detail: 'Identity and store details reviewed by halozon',
    tone: 'text-amazon-greenDark bg-amazon-green/10 border-amazon-greenDark/20',
    icon: BadgeCheck,
  },
  secure: {
    label: 'Secure checkout',
    detail: 'Your payment details are protected in transit',
    tone: 'text-amazon-link bg-amazon-prime/10 border-amazon-prime/20',
    icon: LockKeyhole,
  },
  delivery: {
    label: 'Delivery promise',
    detail: 'Trackable delivery estimate shown before payment',
    tone: 'text-amazon-navylight bg-amazon-bg border-amazon-border',
    icon: Truck,
  },
  returns: {
    label: 'Clear returns',
    detail: 'See eligibility and refund expectations before you buy',
    tone: 'text-amazon-orange bg-amazon-orange/10 border-amazon-orange/20',
    icon: RotateCcw,
  },
  moderated: {
    label: 'Community moderated',
    detail: 'Reviews and questions can be reported for review',
    tone: 'text-amazon-prime bg-amazon-prime/10 border-amazon-prime/20',
    icon: ShieldCheck,
  },
};

export default function TrustBadge({
  kind,
  compact = false,
}: {
  kind: TrustKind;
  compact?: boolean;
}) {
  const item = CONFIG[kind];
  const Icon = item.icon;
  return (
    <span
      title={item.detail}
      aria-label={`${item.label}. ${item.detail}`}
      className={`inline-flex items-center gap-1.5 border rounded-full font-semibold ${item.tone} ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      {item.label}
    </span>
  );
}
