import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AccountLayout from '../AccountLayout';
import Link from 'next/link';
import SafetyNotice from '@/components/SafetyNotice';

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/security');
  return (
    <AccountLayout user={user}>
      <div className="bg-white border border-amazon-border rounded-md p-5 space-y-4">
        <h1 className="text-3xl font-bold">Login & security</h1>
        <SafetyNotice title="Your account security matters" tone="info">
          Use a unique password and never share it or a one-time code. If anything looks unfamiliar, reset your password and contact support.
        </SafetyNotice>
        <div className="space-y-3">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Password" value="••••••••" />
          <Row label="Two-step verification" value="Off" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/forgot-password" className="amazon-btn-dark !text-xs">Reset password</Link>
          <Link href="/help#contact" className="amazon-btn-primary !text-xs">Get security help</Link>
        </div>
      </div>
    </AccountLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-amazon-border pb-3">
      <div>
        <div className="font-bold">{label}</div>
        <div className="text-sm text-amazon-textMuted">Update your {label.toLowerCase()}.</div>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
