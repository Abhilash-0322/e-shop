import Link from 'next/link';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export default function SafetyNotice({
  title,
  children,
  tone = 'info',
  href,
  linkLabel,
}: {
  title: string;
  children: React.ReactNode;
  tone?: 'info' | 'success' | 'warning';
  href?: string;
  linkLabel?: string;
}) {
  const styles = {
    info: 'border-amazon-prime/30 bg-amazon-prime/10 text-amazon-navylight',
    success: 'border-amazon-greenDark/30 bg-amazon-green/10 text-amazon-greenDark',
    warning: 'border-amazon-orange/40 bg-amazon-yellow/20 text-amazon-text',
  }[tone];
  const Icon = tone === 'warning' ? AlertTriangle : tone === 'success' ? ShieldCheck : Info;

  return (
    <div className={`rounded-xl border p-4 ${styles}`} role={tone === 'warning' ? 'alert' : 'status'}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="min-w-0 text-sm">
          <div className="font-bold">{title}</div>
          <div className="mt-1 leading-relaxed opacity-90">{children}</div>
          {href && linkLabel && (
            <Link href={href} className="inline-flex mt-2 font-semibold underline underline-offset-2">
              {linkLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
