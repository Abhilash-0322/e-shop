'use client';

import { useState } from 'react';
import { CheckCircle2, Mail, ShieldCheck, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { AccountPageHeader, Notice, ProgressBar } from '@/components/AccountPrimitives';

export default function SecurityView({
  initial,
}: {
  initial: { name: string; email: string; phone?: string };
}) {
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      if (!response.ok) throw new Error();
      setEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update your profile. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AccountPageHeader eyebrow="Saved details" title="Profile & security" description="Keep your account details current and your shopping experience protected." />
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_.8fr] gap-4">
        <div className="panel p-5">
          <div className="flex items-start justify-between mb-5">
            <div><h2 className="text-lg font-bold">Your sign-in details</h2><p className="text-sm text-muted mt-1">Only you can see and update these details.</p></div>
            <ShieldCheck className="w-6 h-6 text-amazon-green" />
          </div>
          <div className="space-y-1">
            <Row icon={UserRound} label="Name" value={name} />
            <Row icon={Mail} label="Email" value={initial.email} />
            <Row icon={ShieldCheck} label="Password" value="••••••••" />
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary mt-5 !text-xs">Edit profile details</button>
          ) : (
            <div className="mt-5 rounded-2xl border border-amazon-orange/40 bg-amazon-orange/5 p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <label><span className="field-label">Name</span><input className="amazon-input" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label><span className="field-label">Phone (optional)</span><input className="amazon-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" /></label>
              </div>
              <div className="flex justify-end gap-2 mt-4"><button onClick={() => setEditing(false)} className="btn-secondary !text-xs">Cancel</button><button onClick={save} disabled={saving} className="btn-primary !text-xs disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button></div>
            </div>
          )}
        </div>
        <div className="panel p-5">
          <div className="eyebrow mb-2">Security check-in</div>
          <h2 className="text-xl font-bold">A strong account starts here</h2>
          <p className="text-sm text-muted mt-1">Your password keeps your saved addresses, payment methods, and orders private.</p>
          <div className="mt-5"><ProgressBar value={phone ? 100 : 75} label="Protection level" detail={phone ? 'All recommended' : '3 of 4 recommended'} /></div>
          <div className="space-y-3 mt-5 text-sm">
            <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-amazon-green" /> Password is set</div>
            <div className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-amazon-green" /> Email is connected</div>
            <div className={`flex gap-2 items-center ${phone ? '' : 'text-muted'}`}>{phone ? <CheckCircle2 className="w-4 h-4 text-amazon-green" /> : <span className="w-4 h-4 rounded-full border border-amazon-border" />} {phone ? 'Recovery phone is connected' : 'Add a phone number for account recovery'}</div>
          </div>
        </div>
      </div>
      <Notice tone="info"><span className="font-semibold">Need to reset your password?</span><span className="ml-1">Use the secure recovery flow from <a href="/forgot-password" className="underline font-semibold">Forgot password</a>.</span></Notice>
    </>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <div className="flex items-center gap-3 border-b border-amazon-border py-3 last:border-0"><div className="w-9 h-9 rounded-lg bg-amazon-bg grid place-items-center text-amazon-link"><Icon className="w-4 h-4" /></div><div className="flex-1"><div className="text-xs text-muted">{label}</div><div className="text-sm font-semibold mt-0.5">{value}</div></div></div>;
}
